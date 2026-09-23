/**
 * Phase 3F — Current Affairs duplicate / question-family detector.
 *
 * Purpose:
 * - Detect exact duplicates.
 * - Detect normalized wording duplicates.
 * - Detect same-family variants.
 * - Detect questions that reuse the same underlying fact relationship.
 * - Provide deterministic selection filters for quiz assembly.
 *
 * Important:
 * This is intentionally NOT an AI/LLM semantic-similarity service.
 * The first protection layer is deterministic provenance + concept/family
 * identity. A conservative token fingerprint adds wording-level protection.
 * Ambiguous cases are flagged for review rather than automatically merged.
 */

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[“”‘’'"]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sorted(values) {
  return [...values].sort();
}

function makeFactKey(question) {
  return sorted(question?.factIds || []).join("|");
}

function makeFamilyKey(question) {
  return question?.questionFamilyId || null;
}

function makeConceptKey(question) {
  return question?.conceptId || null;
}

function makeExactKey(question) {
  return normalizeText(question?.question);
}

function makeAnswerKey(question) {
  return normalizeText(question?.correctAnswer);
}

function makeCanonicalKey(question) {
  return [
    makeConceptKey(question),
    makeAnswerKey(question),
    normalizeText(question?.variantType),
  ].join("|");
}

function makeTokenSet(question) {
  return new Set(tokenize(question?.question));
}

function intersectionSize(a, b) {
  let count = 0;
  for (const value of a) if (b.has(value)) count += 1;
  return count;
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  if (!a.size || !b.size) return 0;
  return intersectionSize(a, b) / new Set([...a, ...b]).size;
}

/**
 * Conservative similarity score for wording-only comparison.
 *
 * Provenance/family identity must remain stronger than this score.
 */
function wordingSimilarity(a, b) {
  return jaccard(makeTokenSet(a), makeTokenSet(b));
}

function indexQuestions(questions) {
  const exact = new Map();
  const canonical = new Map();
  const family = new Map();
  const concept = new Map();
  const fact = new Map();

  for (const question of questions || []) {
    const add = (map, key, value) => {
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(value);
    };

    add(exact, makeExactKey(question), question);
    add(canonical, makeCanonicalKey(question), question);
    add(family, makeFamilyKey(question), question);
    add(concept, makeConceptKey(question), question);
    add(fact, makeFactKey(question), question);
  }

  return { exact, canonical, family, concept, fact };
}

/**
 * Compare a candidate against an existing Question Bank.
 *
 * Result priority:
 * 1. exact duplicate
 * 2. same canonical concept/answer/variant
 * 3. same question family
 * 4. same concept + same fact provenance
 * 5. strong wording similarity
 * 6. eligible
 */
export function detectQuestionDuplicate({
  candidate,
  existingQuestions = [],
  wordingThreshold = 0.82,
}) {
  if (!candidate?.question) {
    return {
      duplicate: true,
      type: "insufficient_information",
      confidence: "high",
      matches: [],
    };
  }

  const index = indexQuestions(existingQuestions);

  const exactMatches = index.exact.get(makeExactKey(candidate)) || [];
  if (exactMatches.length) {
    return {
      duplicate: true,
      type: "duplicate",
      confidence: "high",
      matches: exactMatches.map((q) => q.questionId),
    };
  }

  const canonicalMatches = index.canonical.get(makeCanonicalKey(candidate)) || [];
  if (canonicalMatches.length) {
    return {
      duplicate: true,
      type: "semantic_duplicate",
      confidence: "high",
      matches: canonicalMatches.map((q) => q.questionId),
    };
  }

  const familyMatches = index.family.get(makeFamilyKey(candidate)) || [];
  if (familyMatches.length) {
    return {
      duplicate: true,
      type: "family_duplicate",
      confidence: "high",
      matches: familyMatches.map((q) => q.questionId),
    };
  }

  const factMatches = index.fact.get(makeFactKey(candidate)) || [];
  if (factMatches.length) {
    const sameAnswer = factMatches.some(
      (q) => makeAnswerKey(q) === makeAnswerKey(candidate)
    );

    if (sameAnswer) {
      return {
        duplicate: true,
        type: "semantic_duplicate",
        confidence: "high",
        matches: factMatches.map((q) => q.questionId),
      };
    }
  }

  // Wording similarity is only a review signal. It is deliberately not enough
  // by itself to reject a question because two legitimate questions can share
  // common words.
  for (const existing of existingQuestions) {
    const similarity = wordingSimilarity(candidate, existing);

    if (similarity >= wordingThreshold) {
      return {
        duplicate: false,
        type: "possible_semantic_duplicate",
        confidence: "medium",
        similarity,
        matches: [existing.questionId],
      };
    }
  }

  return {
    duplicate: false,
    type: "eligible",
    confidence: "high",
    matches: [],
  };
}

/**
 * Check whether a candidate may coexist with already-selected quiz questions.
 *
 * Same family is always blocked. Same concept is also blocked by default.
 * This is stronger than checking question text and is the primary anti-repeat
 * rule for a single quiz.
 */
export function canSelectQuestion({
  candidate,
  selectedQuestions = [],
  blockSameConcept = true,
}) {
  if (!candidate?.questionFamilyId) {
    return {
      allowed: false,
      reason: "missing_question_family_id",
    };
  }

  const family = makeFamilyKey(candidate);
  if (selectedQuestions.some((q) => makeFamilyKey(q) === family)) {
    return {
      allowed: false,
      reason: "family_duplicate",
    };
  }

  if (
    blockSameConcept &&
    candidate.conceptId &&
    selectedQuestions.some((q) => makeConceptKey(q) === candidate.conceptId)
  ) {
    return {
      allowed: false,
      reason: "concept_duplicate",
    };
  }

  return {
    allowed: true,
    reason: null,
  };
}

/**
 * Apply user recent-history cooldown.
 *
 * History may contain question IDs, family IDs, concept IDs, or objects
 * containing those fields. A recent family/concept match blocks the candidate
 * even if its wording is completely different.
 */
export function isQuestionOnCooldown({
  candidate,
  recentHistory = [],
  familyCooldown = true,
  conceptCooldown = true,
  questionCooldown = true,
}) {
  const candidateId = candidate?.questionId;
  const candidateFamily = makeFamilyKey(candidate);
  const candidateConcept = makeConceptKey(candidate);

  for (const item of recentHistory) {
    const history = typeof item === "string" ? { questionId: item } : item || {};

    if (questionCooldown && candidateId && history.questionId === candidateId) {
      return { onCooldown: true, reason: "question_duplicate" };
    }

    if (
      familyCooldown &&
      candidateFamily &&
      history.questionFamilyId === candidateFamily
    ) {
      return { onCooldown: true, reason: "family_cooldown" };
    }

    if (
      conceptCooldown &&
      candidateConcept &&
      history.conceptId === candidateConcept
    ) {
      return { onCooldown: true, reason: "concept_cooldown" };
    }
  }

  return { onCooldown: false, reason: null };
}

/**
 * Filter a Question Bank pool for a quiz.
 *
 * Deterministic: input order is preserved. Randomization belongs to the quiz
 * assembler, after eligibility has been established.
 */
export function filterEligibleQuestions({
  questions = [],
  selectedQuestions = [],
  recentHistory = [],
  blockSameConcept = true,
  familyCooldown = true,
  conceptCooldown = true,
  questionCooldown = true,
}) {
  const eligible = [];
  const rejected = [];

  for (const question of questions) {
    const selectedCheck = canSelectQuestion({
      candidate: question,
      selectedQuestions,
      blockSameConcept,
    });

    if (!selectedCheck.allowed) {
      rejected.push({
        questionId: question?.questionId || null,
        reason: selectedCheck.reason,
      });
      continue;
    }

    const cooldownCheck = isQuestionOnCooldown({
      candidate: question,
      recentHistory,
      familyCooldown,
      conceptCooldown,
      questionCooldown,
    });

    if (cooldownCheck.onCooldown) {
      rejected.push({
        questionId: question?.questionId || null,
        reason: cooldownCheck.reason,
      });
      continue;
    }

    eligible.push(question);
  }

  return {
    eligible,
    rejected,
    counts: {
      input: questions.length,
      eligible: eligible.length,
      rejected: rejected.length,
    },
  };
}

/**
 * Batch duplicate audit for an existing Question Bank.
 */
export function auditQuestionBank({
  questions = [],
  wordingThreshold = 0.82,
}) {
  const duplicates = [];
  const possibleDuplicates = [];
  const seen = [];

  for (const question of questions) {
    const result = detectQuestionDuplicate({
      candidate: question,
      existingQuestions: seen,
      wordingThreshold,
    });

    if (result.duplicate) {
      duplicates.push({
        questionId: question.questionId || null,
        type: result.type,
        matches: result.matches,
      });
    } else if (result.type === "possible_semantic_duplicate") {
      possibleDuplicates.push({
        questionId: question.questionId || null,
        matches: result.matches,
        similarity: result.similarity,
      });
    }

    seen.push(question);
  }

  return {
    duplicates,
    possibleDuplicates,
    counts: {
      total: questions.length,
      duplicates: duplicates.length,
      possibleSemanticDuplicates: possibleDuplicates.length,
    },
  };
}

export default {
  detectQuestionDuplicate,
  canSelectQuestion,
  isQuestionOnCooldown,
  filterEligibleQuestions,
  auditQuestionBank,
};
