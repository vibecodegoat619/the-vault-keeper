import { create } from "zustand";
import {
  BANK_SIZE,
  ITEMS,
  type ItemId,
  type Slot,
  canStore,
  emptySlots,
  startingBags,
  startingGuild,
  startingVault,
} from "@/lib/items";
import {
  PERMIT_PRICE_WOC,
  formatWoc,
  getPermit,
  getWocBalance,
  sendPurchasePermit,
  simulateConfirmDelay,
  type Transaction,
} from "@/lib/woc/contract";
import {
  connectWallet,
  disconnectWallet,
  restoreWallet,
  type WalletAccount,
} from "@/lib/woc/wallet";
import { loadSave, persistSave, type SaveBlob } from "@/lib/save";
import { isBlocked } from "@/game/colliders";

export type WindowId = "bags" | "bank" | "wallet" | "help" | "vendor";
export type BankTab = "bank" | "vault" | "guild";
export type InteractTarget = "none" | "vendor" | "keeper";
export type ChatLine = { id: number; kind: "system" | "say" | "loot" | "combat"; text: string };

type Vec = { x: number; y: number; z: number };

type GameState = {
  phase: "title" | "playing";
  playerName: string;
  copper: number;
  bags: Slot[];
  bank: Slot[];
  vault: Slot[];
  guild: Slot[];
  permitOwned: boolean;
  wallet: WalletAccount | null;
  lastTx: Transaction | null;
  purchasing: boolean;
  purchaseError: string | null;
  windows: Record<WindowId, boolean>;
  bankTab: BankTab;
  summoned: boolean;
  summonPos: Vec | null;
  summonYaw: number;
  summonUntil: number;
  cooldownUntil: number;
  interact: InteractTarget;
  playerPos: Vec;
  playerYaw: number;
  chat: ChatLine[];
  dragging: { from: "bags" | "bank" | "vault" | "guild"; index: number } | null;
  enterWorld: () => void;
  toggleWindow: (id: WindowId) => void;
  closeTop: () => void;
  setBankTab: (t: BankTab) => void;
  setInteract: (t: InteractTarget) => void;
  syncPlayer: (pos: Vec, yaw: number) => void;
  pushChat: (kind: ChatLine["kind"], text: string) => void;
  connect: () => void;
  disconnect: () => void;
  buyPermit: () => Promise<void>;
  grantSigil: () => void;
  summon: () => void;
  dismiss: () => void;
  tryInteract: () => InteractTarget;
  startDrag: (from: "bags" | "bank" | "vault" | "guild", index: number) => void;
  dropOn: (to: "bags" | "bank" | "vault" | "guild", index: number) => void;
  cancelDrag: () => void;
  wocDisplay: () => string;
};

let chatSeq = 1;

function hasSigil(bags: Slot[], bank: Slot[], vault: Slot[]): boolean {
  const all = [...bags, ...bank, ...vault];
  return all.some((s) => s?.id === "sigil");
}

function firstEmpty(slots: Slot[]): number {
  return slots.findIndex((s) => !s);
}

function summonPoint(pos: Vec, yaw: number): Vec {
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  const rx = Math.cos(yaw);
  const rz = -Math.sin(yaw);
  const tries: Vec[] = [
    { x: pos.x + fx * 3.2, y: 0, z: pos.z + fz * 3.2 },
    { x: pos.x + fx * 1.6, y: 0, z: pos.z + fz * 1.6 },
    { x: pos.x + rx * 2.2, y: 0, z: pos.z + rz * 2.2 },
    { x: pos.x - rx * 2.2, y: 0, z: pos.z - rz * 2.2 },
    { x: pos.x, y: 0, z: pos.z },
  ];
  return tries.find((p) => !isBlocked(p.x, p.z, 0.55)) ?? tries[tries.length - 1]!;
}

export const useGame = create<GameState>((set, get) => ({
  phase: "title",
  playerName: "Thorgar",
  copper: 4 * 10000 + 32 * 100,
  bags: startingBags(),
  bank: emptySlots(BANK_SIZE),
  vault: startingVault(),
  guild: startingGuild(),
  permitOwned: false,
  wallet: null,
  lastTx: null,
  purchasing: false,
  purchaseError: null,
  windows: { bags: false, bank: false, wallet: false, help: false, vendor: false },
  bankTab: "bank",
  summoned: false,
  summonPos: null,
  summonYaw: 0,
  summonUntil: 0,
  cooldownUntil: 0,
  interact: "none",
  playerPos: { x: 0, y: 0, z: 8 },
  playerYaw: 0,
  chat: [
    {
      id: chatSeq++,
      kind: "system",
      text: "Welcome to Eastbrook Vale. The bursars have gone on the road.",
    },
    {
      id: chatSeq++,
      kind: "system",
      text: "Purchase Call of the Vault-Keeper with $WOC to summon Bursar Claudius anywhere.",
    },
  ],
  dragging: null,

  enterWorld: () => {
    const save = loadSave();
    const restored = restoreWallet();
    const permit = restored ? getPermit(restored.publicKey) : null;
    const owned = Boolean(permit?.unlocked) || Boolean(save?.permitOwned);
    set({
      phase: "playing",
      wallet: restored,
      permitOwned: owned,
      bags: save?.bags ?? startingBags(),
      bank: save?.bank ?? emptySlots(BANK_SIZE),
      vault: save?.vault ?? startingVault(),
      guild: save?.guild ?? startingGuild(),
      copper: save?.copper ?? 4 * 10000 + 32 * 100,
      playerName: save?.playerName ?? "Thorgar",
    });
    if (owned && !hasSigil(get().bags, get().bank, get().vault)) {
      get().grantSigil();
    }
    get().pushChat("system", "You enter Eastbrook Vale.");
  },

  toggleWindow: (id) =>
    set((s) => ({ windows: { ...s.windows, [id]: !s.windows[id] } })),

  closeTop: () =>
    set((s) => {
      const order: WindowId[] = ["wallet", "bank", "vendor", "bags", "help"];
      const open = order.find((id) => s.windows[id]);
      if (!open) return s;
      return { windows: { ...s.windows, [open]: false } };
    }),

  setBankTab: (t) => set({ bankTab: t }),
  setInteract: (t) => set({ interact: t }),
  syncPlayer: (pos, yaw) => set({ playerPos: pos, playerYaw: yaw }),

  pushChat: (kind, text) =>
    set((s) => ({
      chat: [...s.chat.slice(-40), { id: chatSeq++, kind, text }],
    })),

  connect: () => {
    const w = connectWallet();
    const permit = getPermit(w.publicKey);
    set({ wallet: w, permitOwned: Boolean(permit?.unlocked) || get().permitOwned });
    get().pushChat("system", `Wallet connected: ${w.publicKey.slice(0, 6)}…`);
  },

  disconnect: () => {
    set({ wallet: disconnectWallet(get().wallet) });
    get().pushChat("system", "Wallet disconnected.");
  },

  buyPermit: async () => {
    const { wallet } = get();
    if (!wallet?.connected) {
      set({ purchaseError: "Connect a Solana wallet first." });
      return;
    }
    if (get().permitOwned && hasSigil(get().bags, get().bank, get().vault)) {
      set({ purchaseError: "You already hold the Vault-Keeper's sigil." });
      return;
    }
    set({ purchasing: true, purchaseError: null });
    await simulateConfirmDelay();
    const tx = await sendPurchasePermit({
      owner: wallet.publicKey,
      secretSeed: wallet.secretSeed,
    });
    set({ lastTx: tx, purchasing: false });
    if (tx.status === "failed") {
      set({ purchaseError: tx.error === "InsufficientWoc" ? "Not enough $WOC." : tx.error ?? "Transaction failed." });
      get().pushChat("combat", `Purchase failed: ${tx.error}`);
      return;
    }
    set({ permitOwned: true });
    get().grantSigil();
    get().pushChat("loot", `You paid ${PERMIT_PRICE_WOC} $WOC and received Call of the Vault-Keeper.`);
    persistSnapshot();
  },

  grantSigil: () => {
    const { bags } = get();
    if (hasSigil(bags, get().bank, get().vault)) return;
    const idx = firstEmpty(bags);
    if (idx < 0) {
      get().pushChat("system", "Your bags are full. The sigil waits with the bursar.");
      return;
    }
    const next = bags.slice();
    next[idx] = { id: "sigil", count: 1 };
    set({ bags: next, permitOwned: true });
    persistSnapshot();
  },

  summon: () => {
    const s = get();
    const now = performance.now();
    if (!s.permitOwned || !hasSigil(s.bags, s.bank, s.vault)) {
      get().pushChat("system", "You do not own Call of the Vault-Keeper.");
      return;
    }
    if (s.summoned) {
      get().dismiss();
      return;
    }
    if (now < s.cooldownUntil) {
      get().pushChat("system", "The sigil is still cooling.");
      return;
    }
    const pos = summonPoint(s.playerPos, s.playerYaw);
    set({
      summoned: true,
      summonPos: pos,
      summonYaw: s.playerYaw + Math.PI,
      summonUntil: now + 180_000,
    });
    get().pushChat("say", "Bursar Claudius: The Strongbox travels with you, adventurer.");
  },

  dismiss: () => {
    if (!get().summoned) return;
    set({
      summoned: false,
      summonPos: null,
      cooldownUntil: performance.now() + 8_000,
      windows: { ...get().windows, bank: false },
      interact: get().interact === "keeper" ? "none" : get().interact,
    });
    get().pushChat("system", "Bursar Claudius returns to the vaults.");
  },

  tryInteract: () => {
    const s = get();
    if (s.interact === "keeper") {
      set({ windows: { ...s.windows, bank: !s.windows.bank } });
      return "keeper";
    }
    if (s.interact === "vendor") {
      set({
        windows: {
          ...s.windows,
          vendor: !s.windows.vendor,
          wallet: !s.windows.wallet,
        },
      });
      return "vendor";
    }
    return "none";
  },

  startDrag: (from, index) => set({ dragging: { from, index } }),
  cancelDrag: () => set({ dragging: null }),

  dropOn: (to, index) => {
    const { dragging } = get();
    if (!dragging) return;
    const srcKey = dragging.from;
    if (srcKey === to && dragging.index === index) {
      set({ dragging: null });
      return;
    }
    const copy = {
      bags: get().bags.slice(),
      bank: get().bank.slice(),
      vault: get().vault.slice(),
      guild: get().guild.slice(),
    };
    const src = copy[srcKey];
    const dst = copy[to];
    const item = src[dragging.index];
    if (!item) {
      set({ dragging: null });
      return;
    }
    if (!canStore(item.id, to)) {
      get().pushChat("system", `${ITEMS[item.id].name} cannot go in the guild stash.`);
      set({ dragging: null });
      return;
    }
    const target = dst[index];
    if (!target) {
      dst[index] = item;
      src[dragging.index] = null;
    } else if (target.id === item.id && ITEMS[item.id].stack > 1) {
      const room = ITEMS[item.id].stack - target.count;
      const move = Math.min(room, item.count);
      dst[index] = { id: item.id, count: target.count + move };
      const remain = item.count - move;
      src[dragging.index] = remain > 0 ? { id: item.id, count: remain } : null;
    } else {
      dst[index] = item;
      src[dragging.index] = target;
    }
    set({ ...copy, dragging: null });
    persistSnapshot();
  },

  wocDisplay: () => {
    const w = get().wallet;
    if (!w) return "0";
    return formatWoc(getWocBalance(w.publicKey));
  },
}));

function persistSnapshot() {
  const s = useGame.getState();
  const blob: SaveBlob = {
    version: 1,
    playerName: s.playerName,
    copper: s.copper,
    bags: s.bags,
    bank: s.bank,
    vault: s.vault,
    guild: s.guild,
    permitOwned: s.permitOwned,
  };
  persistSave(blob);
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistSnapshot();
  });
}

export function ownsSigil(): boolean {
  const s = useGame.getState();
  return hasSigil(s.bags, s.bank, s.vault);
}

export type { ItemId };
