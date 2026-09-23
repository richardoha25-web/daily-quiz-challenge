/**
 * Phase 3A — Current Affairs question data model.
 *
 * This file defines the contracts for question records, concepts,
 * question families and variants. It does not generate questions.
 *
 * Design goals:
 * - Preserve verified facts as the source of truth.
 * - Make related question variants identifiable.
 * - Prevent equivalent questions from appearing together.
 * - Keep user history separate from the Question Bank.
 * - Leave room for future access tiers without implementing billing.
 */

export const QUESTION_VARIANT_TYPES = [
  "direct",
  "reverse",
  "identification",
  "classification",
  "relationship",
  "institution_function",
  "comparison",
  "number_count",
  "chronology",
  "matching",
  "scenario",
  "odd_one_out",
  "multi_fact",
];

export const QUESTION_DIFFICULTIES = ["easy", "medium", "hard"];

export const QUESTION_STATUSES = [
  "generated",
  "validated",
  "active",
  "superseded",
  "retired",
];

export const QUESTION_REJECTION_REASONS = [
  "duplicate",
  "semantic_duplicate",
  "family_duplicate",
  "ambiguous",
  "bad_distractor",
  "unsupported_fact",
  "stale_fact",
  "grammar_problem",
  "poor_difficulty",
  "insufficient_information",
];

export const QUESTION_ACCESS_TIERS = [
  "FREE",
  "PREMIUM",
  "SPECIAL_PACK",
];

/**
 * A Concept represents the underlying knowledge relationship being tested.
 * It is broader than a single question and narrower than an entire topic.
 *
 * Example:
 *   fact: Nigeria -> capital -> Abuja
 *   concept: nigeria-capital
 */
export function createQuestionConcept({
  id,
  domain,
  topic,
  label,
  factIds = [],
  relationship,
  status = "active",
}) {
  return {
    id,
    domain,
    topic,
    label,
    factIds: [...new Set(factIds)],
    relationship,
    status,
  };
}

/**
 * A Question Family groups variants that test substantially the same
 * knowledge relationship.
 *
 * Example family:
 *   nigeria-capital
 *     - What is the capital of Nigeria?
 *     - Abuja is the capital of which country?
 *
 * Only one member of a family may appear in one 10-question quiz.
 */
export function createQuestionFamily({
  id,
  conceptId,
  domain,
  topic,
  variantTypes = [],
  cooldownScope = "user_history",
  status = "active",
}) {
  return {
    id,
    conceptId,
    domain,
    topic,
    variantTypes: [...new Set(variantTypes)],
    cooldownScope,
    status,
  };
}

/**
 * Canonical Question Bank record.
 *
 * factIds are the provenance links back to the verified fact database.
 * conceptId/questionFamilyId are the anti-semantic-duplication identity.
 */
export function createQuestionRecord({
  questionId,
  factIds = [],
  conceptId,
  questionFamilyId,
  variantType,
  difficulty,
  domain,
  topic,
  question,
  options,
  correctAnswer,
  explanation = "",
  status = "generated",
  accessTier = "FREE",
  sourceIds = [],
  lastValidated = null,
  createdAt = null,
  updatedAt = null,
}) {
  return {
    questionId,
    factIds: [...new Set(factIds)],
    conceptId,
    questionFamilyId,
    variantType,
    difficulty,
    domain,
    topic,
    question,
    options: [...options],
    correctAnswer,
    explanation,
    status,
    accessTier,
    sourceIds: [...new Set(sourceIds)],
    lastValidated,
    createdAt,
    updatedAt,
  };
}

/**
 * Validate the structural contract only.
 *
 * This intentionally does not decide factual correctness or semantic
 * duplication; those belong to later Phase 3 stages.
 */
export function validateQuestionRecord(record) {
  const errors = [];

  if (!record?.questionId) errors.push("missing_question_id");
  if (!Array.isArray(record?.factIds) || record.factIds.length === 0) {
    errors.push("missing_fact_ids");
  }
  if (!record?.conceptId) errors.push("missing_concept_id");
  if (!record?.questionFamilyId) errors.push("missing_question_family_id");
  if (!QUESTION_VARIANT_TYPES.includes(record?.variantType)) {
    errors.push("invalid_variant_type");
  }
  if (!QUESTION_DIFFICULTIES.includes(record?.difficulty)) {
    errors.push("invalid_difficulty");
  }
  if (!record?.domain) errors.push("missing_domain");
  if (!record?.topic) errors.push("missing_topic");
  if (!record?.question) errors.push("missing_question_text");
  if (!Array.isArray(record?.options) || record.options.length !== 4) {
    errors.push("question_must_have_exactly_four_options");
  }
  if (!record?.correctAnswer) errors.push("missing_correct_answer");
  if (!QUESTION_STATUSES.includes(record?.status)) {
    errors.push("invalid_status");
  }
  if (!QUESTION_ACCESS_TIERS.includes(record?.accessTier)) {
    errors.push("invalid_access_tier");
  }

  if (Array.isArray(record?.options)) {
    const normalized = record.options.map((option) =>
      String(option).trim().toLowerCase()
    );
    if (new Set(normalized).size !== normalized.length) {
      errors.push("duplicate_options");
    }
    if (
      record.correctAnswer &&
      !normalized.includes(String(record.correctAnswer).trim().toLowerCase())
    ) {
      errors.push("correct_answer_not_in_options");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * A quiz-selection identity derived from a question family.
 * Quiz assembly should reject a family already selected in the same quiz.
 */
export function getQuestionFamilyKey(question) {
  return question?.questionFamilyId || null;
}
