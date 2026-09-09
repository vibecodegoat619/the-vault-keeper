import { encodeBase58, pubkeyFromSeed, randomBytes } from "./codec";
import { ensureAccount, getWocBalance } from "./contract";
import type { WalletAccount } from "./types";
export type { WalletAccount } from "./types";

const KEY = "vk.wallet.v1";

function loadStored(): WalletAccount | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WalletAccount;
    if (!parsed.publicKey || !parsed.secretSeed) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(w: WalletAccount) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    /* ignore quota */
  }
}

export function createDemoWallet(): WalletAccount {
  const secretSeed = encodeBase58(randomBytes(32));
  const publicKey = pubkeyFromSeed(secretSeed);
  const wallet: WalletAccount = {
    publicKey,
    secretSeed,
    connected: true,
    label: "Phantom (demo)",
  };
  ensureAccount(publicKey, true);
  persist(wallet);
  return wallet;
}

export function restoreWallet(): WalletAccount | null {
  const w = loadStored();
  if (!w) return null;
  ensureAccount(w.publicKey, true);
  return w;
}

export function connectWallet(): WalletAccount {
  const existing = loadStored();
  if (existing) {
    const w = { ...existing, connected: true };
    ensureAccount(w.publicKey, true);
    persist(w);
    return w;
  }
  return createDemoWallet();
}

export function disconnectWallet(current: WalletAccount | null): WalletAccount | null {
  if (!current) return null;
  const w = { ...current, connected: false };
  persist(w);
  return w;
}

export function walletBalance(w: WalletAccount | null): bigint {
  if (!w) return 0n;
  return getWocBalance(w.publicKey);
}

export function shortenKey(key: string, n = 4): string {
  if (key.length <= n * 2 + 1) return key;
  return `${key.slice(0, n)}…${key.slice(-n)}`;
}
