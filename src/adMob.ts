import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

const PROD = {
  banner: 'ca-app-pub-8496227439538798/2899800506',
  interstitial: 'ca-app-pub-8496227439538798/8159866041',
  rewarded: 'ca-app-pub-8496227439538798/9137905794',
  appOpen: 'ca-app-pub-8496227439538798/2455637861',
  rewardedInterstitial: 'ca-app-pub-8496227439538798/6852855908',
};

const TEST = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  appOpen: 'ca-app-pub-3940256099942544/9257395921',
  rewardedInterstitial: 'ca-app-pub-3940256099942544/535484759',
};

const IS_TESTING = import.meta.env.VITE_ADMOB_TEST_MODE === 'true';
const BANNER_ID = IS_TESTING ? TEST.banner : PROD.banner;
const INTERSTITIAL_ID = IS_TESTING ? TEST.interstitial : PROD.interstitial;
const REWARDED_ID = IS_TESTING ? TEST.rewarded : PROD.rewarded;
const APP_OPEN_ID = IS_TESTING ? TEST.appOpen : PROD.appOpen;
const REWARDED_INTERSTITIAL_ID = IS_TESTING ? TEST.rewardedInterstitial : PROD.rewardedInterstitial;

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
let lastAppOpen = Number(localStorage.getItem('dq-last-app-open') || 0);
let bannerShown = false;
let bannerPosition: BannerAdPosition | null = null;
let appOpenShowing = false;
let retryTimers: Record<string, ReturnType<typeof setTimeout> | null> = { i: null, r: null, ri: null, ao: null, b: null };
let retryDelay: Record<string, number> = { i: 2000, r: 2000, ri: 2000, ao: 3000, b: 10000 };

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
  retryDelay[kind] = Math.min(delay * 2, 60000);
  retryTimers[kind] = setTimeout(() => { retryTimers[kind] = null; fn(); }, delay);
}

export async function showBanner(position: 'top' | 'bottom' = 'bottom') {
  if (!Capacitor.isNativePlatform()) return;
  const target = position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER;

  try {
    await initAds();

    if (bannerShown && bannerPosition === target) {
      try {
        await AdMob.resumeBanner();
        return;
      } catch {
        bannerShown = false;
        bannerPosition = null;
      }
    }

    if (bannerShown) {
      try { await AdMob.removeBanner(); } catch {}
      bannerShown = false;
      bannerPosition = null;
    }

    const options: BannerAdOptions = {
      adId: BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: target,
      margin: 0,
      isTesting: IS_TESTING,
    };

    await AdMob.showBanner(options);
    bannerShown = true;
    bannerPosition = target;
    retryDelay.b = 10000;
  } catch (e) {
    bannerShown = false;
    bannerPosition = null;
    console.error('[AdMob] banner', e);
    retry('b', () => void showBanner(position));
  }
}

export async function preloadInterstitial(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(interstitialReady, interstitialAt, MAX_AGE)) return true;
  if (interstitialPromise) return interstitialPromise;
  interstitialReady = false; interstitialAt = 0;
  interstitialPromise = (async () => {
    try {
      await initAds();
      await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID, isTesting: IS_TESTING });
      interstitialReady = true;
      interstitialAt = Date.now();
      retryDelay.i = 2000;
      return true;
    } catch (e) {
      console.error('[AdMob] interstitial preload', e);
      retry('i', () => void preloadInterstitial(true));
      return false;
    } finally {
      interstitialPromise = null;
    }
  })();
  return interstitialPromise;
}

export async function showInterstitial() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await initAds();
    const deadline = Date.now() + 8000;
    while (!fresh(interstitialReady, interstitialAt, MAX_AGE) && Date.now() < deadline) {
      await preloadInterstitial();
      if (!fresh(interstitialReady, interstitialAt, MAX_AGE)) await sleep(500);
    }
    if (!fresh(interstitialReady, interstitialAt, MAX_AGE)) return false;
    await AdMob.showInterstitial();
    interstitialReady = false; interstitialAt = 0; retryDelay.i = 2000;
    void preloadInterstitial(true);
    return true;
  } catch (e) {
    interstitialReady = false; interstitialAt = 0;
    console.error('[AdMob] interstitial show', e);
    retry('i', () => void preloadInterstitial(true));
    return false;
  }
}

export async function preloadRewarded(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(rewardedReady, rewardedAt, MAX_AGE)) return true;
  if (rewardedPromise) return rewardedPromise;
  rewardedReady = false; rewardedAt = 0;
  rewardedPromise = (async () => {
    try {
      await initAds();
      await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID, isTesting: IS_TESTING });
      rewardedReady = true;
      rewardedAt = Date.now();
      retryDelay.r = 2000;
      return true;
    } catch (e) {
      console.error('[AdMob] rewarded preload', e);
      retry('r', () => void preloadRewarded(true));
      return false;
    } finally {
      rewardedPromise = null;
    }
  })();
  return rewardedPromise;
}

export async function showRewarded() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await initAds();
    const deadline = Date.now() + 10000;
    while (!fresh(rewardedReady, rewardedAt, MAX_AGE) && Date.now() < deadline) {
      await preloadRewarded();
      if (!fresh(rewardedReady, rewardedAt, MAX_AGE)) await sleep(500);
    }
    if (!fresh(rewardedReady, rewardedAt, MAX_AGE)) return false;
    const reward = await AdMob.showRewardVideoAd();
    rewardedReady = false; rewardedAt = 0; retryDelay.r = 2000;
    void preloadRewarded(true);
    return Number(reward?.amount || 0) > 0;
  } catch (e) {
    rewardedReady = false; rewardedAt = 0;
    console.error('[AdMob] rewarded show', e);
    retry('r', () => void preloadRewarded(true));
    return false;
  }
}

export async function preloadRewardedInterstitial(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE)) return true;
  if (rewardedInterstitialPromise) return rewardedInterstitialPromise;
  rewardedInterstitialReady = false; rewardedInterstitialAt = 0;
  rewardedInterstitialPromise = (async () => {
    try {
      await initAds();
      await AdMob.prepareRewardInterstitialAd({ adId: REWARDED_INTERSTITIAL_ID, isTesting: IS_TESTING });
      rewardedInterstitialReady = true;
      rewardedInterstitialAt = Date.now();
      retryDelay.ri = 2000;
      return true;
    } catch (e) {
      console.error('[AdMob] rewarded interstitial preload', e);
      retry('ri', () => void preloadRewardedInterstitial(true));
      return false;
    } finally {
      rewardedInterstitialPromise = null;
    }
  })();
  return rewardedInterstitialPromise;
}

export async function showRewardedInterstitial() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await initAds();
    const deadline = Date.now() + 10000;
    while (!fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE) && Date.now() < deadline) {
      await preloadRewardedInterstitial();
      if (!fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE)) await sleep(500);
    }
    if (!fresh(rewardedInterstitialReady, rewardedInterstitialAt, MAX_AGE)) return false;
    const reward = await AdMob.showRewardInterstitialAd();
    rewardedInterstitialReady = false; rewardedInterstitialAt = 0; retryDelay.ri = 2000;
    void preloadRewardedInterstitial(true);
    return Number(reward?.amount || 0) > 0;
  } catch (e) {
    rewardedInterstitialReady = false; rewardedInterstitialAt = 0;
    console.error('[AdMob] rewarded interstitial show', e);
    retry('ri', () => void preloadRewardedInterstitial(true));
    return false;
  }
}

export async function preloadAppOpen(force = false) {
  if (!Capacitor.isNativePlatform()) return false;
  if (!force && fresh(appOpenReady, appOpenAt, APP_OPEN_MAX_AGE)) return true;
  if (appOpenPromise) return appOpenPromise;
  appOpenReady = false; appOpenAt = 0;
  appOpenPromise = (async () => {
    try {
      await initAds();
      await AdMob.loadAppOpen({ adId: APP_OPEN_ID });
      appOpenReady = true;
      appOpenAt = Date.now();
      retryDelay.ao = 3000;
      return true;
    } catch (e) {
      console.error('[AdMob] app open preload', e);
      retry('ao', () => void preloadAppOpen(true));
      return false;
    } finally {
      appOpenPromise = null;
    }
  })();
  return appOpenPromise;
}

export async function showAppOpenIfAppropriate(maxWaitMs = 0) {
  if (!Capacitor.isNativePlatform() || appOpenShowing) return false;
  if (Date.now() - lastAppOpen < APP_OPEN_GAP) return false;

  try {
    await initAds();

    const preloadPromise = preloadAppOpen();
    if (maxWaitMs > 0) {
      await Promise.race([preloadPromise, sleep(maxWaitMs)]);
    } else {
      await preloadPromise;
    }

    if (!fresh(appOpenReady, appOpenAt, APP_OPEN_MAX_AGE)) return false;

    const loaded = await AdMob.isAppOpenLoaded({ adId: APP_OPEN_ID });
    if (!loaded.value) {
      appOpenReady = false;
      appOpenAt = 0;
      void preloadAppOpen(true);
      return false;
    }

    appOpenShowing = true;
    await AdMob.showAppOpen({ adId: APP_OPEN_ID });
    lastAppOpen = Date.now();
    localStorage.setItem('dq-last-app-open', String(lastAppOpen));
    appOpenReady = false;
    appOpenAt = 0;

    // Preload the next App Open ad after the current one is consumed.
    void preloadAppOpen(true);
    return true;
  } catch (e) {
    appOpenReady = false;
    appOpenAt = 0;
    console.error('[AdMob] app open show', e);
    retry('ao', () => void preloadAppOpen(true));
    return false;
  } finally {
    appOpenShowing = false;
  }
}

export function recoverAds() {
  void initAds().then(() => {
    void showBanner('bottom');
    void preloadInterstitial();
    void preloadRewarded();
    void preloadRewardedInterstitial();
    void preloadAppOpen();
  }).catch(() => undefined);
}
