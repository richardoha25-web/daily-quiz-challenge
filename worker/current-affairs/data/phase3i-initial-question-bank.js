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
    "questionId": "ca:ng-state-abia:classification:easy",
    "questionFamilyId": "ca-family:entity-geography:abia-state-ng-state-abia",
    "conceptId": "ca:entity:ng-state-abia",
    "factIds": [
      "ng-state-abia"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "classification",
    "blueprintId": "classification",
    "difficulty": "easy",
    "domain": "nigeria",
    "topic": "geography",
    "question": "Which geopolitical zone includes Abia State?",
    "options": [
      "South East",
      "South West",
      "North Central",
      "North East"
    ],
    "correctAnswer": "South East",
    "explanation": "The correct answer is Umuahia.",
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
    "questionId": "ca:ng-state-anambra:classification:medium",
    "questionFamilyId": "ca-family:entity-geography:anambra-state-ng-state-anambra",
    "conceptId": "ca:entity:ng-state-anambra",
    "factIds": [
      "ng-state-anambra"
    ],
    "sourceIds": [
      "inec-state-offices"
    ],
    "variantType": "classification",
    "blueprintId": "classification",
    "difficulty": "medium",
    "domain": "nigeria",
    "topic": "geography",
    "question": "Which geopolitical zone includes Anambra State?",
    "options": [
      "South East",
      "South West",
      "North Central",
      "North East"
    ],
    "correctAnswer": "South East",
    "explanation": "The correct answer is Awka.",
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
    "questionId": "ca:ng-state-kano:reverse:easy",
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
    "explanation": "The correct answer is Kano.",
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
    "questionId": "ca:ng-state-lagos:identification:easy",
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
    "explanation": "The correct answer is Ikeja.",
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
    "questionId": "ca:ng-state-rivers:identification:easy",
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
    "explanation": "The correct answer is Port Harcourt.",
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
    "explanation": "The correct answer is Member state.",
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
    "explanation": "The correct answer is Abuja, Nigeria.",
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
    "explanation": "The correct answer is NASA, Roscosmos, JAXA, ESA and the Canadian Space Agency.",
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
    "explanation": "The correct answer is 55.",
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
    "question": "How many member states did ECOWAS have in 2025?",
    "options": [
      12,
      15,
      16,
      10
    ],
    "correctAnswer": 12,
    "explanation": "The correct answer is 12.",
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
    "question": "Who is the current President of Nigeria as of 23 September 2026?",
    "options": [
      "Bola Ahmed Tinubu",
      "Kashim Shettima",
      "Godswill Akpabio",
      "Tajudeen Abbas"
    ],
    "correctAnswer": "Bola Ahmed Tinubu",
    "explanation": "The correct answer is Bola Ahmed Tinubu.",
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
    "question": "Who is the current Vice President of Nigeria as of 23 September 2026?",
    "options": [
      "Kashim Shettima",
      "Bola Ahmed Tinubu",
      "Godswill Akpabio",
      "Benjamin Kalu"
    ],
    "correctAnswer": "Kashim Shettima",
    "explanation": "The correct answer is Kashim Shettima.",
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
    "question": "Who is the current President of the Senate of Nigeria as of 23 September 2026?",
    "options": [
      "Godswill Akpabio",
      "Tajudeen Abbas",
      "Benjamin Kalu",
      "Kashim Shettima"
    ],
    "correctAnswer": "Godswill Akpabio",
    "explanation": "The correct answer is Godswill Akpabio.",
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
    "question": "Who is the current Speaker of the House of Representatives as of 23 September 2026?",
    "options": [
      "Tajudeen Abbas",
      "Godswill Akpabio",
      "Benjamin Kalu",
      "Bola Ahmed Tinubu"
    ],
    "correctAnswer": "Tajudeen Abbas",
    "explanation": "The correct answer is Tajudeen Abbas.",
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
    "question": "Who is the current Governor of the Central Bank of Nigeria as of 23 September 2026?",
    "options": [
      "Olayemi Cardoso",
      "Godswill Akpabio",
      "Tajudeen Abbas",
      "Kashim Shettima"
    ],
    "correctAnswer": "Olayemi Cardoso",
    "explanation": "The correct answer is Olayemi Cardoso.",
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
    "explanation": "The correct answer is 2002.",
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
    "explanation": "The correct answer is 1948.",
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
    "explanation": "The correct answer is 1944.",
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
    "question": "When was Artemis II launched?",
    "options": [
      "2026-04-01",
      "2026-03-01",
      "2025-04-01",
      "2027-04-01"
    ],
    "correctAnswer": "2026-04-01",
    "explanation": "The correct answer is 2026-04-01.",
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
    "question": "What is the capital of the Federal Capital Territory?",
    "options": [
      "Abuja",
      "Lagos",
      "Kano",
      "Ibadan"
    ],
    "correctAnswer": "Abuja",
    "explanation": "The correct answer is Abuja.",
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
    "question": "How many local government areas are there in Nigeria?",
    "options": [
      774,
      810,
      738,
      824
    ],
    "correctAnswer": 774,
    "explanation": "The correct answer is 774.",
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
    "question": "How many teams will compete in the FIFA World Cup 2026?",
    "options": [
      48,
      32,
      40,
      64
    ],
    "correctAnswer": 48,
    "explanation": "The correct answer is 48.",
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
    "question": "Which countries will host the FIFA World Cup 2026?",
    "options": [
      "Canada, Mexico and the United States",
      "Brazil, Argentina and Chile",
      "Spain, Portugal and Morocco",
      "France, Germany and Italy"
    ],
    "correctAnswer": "Canada, Mexico and the United States",
    "explanation": "The correct answer is Canada, Mexico and the United States.",
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
    "question": "Since when has the International Space Station been continuously occupied?",
    "options": [
      "November 2000",
      "January 1998",
      "July 2005",
      "December 2010"
    ],
    "correctAnswer": "November 2000",
    "explanation": "The correct answer is November 2000.",
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
    "question": "How many member states does the World Health Organization have?",
    "options": [
      194,
      193,
      195,
      191
    ],
    "correctAnswer": 194,
    "explanation": "The correct answer is 194.",
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
    "questionId": "ca:world-who-headquarters:reverse:medium",
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
    "explanation": "The correct answer is Geneva, Switzerland.",
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
    "questionId": "ca:sports-fifa-2026-final:reverse:medium",
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
    "explanation": "The correct answer is New York/New Jersey.",
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
    "questionId": "ca:science-artemis-ii-type:identification:medium",
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
    "explanation": "The correct answer is Crewed lunar flyby.",
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
    "questionId": "ca:science-artemis-ii-duration:identification:medium",
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
    "explanation": "The correct answer is 9 days, 1 hour, 32 minutes.",
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
