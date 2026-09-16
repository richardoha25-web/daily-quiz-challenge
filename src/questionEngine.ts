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
const DB_VERSION = 1;
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

const makeLocalId = (category: string, question: LocalQuestion) => {
  const raw = `${category}|${question.q}|${question.a}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `local-${(hash >>> 0).toString(16)}`;
};

const normalizeLocal = (category: string, q: LocalQuestion, index: number): QuizQuestion => {
  const now = new Date().toISOString();
  return {
    id: makeLocalId(category, q),
    category,
    difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
    question: q.q,
    options: [...q.o],
    correctAnswer: q.a,
    source: 'Daily Quiz & Challenge local bank',
    isRemote: false,
    createdAt: now,
    updatedAt: now,
  };
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
  if (!response.ok) throw new Error(`Question API returned ${response.status}`);
  const data = await response.json();
  if (!data?.ok || !Array.isArray(data.questions)) return [];
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
  const fresh = pool.filter((q) => !recent.has(q.id));
  const source = fresh.length >= count ? fresh : pool;
  const wanted: Record<QuizQuestion['difficulty'], number> = { easy: 3, medium: 4, hard: 3 };
  const selected: QuizQuestion[] = [];

  (['easy', 'medium', 'hard'] as const).forEach((difficulty) => {
    const candidates = shuffle(source.filter((q) => q.difficulty === difficulty));
    selected.push(...candidates.slice(0, wanted[difficulty]));
  });

  if (selected.length < count) {
    const used = new Set(selected.map((q) => q.id));
    selected.push(...shuffle(source.filter((q) => !used.has(q.id))).slice(0, count - selected.length));
  }
  return shuffle(selected).slice(0, count);
};

export async function getQuizQuestions(categoryName: string, localBank: LocalQuestion[], count = 10): Promise<QuizQuestion[]> {
  const category = categoryKey(categoryName);
  const local = localBank.map((q, i) => normalizeLocal(category, q, i));

  try { await saveQuestions(local); } catch { /* local bank remains available in memory */ }

  let cached: QuizQuestion[] = [];
  try { cached = await readQuestions(category); } catch { cached = []; }

  if (category === 'science') {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    const missing = difficulties.filter((d) => cached.filter((q) => q.difficulty === d).length < 5);
    for (const difficulty of missing) {
      try {
        const fresh = await fetchRemote(category, difficulty, 20);
        if (fresh.length) {
          try { await saveQuestions(fresh); } catch {}
          cached = [...cached, ...fresh];
        }
      } catch { /* controlled fallback to cache/local */ }
    }
  }

  const deduped = Array.from(new Map([...cached, ...local].map((q) => [q.id, q])).values());
  const recent = await readRecentIds(category).catch(() => new Set<string>());
  const selected = selectMixed(deduped, recent, count);

  if (selected.length < count) {
    const fallback = shuffle(deduped.filter((q) => !selected.some((s) => s.id === q.id)));
    selected.push(...fallback.slice(0, count - selected.length));
  }

  const finalQuestions = selected.slice(0, count);
  try { await recordHistory(category, finalQuestions); } catch {}
  return finalQuestions;
}
