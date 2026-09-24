/**
 * Phase 3I-A — Current Affairs Worker integration.
 *
 * Boundary:
 *   Worker request
 *     -> Question Bank
 *     -> access-tier filter
 *     -> recent-history cooldown
 *     -> Phase 3G quiz assembler
 *     -> public quiz response
 *
 * This module does not generate questions, call NewsData, mutate history,
 * enforce billing, or expose internal Question Bank metadata to the client.
 */

import { CURRENT_AFFAIRS_QUESTION_BANK } from "./data/phase3i-question-bank.js";
import {
  assembleCurrentAffairsQuiz,
} from "./data/phase3g-quiz-assembler.js";
import {
  validateQuestionBankCollection,
} from "./data/phase3h-question-bank.js";

function normalizeRecentHistory(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => typeof item === "string" && item.trim())
        .slice(0, 60)
        .map((questionId) => ({ questionId: questionId.trim() }));
    }
  } catch {
    // Fall through to the compact comma-separated form.
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 60)
    .map((questionId) => ({ questionId }));
}

function toPublicQuestion(record) {
  return {
    id: record.questionId,
    category: "current_affairs",
    difficulty: record.difficulty,
    question: record.question,
    options: [...record.options],
    correctAnswer: record.correctAnswer,
    explanation: record.explanation || "",
    source: "Current Affairs Question Bank",
    isRemote: true,
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || new Date().toISOString(),
  };
}

export function getCurrentAffairsQuestions({
  quizSize = 10,
  recentHistory = [],
  seed = "current-affairs",
} = {}) {
  if (!Number.isInteger(quizSize) || quizSize < 1 || quizSize > 20) {
    return {
      success: false,
      error: "INVALID_QUIZ_SIZE",
      status: 400,
      questions: [],
    };
  }

  const bankValidation = validateQuestionBankCollection(
    CURRENT_AFFAIRS_QUESTION_BANK
  );

  if (!bankValidation.valid) {
    return {
      success: false,
      error: "CURRENT_AFFAIRS_QUESTION_BANK_INVALID",
      status: 500,
      questions: [],
      diagnostics: bankValidation.errors,
    };
  }

  if (CURRENT_AFFAIRS_QUESTION_BANK.length === 0) {
    return {
      success: false,
      error: "CURRENT_AFFAIRS_QUESTION_BANK_NOT_POPULATED",
      status: 503,
      questions: [],
    };
  }

  const assembled = assembleCurrentAffairsQuiz({
    questionBank: CURRENT_AFFAIRS_QUESTION_BANK,
    recentHistory,
    quizSize,
    seed,
    allowedAccessTiers: ["FREE"],
  });

  if (!assembled.success) {
    return {
      success: false,
      error: assembled.error,
      status: assembled.error === "not_enough_eligible_questions" ? 404 : 503,
      questions: [],
      diagnostics: assembled.diagnostics,
    };
  }

  return {
    success: true,
    questions: assembled.quiz.map(toPublicQuestion),
    diagnostics: assembled.diagnostics,
  };
}

export default {
  getCurrentAffairsQuestions,
};
