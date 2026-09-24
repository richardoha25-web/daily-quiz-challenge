/**
 * Phase 3I-B — real Question Bank audit and 3G serving-readiness test.
 */
import { strict as assert } from "node:assert";
import { CURRENT_AFFAIRS_QUESTION_BANK } from "./phase3i-question-bank.js";
import { validateQuestionBankCollection, auditQuestionBankRecords } from "./phase3h-question-bank.js";
import { CURRENT_AFFAIRS_INITIAL_FACTS, CURRENT_AFFAIRS_SOURCES } from "./phase2-initial-facts.js";
import { assembleCurrentAffairsQuiz } from "./phase3g-quiz-assembler.js";

export function runPhase3IBAuditTests() {
  const bank = CURRENT_AFFAIRS_QUESTION_BANK;
  assert.ok(bank.length >= 10, "real bank must contain at least 10 records");
  const contract = validateQuestionBankCollection(bank);
  assert.equal(contract.valid, true, "Question Bank contract must be valid: " + JSON.stringify(contract.errors));
  assert.equal(new Set(bank.map((q) => q.questionId)).size, bank.length, "question IDs must be unique");
  assert.equal(new Set(bank.map((q) => q.questionFamilyId)).size, bank.length, "question families must be unique");
  assert.equal(new Set(bank.map((q) => q.conceptId)).size, bank.length, "concepts must be unique");
  assert.ok(bank.every((q) => q.status === "active"), "all seed records must be active");
  assert.ok(bank.every((q) => q.accessTier === "FREE"), "all initial records must be FREE");
  const audit = auditQuestionBankRecords({ records: bank, facts: CURRENT_AFFAIRS_INITIAL_FACTS, sources: Object.values(CURRENT_AFFAIRS_SOURCES) });
  assert.equal(audit.valid, true, "Question Bank audit must be clean: " + JSON.stringify(audit.issues));
  const assembled = assembleCurrentAffairsQuiz({ questionBank: bank, quizSize: 10, seed: "phase-3i-b-real-bank", allowedAccessTiers: ["FREE"] });
  assert.equal(assembled.success, true, "real bank must assemble a complete quiz: " + JSON.stringify(assembled.diagnostics));
  assert.equal(assembled.quiz.length, 10);
  assert.deepEqual(assembled.diagnostics.counts.difficulty, { easy: 4, medium: 4, hard: 2 });
  assert.equal(new Set(assembled.quiz.map((q) => q.questionFamilyId)).size, 10);
  assert.equal(new Set(assembled.quiz.map((q) => q.conceptId)).size, 10);
  const withHistory = assembleCurrentAffairsQuiz({ questionBank: bank, quizSize: 10, seed: "phase-3i-b-history", recentHistory: bank.slice(0, 5).map((q) => ({ questionId: q.questionId, questionFamilyId: q.questionFamilyId, conceptId: q.conceptId })), allowedAccessTiers: ["FREE"] });
  assert.equal(withHistory.success, true, "real bank must still assemble 10 after small history cooldown");
  assert.equal(withHistory.quiz.length, 10);
  return { passed: true, bankSize: bank.length, auditIssueCount: audit.issues?.length || 0, quizSize: assembled.quiz.length, difficulty: assembled.diagnostics.counts.difficulty, historyQuizSize: withHistory.quiz.length };
}

if (import.meta.url === "file://" + process.argv[1]) console.log(JSON.stringify(runPhase3IBAuditTests(), null, 2));