/**
 * Phase 3J — Current Affairs runtime generation (Step A).
 *
 * Purpose:
 * - Treat Phase 2 verified facts as the primary runtime source.
 * - Use the audited Question Bank first.
 * - Generate fresh validated questions only when the bank cannot assemble
 *   the requested quiz because of recent-history/freshness constraints.
 * - Keep generation request-scoped until Step B (Cloudflare D1 persistence).
 *
 * Runtime flow:
 *   Question Bank
 *      ↓
 *   recent-history filtering
 *      ↓
 *   enough? ── yes → assemble
 *      │
 *      no
 *      ↓
 *   verified facts
 *      ↓
 *   3C → 3D → 3E → 3F
 *      ↓
 *   runtime serving pool
 *      ↓
 *   3G quiz assembly
 *
 * Important:
 * - This module does NOT write to D1/KV.
 * - Generated records are request-scoped candidates in Step A.
 * - Step B will persist validated questions in Cloudflare D1 without changing
 *   this generation contract.
 */

import {
  CURRENT_AFFAIRS_INITIAL_FACTS,
} from "./phase2-initial-facts.js";
import {
  CURRENT_AFFAIRS_QUESTION_BANK,
} from "./phase3i-question-bank.js";
import {
  assembleCurrentAffairsQuiz,
} from "./phase3g-quiz-assembler.js";
import {
  generateSingleFactDrafts,
} from "./phase3c-question-generator.js";
import {
  attachDistractors,
} from "./phase3d-distractor-generator.js";
import {
  validateAndPromoteQuestion,
} from "./phase3e-quality-validator.js";
import {
  detectQuestionDuplicate,
  isQuestionOnCooldown,
} from "./phase3f-duplicate-family-detector.js";
import {
  createQuestionBankRecord,
} from "./phase3h-question-bank.js";

const TARGET_DISTRIBUTION = {
  easy: 4,
  medium: 4,
  hard: 2,
};

const MAX_FACTS_TO_SCAN = 86;
const MAX_DRAFTS_TO_PROCESS = 180;
const MAX_GENERATED_CANDIDATES = 80;

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildTemporalContext(fact) {
  if (!fact) return null;

  const context = {};
  for (const field of [
    "referenceYear",
    "referencePeriod",
    "validFrom",
    "validTo",
    "datasetVintage",
    "lastVerified",
  ]) {
    if (fact[field] !== undefined && fact[field] !== null) {
      context[field] = fact[field];
    }
  }

  return Object.keys(context).length ? context : null;
}

function stableQuestionId(draft) {
  return [
    "ca-runtime",
    slugify(draft.questionFamilyId),
    slugify(draft.variantType),
    slugify(draft.difficulty),
    slugify(draft.question),
  ].join(":");
}

function toActiveRecord(draft, distractors, now) {
  const options = [
    draft.correctAnswer,
    ...distractors,
  ];

  return createQuestionBankRecord({
    questionId: stableQuestionId(draft),
    questionFamilyId: draft.questionFamilyId,
    conceptId: draft.conceptId,
    factIds: draft.factIds,
    sourceIds: draft.sourceIds,
    variantType: draft.variantType,
    blueprintId: draft.blueprintId,
    difficulty: draft.difficulty,
    domain: draft.domain,
    topic: draft.topic,
    question: draft.question,
    options,
    correctAnswer: draft.correctAnswer,
    // Keep internal provenance out of the player-facing explanation.
    explanation: draft.explanation || "",
    status: "active",
    accessTier: draft.accessTier || "FREE",
    temporalContext: buildTemporalContext(
      CURRENT_AFFAIRS_INITIAL_FACTS.find((fact) => fact.id === draft.factIds?.[0])
    ),
    generatorVersion: draft.generatorVersion,
    lastValidated: now,
    createdAt: now,
    updatedAt: now,
  });
}

function deterministicOrder(values, seed = "") {
  const output = [...values];
  let state = 0;

  for (const char of String(seed)) {
    state = (state * 31 + char.charCodeAt(0)) >>> 0;
  }

  for (let i = output.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }

  return output;
}

function recentHistoryHasQuestionId(questionId, recentHistory) {
  return recentHistory.some((item) => {
    const history =
      typeof item === "string"
        ? { questionId: item }
        : item || {};

    return history.questionId === questionId;
  });
}

function enrichRecentHistory(recentHistory, knownQuestions) {
  return recentHistory.map((item) => {
    const history = typeof item === "string"
      ? { questionId: item }
      : item || {};

    const known = knownQuestions.find(
      (question) => question?.questionId === history.questionId
    );

    if (known) {
      return {
        ...history,
        questionFamilyId: history.questionFamilyId || known.questionFamilyId,
        conceptId: history.conceptId || known.conceptId,
      };
    }

    // Runtime-generated IDs encode the stable family slug so Step A can keep
    // family cooldowns even before D1 stores full history metadata.
    const match = String(history.questionId || "").match(
      /^ca-runtime:([^:]+):/
    );

    return {
      ...history,
      questionFamilyId:
        history.questionFamilyId ||
        (match ? `ca-family:${match[1]}` : undefined),
    };
  });
}

function buildGeneratedCandidates({
  facts,
  recentHistory,
  existingQuestions,
  seed,
}) {
  const generated = [];
  const rejected = [];
  const seenIds = new Set();
  const enrichedHistory = enrichRecentHistory(recentHistory, existingQuestions);

  const orderedFacts = deterministicOrder(
    facts.filter((fact) => fact?.status === "active").slice(0, MAX_FACTS_TO_SCAN),
    seed
  );

  let processedDrafts = 0;

  for (const fact of orderedFacts) {
    if (processedDrafts >= MAX_DRAFTS_TO_PROCESS) break;
    if (generated.length >= MAX_GENERATED_CANDIDATES) break;

    const draftsResult = generateSingleFactDrafts({
      fact,
      difficulties: ["easy", "medium", "hard"],
    });

    for (const draft of draftsResult.drafts) {
      if (processedDrafts >= MAX_DRAFTS_TO_PROCESS) break;
      if (generated.length >= MAX_GENERATED_CANDIDATES) break;

      processedDrafts += 1;

      const questionId = stableQuestionId(draft);

      // Exact generated IDs are stable across requests. This lets the Android
      // recent-history list block a previously served generated question even
      // before Step B adds persistent family/concept metadata.
      if (recentHistoryHasQuestionId(questionId, enrichedHistory)) {
        rejected.push({ questionId, reason: "question_cooldown" });
        continue;
      }

      const duplicate = detectQuestionDuplicate({
        candidate: {
          ...draft,
          questionId,
        },
        existingQuestions: [...existingQuestions, ...generated],
        allowSameFamilyVariants: true,
      });

      if (duplicate.duplicate) {
        rejected.push({
          questionId,
          reason: duplicate.type,
          matches: duplicate.matches,
        });
        continue;
      }

      const sourceFact = fact;
      const distractors = attachDistractors({
        draft,
        sourceFact,
        candidateFacts: facts,
      });

      if (!distractors.ok) {
        rejected.push({
          questionId,
          reason: distractors.reason,
        });
        continue;
      }

      const now = new Date().toISOString();
      const record = toActiveRecord(
        {
          ...distractors.draft,
          questionId,
        },
        distractors.draft.distractors,
        now
      );

      const quality = validateAndPromoteQuestion({
        record: {
          ...record,
          status: "generated",
        },
        facts,
      });

      if (!quality.ok) {
        rejected.push({
          questionId,
          reason: quality.rejectionReasons,
          errors: quality.errors,
        });
        continue;
      }

      const activeRecord = {
        ...quality.record,
        status: "active",
        lastValidated: quality.record.lastValidated || now,
        createdAt: record.createdAt,
        updatedAt: now,
      };

      if (seenIds.has(activeRecord.questionId)) continue;

      // Guard against family/concept history supplied in future client
      // versions. Current V1 sends question IDs, so this is additive.
      const cooldown = isQuestionOnCooldown({
        candidate: activeRecord,
        recentHistory,
      });

      if (cooldown.onCooldown) {
        rejected.push({
          questionId,
          reason: cooldown.reason,
        });
        continue;
      }

      generated.push(activeRecord);
      seenIds.add(activeRecord.questionId);
    }
  }

  return {
    generated,
    rejected,
    diagnostics: {
      factsScanned: orderedFacts.length,
      draftsProcessed: processedDrafts,
      generatedCount: generated.length,
      rejectedCount: rejected.length,
    },
  };
}

function hasRequestedDifficultyCoverage(quiz) {
  const counts = { easy: 0, medium: 0, hard: 0 };

  for (const question of quiz || []) {
    counts[question.difficulty] = (counts[question.difficulty] || 0) + 1;
  }

  return (
    counts.easy >= TARGET_DISTRIBUTION.easy &&
    counts.medium >= TARGET_DISTRIBUTION.medium &&
    counts.hard >= TARGET_DISTRIBUTION.hard
  );
}

/**
 * Generate/assemble a Current Affairs quiz using the Question Bank first,
 * then verified-fact runtime generation when needed.
 */
export function getCurrentAffairsQuestionsWithRuntimeGeneration({
  quizSize = 10,
  recentHistory = [],
  seed = "current-affairs",
} = {}) {
  const bank = CURRENT_AFFAIRS_QUESTION_BANK;

  // First pass: preserve the existing audited bank behavior.
  const bankOnly = assembleCurrentAffairsQuiz({
    questionBank: bank,
    recentHistory,
    quizSize,
    seed,
    allowedAccessTiers: ["FREE"],
  });

  if (bankOnly.success) {
    return {
      success: true,
      questions: bankOnly.quiz,
      diagnostics: {
        mode: "question_bank",
        bankCount: bank.length,
        runtimeGeneratedCount: 0,
        assembler: bankOnly.diagnostics,
      },
    };
  }

  // Second pass: generate only when the bank cannot provide a fresh complete
  // quiz. This is the Step A bridge from facts -> validated questions.
  const runtime = buildGeneratedCandidates({
    facts: CURRENT_AFFAIRS_INITIAL_FACTS,
    recentHistory,
    existingQuestions: bank,
    seed,
  });

  const servingPool = [...bank, ...runtime.generated];

  const assembled = assembleCurrentAffairsQuiz({
    questionBank: servingPool,
    recentHistory,
    quizSize,
    seed,
    allowedAccessTiers: ["FREE"],
  });

  if (!assembled.success || !hasRequestedDifficultyCoverage(assembled.quiz)) {
    return {
      success: false,
      error: assembled.error || "not_enough_runtime_generated_questions",
      status: 404,
      questions: [],
      diagnostics: {
        mode: "runtime_generation",
        bankCount: bank.length,
        runtimeGeneratedCount: runtime.generated.length,
        runtime: runtime.diagnostics,
        assembler: assembled.diagnostics,
        initialBankFailure: bankOnly.diagnostics,
      },
    };
  }

  return {
    success: true,
    questions: assembled.quiz,
    diagnostics: {
      mode: "runtime_generation",
      bankCount: bank.length,
      runtimeGeneratedCount: runtime.generated.length,
      runtime: runtime.diagnostics,
      assembler: assembled.diagnostics,
    },
  };
}

export default {
  getCurrentAffairsQuestionsWithRuntimeGeneration,
};
