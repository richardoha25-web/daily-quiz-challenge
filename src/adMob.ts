import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

const BANNER_ID = 'ca-app-pub-8496227439538798/2899800506';
const INTERSTITIAL_ID = 'ca-app-pub-8496227439538798/8159866041';
const REWARDED_ID = 'ca-app-pub-8496227439538798/9137905794';
const APP_OPEN_ID = 'ca-app-pub-8496227439538798/2455637861';
const REWARDED_INTERSTITIAL_ID = 'ca-app-pub-8496227439538798/6852855908';

const MAX_AGE = 55 * 60 * 1000;
const APP_OPEN_MAX_AGE = 3.5 * 60 * 60 * 1000;
const APP_OPEN_GAP = 15 * 60 * 1000;

let initPromise: Promise<void> | null = null;
let interstitialPromise: Promise<boolean> | null = null;
let rewardedPromise: Promise<boolean> | null = null;
let rewardedInterstitialPromise: Promise<boolean> | null = null;
let appOpenPromise: Promise<boolean> | null = null;
let interstitialReady = false, rewardedReady = false, rewardedInterstitialReady = false, appOpenReady = false;
let interstitialAt = 0, rewardedAt = 0, rewardedInterstitialAt = 0, appOpenAt = 0;
let lastAppOpen = 0;
let bannerShown = false;
let appOpenShowing = false;
let retryTimers: Record<string, ReturnType<typeof setTimeout> | null> = { i: null, r: null, ri: null, ao: null, b: null };
let retryDelay: Record<string, number> = { i: 2000, r: 2000, ri: 2000, ao: 3000 };

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const fresh = (ready: boolean, at: number, age: number) => ready && at > 0 && Date.now() - at < age;

export async function initAds() {
  if (!Capacitor.isNativePlatform()) return;
  if (!initPromise) {
    initPromise = AdMob.initialize().catch(e => { initPromise = null; throw e; });
  }
  await initPromise;
}

function retry(kind: keyof typeof retryTimers, fn: () => void) {
  if (retryTimers[kind]) return;
  const delay = retryDelay[kind] || 10000;
  if (kind in retryDelay) retryDelay[kind] = Math.min(delay * 2, 60000);
  retryTimers[kind] = setTimeout(() => { retryTimers[kind] = null; fn(); }, delay);
}

export async function showBanner() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await initAds();
    if (bannerShown) { try { await AdMob.resumeBanner(); return; } catch { bannerShown = false; } }
    const options: BannerAdOptions = { adId: BANNER_ID, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: false };
    await AdMob.showBanner(options);
    bannerShown = true;
    retryDelay.b = 10000;
  } catch (e) { bannerShown = false; console.error('[AdMob] banner', e); retry('b', () => void showBanner()); }
}

export async function preloadInterstitial(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(interstitialReady, interstitialAt, MAX_AGE)) return true;
  if (interstitialPromise) return interstitialPromise;
  interstitialReady = false; interstitialAt = 0;
  interstitialPromise = (async () => {
    try { await initAds(); await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID, isTesting: false }); interstitialReady = true; interstitialAt = Date.now(); retryDelay.i = 2000; return true; }
    catch (e) { console.error('[AdMob] interstitial preload', e); retry('i', () => void preloadInterstitial(true)); return false; }
    finally { interstitialPromise = null; }
  })();
  return interstitialPromise;
}

export async function showInterstitial() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await initAds();
    const deadline = Date.now() + 8000;
    while (!fresh(interstitialReady, interstitialAt, MAX_AGE) && Date.now() < deadline) { await preloadInterstitial(); if (!fresh(interstitialReady, interstitialAt, MAX_AGE)) await sleep(500); }
    if (!fresh(interstitialReady, interstitialAt, MAX_AGE)) return false;
    await AdMob.showInterstitial(); interstitialReady = false; interstitialAt = 0; retryDelay.i = 2000; void preloadInterstitial(true); return true;
  } catch (e) { interstitialReady = false; interstitialAt = 0; console.error('[AdMob] interstitial show', e); retry('i', () => void preloadInterstitial(true)); return false; }
}

export async function preloadRewarded(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(rewardedReady, rewardedAt, MAX_AGE)) return true;
  if (rewardedPromise) return rewardedPromise;
  rewardedReady = false; rewardedAt = 0;
  rewardedPromise = (async () => {
    try { await initAds(); await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID, isTesting: false }); rewardedReady = true; rewardedAt = Date.now(); retryDelay.r = 2000; return true; }
    catch (e) { console.error('[AdMob] rewarded preload', e); retry('r', () => void preloadRewarded(true)); return false; }
    finally { rewardedPromise = null; }
  })();
  return rewardedPromise;
}

export async function showRewarded() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await initAds();
    const deadline = Date.now() + 10000;
    while (!fresh(rewardedReady, rewardedAt, MAX_AGE) && Date.now() < deadline) { await preloadRewarded(); if (!fresh(rewardedReady, rewardedAt, MAX_AGE)) await sleep(500); }
    if (!fresh(rewardedReady, rewardedAt, MAX_AGE)) return false;
    const reward = await AdMob.showRewardVideoAd(); rewardedReady = false; rewardedAt = 0; retryDelay.r = 2000; void preloadRewarded(true); return Number(reward?.amount || 0) > 0;
  } catch (e) { rewardedReady = false; rewardedAt = 0; console.error('[AdMob] rewarded show', e); retry('r', () => void preloadRewarded(true)); return false; }
}

export async function preloadRewardedInterstitial(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE)) return true;
  if (rewardedInterstitialPromise) return rewardedInterstitialPromise;
  rewardedInterstitialReady = false; rewardedInterstitialAt = 0;
  rewardedInterstitialPromise = (async () => {
    try { await initAds(); await AdMob.prepareRewardInterstitialAd({ adId: REWARDED_INTERSTITIAL_ID, isTesting: false }); rewardedInterstitialReady = true; rewardedInterstitialAt = Date.now(); retryDelay.ri = 2000; return true; }
    catch (e) { console.error('[AdMob] rewarded interstitial preload', e); retry('ri', () => void preloadRewardedInterstitial(true)); return false; }
    finally { rewardedInterstitialPromise = null; }
  })();
  return rewardedInterstitialPromise;
}

export async function showRewardedInterstitial() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await initAds();
    const deadline = Date.now() + 10000;
    while (!fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE) && Date.now() < deadline) { await preloadRewardedInterstitial(); if (!fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE)) await sleep(500); }
    if (!fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE)) return false;
    const reward = await AdMob.showRewardInterstitialAd(); rewardedInterstitialReady = false; rewardedInterstitialAt = 0; retryDelay.ri = 2000; void preloadRewardedInterstitial(true); return Number(reward?.amount || 0) > 0;
  } catch (e) { rewardedInterstitialReady = false; rewardedInterstitialAt = 0; console.error('[AdMob] rewarded interstitial show', e); retry('ri', () => void preloadRewardedInterstitial(true)); return false; }
}

export async function preloadAppOpen(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(appOpenReady, appOpenAt, APP_OPEN_MAX_AGE)) return true;
  if (appOpenPromise) return appOpenPromise;
  appOpenReady = false; appOpenAt = 0;
  appOpenPromise = (async () => {
    try { await initAds(); await AdMob.loadAppOpen({ adId: APP_OPEN_ID }); appOpenReady = true; appOpenAt = Date.now(); retryDelay.ao = 3000; return true; }
    catch (e) { console.error('[AdMob] app open preload', e); retry('ao', () => void preloadAppOpen(true)); return false; }
    finally { appOpenPromise = null; }
  })();
  return appOpenPromise;
}

export async function showAppOpenIfAppropriate() {
  if (!Capacitor.isNativePlatform() || appOpenShowing || Date.now() - lastAppOpen < APP_OPEN_GAP) return false;
  try {
    await initAds(); if (!(await preloadAppOpen())) return false;
    const loaded = await AdMob.isAppOpenLoaded({ adId: APP_OPEN_ID });
    if (!loaded.value) { appOpenReady = false; appOpenAt = 0; void preloadAppOpen(true); return false; }
    appOpenShowing = true; await AdMob.showAppOpen({ adId: APP_OPEN_ID }); lastAppOpen = Date.now(); appOpenReady = false; appOpenAt = 0; void preloadAppOpen(true); return true;
  } catch (e) { appOpenReady = false; appOpenAt = 0; console.error('[AdMob] app open show', e); retry('ao', () => void preloadAppOpen(true)); return false; }
  finally { appOpenShowing = false; }
}

export function recoverAds() {
  void initAds().then(() => { void showBanner(); void preloadInterstitial(); void preloadRewarded(); void preloadRewardedInterstitial(); void preloadAppOpen(); }).catch(() => undefined);
}
