/**
 * Phase 3I-B — audited Current Affairs serving Question Bank seed.
 *
 * Bounded serving population derived from Phase 2 verified facts.
 * Every record carries stable identity, provenance, freshness metadata,
 * lifecycle state and access-tier metadata required by the Question Bank
 * contract. NewsData is not involved.
 */
export const CURRENT_AFFAIRS_QUESTION_BANK = [
  {
    "questionId": "ca:ng-state-abia:direct:easy",
    "questionFamilyId": "ca-family:entity-geography:abia-state-ng-state-abia",
    "conceptId": "ca:entity:ng-state-abia",
    "factIds": [
      "ng-state-abia"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "What is the capital of Abia State?",
    "options": [
      "Umuahia",
      "Awka",
      "Yola",
      "Uyo"
    ],
    "correctAnswer": "Umuahia",
    "explanation": "Verified fact: ng-state-abia — Umuahia. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-state-anambra:direct:easy",
    "questionFamilyId": "ca-family:entity-geography:anambra-state-ng-state-anambra",
    "conceptId": "ca:entity:ng-state-anambra",
    "factIds": [
      "ng-state-anambra"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "reverse",
    "blueprintId": "reverse_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "Which Nigerian state has Awka as its capital?",
    "options": [
      "Anambra State",
      "Abia State",
      "Kano State",
      "Lagos State"
    ],
    "correctAnswer": "Anambra State",
    "explanation": "Verified fact: ng-state-anambra — Awka. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-state-kano:direct:easy",
    "questionFamilyId": "ca-family:entity-geography:kano-state-ng-state-kano",
    "conceptId": "ca:entity:ng-state-kano",
    "factIds": [
      "ng-state-kano"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "reverse",
    "blueprintId": "reverse_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "Which Nigerian state has Kano as its capital?",
    "options": [
      "Kano State",
      "Kaduna State",
      "Katsina State",
      "Sokoto State"
    ],
    "correctAnswer": "Kano State",
    "explanation": "Verified fact: ng-state-kano — Kano. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-state-lagos:direct:easy",
    "questionFamilyId": "ca-family:entity-geography:lagos-state-ng-state-lagos",
    "conceptId": "ca:entity:ng-state-lagos",
    "factIds": [
      "ng-state-lagos"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "identification",
    "blueprintId": "identification",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "Which Nigerian state is associated with the capital city Ikeja?",
    "options": [
      "Lagos State",
      "Ogun State",
      "Oyo State",
      "Ondo State"
    ],
    "correctAnswer": "Lagos State",
    "explanation": "Verified fact: ng-state-lagos — Ikeja. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-state-rivers:direct:easy",
    "questionFamilyId": "ca-family:entity-geography:rivers-state-ng-state-rivers",
    "conceptId": "ca:entity:ng-state-rivers",
    "factIds": [
      "ng-state-rivers"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "identification",
    "blueprintId": "identification",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "Which Nigerian state is associated with the capital city Port Harcourt?",
    "options": [
      "Rivers State",
      "Cross River State",
      "Delta State",
      "Bayelsa State"
    ],
    "correctAnswer": "Rivers State",
    "explanation": "Verified fact: ng-state-rivers — Port Harcourt. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:af-au-nigeria-member:direct:easy",
    "questionFamilyId": "ca-family:entity-international-organizations:nigeria-af-au-nigeria-member",
    "conceptId": "ca:entity:af-au-nigeria-member",
    "factIds": [
      "af-au-nigeria-member"
    ],
    "sourceIds": [
      "au-member-states"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "africa",
    "topic": "international-organizations",
    "question": "What is Nigeria's status in the African Union?",
    "options": [
      "Member state",
      "Observer state",
      "Associate member",
      "Non-member"
    ],
    "correctAnswer": "Member state",
    "explanation": "Verified fact: af-au-nigeria-member — Member state. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "1963-05-25",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:af-ecowas-headquarters:direct:easy",
    "questionFamilyId": "ca-family:entity-international-organizations:ecowas-af-ecowas-headquarters",
    "conceptId": "ca:entity:af-ecowas-headquarters",
    "factIds": [
      "af-ecowas-headquarters"
    ],
    "sourceIds": [
      "ecowas-member-states"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "africa",
    "topic": "international-organizations",
    "question": "Where is the headquarters of ECOWAS located?",
    "options": [
      "Abuja, Nigeria",
      "Accra, Ghana",
      "Lagos, Nigeria",
      "Dakar, Senegal"
    ],
    "correctAnswer": "Abuja, Nigeria",
    "explanation": "Verified fact: af-ecowas-headquarters — Abuja, Nigeria. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:science-iss-partners:direct:easy",
    "questionFamilyId": "ca-family:entity-space:international-space-station-science-iss-partners",
    "conceptId": "ca:entity:science-iss-partners",
    "factIds": [
      "science-iss-partners"
    ],
    "sourceIds": [
      "nasa"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "science-technology",
    "topic": "space",
    "question": "Which group of organizations is listed as international partners of the International Space Station?",
    "options": [
      "NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency",
      "NASA, ESA and ISRO only",
      "NASA and JAXA only",
      "ESA and Roscosmos only"
    ],
    "correctAnswer": "NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency",
    "explanation": "Verified fact: science-iss-partners — NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:af-au-member-count:direct:medium",
    "questionFamilyId": "ca-family:entity-international-organizations:african-union-af-au-member-count",
    "conceptId": "ca:entity:af-au-member-count",
    "factIds": [
      "af-au-member-count"
    ],
    "sourceIds": [
      "au-member-states"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "africa",
    "topic": "international-organizations",
    "question": "How many member states does the African Union have?",
    "options": [
      55,
      48,
      54,
      60
    ],
    "correctAnswer": 55,
    "explanation": "Verified fact: af-au-member-count — 55. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:af-ecowas-member-count:direct:medium",
    "questionFamilyId": "ca-family:entity-international-organizations:ecowas-af-ecowas-member-count",
    "conceptId": "ca:entity:af-ecowas-member-count",
    "factIds": [
      "af-ecowas-member-count"
    ],
    "sourceIds": [
      "ecowas-member-states"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "africa",
    "topic": "international-organizations",
    "question": "How many member states does ECOWAS have according to the verified 2025 membership record?",
    "options": [
      12,
      15,
      16,
      10
    ],
    "correctAnswer": 12,
    "explanation": "Verified fact: af-ecowas-member-count — 12. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2025-01-29",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-president:direct:medium",
    "questionFamilyId": "ca-family:entity-government:president-of-nigeria-ng-president",
    "conceptId": "ca:entity:ng-president",
    "factIds": [
      "ng-president"
    ],
    "sourceIds": [
      "ng-government"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "nigeria",
    "topic": "government",
    "question": "Who is the current President of Nigeria according to the fact verified on 23 September 2026?",
    "options": [
      "Bola Ahmed Tinubu",
      "Kashim Shettima",
      "Godswill Akpabio",
      "Tajudeen Abbas"
    ],
    "correctAnswer": "Bola Ahmed Tinubu",
    "explanation": "Verified fact: ng-president — Bola Ahmed Tinubu. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2023-05-29",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-vice-president:direct:medium",
    "questionFamilyId": "ca-family:entity-government:vice-president-of-nigeria-ng-vice-president",
    "conceptId": "ca:entity:ng-vice-president",
    "factIds": [
      "ng-vice-president"
    ],
    "sourceIds": [
      "ng-government"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "nigeria",
    "topic": "government",
    "question": "Who is the current Vice President of Nigeria according to the fact verified on 23 September 2026?",
    "options": [
      "Kashim Shettima",
      "Bola Ahmed Tinubu",
      "Godswill Akpabio",
      "Benjamin Kalu"
    ],
    "correctAnswer": "Kashim Shettima",
    "explanation": "Verified fact: ng-vice-president — Kashim Shettima. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2023-05-29",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-senate-president:direct:medium",
    "questionFamilyId": "ca-family:entity-national-assembly:president-of-the-senate-ng-senate-president",
    "conceptId": "ca:entity:ng-senate-president",
    "factIds": [
      "ng-senate-president"
    ],
    "sourceIds": [
      "ng-government"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "nigeria",
    "topic": "national-assembly",
    "question": "Who is the current President of the Senate of Nigeria according to the fact verified on 23 September 2026?",
    "options": [
      "Godswill Akpabio",
      "Tajudeen Abbas",
      "Benjamin Kalu",
      "Kashim Shettima"
    ],
    "correctAnswer": "Godswill Akpabio",
    "explanation": "Verified fact: ng-senate-president — Godswill Akpabio. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2023-06-13",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-house-speaker:direct:medium",
    "questionFamilyId": "ca-family:entity-national-assembly:speaker-of-the-house-of-representatives-ng-house-speaker",
    "conceptId": "ca:entity:ng-house-speaker",
    "factIds": [
      "ng-house-speaker"
    ],
    "sourceIds": [
      "ng-government"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "nigeria",
    "topic": "national-assembly",
    "question": "Who is the current Speaker of the House of Representatives according to the fact verified on 23 September 2026?",
    "options": [
      "Tajudeen Abbas",
      "Godswill Akpabio",
      "Benjamin Kalu",
      "Bola Ahmed Tinubu"
    ],
    "correctAnswer": "Tajudeen Abbas",
    "explanation": "Verified fact: ng-house-speaker — Tajudeen Abbas. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2023-06-13",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-cbn-governor:direct:medium",
    "questionFamilyId": "ca-family:entity-economy:governor-of-the-central-bank-of-nigeria-ng-cbn-governor",
    "conceptId": "ca:entity:ng-cbn-governor",
    "factIds": [
      "ng-cbn-governor"
    ],
    "sourceIds": [
      "cbn"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "nigeria",
    "topic": "economy",
    "question": "Who is the current Governor of the Central Bank of Nigeria according to the fact verified on 23 September 2026?",
    "options": [
      "Olayemi Cardoso",
      "Godswill Akpabio",
      "Tajudeen Abbas",
      "Kashim Shettima"
    ],
    "correctAnswer": "Olayemi Cardoso",
    "explanation": "Verified fact: ng-cbn-governor — Olayemi Cardoso. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2023-09-29",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:af-au-founded:chronology:hard",
    "questionFamilyId": "ca-family:entity-international-organizations:african-union-af-au-founded",
    "conceptId": "ca:entity:af-au-founded",
    "factIds": [
      "af-au-founded"
    ],
    "sourceIds": [
      "au-member-states"
    ],
    "variantType": "chronology",
    "blueprintId": "chronology",
    "difficulty": "hard",
    "domain": "africa",
    "topic": "international-organizations",
    "question": "In what year was the African Union founded?",
    "options": [
      2002,
      1948,
      1944,
      1963
    ],
    "correctAnswer": 2002,
    "explanation": "Verified fact: af-au-founded — 2002. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:world-who-founded:chronology:hard",
    "questionFamilyId": "ca-family:entity-health:world-health-organization-world-who-founded",
    "conceptId": "ca:entity:world-who-founded",
    "factIds": [
      "world-who-founded"
    ],
    "sourceIds": [
      "who-about"
    ],
    "variantType": "chronology",
    "blueprintId": "chronology",
    "difficulty": "hard",
    "domain": "international-organizations",
    "topic": "health",
    "question": "In what year was the World Health Organization founded?",
    "options": [
      1948,
      1944,
      2002,
      1963
    ],
    "correctAnswer": 1948,
    "explanation": "Verified fact: world-who-founded — 1948. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:world-imf-founded:chronology:hard",
    "questionFamilyId": "ca-family:entity-international-organizations:international-monetary-fund-world-imf-founded",
    "conceptId": "ca:entity:world-imf-founded",
    "factIds": [
      "world-imf-founded"
    ],
    "sourceIds": [
      "imf"
    ],
    "variantType": "chronology",
    "blueprintId": "chronology",
    "difficulty": "hard",
    "domain": "economy",
    "topic": "international-organizations",
    "question": "In what year was the International Monetary Fund established?",
    "options": [
      1944,
      1948,
      1963,
      2002
    ],
    "correctAnswer": 1944,
    "explanation": "Verified fact: world-imf-founded — 1944. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:science-artemis-ii-launch:chronology:hard",
    "questionFamilyId": "ca-family:entity-space:artemis-ii-science-artemis-ii-launch",
    "conceptId": "ca:entity:science-artemis-ii-launch",
    "factIds": [
      "science-artemis-ii-launch"
    ],
    "sourceIds": [
      "nasa"
    ],
    "variantType": "chronology",
    "blueprintId": "chronology",
    "difficulty": "hard",
    "domain": "science-technology",
    "topic": "space",
    "question": "What is the verified launch date recorded for Artemis II?",
    "options": [
      "2026-04-01",
      "2026-03-01",
      "2025-04-01",
      "2027-04-01"
    ],
    "correctAnswer": "2026-04-01",
    "explanation": "Verified fact: science-artemis-ii-launch — 2026-04-01. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "validFrom": "2026-04-01",
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-fct-capital:direct:easy",
    "questionFamilyId": "ca-family:geography:federal-capital-territory-ng-fct-capital",
    "conceptId": "ca:entity:ng-fct-capital",
    "factIds": [
      "ng-fct-capital"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "What is the verified capital associated with Federal Capital Territory?",
    "options": [
      "Abuja",
      "Lagos",
      "Kano",
      "Ibadan"
    ],
    "correctAnswer": "Abuja",
    "explanation": "Verified fact: ng-fct-capital — Abuja. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:ng-lga-count:direct:easy",
    "questionFamilyId": "ca-family:government:nigeria-ng-lga-count",
    "conceptId": "ca:entity:ng-lga-count",
    "factIds": [
      "ng-lga-count"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "government",
    "question": "What is the verified local government areas associated with Nigeria?",
    "options": [
      774,
      810,
      738,
      824
    ],
    "correctAnswer": 774,
    "explanation": "Verified fact: ng-lga-count — 774. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:sports-fifa-2026-teams:direct:easy",
    "questionFamilyId": "ca-family:football:fifa-world-cup-2026-sports-fifa-2026-teams",
    "conceptId": "ca:entity:sports-fifa-2026-teams",
    "factIds": [
      "sports-fifa-2026-teams"
    ],
    "sourceIds": [
      "fifa-world-cup-2026"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "sports",
    "topic": "football",
    "question": "What is the verified participating teams associated with FIFA World Cup 2026?",
    "options": [
      48,
      32,
      40,
      64
    ],
    "correctAnswer": 48,
    "explanation": "Verified fact: sports-fifa-2026-teams — 48. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:sports-fifa-2026-hosts:direct:easy",
    "questionFamilyId": "ca-family:football:fifa-world-cup-2026-sports-fifa-2026-hosts",
    "conceptId": "ca:entity:sports-fifa-2026-hosts",
    "factIds": [
      "sports-fifa-2026-hosts"
    ],
    "sourceIds": [
      "fifa-world-cup-2026"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "sports",
    "topic": "football",
    "question": "What is the verified host countries associated with FIFA World Cup 2026?",
    "options": [
      "Canada, Mexico and the United States",
      "Brazil, Argentina and Chile",
      "Spain, Portugal and Morocco",
      "France, Germany and Italy"
    ],
    "correctAnswer": "Canada, Mexico and the United States",
    "explanation": "Verified fact: sports-fifa-2026-hosts — Canada, Mexico and the United States. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:science-iss-continuous-occupation:direct:easy",
    "questionFamilyId": "ca-family:space:international-space-station-science-iss-continuous-occupation",
    "conceptId": "ca:entity:science-iss-continuous-occupation",
    "factIds": [
      "science-iss-continuous-occupation"
    ],
    "sourceIds": [
      "nasa"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "science-technology",
    "topic": "space",
    "question": "What is the verified continuous human occupation since associated with International Space Station?",
    "options": [
      "November 2000",
      "January 1998",
      "July 2005",
      "December 2010"
    ],
    "correctAnswer": "November 2000",
    "explanation": "Verified fact: science-iss-continuous-occupation — November 2000. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:world-who-member-count:direct:medium",
    "questionFamilyId": "ca-family:health:world-health-organization-world-who-member-count",
    "conceptId": "ca:entity:world-who-member-count",
    "factIds": [
      "world-who-member-count"
    ],
    "sourceIds": [
      "who-about"
    ],
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "medium",
    "domain": "international-organizations",
    "topic": "health",
    "question": "What is the verified member states associated with World Health Organization?",
    "options": [
      194,
      193,
      195,
      191
    ],
    "correctAnswer": 194,
    "explanation": "Verified fact: world-who-member-count — 194. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:world-who-headquarters:direct:medium",
    "questionFamilyId": "ca-family:health:world-health-organization-world-who-headquarters",
    "conceptId": "ca:entity:world-who-headquarters",
    "factIds": [
      "world-who-headquarters"
    ],
    "sourceIds": [
      "who-about"
    ],
    "variantType": "reverse",
    "blueprintId": "reverse_attribute",
    "difficulty": "medium",
    "domain": "international-organizations",
    "topic": "health",
    "question": "Which organization has its headquarters in Geneva, Switzerland?",
    "options": [
      "World Health Organization",
      "International Monetary Fund",
      "African Union",
      "United Nations"
    ],
    "correctAnswer": "World Health Organization",
    "explanation": "Verified fact: world-who-headquarters — Geneva, Switzerland. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:sports-fifa-2026-final:direct:medium",
    "questionFamilyId": "ca-family:football:fifa-world-cup-2026-sports-fifa-2026-final",
    "conceptId": "ca:entity:sports-fifa-2026-final",
    "factIds": [
      "sports-fifa-2026-final"
    ],
    "sourceIds": [
      "fifa-world-cup-2026"
    ],
    "variantType": "reverse",
    "blueprintId": "reverse_attribute",
    "difficulty": "medium",
    "domain": "sports",
    "topic": "football",
    "question": "Which tournament has its 2026 final location recorded as New York/New Jersey?",
    "options": [
      "FIFA World Cup 2026",
      "Olympic Games",
      "Africa Cup of Nations",
      "UEFA European Championship"
    ],
    "correctAnswer": "FIFA World Cup 2026",
    "explanation": "Verified fact: sports-fifa-2026-final — New York/New Jersey. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:science-artemis-ii-type:direct:medium",
    "questionFamilyId": "ca-family:space:artemis-ii-science-artemis-ii-type",
    "conceptId": "ca:entity:science-artemis-ii-type",
    "factIds": [
      "science-artemis-ii-type"
    ],
    "sourceIds": [
      "nasa"
    ],
    "variantType": "identification",
    "blueprintId": "identification",
    "difficulty": "medium",
    "domain": "science-technology",
    "topic": "space",
    "question": "Which mission is recorded as a crewed lunar flyby?",
    "options": [
      "Artemis II",
      "International Space Station",
      "FIFA World Cup 2026",
      "Apollo 11"
    ],
    "correctAnswer": "Artemis II",
    "explanation": "Verified fact: science-artemis-ii-type — Crewed lunar flyby. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  },
  {
    "questionId": "ca:science-artemis-ii-duration:direct:medium",
    "questionFamilyId": "ca-family:space:artemis-ii-science-artemis-ii-duration",
    "conceptId": "ca:entity:science-artemis-ii-duration",
    "factIds": [
      "science-artemis-ii-duration"
    ],
    "sourceIds": [
      "nasa"
    ],
    "variantType": "identification",
    "blueprintId": "identification",
    "difficulty": "medium",
    "domain": "science-technology",
    "topic": "space",
    "question": "Which mission is recorded as lasting 9 days, 1 hour, and 32 minutes?",
    "options": [
      "Artemis II",
      "Artemis I",
      "International Space Station",
      "Apollo 13"
    ],
    "correctAnswer": "Artemis II",
    "explanation": "Verified fact: science-artemis-ii-duration — 9 days, 1 hour, 32 minutes. Source: Phase 2 verified fact record.",
    "status": "active",
    "accessTier": "FREE",
    "temporalContext": {
      "lastVerified": "2026-09-23"
    },
    "generatorVersion": "3I-B.1",
    "lastValidated": "2026-09-24",
    "createdAt": "2026-09-24",
    "updatedAt": "2026-09-24"
  }
];

export default CURRENT_AFFAIRS_QUESTION_BANK;
