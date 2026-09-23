/**
 * Phase 3E — Current Affairs quality validator.
 *
 * Final quality gate before a generated question may become a trusted
 * Question Bank record.
 *
 * The validator is intentionally conservative:
 * - failure is preferred over a questionable question;
 * - verified facts are the source of truth;
 * - semantic/family duplication remains Phase 3F;
 * - this stage validates one completed question at a time.
 */

import {
  QUESTION_ACCESS_TIERS,
  QUESTION_DIFFICULTIES,
  QUESTION_VARIANT_TYPES,
  QUESTION_REJECTION_REASONS,
  validateQuestionRecord,
} from "./phase3a-question-model.js";

const CURRENT_HOLDER_ATTRIBUTES = new Set([
  "currentHolder",
  "currentOfficeholder",
  "currentDirectorGeneral",
]);

const POLITICAL_TERMS = [
  "president",
  "prime minister",
  "governor",
  "senator",
  "minister",
  "government",
  "election",
  "party",
  "parliament",
  "assembly",
  "legislature",
  "court",
  "judge",
  "political",
];

const GENERIC_BAD_PATTERNS = [
  /\b(according to me|in my opinion|obviously|everyone knows)\b/i,
  /\b(best|worst|greatest)\b/i,
];

const QUESTION_ENDING_PATTERN = /[?؟]$/;

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function addError(errors, reason, detail) {
  errors.push({ reason, detail });
}

function getFactById(facts, id) {
  return facts.find((fact) => fact?.id === id) || null;
}

function hasRequiredTemporalContext(fact) {
  if (!fact) return false;

  const dynamic =
    CURRENT_HOLDER_ATTRIBUTES.has(fact.attribute) ||
    fact.validFrom ||
    fact.validTo ||
    fact.referencePeriod ||
    fact.datasetVintage;

  if (!dynamic) return true;

  return Boolean(
    fact.referencePeriod ||
    fact.datasetVintage ||
    fact.validFrom ||
    fact.validTo ||
    fact.lastVerified
  );
}

function validateProvenance(record, facts, errors) {
  if (!Array.isArray(record.factIds) || record.factIds.length === 0) {
    addError(errors, "unsupported_fact", "No fact provenance supplied.");
    return;
  }

  for (const factId of record.factIds) {
    const fact = getFactById(facts, factId);
    if (!fact) {
      addError(errors, "unsupported_fact", `Fact not found: ${factId}`);
      continue;
    }

    if (fact.status !== "active") {
      addError(errors, "unsupported_fact", `Fact is not active: ${factId}`);
    }

    if (!fact.sourceId) {
      addError(errors, "unsupported_fact", `Fact has no source: ${factId}`);
    }

    if (!hasRequiredTemporalContext(fact)) {
      addError(errors, "stale_fact", `Missing temporal/freshness metadata: ${factId}`);
    }
  }
}

function validateOptions(record, errors) {
  if (!Array.isArray(record.options) || record.options.length !== 4) {
    addError(errors, "bad_distractor", "Exactly four options are required.");
    return;
  }

  const normalized = record.options.map(normalize);

  if (normalized.some((option) => !option)) {
    addError(errors, "bad_distractor", "Blank option detected.");
  }

  if (new Set(normalized).size !== 4) {
    addError(errors, "bad_distractor", "Options must be unique.");
  }

  if (!normalized.includes(normalize(record.correctAnswer))) {
    addError(errors, "bad_distractor", "Correct answer must be one of the four options.");
  }
}

function validateLanguage(record, errors) {
  const question = String(record.question || "").trim();

  if (!question) {
    addError(errors, "grammar_problem", "Question text is empty.");
    return;
  }

  if (!QUESTION_ENDING_PATTERN.test(question)) {
    addError(errors, "grammar_problem", "Question should end with a question mark.");
  }

  if (question.length < 10 || question.length > 500) {
    addError(errors, "grammar_problem", "Question length is outside the supported range.");
  }

  if (/[<>]/.test(question)) {
    addError(errors, "grammar_problem", "Question contains unsafe markup characters.");
  }

  for (const pattern of GENERIC_BAD_PATTERNS) {
    if (pattern.test(question)) {
      addError(errors, "ambiguous", "Question contains subjective or evaluative wording.");
    }
  }
}

function validatePoliticalNeutrality(record, facts, errors) {
  const text = [
    record.question,
    record.explanation,
    ...(record.options || []),
  ]
    .join(" ")
    .toLowerCase();

  const political = POLITICAL_TERMS.some((term) => text.includes(term));
  if (!political) return;

  // Political/civic facts are allowed. The validator only blocks wording that
  // turns factual knowledge into persuasion or unsupported evaluation.
  const evaluativePatterns = [
    /\b(vote for|vote against|should vote|support|oppose)\b/i,
    /\b(good|bad|corrupt|honest|dishonest|successful|failure)\b/i,
    /\b(who should|who deserves)\b/i,
  ];

  for (const pattern of evaluativePatterns) {
    if (pattern.test(text)) {
      addError(errors, "ambiguous", "Political content must remain factual and non-persuasive.");
    }
  }

  // Current officeholder facts need an explicit freshness marker.
  for (const factId of record.factIds || []) {
    const fact = getFactById(facts, factId);
    if (fact && CURRENT_HOLDER_ATTRIBUTES.has(fact.attribute) && !fact.lastVerified) {
      addError(errors, "stale_fact", `Current officeholder fact lacks lastVerified: ${factId}`);
    }
  }
}

function validateCorrectAnswer(record, facts, errors) {
  const answer = normalize(record.correctAnswer);
  if (!answer) {
    addError(errors, "insufficient_information", "Correct answer is empty.");
    return;
  }

  const matches = (record.options || []).filter(
    (option) => normalize(option) === answer
  );

  if (matches.length !== 1) {
    addError(errors, "bad_distractor", "There must be exactly one correct option.");
  }
}

function validateDifficulty(record, facts, errors) {
  if (!QUESTION_DIFFICULTIES.includes(record.difficulty)) {
    addError(errors, "poor_difficulty", "Unsupported difficulty.");
    return;
  }

  // Avoid claiming a difficulty is correct solely from wording. These are
  // conservative structural checks; deeper difficulty calibration can evolve.
  if (record.difficulty === "hard" && (record.factIds || []).length < 2 &&
      ["comparison", "scenario", "multi_fact"].includes(record.variantType)) {
    addError(errors, "poor_difficulty", "Hard multi-fact variants require multiple verified facts.");
  }

  if (record.variantType === "number_count" && record.difficulty === "hard") {
    addError(errors, "poor_difficulty", "A simple numeric recall question should not be marked hard.");
  }
}

function validateTier(record, errors) {
  if (!QUESTION_ACCESS_TIERS.includes(record.accessTier)) {
    addError(errors, "insufficient_information", "Invalid access tier.");
  }
}

function validateStructure(record, errors) {
  if (!QUESTION_VARIANT_TYPES.includes(record.variantType)) {
    addError(errors, "insufficient_information", "Invalid question variant.");
  }

  const structural = validateQuestionRecord(record);
  for (const error of structural.errors) {
    addError(errors, "insufficient_information", error);
  }
}

/**
 * Validate a completed Question Bank candidate.
 *
 * Returns:
 * {
 *   valid,
 *   errors,
 *   rejectionReasons,
 *   warnings
 * }
 */
export function validateQuestionQuality({ record, facts = [] }) {
  const errors = [];
  const warnings = [];

  if (!record || typeof record !== "object") {
    return {
      valid: false,
      errors: [{ reason: "insufficient_information", detail: "Missing question record." }],
      rejectionReasons: ["insufficient_information"],
      warnings: [],
    };
  }

  validateStructure(record, errors);
  validateProvenance(record, facts, errors);
  validateOptions(record, errors);
  validateCorrectAnswer(record, facts, errors);
  validateLanguage(record, errors);
  validatePoliticalNeutrality(record, facts, errors);
  validateDifficulty(record, facts, errors);
  validateTier(record, errors);

  // Missing explanation is not a rejection because explanations may be added
  // later or intentionally omitted for a particular quiz mode.
  if (!record.explanation) {
    warnings.push("missing_explanation");
  }

  const rejectionReasons = unique(
    errors
      .map((error) => error.reason)
      .filter((reason) => QUESTION_REJECTION_REASONS.includes(reason))
  );

  return {
    valid: errors.length === 0,
    errors,
    rejectionReasons,
    warnings,
  };
}

/**
 * Validate and mark a candidate as validated.
 *
 * Does not perform semantic/family duplicate checks (Phase 3F).
 */
export function validateAndPromoteQuestion({ record, facts = [] }) {
  const result = validateQuestionQuality({ record, facts });

  if (!result.valid) {
    return {
      ok: false,
      ...result,
    };
  }

  return {
    ok: true,
    record: {
      ...record,
      status: "validated",
      lastValidated: new Date().toISOString(),
    },
    ...result,
  };
}

/**
 * Bounded batch validator for Worker execution.
 */
export function validateQuestionBatch({
  records = [],
  facts = [],
  maxProcessed = 100,
}) {
  const accepted = [];
  const rejected = [];

  for (const record of records) {
    if (accepted.length + rejected.length >= maxProcessed) break;

    const result = validateAndPromoteQuestion({
      record,
      facts,
    });

    if (result.ok) accepted.push(result.record);
    else {
      rejected.push({
        questionId: record?.questionId || null,
        factIds: record?.factIds || [],
        errors: result.errors,
        rejectionReasons: result.rejectionReasons,
      });
    }
  }

  return {
    validatorVersion: "3E.1",
    accepted,
    rejected,
    counts: {
      requestedRecords: records.length,
      accepted: accepted.length,
      rejected: rejected.length,
    },
  };
}
