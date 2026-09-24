/**
 * Phase 3H-E — Question Bank ↔ Phase 3G integration tests.
 *
 * Focus: the smallest deterministic smoke suite proving that an ACTIVE
 * Question Bank can safely feed the quiz assembler.
 *
 * No network, database, NewsData, Android, billing or AdMob dependencies.
 */

import { strict as assert } from "node:assert";
import { assembleCurrentAffairsQuiz } from "./phase3g-quiz-assembler.js";

function makeQuestion({
  id,
  family,
  concept,
  difficulty,
  domain,
  topic,
  variant = "direct",
  tier = "FREE",
}) {
  const answer = `Answer ${id}`;
  return {
    questionId: id,
    questionFamilyId: family,
    conceptId: concept,
    factIds: [`fact-${id}`],
    sourceIds: [`source-${id}`],
    variantType: variant,
    blueprintId: "direct_attribute",
    difficulty,
    domain,
    topic,
    question: `What is the verified answer for item ${id}?`,
    options: [answer, `Wrong A ${id}`, `Wrong B ${id}`, `Wrong C ${id}`],
    correctAnswer: answer,
    explanation: "Verified fact-based question.",
    status: "active",
    accessTier: tier,
    temporalContext: null,
    generatorVersion: "3H-E-test",
    lastValidated: "2026-09-24T00:00:00.000Z",
    createdAt: "2026-09-24T00:00:00.000Z",
    updatedAt: "2026-09-24T00:00:00.000Z",
  };
}

function buildBank() {
  const difficulties = [
    "easy", "easy", "easy", "easy",
    "medium", "medium", "medium", "medium",
    "hard", "hard",
  ];

  return difficulties.map((difficulty, index) =>
    makeQuestion({
      id: `q-${index + 1}`,
      family: `family-${index + 1}`,
      concept: `concept-${index + 1}`,
      difficulty,
      domain: ["Nigeria", "Africa", "World"][index % 3],
      topic: `topic-${index + 1}`,
      variant: ["direct", "reverse", "identification"][index % 3],
    })
  );
}

export function runPhase3HEIntegrationTests() {
  const bank = buildBank();

  const assembled = assembleCurrentAffairsQuiz({
    questionBank: bank,
    quizSize: 10,
    seed: "phase-3h-e",
    allowedAccessTiers: ["FREE"],
  });

  assert.equal(assembled.success, true, "10 active bank questions should assemble");
  assert.equal(assembled.quiz.length, 10, "quiz must contain exactly 10 questions");
  assert.deepEqual(
    assembled.quiz.map((q) => q.quizPosition),
    [1,2,3,4,5,6,7,8,9,10]
  );

  const families = new Set(assembled.quiz.map((q) => q.questionFamilyId));
  const concepts = new Set(assembled.quiz.map((q) => q.conceptId));
  assert.equal(families.size, 10, "question families must be unique");
  assert.equal(concepts.size, 10, "concepts must be unique");

  assert.deepEqual(assembled.diagnostics.counts.difficulty, {
    easy: 4,
    medium: 4,
    hard: 2,
  });

  const historyBlocked = assembleCurrentAffairsQuiz({
    questionBank: bank,
    quizSize: 10,
    recentHistory: bank.slice(0, 10).map((q) => ({
      questionId: q.questionId,
      questionFamilyId: q.questionFamilyId,
      conceptId: q.conceptId,
    })),
    seed: "phase-3h-e-history",
  });

  assert.equal(
    historyBlocked.success,
    false,
    "cooldown must prevent reuse when the entire bank is on history cooldown"
  );
  assert.equal(historyBlocked.error, "not_enough_eligible_questions");

  const premiumOnly = assembleCurrentAffairsQuiz({
    questionBank: bank.map((q) => ({ ...q, accessTier: "PREMIUM" })),
    quizSize: 10,
    allowedAccessTiers: ["FREE"],
  });

  assert.equal(
    premiumOnly.success,
    false,
    "access-tier filtering must prevent PREMIUM questions in a FREE quiz"
  );
  assert.equal(premiumOnly.error, "not_enough_eligible_questions");

  const inactive = assembleCurrentAffairsQuiz({
    questionBank: [
      ...bank.slice(0, 9),
      { ...bank[9], status: "validated" },
    ],
    quizSize: 10,
  });

  assert.equal(inactive.success, false);
  assert.equal(
    inactive.error,
    "question_bank_contains_non_serving_records"
  );

  return {
    passed: true,
    tests: 6,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runPhase3HEIntegrationTests();
  console.log(`Phase 3H-E: ${result.tests} integration tests passed.`);
}
