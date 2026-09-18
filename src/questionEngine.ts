export type QuizQuestion = {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  source: string;
  sourceId?: string;
  isRemote: boolean;
  createdAt: string;
  updatedAt: string;
};

type LocalQuestion = { q: string; a: string; o: string[] };

const DB_NAME = 'DailyQuizDB';
const DB_VERSION = 2;
const QUESTION_STORE = 'questions';
const HISTORY_STORE = 'recent_history';
const WORKER_URL = 'https://daily-quiz-intermidiary.richardoha25.workers.dev';
const RECENT_LIMIT = 60;

const categoryKey = (name: string) => {
  if (name === 'General Knowledge') return 'general';
  if (name === 'Science') return 'science';
  if (name === 'Bible') return 'bible';
  if (name === 'Africa & Nigeria') return 'africa_nigeria';
  return 'current_affairs';
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const oldVersion = request.transaction?.db.version ? request.transaction.db.version : 0;
      if (!db.objectStoreNames.contains(QUESTION_STORE)) {
        const store = db.createObjectStore(QUESTION_STORE, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('difficulty', 'difficulty', { unique: false });
        store.createIndex('categoryDifficulty', ['category', 'difficulty'], { unique: false });
      }
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('questionId', 'questionId', { unique: false });
        store.createIndex('usedAt', 'usedAt', { unique: false });
      }
      if (oldVersion < 2) {
        db.transaction?.objectStore(QUESTION_STORE).clear();
        db.transaction?.objectStore(HISTORY_STORE).clear();
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open question database'));
  });
}

async function saveQuestions(questions: QuizQuestion[]) {
  if (!questions.length) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(QUESTION_STORE, 'readwrite');
    const store = tx.objectStore(QUESTION_STORE);
    questions.forEach((q) => store.put(q));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Unable to save questions'));
  }).finally(() => db.close());
}

async function readQuestions(category: string): Promise<QuizQuestion[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUESTION_STORE, 'readonly');
    const request = tx.objectStore(QUESTION_STORE).index('category').getAll(category);
    request.onsuccess = () => { db.close(); resolve(request.result as QuizQuestion[]); };
    request.onerror = () => { db.close(); reject(request.error || new Error('Unable to read questions')); };
  });
}

async function readRecentIds(category: string): Promise<Set<string>> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly');
    const request = tx.objectStore(HISTORY_STORE).getAll();
    request.onsuccess = () => {
      const rows = (request.result as { questionId: string; category: string; usedAt: number }[])
        .filter((x) => x.category === category)
        .sort((a, b) => b.usedAt - a.usedAt)
        .slice(0, RECENT_LIMIT);
      db.close();
      resolve(new Set(rows.map((x) => x.questionId)));
    };
    request.onerror = () => { db.close(); reject(request.error || new Error('Unable to read question history')); };
  });
}

async function recordHistory(category: string, questions: QuizQuestion[]) {
  if (!questions.length) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite');
    const store = tx.objectStore(HISTORY_STORE);
    const usedAt = Date.now();
    questions.forEach((q) => store.add({ questionId: q.id, category, usedAt }));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Unable to record question history'));
  }).finally(() => db.close());
}

async function fetchRemote(category: string, difficulty: 'easy' | 'medium' | 'hard', limit = 20): Promise<QuizQuestion[]> {
  const url = `${WORKER_URL}/api/questions?category=${encodeURIComponent(category)}&difficulty=${difficulty}&limit=${limit}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  const contentType = response.headers.get('content-type') || 'unknown';
  const body = await response.text();
  const preview = body.slice(0, 180).replace(/\s+/g, ' ').trim();

  if (!response.ok) {
    throw new Error(`Question API returned ${response.status} (${contentType})${preview ? `: ${preview}` : ''}`);
  }

  let data: any;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`Question API returned non-JSON (${response.status}, ${contentType})${preview ? `: ${preview}` : ''}`);
  }

  if (!data?.ok || !Array.isArray(data.questions)) {
    throw new Error('Question API returned an invalid response format.');
  }

  return data.questions.filter((q: any) =>
    q && typeof q.id === 'string' && typeof q.question === 'string' &&
    Array.isArray(q.options) && q.options.length === 4 &&
    typeof q.correctAnswer === 'string' && q.options.includes(q.correctAnswer)
  ).map((q: any) => ({
    id: q.id,
    category: q.category || category,
    difficulty: q.difficulty || difficulty,
    question: q.question,
    options: [...q.options],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    source: q.source || 'remote',
    sourceId: q.sourceId,
    isRemote: true,
    createdAt: q.createdAt || new Date().toISOString(),
    updatedAt: q.updatedAt || new Date().toISOString(),
  }));
}

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const selectMixed = (pool: QuizQuestion[], recent: Set<string>, count = 10) => {
  // Never fall back to the full pool here. Recent questions are intentionally
  // excluded so an online replenishment is required when the fresh cache is
  // exhausted.
  const fresh = pool.filter((q) => !recent.has(q.id));
  const wanted: Record<QuizQuestion['difficulty'], number> = { easy: 3, medium: 4, hard: 3 };
  const selected: QuizQuestion[] = [];

  (['easy', 'medium', 'hard'] as const).forEach((difficulty) => {
    const candidates = shuffle(fresh.filter((q) => q.difficulty === difficulty));
    selected.push(...candidates.slice(0, wanted[difficulty]));
  });

  if (selected.length < count) {
    const used = new Set(selected.map((q) => q.id));
    selected.push(...shuffle(fresh.filter((q) => !used.has(q.id))).slice(0, count - selected.length));
  }

  return shuffle(selected).slice(0, count);
};

export async function getQuizQuestions(categoryName: string, _localBank: LocalQuestion[] = [], count = 10): Promise<QuizQuestion[]> {
  const category = categoryKey(categoryName);

  let cached: QuizQuestion[] = [];
  try { cached = await readQuestions(category); } catch { cached = []; }

  if (category !== 'science') {
    throw new Error(`NO_ONLINE_SOURCE:${category}`);
  }

  const difficulties = ['easy', 'medium', 'hard'] as const;
  const wanted: Record<QuizQuestion['difficulty'], number> = { easy: 3, medium: 4, hard: 3 };

  const dedupe = (questions: QuizQuestion[]) =>
    Array.from(new Map(questions.map((q) => [q.id, q])).values());

  const recent = await readRecentIds(category).catch(() => new Set<string>());

  // Replenish based on questions that are actually fresh, not merely cached.
  // This is the key distinction that prevents the app from getting stuck on
  // previously answered questions.
  let deduped = dedupe(cached);
  let fresh = deduped.filter((q) => !recent.has(q.id));

  const online = typeof navigator === 'undefined' || navigator.onLine !== false;

  if (fresh.length < count && online) {
    for (const difficulty of difficulties) {
      const freshForDifficulty = fresh.filter((q) => q.difficulty === difficulty).length;
      if (freshForDifficulty >= wanted[difficulty]) continue;

      try {
        const incoming = await fetchRemote(category, difficulty, 20);
        if (incoming.length) {
          await saveQuestions(incoming);
          cached = [...cached, ...incoming];
          deduped = dedupe(cached);
          fresh = deduped.filter((q) => !recent.has(q.id));
        }
      } catch {
        // Keep usable cached questions if the provider temporarily fails.
        // We only fail below if there still are not enough fresh questions.
      }
    }
  }

  const selected = selectMixed(deduped, recent, count);

  if (selected.length < count) {
    throw new Error(online
      ? `NOT_ENOUGH_FRESH_QUESTIONS:${category}`
      : `NOT_ENOUGH_CACHED_QUESTIONS:${category}`);
  }

  const finalQuestions = selected.slice(0, count);
  await recordHistory(category, finalQuestions);
  return finalQuestions;
}
