import { useEffect, useMemo, useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdOptions,
} from '@capacitor-community/admob';

type Q = { q: string; a: string; o: string[] };
type Cat = { name: string; icon: string; facts: [string, string][] };

const facts = (rows: [string, string][]) => rows;

const makeQuestions = (rows: [string, string][], seed: number): Q[] =>
  rows.flatMap(([topic, answer], i) => {
    const answerPool = Array.from(new Set(rows.map(([, a]) => a))).filter((x) => x !== answer);
    const templates = [
      `What is the ${topic}?`,
      `Which answer correctly identifies the ${topic}?`,
      `Choose the correct answer for: ${topic}.`,
      `The correct answer for ${topic} is?`,
    ];
    return templates.map((q, j) => {
      const start = (i * 3 + j + seed) % answerPool.length;
      const wrong = [0, 1, 2].map((k) => answerPool[(start + k) % answerPool.length]);
      return { q, a: answer, o: [answer, ...wrong].sort(() => Math.random() - 0.5) };
    });
  });

const cats: Cat[] = [
  {
    name: 'General Knowledge',
    icon: '🧠',
    facts: facts([
      ['capital of France', 'Paris'],
      ['largest ocean', 'Pacific Ocean'],
      ['red planet', 'Mars'],
      ['fastest land animal', 'Cheetah'],
      ['largest continent', 'Asia'],
      ['currency of Japan', 'Yen'],
      ['author of Hamlet', 'William Shakespeare'],
      ['smallest prime number', '2'],
      ['largest mammal', 'Blue whale'],
      ['chemical symbol for gold', 'Au'],
      ['country shaped like a boot', 'Italy'],
      ['first person to walk on the Moon', 'Neil Armstrong'],
      ['hardest natural substance', 'Diamond'],
      ['planet famous for its rings', 'Saturn'],
      ['capital of Canada', 'Ottawa'],
      ['main language spoken in Brazil', 'Portuguese'],
      ['number of continents', '7'],
      ['instrument with black and white keys', 'Piano'],
      ['largest desert', 'Antarctic Desert'],
      ['primary gas in Earth atmosphere', 'Nitrogen'],
      ['square root of 81', '9'],
      ['currency of the United Kingdom', 'Pound sterling'],
      ['ocean between Africa and Australia', 'Indian Ocean'],
      ['days in a leap year', '366'],
      ['shape with three sides', 'Triangle'],
    ]),
  },
  {
    name: 'Bible',
    icon: '📖',
    facts: facts([
      ['first book of the Bible', 'Genesis'],
      ['last book of the Bible', 'Revelation'],
      ['man who built the ark', 'Noah'],
      ['first man', 'Adam'],
      ['first woman', 'Eve'],
      ['brother of Moses', 'Aaron'],
      ['mother of Jesus', 'Mary'],
      ['town where Jesus was born', 'Bethlehem'],
      ['river where Jesus was baptized', 'Jordan River'],
      ['disciple who betrayed Jesus', 'Judas Iscariot'],
      ['disciple who denied Jesus three times', 'Peter'],
      ['number of days Jesus fasted', '40'],
      ['young shepherd who became king', 'David'],
      ['giant defeated by David', 'Goliath'],
      ['wisest king of Israel', 'Solomon'],
      ['prophet swallowed by a great fish', 'Jonah'],
      ['place where Jesus was crucified', 'Golgotha'],
      ['first miracle in John', 'Turning water into wine'],
      ['number of apostles', '12'],
      ['prayer Jesus taught his disciples', "The Lord's Prayer"],
      ['short verse “Jesus wept” is found in', 'John'],
      ['disciple known as Thomas', 'Thomas'],
      ['mountain where Moses received the commandments', 'Mount Sinai'],
      ['sea Jesus calmed during a storm', 'Sea of Galilee'],
      ['father of many nations', 'Abraham'],
    ]),
  },
  {
    name: 'Africa & Nigeria',
    icon: '🌍',
    facts: facts([
      ['capital of Nigeria', 'Abuja'],
      ['largest city in Nigeria', 'Lagos'],
      ['Nigerian currency', 'Naira'],
      ['colors of Nigeria national flag', 'Green and white'],
      ['largest African country by area', 'Algeria'],
      ['longest river commonly listed in Africa', 'Nile'],
      ['largest desert in Africa', 'Sahara Desert'],
      ['capital of Ghana', 'Accra'],
      ['capital of Kenya', 'Nairobi'],
      ['capital of Egypt', 'Cairo'],
      ['South Africa executive capital', 'Pretoria'],
      ['official language of Nigeria', 'English'],
      ['year Nigeria gained independence', '1960'],
      ['date of Nigeria Democracy Day', 'June 12'],
      ['river that gives Nigeria its name', 'Niger River'],
      ['capital of Senegal', 'Dakar'],
      ['capital of Ethiopia', 'Addis Ababa'],
      ['highest mountain in Africa', 'Mount Kilimanjaro'],
      ['largest African lake by surface area', 'Lake Victoria'],
      ['country paired with Zambia at Victoria Falls', 'Zimbabwe'],
      ['Nigeria federal capital territory', 'Abuja'],
      ['Nigeria national football team nickname', 'Super Eagles'],
      ['cassava granules commonly eaten in Nigeria', 'Garri'],
      ['Nigeria internet country code', '.ng'],
      ['capital of Cameroon', 'Yaoundé'],
    ]),
  },
  {
    name: 'Science',
    icon: '🔬',
    facts: facts([
      ['planet closest to the Sun', 'Mercury'],
      ['force that attracts objects toward Earth', 'Gravity'],
      ['chemical symbol for oxygen', 'O'],
      ['boiling point of water at sea level in Celsius', '100°C'],
      ['freezing point of water in Celsius', '0°C'],
      ['center of an atom', 'Nucleus'],
      ['process plants use to make food', 'Photosynthesis'],
      ['organ that pumps blood', 'Heart'],
      ['largest organ of the human body', 'Skin'],
      ['gas humans need for respiration', 'Oxygen'],
      ['full name of DNA', 'Deoxyribonucleic acid'],
      ['unit of electric current', 'Ampere'],
      ['approximate speed of light in vacuum', '300,000 km/s'],
      ['number of bones in a typical adult human', '206'],
      ['red pigment in blood', 'Hemoglobin'],
      ['natural satellite of Earth', 'Moon'],
      ['pH of neutral water', '7'],
      ['energy stored in food', 'Chemical energy'],
      ['study of living things', 'Biology'],
      ['study of matter and its changes', 'Chemistry'],
      ['study of forces and motion', 'Physics'],
      ['organs mainly used for breathing', 'Lungs'],
      ['vitamin produced in skin through sunlight', 'Vitamin D'],
      ['liquid metal at room temperature', 'Mercury'],
      ['smallest unit of an element', 'Atom'],
    ]),
  },
];

const all = cats.map((c, i) => ({ ...c, questions: makeQuestions(c.facts, i) }));

// ===== REAL AdMob IDs =====
const BANNER_ID = 'ca-app-pub-8496227439538798/2899800506';
const INTERSTITIAL_ID = 'ca-app-pub-8496227439538798/8159866041';
const REWARDED_ID = 'ca-app-pub-8496227439538798/9137905794';

// ===== AdMob helpers =====
async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.initialize();
    console.log('[AdMob] initialized');
  } catch (e) {
    console.error('[AdMob] init failed', e);
  }
}

async function showHomeBanner() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    try { await AdMob.hideBanner(); } catch {}
    const options: BannerAdOptions = {
      adId: BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
    };
    await AdMob.showBanner(options);
    console.log('[AdMob] Banner requested');
  } catch (e) {
    console.error('[AdMob] Banner failed', e);
  }
}

async function hideBanner() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.hideBanner();
  } catch {
    // ignore
  }
}

async function showInterstitial() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const options: AdOptions = {
      adId: INTERSTITIAL_ID,
      isTesting: true,
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
    console.log('[AdMob] Interstitial shown');
  } catch (e) {
    console.error('[AdMob] Interstitial failed', e);
  }
}

async function showRewarded(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const options: AdOptions = {
      adId: REWARDED_ID,
      isTesting: true,
    };
    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();
    console.log('[AdMob] Rewarded finished');
    return true;
  } catch (e) {
    console.error('[AdMob] Rewarded failed', e);
    return false;
  }
}

function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'result'>('home');
  const [cat, setCat] = useState(0);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(Number(localStorage.getItem('dq-streak') || 0));
  const [best, setBest] = useState(Number(localStorage.getItem('dq-best') || 0));
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const interstitialShown = useRef(false);
  const bank = useMemo(() => all[cat].questions, [cat]);

  // Initialize AdMob once
  useEffect(() => {
    initAdMob();
  }, []);

  // Show / hide banner based on screen
  useEffect(() => {
    if (screen === 'home') {
      const t = setTimeout(() => showHomeBanner(), 500);
      return () => {
        clearTimeout(t);
        hideBanner();
      };
    } else {
      hideBanner();
    }
  }, [screen]);

  // Show Interstitial when entering result screen
  useEffect(() => {
    if (screen === 'result' && !interstitialShown.current) {
      interstitialShown.current = true;
      const t = setTimeout(() => showInterstitial(), 900);
      return () => clearTimeout(t);
    }
    if (screen !== 'result') {
      interstitialShown.current = false;
      setRewardClaimed(false);
    }
  }, [screen]);

  const start = (c: number) => {
    setCat(c);
    setQuestions([...all[c].questions].sort(() => Math.random() - 0.5).slice(0, 10));
    setIdx(0);
    setScore(0);
    setTime(15);
    setPicked(null);
    setRewardClaimed(false);
    setScreen('quiz');
  };

  useEffect(() => {
    if (screen !== 'quiz' || picked) return;
    const t = setInterval(
      () =>
        setTime((x) => {
          if (x <= 1) {
            clearInterval(t);
            answer('');
            return 0;
          }
          return x - 1;
        }),
      1000
    );
    return () => clearInterval(t);
  }, [screen, idx, picked]);

  const answer = (v: string) => {
    if (picked) return;
    const ok = v === questions[idx]?.a;
    const ns = score + (ok ? 10 : 0);
    setScore(ns);
    setPicked(v || 'timeout');
    setTimeout(() => {
      if (idx === 9) {
        const nb = Math.max(best, ns);
        setBest(nb);
        localStorage.setItem('dq-best', String(nb));
        const s = streak + 1;
        setStreak(s);
        localStorage.setItem('dq-streak', String(s));
        setScreen('result');
      } else {
        setIdx((x) => x + 1);
        setTime(15);
        setPicked(null);
      }
    }, 650);
  };

  const reset = () => {
    setScreen('home');
    setPicked(null);
    setRewardClaimed(false);
  };

  const claimReward = async () => {
    if (rewardClaimed) return;
    const watched = await showRewarded();
    if (watched) {
      const bonus = 20;
      const newScore = score + bonus;
      setScore(newScore);
      setRewardClaimed(true);
      const nb = Math.max(best, newScore);
      setBest(nb);
      localStorage.setItem('dq-best', String(nb));
    }
  };

  return (
    <div className="app">
      <header>
        <div className="brand">⚡ DAILY QUIZ</div>
        <div className="stats">
          <span>🔥 {streak}</span>
          <span>🏆 {best}</span>
        </div>
      </header>

      {screen === 'home' && (
        <main>
          <section className="hero">
            <div className="pill">DAILY CHALLENGE</div>
            <h1>
              Test your mind.
              <br />
              <em>Beat your score.</em>
            </h1>
            <p>10 questions · 15 seconds each · 100 points</p>
          </section>
          <h2>Choose a category</h2>
          <div className="grid">
            {all.map((c, i) => (
              <button className="cat" key={c.name} onClick={() => start(i)}>
                <span>{c.icon}</span>
                <div>
                  <b>{c.name}</b>
                  <small>{c.questions.length} questions</small>
                </div>
                <strong>›</strong>
              </button>
            ))}
          </div>
          <div className="info">
            <b>🎯 How it works</b>
            <span>Pick a category, answer 10 random questions and build your daily streak.</span>
          </div>
        </main>
      )}

      {screen === 'quiz' && (
        <main>
          <div className="quiztop">
            <button onClick={reset}>← Exit</button>
            <span>
              {idx + 1} / 10
            </span>
            <b>🔥 {streak}</b>
          </div>
          <div className="progress">
            <i style={{ width: `${((idx + 1) / 10) * 100}%` }} />
          </div>
          <div className="timer">{time}s</div>
          <section className="question">
            <div className="qcat">
              {all[cat].icon} {all[cat].name}
            </div>
            <h1>{questions[idx]?.q}</h1>
            <div className="answers">
              {questions[idx]?.o.map((o) => (
                <button
                  key={o}
                  disabled={!!picked}
                  className={
                    picked ? (o === questions[idx].a ? 'correct' : o === picked ? 'wrong' : '') : ''
                  }
                  onClick={() => answer(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {screen === 'result' && (
        <main className="result">
          <div className="resulticon">{score >= 80 ? '🏆' : score >= 50 ? '⭐' : '💪'}</div>
          <div className="pill">QUIZ COMPLETE</div>
          <h1>{score} / 100</h1>
          <p>{score >= 80 ? 'Excellent work!' : score >= 50 ? 'Good job!' : 'Keep practicing!'}</p>
          <div className="resultstats">
            <div>
              <b>{Math.floor(score / 10)}</b>
              <span>Correct</span>
            </div>
            <div>
              <b>10</b>
              <span>Questions</span>
            </div>
            <div>
              <b>🔥 {streak}</b>
              <span>Streak</span>
            </div>
          </div>

          {!rewardClaimed && (
            <button className="primary" onClick={claimReward} style={{ marginBottom: 12 }}>
              🎬 Watch Ad for +20 Bonus Points
            </button>
          )}
          {rewardClaimed && (
            <p style={{ color: '#4ade80', marginBottom: 12 }}>✅ Bonus claimed! +20 points</p>
          )}

          <button className="primary" onClick={() => start(cat)}>
            Play Again
          </button>
          <button className="secondary" onClick={reset}>
            Choose Another Category
          </button>
        </main>
      )}

      <footer>
        Daily Quiz & Challenge · Version 1 · {bank.length} questions in this category · Ads help keep
        the quiz free.
      </footer>
    </div>
  );
}

export default App;
