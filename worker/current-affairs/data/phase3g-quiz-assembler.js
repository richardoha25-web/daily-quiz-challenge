/**
 * Phase 3G — Current Affairs quiz assembler.
 *
 * Purpose:
 * - Assemble exactly 10 playable questions from an already validated Question Bank.
 * - Apply the strongest anti-repetition rules before selection.
 * - Balance difficulty, domain/topic concentration and question variants.
 * - Keep selection deterministic and testable.
 *
 * Deliberate boundary:
 * - This module does NOT generate questions.
 * - It does NOT generate distractors.
 * - It does NOT validate factual correctness.
 * - It does NOT persist the Question Bank.
 * - It does NOT write user recent history.
 *
 * The Question Bank is the content source; recentHistory is user state.
 */

import { validateQuestionRecord } from "./phase3a-question-model.js";
import {
  filterEligibleQuestions,
  canSelectQuestion,
} from "./phase3f-duplicate-family-detector.js";

export const DEFAULT_QUIZ_SIZE = 10;

export const DEFAULT_DIFFICULTY_TARGETS = {
  easy: 4,
  medium: 4,
  hard: 2,
};

export const DEFAULT_ASSEMBLY_LIMITS = {
  maxPerDomain: 3,
  maxPerTopic: 2,
  maxPerVariantType: 2,
  blockSameConcept: true,
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function sum(values) {
  return Object.values(values).reduce((total, value) => total + value, 0);
}

/**
 * Stable string hash used only for deterministic ordering.
 * It is not a security primitive.
 */
function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Deterministic pseudo-random score for stable shuffling.
 */
function seededScore(seed, questionId) {
  return hashString(`${seed}|${questionId}`) / 4294967296;
}

function deterministicShuffle(questions, seed) {
  return [...questions].sort((a, b) => {
    const scoreA = seededScore(seed, a.questionId);
    const scoreB = seededScore(seed, b.questionId);

    if (scoreA !== scoreB) return scoreA - scoreB;
    return String(a.questionId).localeCompare(String(b.questionId));
  });
}

function countBy(questions, field) {
  const counts = {};

  for (const question of questions) {
    const value = question?.[field];
    if (!value) continue;
    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

function meetsLimit(counts, key, limit) {
  return (counts[key] || 0) < limit;
}

function normalizeDifficultyTargets(targets, quizSize) {
  const requested = {
    easy: Math.max(0, Number(targets?.easy ?? 0)),
    medium: Math.max(0, Number(targets?.medium ?? 0)),
    hard: Math.max(0, Number(targets?.hard ?? 0)),
  };

  const total = sum(requested);

  if (total === quizSize) return requested;

  if (total === 0) {
    return { ...DEFAULT_DIFFICULTY_TARGETS };
  }

  const scaled = {};
  let assigned = 0;

  for (const difficulty of ["easy", "medium", "hard"]) {
    const raw = (requested[difficulty] / total) * quizSize;
    scaled[difficulty] = Math.floor(raw);
    assigned += scaled[difficulty];
  }

  const remainderOrder = ["medium", "easy", "hard"];

  for (const difficulty of remainderOrder) {
    if (assigned >= quizSize) break;
    scaled[difficulty] += 1;
    assigned += 1;
  }

  return scaled;
}

/**
 * Select questions in priority passes.
 *
 * Pass 1 tries to meet the requested difficulty target while respecting all
 * concentration limits.
 * Pass 2 fills remaining slots from the least-represented difficulty/domain
 * combinations without breaking family/concept rules.
 * Pass 3 is a controlled relaxation of topic/domain concentration only.
 *
 * Family/concept duplication is never relaxed.
 */
function selectQuestions({
  candidates,
  quizSize,
  difficultyTargets,
  limits,
  seed,
}) {
  const ordered = deterministicShuffle(candidates, seed);
  const selected = [];
  const difficultyCounts = {};
  const domainCounts = {};
  const topicCounts = {};
  const variantCounts = {};

  const trySelect = (candidate, { relaxDistribution = false } = {}) => {
    if (selected.length >= quizSize) return false;

    const coexistence = canSelectQuestion({
      candidate,
      selectedQuestions: selected,
      blockSameConcept: limits.blockSameConcept,
    });

    if (!coexistence.allowed) return false;

    const difficulty = candidate.difficulty;
    const domain = candidate.domain;
    const topic = candidate.topic;
    const variantType = candidate.variantType;

    const difficultyTarget = difficultyTargets[difficulty] || 0;
    if (!relaxDistribution && (difficultyCounts[difficulty] || 0) >= difficultyTarget) {
      return false;
    }

    if (
      !relaxDistribution &&
      domain &&
      !meetsLimit(domainCounts, domain, limits.maxPerDomain)
    ) {
      return false;
    }

    if (
      !relaxDistribution &&
      topic &&
      !meetsLimit(topicCounts, topic, limits.maxPerTopic)
    ) {
      return false;
    }

    if (
      !relaxDistribution &&
      variantType &&
      !meetsLimit(variantCounts, variantType, limits.maxPerVariantType)
    ) {
      return false;
    }

    selected.push(candidate);
    difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
    if (domain) domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    if (topic) topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    if (variantType) {
      variantCounts[variantType] = (variantCounts[variantType] || 0) + 1;
    }

    return true;
  };

  // Pass 1: satisfy the requested difficulty distribution.
  for (const difficulty of ["easy", "medium", "hard"]) {
    const target = difficultyTargets[difficulty] || 0;

    for (const candidate of ordered) {
      if ((difficultyCounts[difficulty] || 0) >= target) break;
      if (candidate.difficulty !== difficulty) continue;
      trySelect(candidate);
    }
  }

  // Pass 2: fill any remaining slots while preserving concentration limits.
  for (const candidate of ordered) {
    if (selected.length >= quizSize) break;
    trySelect(candidate);
  }

  // Pass 3: relax only distribution limits if needed. Family/concept rules
  // remain enforced by canSelectQuestion().
  if (selected.length < quizSize) {
    for (const candidate of ordered) {
      if (selected.length >= quizSize) break;
      trySelect(candidate, { relaxDistribution: true });
    }
  }

  return {
    selected,
    counts: {
      difficulty: countBy(selected, "difficulty"),
      domain: countBy(selected, "domain"),
      topic: countBy(selected, "topic"),
      variantType: countBy(selected, "variantType"),
    },
  };
}

/**
 * Validate that the input pool contains only serving-safe Question Bank records.
 *
 * Active is the serving state. Generated drafts are never eligible here.
 */
function validateQuestionBankInput(questionBank) {
  const errors = [];

  for (const question of questionBank || []) {
    if (question?.status !== "active") {
      errors.push({
        questionId: question?.questionId || null,
        reason: "question_not_active",
        status: question?.status || null,
      });
      continue;
    }

    const structural = validateQuestionRecord(question);

    if (!structural.valid) {
      errors.push({
        questionId: question?.questionId || null,
        reason: "invalid_question_record",
        details: structural.errors,
      });
    }
  }

  return errors;
}

/**
 * Assemble one Current Affairs quiz.
 *
 * Required inputs:
 * - questionBank: active Question Bank records only.
 * - recentHistory: user history records/IDs used for cooldowns.
 *
 * The function returns a failure instead of silently serving fewer than ten
 * questions. This makes insufficient-bank conditions visible to Phase 3H.
 */
export function assembleCurrentAffairsQuiz({
  questionBank = [],
  recentHistory = [],
  quizSize = DEFAULT_QUIZ_SIZE,
  seed = "current-affairs",
  difficultyTargets = DEFAULT_DIFFICULTY_TARGETS,
  allowedAccessTiers = ["FREE"],
  familyCooldown = true,
  conceptCooldown = true,
  questionCooldown = true,
  limits = DEFAULT_ASSEMBLY_LIMITS,
} = {}) {
  if (!Number.isInteger(quizSize) || quizSize < 1 || quizSize > 20) {
    return {
      success: false,
      error: "invalid_quiz_size",
      quiz: [],
    };
  }

  const bankErrors = validateQuestionBankInput(questionBank);

  if (bankErrors.length > 0) {
    return {
      success: false,
      error: "question_bank_contains_non_serving_records",
      quiz: [],
      diagnostics: {
        bankErrors,
      },
    };
  }

  const normalizedTiers = unique(allowedAccessTiers).map(normalize);

  const accessFiltered = questionBank.filter((question) =>
    normalizedTiers.includes(normalize(question.accessTier || "FREE"))
  );

  const eligibleResult = filterEligibleQuestions({
    questions: accessFiltered,
    selectedQuestions: [],
    recentHistory,
    blockSameConcept: limits.blockSameConcept,
    familyCooldown,
    conceptCooldown,
    questionCooldown,
  });

  const normalizedTargets = normalizeDifficultyTargets(
    difficultyTargets,
    quizSize
  );

  if (eligibleResult.eligible.length < quizSize) {
    return {
      success: false,
      error: "not_enough_eligible_questions",
      quiz: [],
      diagnostics: {
        quizSize,
        inputBankSize: questionBank.length,
        accessEligible: accessFiltered.length,
        eligibleAfterHistory: eligibleResult.eligible.length,
        required: quizSize,
        rejected: eligibleResult.rejected,
        difficultyTargets: normalizedTargets,
      },
    };
  }

  const selection = selectQuestions({
    candidates: eligibleResult.eligible,
    quizSize,
    difficultyTargets: normalizedTargets,
    limits: {
      ...DEFAULT_ASSEMBLY_LIMITS,
      ...limits,
    },
    seed,
  });

  if (selection.selected.length !== quizSize) {
    return {
      success: false,
      error: "distribution_constraints_prevent_full_quiz",
      quiz: [],
      diagnostics: {
        quizSize,
        selected: selection.selected.length,
        eligible: eligibleResult.eligible.length,
        difficultyTargets: normalizedTargets,
        counts: selection.counts,
      },
    };
  }

  const quiz = selection.selected.map((question, index) => ({
    ...question,
    quizPosition: index + 1,
  }));

  return {
    success: true,
    quiz,
    diagnostics: {
      quizSize,
      seed,
      difficultyTargets: normalizedTargets,
      selectedCount: quiz.length,
      counts: selection.counts,
      eligibleBeforeSelection: eligibleResult.eligible.length,
      rejectedByHistory: eligibleResult.rejected,
    },
  };
}

export default {
  assembleCurrentAffairsQuiz,
  DEFAULT_QUIZ_SIZE,
  DEFAULT_DIFFICULTY_TARGETS,
  DEFAULT_ASSEMBLY_LIMITS,
};
