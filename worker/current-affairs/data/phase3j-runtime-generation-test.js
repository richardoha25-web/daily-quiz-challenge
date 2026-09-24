/**
 * Phase 3J — Step A runtime generation integration test.
 *
 * Proves the audited Question Bank is not a hard ceiling: when its records
 * are blocked by recent history, the Worker can generate a fresh quiz from
 * verified facts through 3C -> 3D -> 3E -> 3F -> 3G.
 */

import assert from "node:assert/strict";
import { CURRENT_AFFAIRS_QUESTION_BANK } from "./phase3i-question-bank.js";
import { getCurrentAffairsQuestionsWithRuntimeGeneration } from "./phase3j-runtime-generation.js";

export function runPhase3JRuntimeGenerationTests() {
  const recentHistory = CURRENT_AFFAIRS_QUESTION_BANK.map((record) => ({
    questionId: record.questionId,
  }));

  const result = getCurrentAffairsQuestionsWithRuntimeGeneration({
    quizSize: 10,
    recentHistory,
    seed: "phase3j-step-a-test",
  });

  assert.equal(result.success, true, "runtime generation should assemble a fresh quiz");
  assert.equal(result.questions.length, 10, "runtime generation must return 10 questions");
  assert.equal(result.diagnostics.mode, "runtime_generation");
  assert.ok(
    result.diagnostics.runtimeGeneratedCount > 0,
    "runtime generation must create at least one request-scoped question"
  );

  const ids = new Set(result.questions.map((question) => question.id));
  assert.equal(ids.size, 10, "question IDs must be unique");

  const families = new Set(
    result.questions.map((question) => question.questionFamilyId || question.id)
  );
  assert.equal(families.size, 10, "quiz assembly must not repeat a question family");

  const counts = result.questions.reduce((acc, question) => {
    acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
    return acc;
  }, {});

  assert.equal(counts.easy, 4);
  assert.equal(counts.medium, 4);
  assert.equal(counts.hard, 2);

  for (const question of result.questions) {
    assert.equal(question.category, undefined, "internal test records should remain unwrapped here");
    assert.ok(question.options?.length === 4, "every generated question must have four options");
    assert.ok(question.options.includes(question.correctAnswer));
    assert.ok(
      !String(question.explanation || "").includes("factIds") &&
      !String(question.explanation || "").includes("sourceIds"),
      "player-facing explanation must not expose internal metadata"
    );
  }

  return {
    passed: true,
    generated: result.diagnostics.runtimeGeneratedCount,
    questionCount: result.questions.length,
    difficultyCounts: counts,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runPhase3JRuntimeGenerationTests(), null, 2));
}
