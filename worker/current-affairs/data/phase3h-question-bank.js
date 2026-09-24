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


/**
 * Phase 3H-B — In-memory Question Bank manager.
 *
 * The manager is the controlled API around the 3H-A contract. It deliberately
 * keeps persistence implementation-neutral: the current repository can use
 * version-controlled data, while a later D1/KV-backed implementation can keep
 * the same manager contract.
 */

function cloneRecord(record) {
  if (!record) return record;
  return {
    ...record,
    factIds: Array.isArray(record.factIds) ? [...record.factIds] : [],
    sourceIds: Array.isArray(record.sourceIds) ? [...record.sourceIds] : [],
    options: Array.isArray(record.options) ? [...record.options] : [],
    temporalContext:
      record.temporalContext && typeof record.temporalContext === "object"
        ? { ...record.temporalContext }
        : record.temporalContext,
  };
}

export function createQuestionBankManager(initialRecords = []) {
  const records = new Map();

  const result = validateQuestionBankCollection(initialRecords);
  if (!result.valid) {
    throw new Error(
      `Invalid initial Question Bank: ${JSON.stringify(result.errors)}`
    );
  }

  for (const record of initialRecords) {
    records.set(record.questionId, cloneRecord(record));
  }

  function get(questionId) {
    return cloneRecord(records.get(questionId) || null);
  }

  function list({
    status = null,
    accessTier = null,
    difficulty = null,
    domain = null,
    topic = null,
    variantType = null,
    questionFamilyId = null,
    conceptId = null,
  } = {}) {
    return [...records.values()]
      .filter((record) => !status || record.status === status)
      .filter((record) => !accessTier || record.accessTier === accessTier)
      .filter((record) => !difficulty || record.difficulty === difficulty)
      .filter((record) => !domain || record.domain === domain)
      .filter((record) => !topic || record.topic === topic)
      .filter((record) => !variantType || record.variantType === variantType)
      .filter(
        (record) =>
          !questionFamilyId || record.questionFamilyId === questionFamilyId
      )
      .filter((record) => !conceptId || record.conceptId === conceptId)
      .map(cloneRecord);
  }

  function add(record) {
    const validation = validateQuestionBankRecord(record);

    if (!validation.valid) {
      return { success: false, record: null, errors: validation.errors };
    }

    if (records.has(record.questionId)) {
      return {
        success: false,
        record: null,
        errors: ["question_id_already_exists"],
      };
    }

    records.set(record.questionId, cloneRecord(record));

    return { success: true, record: cloneRecord(record), errors: [] };
  }

  function promote(questionId, { validatedAt = null, updatedAt = null } = {}) {
    const current = records.get(questionId);

    if (!current) {
      return { success: false, record: null, errors: ["question_not_found"] };
    }

    if (current.status !== "validated") {
      return {
        success: false,
        record: null,
        errors: ["only_validated_questions_can_be_promoted"],
      };
    }

    const result = promoteQuestionBankRecord(current, {
      validatedAt,
      updatedAt,
    });

    if (!result.success) {
      return result;
    }

    records.set(questionId, cloneRecord(result.record));
    return { success: true, record: cloneRecord(result.record), errors: [] };
  }

  function update(questionId, patch = {}) {
    const current = records.get(questionId);

    if (!current) {
      return { success: false, record: null, errors: ["question_not_found"] };
    }

    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      return { success: false, record: null, errors: ["invalid_update_patch"] };
    }

    // Identity fields are immutable. Replacement should create a new question
    // identity and use supersedeQuestion/supersedeQuestionBankRecord instead.
    for (const field of ["questionId", "questionFamilyId", "conceptId"]) {
      if (Object.prototype.hasOwnProperty.call(patch, field)) {
        return {
          success: false,
          record: null,
          errors: [`immutable_identity_field:${field}`],
        };
      }
    }

    const candidate = { ...current, ...patch, updatedAt: patch.updatedAt ?? current.updatedAt };
    const validation = validateQuestionBankRecord(candidate);

    if (!validation.valid) {
      return { success: false, record: null, errors: validation.errors };
    }

    records.set(questionId, cloneRecord(candidate));
    return { success: true, record: cloneRecord(candidate), errors: [] };
  }

  function retire(questionId, { updatedAt = null } = {}) {
    const current = records.get(questionId);

    if (!current) {
      return { success: false, record: null, errors: ["question_not_found"] };
    }

    const result = retireQuestionBankRecord(current, { updatedAt });
    records.set(questionId, cloneRecord(result.record));

    return { success: true, record: cloneRecord(result.record), errors: [] };
  }

  function supersede(
    questionId,
    replacementRecord,
    { updatedAt = null } = {}
  ) {
    const current = records.get(questionId);

    if (!current) {
      return { success: false, record: null, errors: ["question_not_found"] };
    }

    if (!replacementRecord?.questionId) {
      return {
        success: false,
        record: null,
        errors: ["replacement_question_required"],
      };
    }

    if (records.has(replacementRecord.questionId)) {
      return {
        success: false,
        record: null,
        errors: ["replacement_question_id_already_exists"],
      };
    }

    const replacementValidation =
      validateQuestionBankRecord(replacementRecord);

    if (!replacementValidation.valid) {
      return {
        success: false,
        record: null,
        errors: replacementValidation.errors,
      };
    }

    const superseded = supersedeQuestionBankRecord(current, {
      replacementQuestionId: replacementRecord.questionId,
      updatedAt,
    });

    records.set(questionId, cloneRecord(superseded.record));
    records.set(
      replacementRecord.questionId,
      cloneRecord(replacementRecord)
    );

    return {
      success: true,
      record: cloneRecord(superseded.record),
      replacementRecord: cloneRecord(replacementRecord),
      errors: [],
    };
  }

  function findByFactId(factId) {
    return [...records.values()]
      .filter((record) => record.factIds.includes(factId))
      .map(cloneRecord);
  }

  function findBySourceId(sourceId) {
    return [...records.values()]
      .filter((record) => record.sourceIds.includes(sourceId))
      .map(cloneRecord);
  }

  function getStats() {
    const stats = {
      total: records.size,
      byStatus: {},
      byDifficulty: {},
      byDomain: {},
      byAccessTier: {},
    };

    for (const record of records.values()) {
      for (const [bucket, value] of [
        ["byStatus", record.status],
        ["byDifficulty", record.difficulty],
        ["byDomain", record.domain],
        ["byAccessTier", record.accessTier],
      ]) {
        stats[bucket][value] = (stats[bucket][value] || 0) + 1;
      }
    }

    return stats;
  }

  function audit() {
    const collection = validateQuestionBankCollection([...records.values()]);
    return {
      ...collection,
      stats: getStats(),
    };
  }

  function snapshot() {
    return [...records.values()].map(cloneRecord);
  }

  return {
    get,
    list,
    add,
    promote,
    update,
    retire,
    supersede,
    findByFactId,
    findBySourceId,
    getStats,
    audit,
    snapshot,
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
  createQuestionBankManager,
  QUESTION_ACCESS_TIERS,
  QUESTION_DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_VARIANT_TYPES,
};
