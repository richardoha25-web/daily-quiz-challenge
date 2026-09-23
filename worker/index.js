// Preview rebuild trigger: Africa API Worker-secret configuration is verified outside the repository.

const OPEN_TRIVIA_URL = "https://opentdb.com/api.php";
const NEWSDATA_URL = "https://newsdata.io/api/1/latest";

function json(data, status = 200, request) {
const origin = request?.headers.get("Origin") || "*";
return new Response(JSON.stringify(data), {
status,
headers: {
"Content-Type": "application/json",
"Cache-Control": "no-store",
"Access-Control-Allow-Origin": origin,
"Access-Control-Allow-Methods": "GET, OPTIONS",
"Access-Control-Allow-Headers": "Content-Type"
}
});
}

function decodeHtml(text) {
return text
.replace(/&quot;/g, '"')
.replace(/&#039;/g, "'")
.replace(/&amp;/g, "&")
.replace(/&lt;/g, "<")
.replace(/&gt;/g, ">")
.replace(/“/g, '"')
.replace(/”/g, '"')
.replace(/‘/g, "'")
.replace(/’/g, "'")
.replace(/&#(\\d+);/g, (_, code) =>
String.fromCharCode(Number(code))
);
}

function shuffle(array) {
const result = [...array];

for (let i = result.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[result[i], result[j]] = [result[j], result[i]];
}

return result;
}

async function fetchAfricaCountries(env) {
const apiKey = env.AFRICA_API_KEY;

if (!apiKey) throw new Error("AFRICA_API_KEY_NOT_CONFIGURED");

const cache = caches.default;
const cacheKey = new Request("https://daily-quiz-africa-cache.internal/countries");
const cached = await cache.match(cacheKey);

if (cached) return cached.json();

const apiUrl = new URL("https://api.africa-api.com/v1/countries");
apiUrl.searchParams.set("paginate", "true");
apiUrl.searchParams.set("page", "1");
apiUrl.searchParams.set("per_page", "100");
apiUrl.searchParams.set("sort", "name");

let response;

try {
response = await fetch(apiUrl.toString(), {
headers: {
Authorization: `Bearer ${apiKey}`,
Accept: "application/json"
},
signal: AbortSignal.timeout(8000)
});
} catch {
throw new Error("AFRICA_API_TIMEOUT");
}

if (response.status === 401 || response.status === 403) {
throw new Error("AFRICA_API_AUTH_FAILED");
}

if (response.status === 429) {
throw new Error("AFRICA_API_RATE_LIMITED");
}

if (!response.ok) throw new Error("AFRICA_API_UNAVAILABLE");

const data = await response.json();
const countries = Array.isArray(data?.data) ? data.data : [];

if (!countries.length) throw new Error("AFRICA_API_NO_COUNTRIES");

const cachedResponse = new Response(JSON.stringify({
countries,
retrievedAt: new Date().toISOString()
}), {
headers: {
"Content-Type": "application/json",
"Cache-Control": "public, max-age=300"
}
});

await cache.put(cacheKey, cachedResponse.clone());
return cachedResponse.json();
}

function uniqueValues(countries, getter) {
return [...new Set(
countries
.map(getter)
.filter(value => value !== null && value !== undefined && String(value).trim() !== "")
.map(value => String(value))
)];
}

function makeOptions(correct, values) {
const unique = [...new Set([String(correct), ...values.map(String)])];
if (unique.length < 4) return null;

const distractors = shuffle(
unique.filter(value => value !== String(correct))
).slice(0, 3);

return shuffle([String(correct), ...distractors]);
}

function generatedQuestion({ id, difficulty, question, correctAnswer, options, explanation }) {
return {
id,
category: "africa_nigeria",
difficulty,
question,
options,
correctAnswer: String(correctAnswer),
explanation,
source: "Africa API",
sourceId: id,
sourceUrl: "https://africa-api.com/docs/countries",
license: "Africa API source data; verify current provider terms before production republication",
isRemote: true,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
};
}

function buildAfricaQuestions(countries, difficulty) {
const questions = [];
const validCountries = countries.filter(country =>
country &&
typeof country.id === "string" &&
typeof country.name === "string" &&
country.name.trim()
);

const countriesWithCapital = validCountries.filter(country =>
typeof country.capital === "string" && country.capital.trim()
);

const countriesWithRegion = validCountries.filter(country =>
typeof country.region === "string" && country.region.trim()
);

const countriesWithSubregion = validCountries.filter(country =>
typeof country.subregion === "string" && country.subregion.trim()
);

const countriesWithCurrency = validCountries.filter(country =>
Array.isArray(country.currencies) && country.currencies.filter(Boolean).length > 0
);

const addQuestion = (id, question, correctAnswer, options, explanation) => {
if (!options || options.length !== 4) return;
questions.push(generatedQuestion({
id,
difficulty,
question,
correctAnswer,
options,
explanation
}));
};

// EASY: direct, unambiguous factual recall.
if (difficulty === "easy") {
for (const country of countriesWithCapital) {
const options = makeOptions(
country.capital,
countriesWithCapital.map(item => item.capital)
);
addQuestion(
`africa-api-${country.id}-capital`,
`What is the capital of ${country.name}?`,
country.capital,
options,
`Capital: ${country.capital}. Source: Africa API country reference data.`
);
}

for (const country of countriesWithRegion) {
const options = makeOptions(
country.region,
countriesWithRegion.map(item => item.region)
);
addQuestion(
`africa-api-${country.id}-region`,
`In which region of Africa is ${country.name} located?`,
country.region,
options,
`Region: ${country.region}. Source: Africa API country reference data.`
);
}

const currencyCodes = countriesWithCurrency.flatMap(country =>
country.currencies.filter(Boolean).map(String)
);

for (const country of countriesWithCurrency) {
const correct = String(country.currencies.filter(Boolean)[0]);
const options = makeOptions(correct, currencyCodes);
addQuestion(
`africa-api-${country.id}-currency`,
`Which currency code is listed for ${country.name}?`,
correct,
options,
`Currency code: ${correct}. Source: Africa API country reference data.`
);
}
}

// MEDIUM: connect two related facts instead of copying a raw field.
if (difficulty === "medium") {
for (const country of countriesWithCapital) {
const options = makeOptions(
country.name,
countriesWithCapital.map(item => item.name)
);
addQuestion(
`africa-api-${country.id}-country-by-capital`,
`Which African country has ${country.capital} as its capital?`,
country.name,
options,
`${country.capital} is the capital of ${country.name}. Source: Africa API country reference data.`
);
}

const currencyCountryPairs = [];
for (const country of countriesWithCurrency) {
for (const currency of country.currencies.filter(Boolean).map(String)) {
currencyCountryPairs.push({ country, currency });
}
}

const currencyCountryCounts = new Map();
for (const pair of currencyCountryPairs) {
currencyCountryCounts.set(
pair.currency,
(currencyCountryCounts.get(pair.currency) || 0) + 1
);
}

for (const pair of currencyCountryPairs) {
if (currencyCountryCounts.get(pair.currency) !== 1) continue;

const options = makeOptions(
pair.country.name,
countriesWithCurrency.map(item => item.name)
);
addQuestion(
`africa-api-${pair.country.id}-country-by-currency-${pair.currency}`,
`Which African country is listed as using the currency code ${pair.currency}?`,
pair.country.name,
options,
`Currency code ${pair.currency} is listed for ${pair.country.name}. Source: Africa API country reference data.`
);
}

for (const country of countriesWithSubregion) {
const differentSubregion = countriesWithSubregion.filter(
item => item.subregion !== country.subregion
);

const options = makeOptions(
country.name,
differentSubregion.map(item => item.name)
);
addQuestion(
`africa-api-${country.id}-country-by-subregion`,
`Which country below is also part of the ${country.subregion} African subregion?`,
country.name,
options,
`${country.name} is listed in the ${country.subregion} subregion. Source: Africa API country reference data.`
);
}
}

// HARD: combine multiple independent facts into one identification problem.
// We deliberately avoid official_name and raw area-number questions because
// they either reveal the answer or create weak memorization questions.
if (difficulty === "hard") {
const candidates = validCountries.filter(country =>
typeof country.capital === "string" && country.capital.trim() &&
typeof country.region === "string" && country.region.trim() &&
Array.isArray(country.currencies) && country.currencies.filter(Boolean).length > 0
);

for (const country of candidates) {
const currency = String(country.currencies.filter(Boolean)[0]);

const clue = `Identify the African country described by these clues: its capital is ${country.capital}, it is in ${country.region}, and its listed currency code is ${currency}.`;

const options = makeOptions(
country.name,
candidates.map(item => item.name)
);

addQuestion(
`africa-api-${country.id}-three-fact-identification`,
clue,
country.name,
options,
`The three clues point to ${country.name}: capital ${country.capital}, region ${country.region}, currency code ${currency}. Source: Africa API country reference data.`
);
}

for (const country of candidates) {
const options = makeOptions(
country.name,
candidates.map(item => item.name)
);

const question = `Which African country has ${country.capital} as its capital and is located in ${country.region}?`;
addQuestion(
`africa-api-${country.id}-capital-region-identification`,
question,
country.name,
options,
`${country.name} has ${country.capital} as its capital and is listed in ${country.region}. Source: Africa API country reference data.`
);
}
}

return shuffle(
questions.filter((question, index, array) =>
array.findIndex(candidate => candidate.id === question.id) === index
)
);
}

async function createId(text) {
const data = new TextEncoder().encode(text);
const hash = await crypto.subtle.digest("SHA-256", data);

return Array.from(new Uint8Array(hash))
.map(byte => byte.toString(16).padStart(2, "0"))
.join("");
}

export default {
async fetch(request, env) {
const url = new URL(request.url);

if (request.method === "OPTIONS") {
const origin = request.headers.get("Origin") || "*";
return new Response(null, {
status: 204,
headers: {
"Access-Control-Allow-Origin": origin,
"Access-Control-Allow-Methods": "GET, OPTIONS",
"Access-Control-Allow-Headers": "Content-Type",
"Access-Control-Max-Age": "86400"
}
});
}

if (url.pathname === "/api/health") {
return json({
ok: true,
service: "daily-quiz-intermediary",
version: "1.0"
}, 200, request);
}

if (url.pathname === "/api/test/africa-api") {
const apiKey = env.AFRICA_API_KEY;

if (!apiKey) {
return json({
ok: false,
error: "AFRICA_API_KEY_NOT_CONFIGURED",
message: "Africa API secret is not configured on the Worker."
}, 500, request);
}

let response;
try {
response = await fetch("https://api.africa-api.com/v1/countries/ng", {
headers: {
Authorization: `Bearer ${apiKey}`
},
signal: AbortSignal.timeout(8000)
});
} catch (error) {
return json({
ok: false,
error: "AFRICA_API_TIMEOUT",
message: "Africa API request timed out."
}, 504, request);
}

if (response.status === 401 || response.status === 403) {
return json({
ok: false,
error: "AFRICA_API_AUTH_FAILED",
message: "Africa API authentication failed. Check the AFRICA_API_KEY Worker secret."
}, response.status, request);
}

if (response.status === 429) {
return json({
ok: false,
error: "AFRICA_API_RATE_LIMITED",
message: "Africa API free-tier rate limit was reached."
}, 429, request);
}

if (!response.ok) {
return json({
ok: false,
error: "AFRICA_API_UNAVAILABLE",
message: "Africa API returned an unexpected error."
}, 503, request);
}

let data;
try {
data = await response.json();
} catch (error) {
return json({
ok: false,
error: "AFRICA_API_INVALID_RESPONSE",
message: "Africa API returned invalid JSON."
}, 503, request);
}

return json({
ok: true,
provider: "Africa API",
country: data?.data?.name || "Nigeria",
verified: true,
availableFields: Object.keys(data?.data || {}),
sourceMode: "live Africa API facts -> generated questions"
}, 200, request);
}

if (url.pathname === "/api/questions") {
const category = url.searchParams.get("category");
const difficulty = url.searchParams.get("difficulty");
const limitText = url.searchParams.get("limit");

const categories = [
"general",
"science",
"bible",
"africa_nigeria",
"current_affairs",
"news_quiz"
];

const difficulties = [
"easy",
"medium",
"hard"
];

if (!categories.includes(category)) {
return json({
ok: false,
error: "INVALID_REQUEST",
message: "Invalid category."
}, 400, request);
}

if (!difficulties.includes(difficulty)) {
return json({
ok: false,
error: "INVALID_REQUEST",
message: "Invalid difficulty."
}, 400, request);
}

let limit = 10;

if (limitText !== null) {
limit = Number(limitText);
}

if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
return json({
ok: false,
error: "INVALID_REQUEST",
message: "Limit must be between 1 and 20."
}, 400, request);
}

// Science → Open Trivia DB Science & Nature (category 17)
if (category === "science") {
const apiUrl = new URL(OPEN_TRIVIA_URL);

apiUrl.searchParams.set("amount", String(limit));
apiUrl.searchParams.set("category", "17");
apiUrl.searchParams.set("difficulty", difficulty);
apiUrl.searchParams.set("type", "multiple");
apiUrl.searchParams.set("encode", "url3986");

let response;

try {
response = await fetch(apiUrl.toString(), {
signal: AbortSignal.timeout(8000)
});
} catch (error) {
return json({
ok: false,
error: "PROVIDER_TIMEOUT",
message: "Science question provider timed out."
}, 504, request);
}

if (!response.ok) {
return json({
ok: false,
error: "PROVIDER_UNAVAILABLE",
message: "Science question provider is unavailable."
}, 503, request);
}

let data;

try {
data = await response.json();
} catch (error) {
return json({
ok: false,
error: "PROVIDER_UNAVAILABLE",
message: "Invalid response from question provider."
}, 503, request);
}

if (data.response_code === 5) {
return json({
ok: false,
error: "RATE_LIMITED",
message: "Question provider rate limit reached."
}, 429, request);
}

if (data.response_code === 1) {
return json({
ok: false,
error: "NO_QUESTIONS",
message: "Not enough science questions are available."
}, 404, request);
}

if (data.response_code !== 0 || !Array.isArray(data.results)) {
return json({
ok: false,
error: "PROVIDER_UNAVAILABLE",
message: "Question provider returned an unexpected response."
}, 503, request);
}

const questions = [];

for (const item of data.results) {
if (
item.type !== "multiple" ||
item.difficulty !== difficulty ||
!item.question ||
!item.correct_answer ||
!Array.isArray(item.incorrect_answers) ||
item.incorrect_answers.length !== 3
) {
continue;
}

const question = decodeHtml(
decodeURIComponent(item.question)
);

const correctAnswer = decodeHtml(
decodeURIComponent(item.correct_answer)
);

const incorrectAnswers = item.incorrect_answers.map(answer =>
decodeHtml(decodeURIComponent(answer))
);

const options = shuffle([
correctAnswer,
...incorrectAnswers
]);

const idSource = [
"opentdb",
"science",
difficulty,
question,
correctAnswer
].join("|");

const id = await createId(idSource);

questions.push({
id: `opentdb-${id}`,
category: "science",
difficulty: difficulty,
question: question,
options: options,
correctAnswer: correctAnswer,
explanation: "",
source: "Open Trivia DB",
sourceId: id,
isRemote: true,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
});
}

if (questions.length === 0) {
return json({
ok: false,
error: "NO_QUESTIONS",
message: "No valid science questions were returned."
}, 404, request);
}

return json({
ok: true,
category: "science",
difficulty: difficulty,
limit: limit,
source: "Open Trivia DB",
questions: questions
}, 200, request);
}

// General Knowledge → Open Trivia DB General Knowledge (category 9)
if (category === "general") {
const apiUrl = new URL(OPEN_TRIVIA_URL);

apiUrl.searchParams.set("amount", String(limit));
apiUrl.searchParams.set("category", "9");
apiUrl.searchParams.set("difficulty", difficulty);
apiUrl.searchParams.set("type", "multiple");
apiUrl.searchParams.set("encode", "url3986");

let response;

try {
response = await fetch(apiUrl.toString(), {
signal: AbortSignal.timeout(8000)
});
} catch (error) {
return json({
ok: false,
error: "PROVIDER_TIMEOUT",
message: "General Knowledge question provider timed out."
}, 504, request);
}

if (!response.ok) {
return json({
ok: false,
error: "PROVIDER_UNAVAILABLE",
message: "General Knowledge question provider is unavailable."
}, 503, request);
}

let data;

try {
data = await response.json();
} catch (error) {
return json({
ok: false,
error: "PROVIDER_UNAVAILABLE",
message: "Invalid response from question provider."
}, 503, request);
}

if (data.response_code === 5) {
return json({
ok: false,
error: "RATE_LIMITED",
message: "Question provider rate limit reached."
}, 429, request);
}

if (data.response_code === 1) {
return json({
ok: false,
error: "NO_QUESTIONS",
message: "Not enough General Knowledge questions are available."
}, 404, request);
}

if (data.response_code !== 0 || !Array.isArray(data.results)) {
return json({
ok: false,
error: "PROVIDER_UNAVAILABLE",
message: "Question provider returned an unexpected response."
}, 503, request);
}

const questions = [];

for (const item of data.results) {
if (
item.type !== "multiple" ||
item.difficulty !== difficulty ||
!item.question ||
!item.correct_answer ||
!Array.isArray(item.incorrect_answers) ||
item.incorrect_answers.length !== 3
) {
continue;
}

const question = decodeHtml(
decodeURIComponent(item.question)
);

const correctAnswer = decodeHtml(
decodeURIComponent(item.correct_answer)
);

const incorrectAnswers = item.incorrect_answers.map(answer =>
decodeHtml(decodeURIComponent(answer))
);

const options = shuffle([
correctAnswer,
...incorrectAnswers
]);

const idSource = [
"opentdb",
"general",
difficulty,
question,
correctAnswer
].join("|");

const id = await createId(idSource);

questions.push({
id: `opentdb-${id}`,
category: "general",
difficulty: difficulty,
question: question,
options: options,
correctAnswer: correctAnswer,
explanation: "",
source: "Open Trivia DB",
sourceId: id,
isRemote: true,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
});
}

if (questions.length === 0) {
return json({
ok: false,
error: "NO_QUESTIONS",
message: "No valid General Knowledge questions were returned."
}, 404, request);
}

return json({
ok: true,
category: "general",
difficulty: difficulty,
limit: limit,
source: "Open Trivia DB",
questions: questions
}, 200, request);
}

if (category === "current_affairs") {
return json({
ok: false,
error: "CURRENT_AFFAIRS_PHASE3_NOT_CONNECTED",
message: "Current Affairs is temporarily disconnected from the NewsData provider while the fact-first question system is being implemented."
}, 503, request);
}

if (category === "news_quiz") {
try {
const module = await import("./news-quiz/index.js");
const result = await module.getNewsQuizQuestions(env, difficulty, limit);
if (!result.questions.length) return json({ok:false,error:"NO_QUESTIONS",message:"No usable News Quiz questions were returned."},404,request);
return json({ok:true,category:"news_quiz",difficulty,limit,source:result.source,questions:result.questions},200,request);
} catch (error) {
const code = error instanceof Error ? error.message : "NEWSDATA_UNAVAILABLE";
const status = code === "NEWSDATA_AUTH_FAILED" ? 401 : code === "NEWSDATA_RATE_LIMITED" ? 429 : code === "NEWSDATA_TIMEOUT" ? 504 : code === "NEWSDATA_API_KEY_NOT_CONFIGURED" ? 500 : 503;
return json({ok:false,error:code,message:"News Quiz news source is unavailable right now.",diagnostic:{provider:"NewsData.io",product:"news_quiz",stage:"fetch",detail:code}},status,request);
}
}

if (category === "africa_nigeria") {
let countryPayload;

try {
countryPayload = await fetchAfricaCountries(env);
} catch (error) {
const code = error instanceof Error ? error.message : "AFRICA_API_UNAVAILABLE";
const status = code === "AFRICA_API_RATE_LIMITED" ? 429 : 503;

return json({
ok: false,
error: code,
message: "Africa data provider is unavailable right now."
}, status, request);
}

const countries = Array.isArray(countryPayload?.countries)
? countryPayload.countries
: [];

const generatedQuestions = buildAfricaQuestions(countries, difficulty);

if (generatedQuestions.length === 0) {
return json({
ok: false,
error: "NO_QUESTIONS",
message: "No valid Africa & Nigeria questions could be generated from the current country data."
}, 404, request);
}

return json({
ok: true,
category: "africa_nigeria",
difficulty,
limit,
source: "Africa API",
generatedFromFacts: true,
factCountryCount: countries.length,
generatedQuestionCount: generatedQuestions.length,
questions: generatedQuestions.slice(0, limit)
}, 200, request);
}

// Other categories are not connected to an external provider yet.
return json({
ok: true,
category: category,
difficulty: difficulty,
limit: limit,
questions: []
}, 200, request);
}

return new Response(
"Daily Quiz & Challenge intermediary is running.",
{ headers: { "Access-Control-Allow-Origin": request.headers.get("Origin") || "*" } }
);

}
};
