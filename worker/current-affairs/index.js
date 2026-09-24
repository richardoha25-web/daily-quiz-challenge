/**
 * Phase 3I-A — Current Affairs Worker integration.
 *
 * Boundary:
 *   Worker request
 *     -> Question Bank
 *     -> recent-history cooldown
 *     -> if needed: verified facts -> 3C -> 3D -> 3E -> 3F
 *     -> Phase 3G quiz assembler
 *     -> public quiz response
 *
 * Step A generation is request-scoped. Step B will persist validated records
 * in Cloudflare D1. NewsData remains isolated in the future News Quiz route.
 */

import { CURRENT_AFFAIRS_QUESTION_BANK } from "./data/phase3i-question-bank.js";
import {
  validateQuestionBankCollection,
} from "./data/phase3h-question-bank.js";
import {
  getCurrentAffairsQuestionsWithRuntimeGeneration,
} from "./data/phase3j-runtime-generation.js";

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
    id: String(record.questionId),
    category: "current_affairs",
    difficulty: record.difficulty,
    question: record.question,
    options: record.options.map((option) => String(option)),
    correctAnswer: String(record.correctAnswer),
    explanation: record.explanation || "",
    source: "Current Affairs verified fact system",
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

  const result = getCurrentAffairsQuestionsWithRuntimeGeneration({
    quizSize,
    recentHistory,
    seed,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status || 503,
      questions: [],
      diagnostics: result.diagnostics,
    };
  }

  return {
    success: true,
    questions: result.questions.map(toPublicQuestion),
    diagnostics: result.diagnostics,
  };
}

export default {
  getCurrentAffairsQuestions,
};
