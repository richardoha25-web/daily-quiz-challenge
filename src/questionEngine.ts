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
const DB_VERSION = 3;
const QUESTION_STORE = 'questions';
const HISTORY_STORE = 'recent_history';
const PRODUCTION_WORKER_URL = 'https://daily-quiz-intermidiary.richardoha25.workers.dev';
const AFRICA_NIGERIA_TEST_WORKER_URL =
  'https://africa-nigeria-poc-daily-quiz-intermidiary.richardoha25.workers.dev';

const workerUrlForCategory = (category: string) =>
  category === 'africa_nigeria'
    ? AFRICA_NIGERIA_TEST_WORKER_URL
    : PRODUCTION_WORKER_URL;
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

      if (oldVersion >= 2 && db.objectStoreNames.contains(QUESTION_STORE)) {
        db.deleteObjectStore(QUESTION_STORE);
      }

      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('questionId', 'questionId', { unique: false });
        store.createIndex('usedAt', 'usedAt', { unique: false });
      }

      if (oldVersion < 2 && db.objectStoreNames.contains(HISTORY_STORE)) {
        db.transaction?.objectStore(HISTORY_STORE).clear();
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open question database'));
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

    request.onerror = () => {
      db.close();
      reject(request.error || new Error('Unable to read question history'));
    };
  });
}

async function recordHistory(category: string, questions: QuizQuestion[]) {
  if (!questions.length) return;

  const db = await openDb();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite');
    const store = tx.objectStore(HISTORY_STORE);
    const usedAt = Date.now();

    questions.forEach((q) => store.add({
      questionId: q.id,
      category,
      usedAt,
    }));

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Unable to record question history'));
  }).finally(() => db.close());
}

async function fetchRemote(
  category: string,
  difficulty: 'easy' | 'medium' | 'hard',
  limit = 20
): Promise<QuizQuestion[]> {
  const url =
    workerUrlForCategory(category) +
    '/api/questions?category=' +
    encodeURIComponent(category) +
    '&difficulty=' +
    difficulty +
    '&limit=' +
    limit;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  const contentType = response.headers.get('content-type') || 'unknown';
  const body = await response.text();
  const preview = body.slice(0, 180).replace(/\s+/g, ' ').trim();

  if (!response.ok) {
    throw new Error(
      'Question API returned ' +
      response.status +
      ' (' +
      contentType +
      ')' +
      (preview ? ': ' + preview : '')
    );
  }

  let data: any;

  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(
      'Question API returned non-JSON (' +
      response.status +
      ', ' +
      contentType +
      ')' +
      (preview ? ': ' + preview : '')
    );
  }

  if (!data?.ok || !Array.isArray(data.questions)) {
    throw new Error('Question API returned an invalid response format.');
  }

  return data.questions
    .filter((q: any) =>
      q &&
      typeof q.id === 'string' &&
      typeof q.question === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'string' &&
      q.options.includes(q.correctAnswer)
    )
    .map((q: any) => ({
      id: q.id,
      category: q.category || category,
      difficulty: q.difficulty || difficulty,
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      source: q.source || 'remote',
      sourceId: q.sourceId,
      isRemote: q.isRemote ?? true,
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

const selectMixed = (pool: QuizQuestion[], count = 10) => {
  const wanted: Record<QuizQuestion['difficulty'], number> = {
    easy: 3,
    medium: 4,
    hard: 3,
  };
  const selected: QuizQuestion[] = [];

  (['easy', 'medium', 'hard'] as const).forEach((difficulty) => {
    const candidates = shuffle(pool.filter((q) => q.difficulty === difficulty));
    selected.push(...candidates.slice(0, wanted[difficulty]));
  });

  if (selected.length < count) {
    const used = new Set(selected.map((q) => q.id));
    selected.push(
      ...shuffle(pool.filter((q) => !used.has(q.id))).slice(
        0,
        count - selected.length
      )
    );
  }

  return shuffle(selected).slice(0, count);
};

export async function getQuizQuestions(
  categoryName: string,
  _localBank: LocalQuestion[] = [],
  count = 10
): Promise<QuizQuestion[]> {
  const category = categoryKey(categoryName);

  if (category !== 'science' && category !== 'general' && category !== 'africa_nigeria') {
    throw new Error('NO_ONLINE_SOURCE:' + category);
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('INTERNET_REQUIRED:' + category);
  }

  const recent = await readRecentIds(category).catch(() => new Set<string>());
  const difficulties = ['easy', 'medium', 'hard'] as const;
  const wanted: Record<QuizQuestion['difficulty'], number> = {
    easy: 3,
    medium: 4,
    hard: 3,
  };

  const collected = new Map<string, QuizQuestion>();
  const MAX_ATTEMPTS_PER_DIFFICULTY = 3;

  const collect = (questions: QuizQuestion[]) => {
    for (const question of questions) {
      if (!recent.has(question.id) && !collected.has(question.id)) {
        collected.set(question.id, question);
      }
    }
  };

  for (const difficulty of difficulties) {
    let attempts = 0;

    while (
      attempts < MAX_ATTEMPTS_PER_DIFFICULTY &&
      Array.from(collected.values()).filter((q) => q.difficulty === difficulty).length < wanted[difficulty]
    ) {
      attempts += 1;

      try {
        const incoming = await fetchRemote(category, difficulty, 20);
        const before = collected.size;
        collect(incoming);
        const added = collected.size - before;
        const availableForDifficulty = Array.from(collected.values())
          .filter((q) => q.difficulty === difficulty)
          .length;

        if (availableForDifficulty >= wanted[difficulty] || added === 0) {
          break;
        }
      } catch {
        break;
      }
    }
  }

  const selected = selectMixed(Array.from(collected.values()), count);

  if (selected.length < count) {
    throw new Error('NOT_ENOUGH_FRESH_QUESTIONS:' + category);
  }

  const finalQuestions = selected.slice(0, count);
  await recordHistory(category, finalQuestions);
  return finalQuestions;
}
