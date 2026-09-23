/**
 * Phase 3D — Current Affairs distractor generator.
 *
 * Converts a Phase 3C question draft into a four-option candidate set.
 *
 * Design principles:
 * - Prefer verified values/entities from the same fact system.
 * - Match the correct answer's semantic category before widening the pool.
 * - Never use the correct answer as a distractor.
 * - Never create duplicate options.
 * - Never invent factual relationships.
 * - Return an explicit insufficiency result rather than filling weak options.
 *
 * Phase 3D does not decide whether a question is factually valid. Phase 3E
 * remains responsible for final quality validation.
 */

import { DISTRACTOR_STRATEGIES, getQuestionBlueprint } from "./phase3b-question-blueprints.js";

const ENTITY_ANSWER_VARIANTS = new Set([
  "reverse",
  "identification",
]);

const VALUE_ANSWER_VARIANTS = new Set([
  "direct",
  "institution_function",
  "number_count",
  "chronology",
  "classification",
]);

const STRATEGY_ORDER = {
  same_attribute: ["same_attribute", "same_topic", "same_domain"],
  related_entities: ["same_attribute", "same_topic", "same_domain"],
  related_institutions: ["same_attribute", "same_topic", "same_domain"],
  related_categories: ["same_attribute", "same_topic", "same_domain"],
  same_unit: ["same_attribute", "same_topic", "same_domain"],
  nearby_value: ["same_attribute", "same_topic", "same_domain"],
  none: [],
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null))];
}

function factIsUsable(fact) {
  return Boolean(
    fact &&
    fact.id &&
    fact.domain &&
    fact.topic &&
    fact.entity !== undefined &&
    fact.attribute !== undefined &&
    fact.value !== undefined
  );
}

function isSameAttribute(a, b) {
  return normalize(a?.attribute) === normalize(b?.attribute);
}

function isSameTopic(a, b) {
  return normalize(a?.topic) === normalize(b?.topic);
}

function isSameDomain(a, b) {
  return normalize(a?.domain) === normalize(b?.domain);
}

function sameValueType(a, b) {
  if (typeof a === typeof b) return true;
  if (typeof a === "number" || typeof b === "number") {
    return !Number.isNaN(Number(a)) && !Number.isNaN(Number(b));
  }
  return false;
}

function getAnswerField(draft) {
  if (ENTITY_ANSWER_VARIANTS.has(draft.variantType)) return "entity";

  if (VALUE_ANSWER_VARIANTS.has(draft.variantType)) return "value";

  // Context-generated variants supply candidate answers explicitly in
  // context, so the generator does not infer a field from unrelated facts.
  return null;
}

function candidateValue(fact, draft) {
  const field = getAnswerField(draft);
  return field ? fact[field] : null;
}

function candidateScore(fact, sourceFact, draft, strategy) {
  let score = 0;

  if (strategy === "none") return -1;

  if (isSameAttribute(fact, sourceFact)) score += 60;
  if (isSameTopic(fact, sourceFact)) score += 30;
  if (isSameDomain(fact, sourceFact)) score += 15;

  if (sameValueType(fact.value, sourceFact.value)) score += 8;

  if (draft.variantType === "number_count" && typeof fact.value === "number") {
    score += 12;
  }

  if (draft.variantType === "chronology" && typeof fact.value === "string") {
    score += /^\d{4}(-\d{2}-\d{2})?$/.test(fact.value) ? 12 : 0;
  }

  if (draft.variantType === "reverse" || draft.variantType === "identification") {
    // Entity distractors should come from distinct entities.
    if (normalize(fact.entity) !== normalize(sourceFact.entity)) score += 10;
  }

  return score;
}

function getStrategies(blueprint) {
  const configured = blueprint?.distractorStrategy;
  return STRATEGY_ORDER[configured] || [configured, "same_topic", "same_domain"];
}

function collectCandidates({ draft, sourceFact, candidateFacts, blueprint }) {
  const correct = normalize(draft.correctAnswer);
  const strategies = getStrategies(blueprint);
  const scored = new Map();

  for (const fact of candidateFacts) {
    if (!factIsUsable(fact)) continue;
    if (fact.id === sourceFact?.id) continue;

    const value = candidateValue(fact, draft);
    if (value === null || value === undefined) continue;

    const normalized = normalize(value);
    if (!normalized || normalized === correct) continue;

    for (const strategy of strategies) {
      const score = candidateScore(fact, sourceFact, draft, strategy);
      if (score < 1) continue;

      const previous = scored.get(normalized);
      if (!previous || score > previous.score) {
        scored.set(normalized, {
          value,
          factId: fact.id,
          score,
          strategy,
        });
      }
    }
  }

  return [...scored.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return normalize(a.value).localeCompare(normalize(b.value));
  });
}

function selectBalanced(candidates, count) {
  // Deterministic selection. Prefer strong candidates, but avoid taking
  // several answers from exactly the same source entity when alternatives exist.
  const selected = [];
  const seenFacts = new Set();

  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (seenFacts.has(candidate.factId)) continue;

    selected.push(candidate);
    seenFacts.add(candidate.factId);
  }

  return selected;
}

/**
 * Generate exactly three distractors for a question draft.
 *
 * candidateFacts should normally be the relevant verified fact pool for the
 * current domain/topic. The generator intentionally refuses to manufacture
 * unsupported answers when fewer than three strong candidates exist.
 */
export function generateDistractors({
  draft,
  sourceFact = null,
  candidateFacts = [],
}) {
  if (!draft?.question || !draft?.correctAnswer) {
    return {
      ok: false,
      reason: "invalid_question_draft",
      distractors: [],
    };
  }

  if (!Array.isArray(candidateFacts)) {
    return {
      ok: false,
      reason: "candidate_facts_must_be_array",
      distractors: [],
    };
  }

  const blueprint = getQuestionBlueprint(draft.blueprintId);
  if (!blueprint || blueprint.status !== "active") {
    return {
      ok: false,
      reason: "invalid_or_inactive_blueprint",
      distractors: [],
    };
  }

  if (!DISTRACTOR_STRATEGIES.includes(blueprint.distractorStrategy)) {
    return {
      ok: false,
      reason: "unsupported_distractor_strategy",
      distractors: [],
    };
  }

  if (
    ["relationship", "comparison", "matching", "scenario", "odd_one_out", "multi_fact"]
      .includes(draft.variantType) &&
    candidateFacts.length === 0
  ) {
    return {
      ok: false,
      reason: "explicit_candidate_context_required",
      distractors: [],
    };
  }

  const candidates = collectCandidates({
    draft,
    sourceFact,
    candidateFacts,
    blueprint,
  });

  const selected = selectBalanced(candidates, 3);
  const distractors = unique(selected.map((item) => item.value));

  if (distractors.length < 3) {
    return {
      ok: false,
      reason: "insufficient_verified_distractors",
      required: 3,
      available: distractors.length,
      candidatesConsidered: candidates.length,
      distractors,
    };
  }

  return {
    ok: true,
    distractors,
    provenance: selected.map((item) => ({
      factId: item.factId,
      strategy: item.strategy,
      score: item.score,
    })),
  };
}

/**
 * Attach distractors to a draft without deciding final option order.
 *
 * Phase 3E should validate the completed option set before activation.
 */
export function attachDistractors({
  draft,
  sourceFact = null,
  candidateFacts = [],
}) {
  const result = generateDistractors({
    draft,
    sourceFact,
    candidateFacts,
  });

  if (!result.ok) return result;

  return {
    ok: true,
    draft: {
      ...draft,
      distractors: result.distractors,
      distractorProvenance: result.provenance,
    },
  };
}

/**
 * Batch helper with an explicit cap to keep Worker execution predictable.
 */
export function generateDistractorBatch({
  drafts = [],
  facts = [],
  maxProcessed = 100,
}) {
  const completed = [];
  const rejected = [];

  for (const draft of drafts) {
    if (completed.length + rejected.length >= maxProcessed) break;

    const sourceFact =
      facts.find((fact) => draft.factIds?.includes(fact.id)) || null;

    const result = attachDistractors({
      draft,
      sourceFact,
      candidateFacts: facts,
    });

    if (result.ok) completed.push(result.draft);
    else {
      rejected.push({
        questionId: draft.questionId || null,
        factIds: draft.factIds || [],
        reason: result.reason,
        available: result.available,
      });
    }
  }

  return {
    generatorVersion: "3D.1",
    completed,
    rejected,
    counts: {
      requestedDrafts: drafts.length,
      completed: completed.length,
      rejected: rejected.length,
    },
  };
}
