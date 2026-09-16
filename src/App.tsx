import { useEffect, useMemo, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { getQuizQuestions } from './questionEngine';

type Q = { q: string; a: string; o: string[] };
type Cat = { name: string; icon: string; key: string };

const all: Cat[] = [
  { name: 'General Knowledge', icon: '🧠', key: 'general' },
  { name: 'Bible', icon: '📖', key: 'bible' },
  { name: 'Africa & Nigeria', icon: '🌍', key: 'africa_nigeria' },
  { name: 'Science', icon: '🔬', key: 'science' },
  { name: 'Current Affairs', icon: '📰', key: 'current_affairs' },
];

const BANNER_ID = 'ca-app-pub-8496227439538798/2899800506';
const INTERSTITIAL_ID = 'ca-app-pub-8496227439538798/8159866041';
const REWARDED_ID = 'ca-app-pub-8496227439538798/9137905794';
const APP_OPEN_ID = 'ca-app-pub-8496227439538798/2455637861';
const REWARDED_INTERSTITIAL_ID = 'ca-app-pub-8496227439538798/6852855908';
const AD_MAX_AGE = 55 * 60 * 1000;
const APP_OPEN_MAX_AGE = 3.5 * 60 * 60 * 1000;
const APP_OPEN_GAP = 15 * 60 * 1000;
let adMobInitPromise: Promise<void> | null = null;
let interstitialReady = false, rewardedReady = false, rewardedInterstitialReady = false, appOpenReady = false;
let interstitialAt = 0, rewardedAt = 0, rewardedInterstitialAt = 0, appOpenAt = 0, lastAppOpenShownAt = 0;
let bannerShown = false, appOpenShowing = false;
const fresh = (ready: boolean, at: number, maxAge = AD_MAX_AGE) => ready && at > 0 && Date.now() - at < maxAge;

async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  if (!adMobInitPromise) adMobInitPromise = AdMob.initialize().catch((e) => { adMobInitPromise = null; throw e; });
  await adMobInitPromise;
}
async function showBanner() {
  if (!Capacitor.isNativePlatform()) return;
  try { await initAdMob(); if (bannerShown) { try { await AdMob.resumeBanner(); return; } catch { bannerShown = false; } } await AdMob.showBanner({ adId: BANNER_ID, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: false } as BannerAdOptions); bannerShown = true; } catch { setTimeout(() => void showBanner(), 10000); }
}
async function preloadInterstitial() { if (!Capacitor.isNativePlatform() || fresh(interstitialReady, interstitialAt)) return fresh(interstitialReady, interstitialAt); try { await initAdMob(); await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID, isTesting: false }); interstitialReady = true; interstitialAt = Date.now(); return true; } catch { interstitialReady = false; interstitialAt = 0; return false; } }
async function showInterstitial() { if (!Capacitor.isNativePlatform()) return false; try { await initAdMob(); if (!(await preloadInterstitial())) return false; await AdMob.showInterstitial(); interstitialReady = false; interstitialAt = 0; void preloadInterstitial(); return true; } catch { interstitialReady = false; interstitialAt = 0; return false; } }
async function preloadRewarded() { if (!Capacitor.isNativePlatform() || fresh(rewardedReady, rewardedAt)) return fresh(rewardedReady, rewardedAt); try { await initAdMob(); await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID, isTesting: false }); rewardedReady = true; rewardedAt = Date.now(); return true; } catch { rewardedReady = false; rewardedAt = 0; return false; } }
async function showRewarded() { if (!Capacitor.isNativePlatform()) return false; try { await initAdMob(); if (!(await preloadRewarded())) return false; const reward = await AdMob.showRewardVideoAd(); rewardedReady = false; rewardedAt = 0; void preloadRewarded(); return Number(reward?.amount || 0) > 0; } catch { rewardedReady = false; rewardedAt = 0; return false; } }
async function preloadRewardedInterstitial() { if (!Capacitor.isNativePlatform() || fresh(rewardedInterstitialReady, rewardedInterstitialAt)) return fresh(rewardedInterstitialReady, rewardedInterstitialAt); try { await initAdMob(); await AdMob.prepareRewardInterstitialAd({ adId: REWARDED_INTERSTITIAL_ID, isTesting: false }); rewardedInterstitialReady = true; rewardedInterstitialAt = Date.now(); return true; } catch { rewardedInterstitialReady = false; rewardedInterstitialAt = 0; return false; } }
async function preloadAppOpen() { if (!Capacitor.isNativePlatform() || fresh(appOpenReady, appOpenAt, APP_OPEN_MAX_AGE)) return fresh(appOpenReady, appOpenAt, APP_OPEN_MAX_AGE); try { await initAdMob(); await AdMob.loadAppOpen({ adId: APP_OPEN_ID }); appOpenReady = true; appOpenAt = Date.now(); return true; } catch { appOpenReady = false; appOpenAt = 0; return false; } }
async function showAppOpenIfAppropriate() { if (!Capacitor.isNativePlatform() || appOpenShowing || Date.now() - lastAppOpenShownAt < APP_OPEN_GAP) return false; try { await initAdMob(); if (!(await preloadAppOpen())) return false; const loaded = await AdMob.isAppOpenLoaded({ adId: APP_OPEN_ID }); if (!loaded.value) return false; appOpenShowing = true; await AdMob.showAppOpen({ adId: APP_OPEN_ID }); lastAppOpenShownAt = Date.now(); appOpenReady = false; appOpenAt = 0; void preloadAppOpen(); return true; } catch { return false; } finally { appOpenShowing = false; } }

function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'result'>('home');
  const [cat, setCat] = useState(3);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [picked, setPicked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(Number(localStorage.getItem('dq-streak') || 0));
  const [best, setBest] = useState(Number(localStorage.getItem('dq-best') || 0));
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);
  const interstitialShown = useRef(false);
  const initialForegroundHandled = useRef(false);
  const bank = useMemo(() => questions, [questions]);

  useEffect(() => {
    let cancelled = false;
    const startAds = async () => { try { await initAdMob(); if (cancelled) return; void showBanner(); void preloadInterstitial(); void preloadRewarded(); void preloadRewardedInterstitial(); void preloadAppOpen(); if (!initialForegroundHandled.current) { initialForegroundHandled.current = true; setTimeout(() => { if (!cancelled) void showAppOpenIfAppropriate(); }, 1200); } } catch {} };
    void startAds();
    const visible = () => { if (document.visibilityState !== 'visible' || cancelled) return; void showBanner(); void preloadInterstitial(); void preloadRewarded(); void preloadRewardedInterstitial(); void preloadAppOpen(); setTimeout(() => { if (!cancelled) void showAppOpenIfAppropriate(); }, 500); };
    document.addEventListener('visibilitychange', visible); window.addEventListener('focus', visible);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', visible); window.removeEventListener('focus', visible); };
  }, []);

  useEffect(() => { if (screen === 'result' && !interstitialShown.current) { interstitialShown.current = true; const t = setTimeout(() => void showInterstitial(), 900); return () => clearTimeout(t); } if (screen !== 'result') { interstitialShown.current = false; setRewardClaimed(false); } }, [screen]);

  const start = async (c: number) => {
    setCat(c); setQuestions([]); setIdx(0); setScore(0); setTime(15); setPicked(null); setRewardClaimed(false); setError(''); setLoading(true); setScreen('quiz');
    try {
      const selected = await getQuizQuestions(all[c].name, [], 10);
      setQuestions(selected.map((q) => ({ q: q.question, a: q.correctAnswer, o: q.options })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to prepare the quiz.');
      setQuestions([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (screen !== 'quiz' || picked || loading || !questions.length) return;
    const t = setInterval(() => setTime((x) => { if (x <= 1) { clearInterval(t); answer(''); return 0; } return x - 1; }), 1000);
    return () => clearInterval(t);
  }, [screen, idx, picked, loading, questions.length]);

  const answer = (v: string) => {
    if (picked || loading || !questions[idx]) return;
    const ok = v === questions[idx].a; const ns = score + (ok ? 10 : 0); setScore(ns); setPicked(v || 'timeout');
    setTimeout(() => { if (idx === 9) { const nb = Math.max(best, ns); setBest(nb); localStorage.setItem('dq-best', String(nb)); const s = streak + 1; setStreak(s); localStorage.setItem('dq-streak', String(s)); setScreen('result'); } else { setIdx((x) => x + 1); setTime(15); setPicked(null); } }, 650);
  };

  const reset = () => { setScreen('home'); setPicked(null); setError(''); setLoading(false); setQuestions([]); };
  const claimReward = async () => { if (rewardClaimed || rewardLoading) return; setRewardLoading(true); try { if (await showRewarded()) { const newScore = score + 20; setScore(newScore); setRewardClaimed(true); const nb = Math.max(best, newScore); setBest(nb); localStorage.setItem('dq-best', String(nb)); } } finally { setRewardLoading(false); } };

  return <div className="app">
    <header><div className="brand">⚡ DAILY QUIZ</div><div className="stats"><span>🔥 {streak}</span><span>🏆 {best}</span></div></header>
    {screen === 'home' && <main><section className="hero"><div className="pill">DAILY CHALLENGE</div><h1>Test your mind.<br /><em>Beat your score.</em></h1><p>10 questions · 15 seconds each · 100 points</p></section><h2>Choose a category</h2><div className="grid">{all.map((c, i) => <button className="cat" key={c.key} onClick={() => void start(i)}><span>{c.icon}</span><div><b>{c.name}</b><small>{c.name === 'Science' ? 'Online questions' : 'Online source coming next'}</small></div><strong>›</strong></button>)}</div><div className="info"><b>🌐 Online quiz system</b><span>Questions are fetched online and saved securely in your local question cache for future quizzes.</span></div></main>}
    {screen === 'quiz' && <main><div className="quiztop"><button onClick={reset}>← Exit</button><span>{questions.length ? `${idx + 1} / 10` : '— / 10'}</span><b>🔥 {streak}</b></div><div className="progress"><i style={{ width: `${questions.length ? ((idx + 1) / 10) * 100 : 0}%` }} /></div>{loading ? <section className="question"><div className="qcat">{all[cat].icon} {all[cat].name}</div><h1>Getting your quiz online…</h1><p>Checking the online question source and your saved question cache.</p></section> : error ? <section className="question"><div className="qcat">{all[cat].icon} {all[cat].name}</div><h1>Quiz unavailable</h1><p>{error}</p><button className="secondary" onClick={() => void start(cat)}>Try Again</button></section> : <><div className="timer">{time}s</div><section className="question"><div className="qcat">{all[cat].icon} {all[cat].name}</div><h1>{questions[idx]?.q}</h1><div className="answers">{questions[idx]?.o.map((o) => <button key={o} disabled={!!picked} className={picked ? (o === questions[idx].a ? 'correct' : o === picked ? 'wrong' : '') : ''} onClick={() => answer(o)}>{o}</button>)}</div></section></>}</main>}
    {screen === 'result' && <main className="result"><div className="resulticon">{score >= 80 ? '🏆' : score >= 50 ? '⭐' : '💪'}</div><div className="pill">QUIZ COMPLETE</div><h1>{score} / 100</h1><p>{score >= 80 ? 'Excellent work!' : score >= 50 ? 'Good job!' : 'Keep practicing!'}</p><div className="resultstats"><div><b>{Math.floor(score / 10)}</b><span>Correct</span></div><div><b>10</b><span>Questions</span></div><div><b>🔥 {streak}</b><span>Streak</span></div></div>{!rewardClaimed && <button className="primary" onClick={claimReward} disabled={rewardLoading}>{rewardLoading ? '⏳ Loading Ad...' : '🎬 Watch Ad for +20 Bonus Points'}</button>}{rewardClaimed && <p style={{ color: '#4ade80' }}>✅ Bonus claimed! +20 points</p>}<button className="primary" onClick={() => void start(cat)}>Play Again</button><button className="secondary" onClick={reset}>Choose Another Category</button></main>}
    <footer>Daily Quiz & Challenge · Version 1.1 · Online question engine · Ads help keep the quiz free.</footer>
  </div>;
}

export default App;
