/**
 * Phase 3H-A — Current Affairs Question Bank contract.
 *
 * Purpose:
 * - Define the persistent Question Bank record contract.
 * - Preserve provenance, identity, validation and lifecycle metadata.
 * - Provide safe normalization/validation for Question Bank storage.
 *
 * Boundary:
 * - Does not generate questions.
 * - Does not generate distractors.
 * - Does not replace Phase 3E quality validation or Phase 3F duplicate detection.
 * - Does not assemble quizzes.
 * - Does not enforce billing/access permissions.
 * - Does not connect to NewsData, the Worker route or the Android app.
 *
 * Pipeline:
 *   verified facts
 *     -> 3C generator
 *     -> 3D distractors
 *     -> 3E quality validator
 *     -> 3F duplicate/family detection
 *     -> 3H Question Bank
 *     -> 3G quiz assembly / later Worker integration
 */

import {
  QUESTION_ACCESS_TIERS,
  QUESTION_DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_VARIANT_TYPES,
  validateQuestionRecord,
} from "./phase3a-question-model.js";

export const QUESTION_BANK_VERSION = "3H-A.1";

export const QUESTION_BANK_LIFECYCLE = [
  "validated",
  "active",
  "superseded",
  "retired",
];

export const QUESTION_BANK_SERVING_STATUSES = ["active"];

export const QUESTION_BANK_REQUIRED_FIELDS = [
  "questionId",
  "questionFamilyId",
  "conceptId",
  "factIds",
  "sourceIds",
  "variantType",
  "blueprintId",
  "difficulty",
  "domain",
  "topic",
  "question",
  "options",
  "correctAnswer",
  "explanation",
  "status",
  "accessTier",
  "temporalContext",
  "generatorVersion",
  "lastValidated",
  "createdAt",
  "updatedAt",
];

/**
 * Build a canonical Question Bank record.
 *
 * The base question contract remains owned by Phase 3A. This layer adds
 * Question Bank-specific metadata needed for provenance, lifecycle and
 * freshness management.
 */
export function createQuestionBankRecord({
  questionId,
  questionFamilyId,
  conceptId,
  factIds = [],
  sourceIds = [],
  variantType,
  blueprintId,
  difficulty,
  domain,
  topic,
  question,
  options = [],
  correctAnswer,
  explanation = "",
  status = "validated",
  accessTier = "FREE",
  temporalContext = null,
  generatorVersion = null,
  lastValidated = null,
  createdAt = null,
  updatedAt = null,
} = {}) {
  return {
    questionId,
    questionFamilyId,
    conceptId,
    factIds: [...new Set(factIds)],
    sourceIds: [...new Set(sourceIds)],
    variantType,
    blueprintId,
    difficulty,
    domain,
    topic,
    question,
    options: [...options],
    correctAnswer,
    explanation,
    status,
    accessTier,
    temporalContext,
    generatorVersion,
    lastValidated,
    createdAt,
    updatedAt,
  };
}

/**
 * Return the stable identity fields used by downstream Question Bank logic.
 *
 * Question ID identifies the exact variant.
 * Family/concept IDs identify the underlying knowledge relationship.
 */
export function getQuestionBankIdentity(record) {
  return {
    questionId: record?.questionId || null,
    questionFamilyId: record?.questionFamilyId || null,
    conceptId: record?.conceptId || null,
  };
}

function hasOwn(record, field) {
  return Object.prototype.hasOwnProperty.call(record || {}, field);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestampOrNull(value) {
  return value === null || isNonEmptyString(value);
}

function validateTemporalContext(temporalContext) {
  const errors = [];

  if (temporalContext === null) return errors;

  if (typeof temporalContext !== "object" || Array.isArray(temporalContext)) {
    return ["invalid_temporal_context"];
  }

  const allowedFields = new Set([
    "referenceYear",
    "referencePeriod",
    "validFrom",
    "validTo",
    "datasetVintage",
    "lastVerified",
  ]);

  for (const key of Object.keys(temporalContext)) {
    if (!allowedFields.has(key)) {
      errors.push(`unknown_temporal_context_field:${key}`);
    }
  }

  for (const field of ["referenceYear", "referencePeriod", "validFrom", "validTo", "datasetVintage", "lastVerified"]) {
    if (hasOwn(temporalContext, field) && !isTimestampOrNull(temporalContext[field])) {
      errors.push(`invalid_temporal_context_field:${field}`);
    }
  }

  return errors;
}

/**
 * Validate the Question Bank contract.
 *
 * This is intentionally stricter than Phase 3A structural validation.
 * It checks that a record has the metadata required for persistent bank
 * management, while leaving factual/semantic decisions to Phases 3E/3F.
 */
export function validateQuestionBankRecord(record) {
  const errors = [];

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {
      valid: false,
      errors: ["record_must_be_an_object"],
    };
  }

  const structural = validateQuestionRecord({
    ...record,
    // Phase 3A treats generated as a valid structural status. The bank
    // contract separately restricts which lifecycle states are persisted.
    status: record.status,
  });

  errors.push(...structural.errors);

  for (const field of QUESTION_BANK_REQUIRED_FIELDS) {
    if (!hasOwn(record, field)) {
      errors.push(`missing_question_bank_field:${field}`);
    }
  }

  if (!QUESTION_BANK_LIFECYCLE.includes(record.status)) {
    errors.push("invalid_question_bank_status");
  }

  if (!QUESTION_BANK_SERVING_STATUSES.includes(record.status) &&
      record.status === "validated") {
    // Validated records are allowed in the bank as promotion-ready records,
    // but are never serving records until promoted to active.
  }

  if (!isNonEmptyString(record.blueprintId)) {
    errors.push("missing_blueprint_id");
  }

  if (!isNonEmptyString(record.generatorVersion)) {
    errors.push("missing_generator_version");
  }

  if (!isTimestampOrNull(record.lastValidated)) {
    errors.push("invalid_last_validated");
  }

  if (!isTimestampOrNull(record.createdAt)) {
    errors.push("invalid_created_at");
  }

  if (!isTimestampOrNull(record.updatedAt)) {
    errors.push("invalid_updated_at");
  }

  errors.push(...validateTemporalContext(record.temporalContext));

  if (
    record.status === "active" &&
    (!record.lastValidated || !record.sourceIds?.length)
  ) {
    errors.push("active_question_requires_validation_and_source_provenance");
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
  };
}

/**
 * Check whether a record is eligible to be served by the quiz assembler.
 *
 * This does not perform user-history or family checks; Phase 3G owns those.
 */
export function isQuestionBankRecordServable(record) {
  const validation = validateQuestionBankRecord(record);

  return {
    servable:
      validation.valid &&
      record.status === "active" &&
      QUESTION_BANK_SERVING_STATUSES.includes(record.status),
    errors: validation.errors,
  };
}

/**
 * Promote a validated Question Bank record to active.
 *
 * Promotion is deliberately explicit. A caller must already have passed the
 * record through Phase 3E/3F; this contract does not re-run those systems.
 */
export function promoteQuestionBankRecord(record, {
  validatedAt = null,
  updatedAt = null,
} = {}) {
  const candidate = {
    ...record,
    status: "active",
    lastValidated: validatedAt ?? record?.lastValidated ?? null,
    updatedAt: updatedAt ?? record?.updatedAt ?? null,
  };

  const validation = validateQuestionBankRecord(candidate);

  if (!validation.valid) {
    return {
      success: false,
      record: null,
      errors: validation.errors,
    };
  }

  return {
    success: true,
    record: candidate,
    errors: [],
  };
}

/**
 * Mark an active question as superseded by a replacement.
 *
 * The manager in Phase 3H-B will own persistence and replacement indexing.
 */
export function supersedeQuestionBankRecord(record, {
  replacementQuestionId = null,
  updatedAt = null,
} = {}) {
  const candidate = {
    ...record,
    status: "superseded",
    updatedAt: updatedAt ?? record?.updatedAt ?? null,
    supersededBy: replacementQuestionId || null,
  };

  return {
    success: true,
    record: candidate,
    errors: [],
  };
}

/**
 * Retire a Question Bank record without deleting its historical identity.
 */
export function retireQuestionBankRecord(record, { updatedAt = null } = {}) {
  return {
    success: true,
    record: {
      ...record,
      status: "retired",
      updatedAt: updatedAt ?? record?.updatedAt ?? null,
    },
    errors: [],
  };
}

/**
 * Validate a complete Question Bank collection.
 *
 * Duplicate question IDs are a storage-level error. Semantic/family duplicate
 * detection remains owned by Phase 3F.
 */
export function validateQuestionBankCollection(records = []) {
  const errors = [];
  const questionIds = new Set();

  for (const record of records) {
    const result = validateQuestionBankRecord(record);

    if (!result.valid) {
      errors.push({
        questionId: record?.questionId || null,
        errors: result.errors,
      });
    }

    if (record?.questionId) {
      if (questionIds.has(record.questionId)) {
        errors.push({
          questionId: record.questionId,
          errors: ["duplicate_question_id"],
        });
      }
      questionIds.add(record.questionId);
    }
  }

  return {
    valid: errors.length === 0,
    count: records.length,
    errors,
  };
}

export default {
  QUESTION_BANK_VERSION,
  QUESTION_BANK_LIFECYCLE,
  QUESTION_BANK_SERVING_STATUSES,
  QUESTION_BANK_REQUIRED_FIELDS,
  createQuestionBankRecord,
  getQuestionBankIdentity,
  validateQuestionBankRecord,
  isQuestionBankRecordServable,
  promoteQuestionBankRecord,
  supersedeQuestionBankRecord,
  retireQuestionBankRecord,
  validateQuestionBankCollection,
  QUESTION_ACCESS_TIERS,
  QUESTION_DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_VARIANT_TYPES,
};
