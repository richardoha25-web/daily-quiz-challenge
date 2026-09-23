const NEWSDATA_URL = "https://newsdata.io/api/1/latest";

export async function fetchNewsDataArticles(env) {
  const apiKey = env.NEWSDATA_API_KEY;
  if (!apiKey) throw new Error("NEWSDATA_API_KEY_NOT_CONFIGURED");

  const apiUrl = new URL(NEWSDATA_URL);
  apiUrl.searchParams.set("apikey", apiKey);
  apiUrl.searchParams.set("language", "en");
  apiUrl.searchParams.set("size", "10");
  apiUrl.searchParams.set("removeduplicate", "1");

  let response;
  try {
    response = await fetch(apiUrl.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    throw new Error("NEWSDATA_TIMEOUT");
  }

  let rawBody = "";
  try {
    rawBody = await response.text();
  } catch {
    throw new Error("NEWSDATA_RESPONSE_READ_FAILED");
  }

  let data = null;
  try {
    data = JSON.parse(rawBody);
  } catch {
    throw new Error("NEWSDATA_INVALID_RESPONSE");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("NEWSDATA_AUTH_FAILED");
  }
  if (response.status === 429) {
    throw new Error("NEWSDATA_RATE_LIMITED");
  }
  if (!response.ok) {
    throw new Error(
      data?.results?.[0]?.message ||
      data?.message ||
      data?.code ||
      `NEWSDATA_HTTP_${response.status}`
    );
  }
  if (data?.status !== "success" || !Array.isArray(data?.results)) {
    throw new Error(
      data?.results?.[0]?.message ||
      data?.message ||
      data?.code ||
      "NEWSDATA_INVALID_RESPONSE"
    );
  }

  return data.results;
}
