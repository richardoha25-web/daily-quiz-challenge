/**
 * Phase 3B — Current Affairs question blueprint/template system.
 *
 * This file defines SAFE question construction patterns.
 * It does not generate question text, options, distractors, or quizzes.
 *
 * Phase 3B responsibilities:
 * - Define reusable blueprint contracts.
 * - Define required fact/concept inputs.
 * - Define which question variant a blueprint produces.
 * - Define difficulty guidance.
 * - Define family/identity guidance.
 * - Define constraints that Phase 3C/3D must obey.
 *
 * The verified Phase 2 fact database remains the source of truth.
 */

export const BLUEPRINT_STATUS = ["active", "experimental", "disabled"];

export const BLUEPRINT_INPUT_TYPES = [
  "single_fact",
  "related_facts",
  "fact_set",
];

export const DISTRACTOR_STRATEGIES = [
  "related_entities",
  "same_attribute",
  "same_domain",
  "same_unit",
  "nearby_value",
  "related_institutions",
  "related_categories",
  "none",
];

export const QUESTION_BLUEPRINTS = [
  {
    id: "direct_attribute",
    label: "Direct attribute",
    variantType: "direct",
    inputType: "single_fact",
    supportedDifficulty: ["easy", "medium"],
    answerRole: "fact.value",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "same_attribute",
    familyIdentity: "entity:attribute",
    promptPattern: "Ask for the value of an attribute belonging to the fact entity.",
    constraints: [
      "The fact must support one clear answer.",
      "Do not expose the answer in the question wording.",
      "Use explicit time context when the fact is dynamic.",
    ],
    status: "active",
  },

  {
    id: "reverse_attribute",
    label: "Reverse attribute",
    variantType: "reverse",
    inputType: "single_fact",
    supportedDifficulty: ["medium"],
    answerRole: "fact.entity",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_entities",
    familyIdentity: "entity:attribute",
    promptPattern: "Present the known attribute value and ask which entity it belongs to.",
    constraints: [
      "The supplied value must identify exactly one valid entity within the selected fact scope.",
      "Do not create a reverse question when the value maps to multiple entities.",
      "The resulting family must match the corresponding direct-attribute relationship.",
    ],
    status: "active",
  },

  {
    id: "identification",
    label: "Identification",
    variantType: "identification",
    inputType: "single_fact",
    supportedDifficulty: ["easy", "medium"],
    answerRole: "fact.entity",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_entities",
    familyIdentity: "entity:attribute",
    promptPattern: "Describe a verified attribute or role and ask the user to identify the entity.",
    constraints: [
      "Description must be supported entirely by verified facts.",
      "Do not introduce unsupported descriptive clues.",
      "Avoid clues that uniquely reveal the answer through wording alone.",
    ],
    status: "active",
  },

  {
    id: "classification",
    label: "Classification",
    variantType: "classification",
    inputType: "single_fact",
    supportedDifficulty: ["medium"],
    answerRole: "fact.attributeValue",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_categories",
    familyIdentity: "entity:classification",
    promptPattern: "Ask which verified category, region, group or classification an entity belongs to.",
    constraints: [
      "The classification must be explicit in the source facts.",
      "Distractors must belong to the same classification system.",
    ],
    status: "active",
  },

  {
    id: "relationship",
    label: "Relationship",
    variantType: "relationship",
    inputType: "related_facts",
    supportedDifficulty: ["medium", "hard"],
    answerRole: "relationship.value",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_entities",
    familyIdentity: "relationship:entities",
    promptPattern: "Ask about a verified relationship between two or more entities.",
    constraints: [
      "Every relationship used must be supported by verified facts.",
      "Do not infer a relationship merely because two entities share a topic.",
      "The relationship direction must remain unambiguous.",
    ],
    status: "active",
  },

  {
    id: "institution_function",
    label: "Institution and function",
    variantType: "institution_function",
    inputType: "single_fact",
    supportedDifficulty: ["easy", "medium"],
    answerRole: "fact.value",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_institutions",
    familyIdentity: "institution:function",
    promptPattern: "Ask which function, responsibility or purpose is associated with a verified institution.",
    constraints: [
      "Use an official institutional description where available.",
      "Do not attribute a function to an institution unless supported by the source fact.",
      "Keep overlapping institutional mandates distinguishable.",
    ],
    status: "active",
  },

  {
    id: "comparison",
    label: "Comparison",
    variantType: "comparison",
    inputType: "related_facts",
    supportedDifficulty: ["hard"],
    answerRole: "comparison.result",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "same_unit",
    familyIdentity: "comparison:entities:attribute",
    promptPattern: "Compare two or more verified entities using the same attribute or measurement basis.",
    constraints: [
      "Compared values must use the same unit and reference period.",
      "Dynamic numeric facts must include their reference period and dataset vintage.",
      "Do not compare incomparable datasets.",
    ],
    status: "active",
  },

  {
    id: "number_count",
    label: "Number or count",
    variantType: "number_count",
    inputType: "single_fact",
    supportedDifficulty: ["easy", "medium"],
    answerRole: "fact.value",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "nearby_value",
    familyIdentity: "entity:count",
    promptPattern: "Ask for a verified count or numeric value.",
    constraints: [
      "The fact must contain a clearly defined count or number.",
      "Use the reference year/period when the number can change.",
      "Numeric distractors must remain plausible and use the same unit.",
    ],
    status: "active",
  },

  {
    id: "chronology",
    label: "Chronology or date",
    variantType: "chronology",
    inputType: "single_fact",
    supportedDifficulty: ["medium", "hard"],
    answerRole: "fact.date",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "nearby_value",
    familyIdentity: "entity:date",
    promptPattern: "Ask when a verified event, founding, appointment or milestone occurred.",
    constraints: [
      "The date must be explicitly supported by the source fact.",
      "Do not imply a more precise date than the source supports.",
      "Date distractors must be plausible but factually distinct.",
    ],
    status: "active",
  },

  {
    id: "matching",
    label: "Matching",
    variantType: "matching",
    inputType: "related_facts",
    supportedDifficulty: ["medium"],
    answerRole: "relationship.mapping",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_entities",
    familyIdentity: "mapping:entities:attributes",
    promptPattern: "Ask which entity correctly matches a verified attribute, or which attribute matches an entity.",
    constraints: [
      "Every candidate mapping must be supported or falsified by verified facts.",
      "Avoid duplicate answer mappings.",
      "The relationship must remain understandable in standard four-option MCQ form.",
    ],
    status: "active",
  },

  {
    id: "scenario",
    label: "Scenario/application",
    variantType: "scenario",
    inputType: "related_facts",
    supportedDifficulty: ["hard"],
    answerRole: "application.result",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_entities",
    familyIdentity: "scenario:underlying-concept",
    promptPattern: "Place a verified relationship or institutional fact into a short factual scenario.",
    constraints: [
      "The scenario must not require knowledge outside the supplied verified facts.",
      "Avoid opinion, persuasion or speculative interpretation.",
      "The correct answer must follow directly from the verified relationship.",
    ],
    status: "active",
  },

  {
    id: "odd_one_out",
    label: "Odd one out",
    variantType: "odd_one_out",
    inputType: "fact_set",
    supportedDifficulty: ["medium", "hard"],
    answerRole: "set.outlier",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_categories",
    familyIdentity: "set:classification",
    promptPattern: "Present entities sharing a verified classification except one and ask for the outlier.",
    constraints: [
      "The common classification must be explicitly supported.",
      "There must be exactly one defensible outlier.",
      "Do not rely on hidden or subjective criteria.",
    ],
    status: "active",
  },

  {
    id: "multi_fact",
    label: "Multi-fact reasoning",
    variantType: "multi_fact",
    inputType: "related_facts",
    supportedDifficulty: ["hard"],
    answerRole: "derived.relationship",
    requiredFactFields: ["entity", "attribute", "value"],
    distractorStrategy: "related_entities",
    familyIdentity: "multi_fact:concept",
    promptPattern: "Combine two or more verified facts to answer one unambiguous question.",
    constraints: [
      "Every premise must be independently supported.",
      "The conclusion must follow without outside knowledge.",
      "Do not use multi-fact construction merely to make a question harder.",
    ],
    status: "active",
  },
];

/**
 * Return a blueprint by stable ID.
 */
export function getQuestionBlueprint(id) {
  return QUESTION_BLUEPRINTS.find((blueprint) => blueprint.id === id) || null;
}

/**
 * Return blueprints capable of producing a requested variant type.
 */
export function getBlueprintsForVariant(variantType) {
  return QUESTION_BLUEPRINTS.filter(
    (blueprint) =>
      blueprint.variantType === variantType && blueprint.status === "active"
  );
}

/**
 * Structural blueprint validation only.
 *
 * This does not validate a generated question or the underlying facts.
 */
export function validateQuestionBlueprint(blueprint) {
  const errors = [];

  if (!blueprint?.id) errors.push("missing_blueprint_id");
  if (!blueprint?.label) errors.push("missing_blueprint_label");
  if (!blueprint?.variantType) errors.push("missing_variant_type");
  if (!blueprint?.inputType) errors.push("missing_input_type");

  if (
    blueprint?.inputType &&
    !BLUEPRINT_INPUT_TYPES.includes(blueprint.inputType)
  ) {
    errors.push("invalid_input_type");
  }

  if (!Array.isArray(blueprint?.supportedDifficulty) ||
      blueprint.supportedDifficulty.length === 0) {
    errors.push("missing_supported_difficulty");
  }

  if (
    Array.isArray(blueprint?.supportedDifficulty) &&
    blueprint.supportedDifficulty.some(
      (difficulty) => !["easy", "medium", "hard"].includes(difficulty)
    )
  ) {
    errors.push("invalid_supported_difficulty");
  }

  if (!blueprint?.answerRole) errors.push("missing_answer_role");
  if (!blueprint?.requiredFactFields?.length) {
    errors.push("missing_required_fact_fields");
  }
  if (!blueprint?.distractorStrategy) {
    errors.push("missing_distractor_strategy");
  }
  if (!blueprint?.familyIdentity) errors.push("missing_family_identity");
  if (!blueprint?.promptPattern) errors.push("missing_prompt_pattern");
  if (!Array.isArray(blueprint?.constraints) || blueprint.constraints.length === 0) {
    errors.push("missing_constraints");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate the complete Phase 3B blueprint registry.
 */
export function validateQuestionBlueprintRegistry() {
  const errors = [];
  const ids = new Set();

  for (const blueprint of QUESTION_BLUEPRINTS) {
    if (ids.has(blueprint.id)) {
      errors.push(`duplicate_blueprint_id:${blueprint.id}`);
    }
    ids.add(blueprint.id);

    const result = validateQuestionBlueprint(blueprint);
    if (!result.valid) {
      errors.push(
        ...result.errors.map((error) => `${blueprint.id}:${error}`)
      );
    }
  }

  return {
    valid: errors.length === 0,
    count: QUESTION_BLUEPRINTS.length,
    errors,
  };
}

export default QUESTION_BLUEPRINTS;
