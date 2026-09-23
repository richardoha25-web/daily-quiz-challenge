function cleanNewsText(value) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").replace(/\s+([,.;!?])/g, "$1").trim()
    : "";
}

export function isUsableNewsArticle(article) {
  const title = cleanNewsText(article?.title);
  const description = cleanNewsText(article?.description);
  const sourceName = cleanNewsText(article?.source_name);
  const articleId = cleanNewsText(article?.article_id);
  if (!title || !description || !sourceName || !articleId) return false;
  if (title.length < 18 || title.length > 220) return false;
  if (description.length < 45 || description.length > 600) return false;

  const text = (title + " " + description).toLowerCase();
  const blockedPhrases = [
    "opinion", "editorial", "commentary", "column",
    "rumour", "rumor", "gossip", "clickbait",
    "celebrity feud", "red carpet", "fashion evolution",
    "adult star", "onlyfans"
  ];
  return !blockedPhrases.some((phrase) => text.includes(phrase));
}

export function cleanNewsTextForGeneration(value) {
  return cleanNewsText(value);
}
