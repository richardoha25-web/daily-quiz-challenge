import { fetchNewsDataArticles } from "./provider.js";
import { buildNewsQuizQuestions } from "./generator.js";

export async function getNewsQuizQuestions(env, difficulty, limit) {
  const articles = await fetchNewsDataArticles(env);
  const questions = buildNewsQuizQuestions(articles, difficulty);

  return {
    source: "NewsData.io",
    questions: questions.slice(0, limit)
  };
}
