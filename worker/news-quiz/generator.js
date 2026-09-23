import { isUsableNewsArticle, cleanNewsTextForGeneration } from "./validator.js";

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeOptions(correct, values) {
  const unique = [...new Set([String(correct), ...values.map(String)])];
  if (unique.length < 4) return null;
  const distractors = shuffle(unique.filter((value) => value !== String(correct))).slice(0, 3);
  return shuffle([String(correct), ...distractors]);
}

export function buildNewsQuizQuestions(articles, difficulty) {
  const usable = articles
    .filter(isUsableNewsArticle)
    .filter((article, index, array) =>
      array.findIndex((item) => item.article_id === article.article_id) === index
    );

  const questions = [];

  for (let i = 0; i < usable.length; i += 1) {
    const article = usable[i];
    const others = usable.filter((_, index) => index !== i);
    if (others.length < 3) continue;

    const title = cleanNewsTextForGeneration(article.title);
    const description = cleanNewsTextForGeneration(article.description);
    const questionByDifficulty = {
      easy: "Which headline best matches this recent news report: " + description,
      medium: "According to this recent news report, which headline is correct: " + description,
      hard: "Which recent headline is accurately described by this report: " + description
    };

    const correctAnswer = title;
    const options = makeOptions(correctAnswer, others.map((item) => cleanNewsTextForGeneration(item.title)));
    if (!options) continue;

    const now = new Date().toISOString();
    questions.push({
      id: "newsdata-" + article.article_id + "-" + difficulty,
      category: "news_quiz",
      difficulty,
      question: questionByDifficulty[difficulty] || questionByDifficulty.easy,
      options,
      correctAnswer,
      explanation: "The report from " + article.source_name + " states: " + description,
      source: "NewsData.io",
      sourceId: article.article_id,
      sourceUrl: article.link || article.source_url || "",
      publishedAt: article.pubDate || "",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isRemote: true,
      createdAt: now,
      updatedAt: now
    });
  }

  return shuffle(questions.filter((question, index, array) =>
    array.findIndex((candidate) => candidate.id === question.id) === index
  ));
}
