/**
 * Phase 3C — Current Affairs deterministic question generator.
 *
 * Purpose:
 * - Convert verified facts + Phase 3B blueprints into question drafts.
 * - Produce stable concept/family identities.
 * - Never invent factual content.
 * - Never generate distractors or quiz selections.
 *
 * Important boundary:
 * Phase 3C intentionally returns a QUESTION DRAFT, not a final
 * Question Bank record. Phase 3D supplies distractors/options and
 * Phase 3E/3F handle quality and duplicate/family validation.
 */

import {
  getQuestionBlueprint,
  QUESTION_BLUEPRINTS,
} from "./phase3b-question-blueprints.js";

const DYNAMIC_ATTRIBUTES = new Set([
  "currentHolder",
  "population",
  "gdp",
  "gdpGrowth",
  "inflation",
  "exchangeRate",
  "membershipCount",
  "ranking",
  "currentOfficeholder",
]);

const ATTRIBUTE_LABELS = {
  capital: "capital",
  currentHolder: "current holder",
  federalUnits: "number of federal units",
  localGovernmentAreas: "number of local government areas",
  members: "number of members",
  membershipCount: "number of members",
  founded: "founding date",
  established: "establishment date",
  created: "creation date",
};

const VALID_VARIANT_TYPES = new Set(
  QUESTION_BLUEPRINTS.map((blueprint) => blueprint.variantType)
);

function normalizeText(value) {
  return String(value ?? "").trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function labelForAttribute(attribute) {
  if (ATTRIBUTE_LABELS[attribute]) return ATTRIBUTE_LABELS[attribute];

  return normalizeText(attribute)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toLowerCase());
}

function isDynamicFact(fact) {
  if (!fact) return false;

  return (
    DYNAMIC_ATTRIBUTES.has(fact.attribute) ||
    Boolean(fact.validFrom) ||
    Boolean(fact.validTo) ||
    Boolean(fact.referencePeriod) ||
    Boolean(fact.datasetVintage)
  );
}

function getTemporalContext(fact) {
  if (!isDynamicFact(fact)) return "";

  if (fact.referencePeriod) return ` for ${fact.referencePeriod}`;
  if (fact.datasetVintage) return ` (dataset vintage: ${fact.datasetVintage})`;
  if (fact.validFrom && fact.validTo) {
    return ` during ${fact.validFrom} to ${fact.validTo}`;
  }
  if (fact.validFrom) return ` from ${fact.validFrom}`;

  return ` (verified ${fact.lastVerified || "date not specified"})`;
}

function assertFactShape(fact) {
  if (!fact || typeof fact !== "object") {
    return { valid: false, error: "invalid_fact" };
  }

  const required = ["id", "domain", "topic", "entity", "attribute", "value"];
  const missing = required.filter((field) => fact[field] === undefined || fact[field] === null || fact[field] === "");

  if (missing.length) {
    return { valid: false, error: "missing_fact_fields", fields: missing };
  }

  return { valid: true };
}

function createIdentity(fact, blueprint) {
  const entity = slugify(fact.entity);
  const attribute = slugify(fact.attribute);

  // Direct and reverse/identification forms deliberately share identity.
  if (["direct", "reverse", "identification"].includes(blueprint.variantType)) {
    return {
      conceptId: `ca:${entity}:${attribute}`,
      questionFamilyId: `ca-family:${entity}:${attribute}`,
    };
  }

  return {
    conceptId: `ca:${blueprint.familyIdentity}:${entity}:${attribute}`,
    questionFamilyId: `ca-family:${blueprint.familyIdentity}:${entity}:${attribute}`,
  };
}

function createBaseDraft(fact, blueprint, question, correctAnswer, difficulty) {
  const identity = createIdentity(fact, blueprint);

  return {
    type: "question_draft",
    generatorVersion: "3C.1",
    factIds: [fact.id],
    sourceIds: unique([fact.sourceId]),
    conceptId: identity.conceptId,
    questionFamilyId: identity.questionFamilyId,
    variantType: blueprint.variantType,
    difficulty,
    domain: fact.domain,
    topic: fact.topic,
    question,
    correctAnswer: normalizeText(correctAnswer),
    options: null,
    explanation: "",
    accessTier: "FREE",
    status: "generated",
    temporalContext: getTemporalContext(fact),
    blueprintId: blueprint.id,
  };
}

function generateDirect(fact, blueprint, difficulty) {
  const attribute = labelForAttribute(fact.attribute);
  const temporal = getTemporalContext(fact);

  return createBaseDraft(
    fact,
    blueprint,
    `What is the ${attribute} of ${fact.entity}${temporal}?`,
    fact.value,
    difficulty
  );
}

function generateReverse(fact, blueprint, difficulty) {
  const attribute = labelForAttribute(fact.attribute);
  const temporal = getTemporalContext(fact);

  return createBaseDraft(
    fact,
    blueprint,
    `${fact.value} is the ${attribute} of which entity${temporal}?`,
    fact.entity,
    difficulty
  );
}

function generateIdentification(fact, blueprint, difficulty) {
  const attribute = labelForAttribute(fact.attribute);
  const temporal = getTemporalContext(fact);

  return createBaseDraft(
    fact,
    blueprint,
    `Which entity has the ${attribute} of ${fact.value}${temporal}?`,
    fact.entity,
    difficulty
  );
}

function generateClassification(fact, blueprint, difficulty) {
  if (!fact.region) {
    return null;
  }

  const classification = fact.region;
  return createBaseDraft(
    fact,
    blueprint,
    `Which classification or group is ${fact.entity} associated with?`,
    classification,
    difficulty
  );
}

function generateInstitutionFunction(fact, blueprint, difficulty) {
  return createBaseDraft(
    fact,
    blueprint,
    `What verified function or responsibility is associated with ${fact.entity}?`,
    fact.value,
    difficulty
  );
}

function generateNumberCount(fact, blueprint, difficulty) {
  if (typeof fact.value !== "number" && !/^[-+]?\d/.test(String(fact.value))) {
    return null;
  }

  return createBaseDraft(
    fact,
    blueprint,
    `What is the ${labelForAttribute(fact.attribute)} of ${fact.entity}${getTemporalContext(fact)}?`,
    fact.value,
    difficulty
  );
}

function generateChronology(fact, blueprint, difficulty) {
  if (!/^\d{4}(-\d{2}-\d{2})?$/.test(String(fact.value))) {
    return null;
  }

  return createBaseDraft(
    fact,
    blueprint,
    `When did ${fact.entity} reach the milestone described by the verified fact?`,
    fact.value,
    difficulty
  );
}

/**
 * Relationship/set-based blueprints require an explicit relationship context.
 * Phase 3C will not infer relationships from unrelated facts.
 */
function generateContextRequired(fact, blueprint, difficulty, context = {}) {
  const relationship = context.relationship;
  if (!relationship?.question || relationship?.correctAnswer === undefined) {
    return null;
  }

  const identityFactIds = unique([fact.id, ...(context.factIds || [])]);
  const identity = {
    conceptId: `ca:${blueprint.familyIdentity}:${slugify(relationship.key || fact.id)}`,
    questionFamilyId: `ca-family:${blueprint.familyIdentity}:${slugify(relationship.key || fact.id)}`,
  };

  return {
    type: "question_draft",
    generatorVersion: "3C.1",
    factIds: identityFactIds,
    sourceIds: unique([fact.sourceId, ...(context.sourceIds || [])]),
    conceptId: identity.conceptId,
    questionFamilyId: identity.questionFamilyId,
    variantType: blueprint.variantType,
    difficulty,
    domain: fact.domain,
    topic: fact.topic,
    question: relationship.question,
    correctAnswer: normalizeText(relationship.correctAnswer),
    options: null,
    explanation: relationship.explanation || "",
    accessTier: "FREE",
    status: "generated",
    temporalContext: relationship.temporalContext || "",
    blueprintId: blueprint.id,
  };
}

const GENERATORS = {
  direct: generateDirect,
  reverse: generateReverse,
  identification: generateIdentification,
  classification: generateClassification,
  institution_function: generateInstitutionFunction,
  number_count: generateNumberCount,
  chronology: generateChronology,
  relationship: generateContextRequired,
  comparison: generateContextRequired,
  matching: generateContextRequired,
  scenario: generateContextRequired,
  odd_one_out: generateContextRequired,
  multi_fact: generateContextRequired,
};

/**
 * Generate one draft from one verified fact.
 *
 * Returns:
 *   { ok: true, draft }
 * or
 *   { ok: false, reason, details }
 */
export function generateQuestionDraft({
  fact,
  blueprintId,
  difficulty,
  context = {},
}) {
  const factCheck = assertFactShape(fact);
  if (!factCheck.valid) return { ok: false, ...factCheck };

  const blueprint = getQuestionBlueprint(blueprintId);
  if (!blueprint || blueprint.status !== "active") {
    return { ok: false, reason: "invalid_or_inactive_blueprint" };
  }

  if (!VALID_VARIANT_TYPES.has(blueprint.variantType)) {
    return { ok: false, reason: "unsupported_variant_type" };
  }

  if (!blueprint.supportedDifficulty.includes(difficulty)) {
    return {
      ok: false,
      reason: "difficulty_not_supported_by_blueprint",
      supportedDifficulty: blueprint.supportedDifficulty,
    };
  }

  const generator = GENERATORS[blueprint.variantType];
  if (!generator) {
    return { ok: false, reason: "generator_not_implemented" };
  }

  const draft = generator(fact, blueprint, difficulty, context);

  if (!draft) {
    return {
      ok: false,
      reason: "insufficient_information_for_blueprint",
      blueprintId,
      factId: fact.id,
    };
  }

  return { ok: true, draft };
}

/**
 * Generate all safe single-fact drafts for a fact.
 *
 * Classification is intentionally conservative: a fact must expose an
 * explicit `region` classification. Generic string values are never
 * treated as classifications.
 *
 * Conservative by design: only blueprints whose answer can be derived
 * directly from the supplied fact are attempted.
 */
export function generateSingleFactDrafts({
  fact,
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
}) {
  const drafts = [];
  const rejected = [];

  for (const blueprintId of blueprintIds) {
    const blueprint = getQuestionBlueprint(blueprintId);
    if (!blueprint) {
      rejected.push({ blueprintId, reason: "unknown_blueprint" });
      continue;
    }

    for (const difficulty of difficulties) {
      if (!blueprint.supportedDifficulty.includes(difficulty)) continue;

      const result = generateQuestionDraft({
        fact,
        blueprintId,
        difficulty,
      });

      if (result.ok) drafts.push(result.draft);
      else rejected.push({ blueprintId, difficulty, ...result });
    }
  }

  return { drafts, rejected };
}

/**
 * Deterministically generate a bounded batch.
 * This prevents one large fact set from creating unbounded question output.
 */
export function generateQuestionDraftBatch({
  facts = [],
  maxDrafts = 100,
  ...config
}) {
  const drafts = [];
  const rejected = [];
  const generatedKeys = new Set();

  for (const fact of facts) {
    if (drafts.length >= maxDrafts) break;

    const result = generateSingleFactDrafts({
      fact,
      ...config,
    });

    for (const draft of result.drafts) {
      if (drafts.length >= maxDrafts) break;

      const fingerprint = [
        draft.question.trim().toLowerCase(),
        draft.correctAnswer.trim().toLowerCase(),
        draft.questionFamilyId,
      ].join("|");

      if (generatedKeys.has(fingerprint)) {
        rejected.push({
          blueprintId: draft.blueprintId,
          factId: fact.id,
          difficulty: draft.difficulty,
          reason: "duplicate_generated_draft",
        });
        continue;
      }

      generatedKeys.add(fingerprint);
      drafts.push(draft);
    }

    rejected.push(...result.rejected);
  }

  return {
    generatorVersion: "3C.1",
    drafts,
    rejected,
    counts: {
      requestedFacts: facts.length,
      generatedDrafts: drafts.length,
      rejectedAttempts: rejected.length,
    },
  };
}

/**
 * Registry-level smoke validation.
 */
export function validateGeneratorConfiguration() {
  const errors = [];

  for (const blueprint of QUESTION_BLUEPRINTS) {
    if (!GENERATORS[blueprint.variantType]) {
      errors.push(`missing_generator:${blueprint.variantType}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
