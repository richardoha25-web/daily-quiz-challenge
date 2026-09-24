/**
 * Phase 3I-B — audited Current Affairs serving Question Bank seed.
 *
 * These records are the first controlled serving population for 3I-A.
 * They are derived only from Phase 2 verified facts and carry provenance,
 * temporal metadata and explicit lifecycle/access metadata.
 *
 * This is a deliberately bounded seed. Phase 3I-B can expand it with the
 * remaining Phase 2 facts after the same generation/quality/duplicate gates.
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
    "question": "What is the verified value associated with Abia State?",
    "options": [
      "Umuahia",
      "Awka",
      "Yola",
      "Uyo"
    ],
    "correctAnswer": "Umuahia",
    "explanation": "Verified fact: Abia State — Umuahia. Source record: ng-state-abia.",
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
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "What is the verified value associated with Anambra State?",
    "options": [
      "Awka",
      "Umuahia",
      "Enugu",
      "Owerri"
    ],
    "correctAnswer": "Awka",
    "explanation": "Verified fact: Anambra State — Awka. Source record: ng-state-anambra.",
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
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "What is the verified value associated with Kano State?",
    "options": [
      "Kano",
      "Kaduna",
      "Sokoto",
      "Katsina"
    ],
    "correctAnswer": "Kano",
    "explanation": "Verified fact: Kano State — Kano. Source record: ng-state-kano.",
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
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "What is the verified value associated with Lagos State?",
    "options": [
      "Ikeja",
      "Abeokuta",
      "Ibadan",
      "Akure"
    ],
    "correctAnswer": "Ikeja",
    "explanation": "Verified fact: Lagos State — Ikeja. Source record: ng-state-lagos.",
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
    "variantType": "direct",
    "blueprintId": "direct_attribute",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "What is the verified value associated with Rivers State?",
    "options": [
      "Port Harcourt",
      "Calabar",
      "Asaba",
      "Benin City"
    ],
    "correctAnswer": "Port Harcourt",
    "explanation": "Verified fact: Rivers State — Port Harcourt. Source record: ng-state-rivers.",
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
    "question": "What is the verified value associated with Nigeria?",
    "options": [
      "Member state",
      "Observer state",
      "Associate member",
      "Non-member"
    ],
    "correctAnswer": "Member state",
    "explanation": "Verified fact: Nigeria — Member state. Source record: af-au-nigeria-member.",
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
    "question": "What is the verified value associated with ECOWAS?",
    "options": [
      "Abuja, Nigeria",
      "Accra, Ghana",
      "Lagos, Nigeria",
      "Dakar, Senegal"
    ],
    "correctAnswer": "Abuja, Nigeria",
    "explanation": "Verified fact: ECOWAS — Abuja, Nigeria. Source record: af-ecowas-headquarters.",
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
    "question": "What is the verified value associated with International Space Station?",
    "options": [
      "NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency",
      "NASA, ESA and ISRO only",
      "NASA and JAXA only",
      "ESA and Roscosmos only"
    ],
    "correctAnswer": "NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency",
    "explanation": "Verified fact: International Space Station — NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency. Source record: science-iss-partners.",
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
    "question": "Which verified fact is associated with African Union?",
    "options": [
      55,
      48,
      54,
      60
    ],
    "correctAnswer": 55,
    "explanation": "Verified fact: African Union — 55. Source record: af-au-member-count.",
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
    "question": "Which verified fact is associated with ECOWAS?",
    "options": [
      12,
      15,
      16,
      10
    ],
    "correctAnswer": 12,
    "explanation": "Verified fact: ECOWAS — 12. Source record: af-ecowas-member-count.",
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
    "questionId": "ca:af-ecowas-headquarters:direct:medium",
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
    "difficulty": "medium",
    "domain": "africa",
    "topic": "international-organizations",
    "question": "Which verified fact is associated with ECOWAS?",
    "options": [
      "Abuja, Nigeria",
      "Accra, Ghana",
      "Lagos, Nigeria",
      "Dakar, Senegal"
    ],
    "correctAnswer": "Abuja, Nigeria",
    "explanation": "Verified fact: ECOWAS — Abuja, Nigeria. Source record: af-ecowas-headquarters.",
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
    "question": "Which verified fact is associated with President of Nigeria?",
    "options": [
      "Bola Ahmed Tinubu",
      "Kashim Shettima",
      "Godswill Akpabio",
      "Tajudeen Abbas"
    ],
    "correctAnswer": "Bola Ahmed Tinubu",
    "explanation": "Verified fact: President of Nigeria — Bola Ahmed Tinubu. Source record: ng-president.",
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
    "question": "Which verified fact is associated with Vice President of Nigeria?",
    "options": [
      "Kashim Shettima",
      "Bola Ahmed Tinubu",
      "Godswill Akpabio",
      "Benjamin Kalu"
    ],
    "correctAnswer": "Kashim Shettima",
    "explanation": "Verified fact: Vice President of Nigeria — Kashim Shettima. Source record: ng-vice-president.",
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
    "question": "Which verified fact is associated with President of the Senate?",
    "options": [
      "Godswill Akpabio",
      "Tajudeen Abbas",
      "Benjamin Kalu",
      "Kashim Shettima"
    ],
    "correctAnswer": "Godswill Akpabio",
    "explanation": "Verified fact: President of the Senate — Godswill Akpabio. Source record: ng-senate-president.",
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
    "question": "Which verified fact is associated with Speaker of the House of Representatives?",
    "options": [
      "Tajudeen Abbas",
      "Godswill Akpabio",
      "Benjamin Kalu",
      "Bola Ahmed Tinubu"
    ],
    "correctAnswer": "Tajudeen Abbas",
    "explanation": "Verified fact: Speaker of the House of Representatives — Tajudeen Abbas. Source record: ng-house-speaker.",
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
    "question": "Which verified fact is associated with Governor of the Central Bank of Nigeria?",
    "options": [
      "Olayemi Cardoso",
      "Godswill Akpabio",
      "Tajudeen Abbas",
      "Kashim Shettima"
    ],
    "correctAnswer": "Olayemi Cardoso",
    "explanation": "Verified fact: Governor of the Central Bank of Nigeria — Olayemi Cardoso. Source record: ng-cbn-governor.",
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
    "question": "When was the milestone associated with African Union recorded?",
    "options": [
      2002,
      1948,
      1944,
      1963
    ],
    "correctAnswer": 2002,
    "explanation": "Verified fact: African Union — 2002. Source record: af-au-founded.",
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
    "question": "When was the milestone associated with World Health Organization recorded?",
    "options": [
      1948,
      1944,
      2002,
      1963
    ],
    "correctAnswer": 1948,
    "explanation": "Verified fact: World Health Organization — 1948. Source record: world-who-founded.",
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
    "question": "When was the milestone associated with International Monetary Fund recorded?",
    "options": [
      1944,
      1948,
      1963,
      2002
    ],
    "correctAnswer": 1944,
    "explanation": "Verified fact: International Monetary Fund — 1944. Source record: world-imf-founded.",
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
    "question": "When was the milestone associated with Artemis II recorded?",
    "options": [
      "2026-04-01",
      "2026-03-01",
      "2025-04-01",
      "2027-04-01"
    ],
    "correctAnswer": "2026-04-01",
    "explanation": "Verified fact: Artemis II — 2026-04-01. Source record: science-artemis-ii-launch.",
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
  }
];

export default CURRENT_AFFAIRS_QUESTION_BANK;
