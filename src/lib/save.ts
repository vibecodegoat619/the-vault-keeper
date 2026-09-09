import type { Slot } from "@/lib/items";

export const SAVE_VERSION = 1;
const KEY = "vk.save.v1";
const BACKUP = "vk.save.v1.bak";

export type SaveBlob = {
  version: number;
  playerName: string;
  copper: number;
  bags: Slot[];
  bank: Slot[];
  vault: Slot[];
  guild: Slot[];
  permitOwned: boolean;
};

export function loadSave(): SaveBlob | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveBlob;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== SAVE_VERSION) return migrate(parsed);
    return parsed;
  } catch {
    try {
      const bak = localStorage.getItem(BACKUP);
      return bak ? (JSON.parse(bak) as SaveBlob) : null;
    } catch {
      return null;
    }
  }
}

function migrate(s: SaveBlob): SaveBlob {
  return { ...s, version: SAVE_VERSION };
}

export function persistSave(blob: SaveBlob) {
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP, prev);
    localStorage.setItem(KEY, JSON.stringify(blob));
  } catch {
    /* private mode */
  }
}
