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

/**
 * Phase 3H-C — Question Bank population pipeline.
 *
 * Controlled flow:
 *   Phase 2 facts
 *     -> 3C draft
 *     -> 3D verified distractors
 *     -> 3E quality validation
 *     -> 3F duplicate/family gate
 *     -> 3H-B manager.add()
 *
 * This stage populates a repository/in-memory bank only. It does not connect
 * the Android app, Worker route, NewsData or billing.
 */

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
} from "./phase3f-duplicate-family-detector.js";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\\s+/g, " ");
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stableQuestionId(draft) {
  return [
    "ca",
    slugify(draft.questionFamilyId),
    slugify(draft.variantType),
    slugify(draft.difficulty),
    slugify(draft.question),
  ].join(":");
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

function completeRecord(draft, distractors) {
  const options = [
    draft.correctAnswer,
    ...distractors,
  ];

  return {
    ...draft,
    questionId: stableQuestionId(draft),
    options,
    explanation: draft.explanation || "",
    temporalContext:
      draft.temporalContext && typeof draft.temporalContext === "object"
        ? draft.temporalContext
        : null,
    status: "generated",
  };
}

function deterministicShuffle(values, seed) {
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

/**
 * Populate a Question Bank from verified facts.
 *
 * By default only one variant is accepted per question family. This prevents
 * the initial bank from filling with direct/reverse/identification variants
 * that Phase 3G would never allow in the same quiz anyway.
 */
export function populateQuestionBank({
  facts = [],
  existingRecords = [],
  maxProcessedFacts = 1000,
  maxAccepted = 500,
  difficulties = ["easy", "medium"],
  blueprintIds = [
    "direct_attribute",
    "reverse_attribute",
    "identification",
    "classification",
    "institution_function",
    "number_count",
    "chronology",
  ],
  oneVariantPerFamily = true,
  timestamp = null,
} = {}) {
  const manager = createQuestionBankManager(existingRecords);
  const accepted = [];
  const rejected = [];
  const seenFamilies = new Set(
    existingRecords
      .filter((record) => record?.status === "active" || record?.status === "validated")
      .map((record) => record.questionFamilyId)
      .filter(Boolean)
  );

  let processedFacts = 0;

  for (const fact of facts) {
    if (processedFacts >= maxProcessedFacts || accepted.length >= maxAccepted) {
      break;
    }

    processedFacts += 1;

    const generated = generateSingleFactDrafts({
      fact,
      difficulties,
      blueprintIds,
    });

    const candidates = generated.drafts;

    for (const draft of candidates) {
      if (accepted.length >= maxAccepted) break;

      if (oneVariantPerFamily && seenFamilies.has(draft.questionFamilyId)) {
        rejected.push({
          questionId: null,
          factIds: draft.factIds,
          reason: "family_already_populated",
          questionFamilyId: draft.questionFamilyId,
        });
        continue;
      }

      const sourceFact =
        facts.find((candidate) => candidate.id === draft.factIds?.[0]) || fact;

      const distractors = attachDistractors({
        draft,
        sourceFact,
        candidateFacts: facts,
      });

      if (!distractors.ok) {
        rejected.push({
          questionId: null,
          factIds: draft.factIds || [],
          reason: distractors.reason,
        });
        continue;
      }

      const record = completeRecord(draft, distractors.distractors);

      // Give every completed record deterministic option ordering. The correct
      // answer remains explicitly stored and is always present in the options.
      record.options = deterministicShuffle(
        record.options,
        record.questionId
      );

      const quality = validateAndPromoteQuestion({
        record,
        facts,
      });

      if (!quality.ok) {
        rejected.push({
          questionId: record.questionId,
          factIds: record.factIds,
          reason: "quality_validation_failed",
          rejectionReasons: quality.rejectionReasons,
          errors: quality.errors,
        });
        continue;
      }

      const duplicate = detectQuestionDuplicate({
        candidate: quality.record,
        existingQuestions: [
          ...manager.snapshot(),
          ...accepted,
        ],
      });

      if (duplicate.duplicate) {
        rejected.push({
          questionId: quality.record.questionId,
          factIds: quality.record.factIds,
          reason: duplicate.type,
          matches: duplicate.matches,
        });
        continue;
      }

      const candidate = {
        ...quality.record,
        status: "validated",
        generatorVersion: record.generatorVersion || "3C.1",
        blueprintId: record.blueprintId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const addResult = manager.add(candidate);

      if (!addResult.success) {
        rejected.push({
          questionId: candidate.questionId,
          factIds: candidate.factIds,
          reason: "question_bank_add_failed",
          errors: addResult.errors,
        });
        continue;
      }

      accepted.push(addResult.record);
      seenFamilies.add(candidate.questionFamilyId);
    }
  }

  return {
    bank: manager.snapshot(),
    accepted,
    rejected,
    counts: {
      inputFacts: facts.length,
      processedFacts,
      accepted: accepted.length,
      rejected: rejected.length,
      finalBankSize: manager.snapshot().length,
    },
    pipelineVersion: "3H-C.1",
  };
}

/**
 * Phase 3H-D — Question Bank audit system.
 * Read-only: it never silently repairs or activates questions.
 */
function auditFreshness(record, factsById) {
  const issues = [];
  for (const factId of record.factIds || []) {
    const fact = factsById.get(factId);
    if (!fact) {
      issues.push({ type: "missing_fact_reference", factId });
      continue;
    }
    if (fact.status !== "active") {
      issues.push({ type: "inactive_fact_dependency", factId });
    }
    const dynamic =
      fact.attribute === "currentHolder" ||
      fact.attribute === "currentOfficeholder" ||
      fact.attribute === "currentDirectorGeneral" ||
      fact.validFrom || fact.validTo || fact.referencePeriod || fact.datasetVintage;
    if (dynamic && !(
      fact.lastVerified || fact.referencePeriod || fact.datasetVintage ||
      fact.validFrom || fact.validTo
    )) {
      issues.push({ type: "missing_freshness_metadata", factId });
    }
  }
  return issues;
}

function auditReferences(record, factsById, sourceIds) {
  const issues = [];
  for (const factId of record.factIds || []) {
    if (!factsById.has(factId)) issues.push({ type: "missing_fact_reference", factId });
  }
  for (const sourceId of record.sourceIds || []) {
    if (sourceIds.size && !sourceIds.has(sourceId)) {
      issues.push({ type: "missing_source_reference", sourceId });
    }
  }
  if (!record.factIds?.length) issues.push({ type: "missing_fact_provenance" });
  if (!record.sourceIds?.length) issues.push({ type: "missing_source_provenance" });
  return issues;
}

/**
 * Audit a Question Bank without mutating it.
 *
 * facts is strongly recommended. sources is optional because the source
 * registry is not owned by the Question Bank layer.
 */
export function auditQuestionBankRecords({
  records = [],
  facts = [],
  sources = [],
  checkDuplicates = true,
  wordingThreshold = 0.82,
} = {}) {
  const issues = [];
  const factsById = new Map(facts.filter(Boolean).map((fact) => [fact.id, fact]));
  const sourceIds = new Set(
    sources.filter(Boolean).map((source) => source.id).filter(Boolean)
  );
  const seenIds = new Set();
  const familyMap = new Map();

  for (const record of records) {
    const validation = validateQuestionBankRecord(record);
    if (!validation.valid) {
      issues.push({
        questionId: record?.questionId || null,
        category: "contract",
        errors: validation.errors,
      });
    }

    if (record?.questionId) {
      if (seenIds.has(record.questionId)) {
        issues.push({
          questionId: record.questionId,
          category: "identity",
          errors: ["duplicate_question_id"],
        });
      }
      seenIds.add(record.questionId);
    }

    for (const issue of auditReferences(record, factsById, sourceIds)) {
      issues.push({
        questionId: record?.questionId || null,
        category: "provenance",
        ...issue,
      });
    }

    for (const issue of auditFreshness(record, factsById)) {
      issues.push({
        questionId: record?.questionId || null,
        category: "freshness",
        ...issue,
      });
    }

    if (record?.questionFamilyId) {
      if (!familyMap.has(record.questionFamilyId)) familyMap.set(record.questionFamilyId, []);
      familyMap.get(record.questionFamilyId).push(record.questionId);
    }
  }

  for (const [familyId, questionIds] of familyMap) {
    if (questionIds.length > 1) {
      issues.push({
        questionId: questionIds[0],
        category: "family",
        familyId,
        relatedQuestionIds: questionIds,
        errors: ["multiple_questions_in_same_family"],
      });
    }
  }

  if (checkDuplicates && records.length > 1) {
    const duplicateAudit = auditQuestionBank({
      questions: records,
      wordingThreshold,
    });
    for (const duplicate of duplicateAudit.duplicates) {
      issues.push({
        questionId: duplicate.questionId,
        category: "duplicate",
        errors: [duplicate.type],
        matches: duplicate.matches,
      });
    }
    for (const possible of duplicateAudit.possibleDuplicates) {
      issues.push({
        questionId: possible.questionId,
        category: "possible_duplicate",
        errors: ["possible_semantic_duplicate"],
        matches: possible.matches,
        similarity: possible.similarity,
      });
    }
  }

  const byCategory = {};
  for (const issue of issues) {
    byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
  }

  return {
    valid: issues.length === 0,
    counts: { records: records.length, issues: issues.length },
    byCategory,
    issues,
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
