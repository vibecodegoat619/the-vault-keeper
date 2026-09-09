/**
 * VaultKeeperPermit — the on-chain gate for Call of the Vault-Keeper.
 *
 * This module is the integration seam for $WOC. In production it would
 * submit a real Solana transaction against VAULT_KEEPER_PROGRAM_ID that
 * transfers PERMIT_PRICE_WOC of the live $WOC mint into the bursar treasury
 * and writes a Permit PDA owned by the buyer. The browser preview runs a
 * deterministic simulated ledger so the purchase, signature, logs, and PDA
 * are inspectable without a live wallet.
 *
 * Instruction layout (little-endian, Borsh-shaped):
 *   0 initialize       [u8 disc=0][u64 price]
 *   1 purchase_permit  [u8 disc=1][u64 price][u8[32] owner_hint]
 *   2 query_permit     [u8 disc=2]
 *
 * PDA seeds: ["vk-permit", owner_pubkey]
 */

import {
  CLUSTER,
  PERMIT_PRICE_BASE,
  PERMIT_PRICE_WOC,
  TREASURY_ADDRESS,
  VAULT_KEEPER_PROGRAM_ID,
  WOC_DECIMALS,
  WOC_MINT,
  type EncodedInstruction,
  type PermitAccount,
  type Transaction,
} from "./types";
import {
  bytesToHex,
  encodeBase58,
  randomBytes,
  sha256,
  signMessage,
  writeU64LE,
} from "./codec";

export {
  CLUSTER,
  PERMIT_PRICE_BASE,
  PERMIT_PRICE_WOC,
  TREASURY_ADDRESS,
  VAULT_KEEPER_PROGRAM_ID,
  WOC_DECIMALS,
  WOC_MINT,
};
export type { EncodedInstruction, PermitAccount, Transaction } from "./types";

const DISC: Record<EncodedInstruction["kind"], number> = {
  initialize: 0,
  purchase_permit: 1,
  query_permit: 2,
};

export function derivePermitPda(owner: string): string {
  const raw = new TextEncoder().encode(`vk-permit:${owner}:${VAULT_KEEPER_PROGRAM_ID}`);
  let h = 0;
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    h = 2166136261;
    for (const b of raw) {
      h ^= b + i;
      h = Math.imul(h, 16777619);
    }
    out[i] = h & 255;
  }
  return encodeBase58(out);
}

export function encodePurchasePermit(owner: string): EncodedInstruction {
  const data = new Uint8Array(1 + 8 + 32);
  data[0] = DISC.purchase_permit;
  writeU64LE(data, 1, PERMIT_PRICE_BASE);
  const hint = new TextEncoder().encode(owner);
  data.set(hint.slice(0, 32), 9);
  return {
    programId: VAULT_KEEPER_PROGRAM_ID,
    kind: "purchase_permit",
    discriminator: DISC.purchase_permit,
    data,
    hex: bytesToHex(data),
    accounts: [
      { name: "buyer", pubkey: owner, writable: true, signer: true },
      { name: "buyerWocAta", pubkey: `${owner.slice(0, 6)}…WOC`, writable: true, signer: false },
      { name: "treasury", pubkey: TREASURY_ADDRESS, writable: true, signer: false },
      { name: "permitPda", pubkey: derivePermitPda(owner), writable: true, signer: false },
      { name: "wocMint", pubkey: WOC_MINT, writable: false, signer: false },
      { name: "tokenProgram", pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", writable: false, signer: false },
      { name: "systemProgram", pubkey: "11111111111111111111111111111111", writable: false, signer: false },
    ],
  };
}

type Ledger = {
  slot: number;
  balances: Record<string, bigint>;
  permits: Record<string, PermitAccount>;
  txs: Transaction[];
};

const STARTING_WOC = 128n * 10n ** BigInt(WOC_DECIMALS);

function emptyLedger(): Ledger {
  return { slot: 18_420_000, balances: {}, permits: {}, txs: [] };
}

let ledger: Ledger = emptyLedger();

const LEDGER_KEY = "vk.ledger.v1";

function serializeLedger(l: Ledger) {
  return JSON.stringify({
    slot: l.slot,
    balances: Object.fromEntries(Object.entries(l.balances).map(([k, v]) => [k, v.toString()])),
    permits: l.permits,
    txs: l.txs,
  });
}

function hydrateLedger() {
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      slot: number;
      balances: Record<string, string>;
      permits: Record<string, PermitAccount>;
      txs: Transaction[];
    };
    ledger = {
      slot: parsed.slot ?? 18_420_000,
      balances: Object.fromEntries(
        Object.entries(parsed.balances ?? {}).map(([k, v]) => [k, BigInt(v)]),
      ),
      permits: parsed.permits ?? {},
      txs: parsed.txs ?? [],
    };
  } catch {
    /* keep empty */
  }
}

function persistLedger() {
  try {
    localStorage.setItem(LEDGER_KEY, serializeLedger(ledger));
  } catch {
    /* ignore */
  }
}

if (typeof window !== "undefined") hydrateLedger();

export function ensureAccount(pubkey: string, funded = true) {
  if (ledger.balances[pubkey] === undefined) {
    ledger.balances[pubkey] = funded ? STARTING_WOC : 0n;
  }
}

export function getWocBalance(pubkey: string): bigint {
  ensureAccount(pubkey);
  return ledger.balances[pubkey] ?? 0n;
}

export function formatWoc(base: bigint): string {
  const neg = base < 0n;
  const abs = neg ? -base : base;
  const whole = abs / 10n ** BigInt(WOC_DECIMALS);
  const frac = abs % 10n ** BigInt(WOC_DECIMALS);
  const fracStr = frac.toString().padStart(WOC_DECIMALS, "0").replace(/0+$/, "");
  const body = fracStr.length ? `${whole.toString()}.${fracStr}` : whole.toString();
  return neg ? `-${body}` : body;
}

export function getPermit(owner: string): PermitAccount | null {
  return ledger.permits[derivePermitPda(owner)] ?? null;
}

export function recentTransactions(limit = 8): Transaction[] {
  return ledger.txs.slice(0, limit);
}

export async function sendPurchasePermit(opts: {
  owner: string;
  secretSeed: string;
}): Promise<Transaction> {
  ensureAccount(opts.owner);
  const ix = encodePurchasePermit(opts.owner);
  const pda = derivePermitPda(opts.owner);
  const existing = ledger.permits[pda];
  const now = Date.now();
  ledger.slot += 1;

  const sig = await signMessage(opts.secretSeed, ix.data);
  const tx: Transaction = {
    signature: sig,
    slot: ledger.slot,
    blockTime: now,
    feeLamports: 5000,
    status: "processing",
    instruction: ix,
    logs: [
      `Program ${VAULT_KEEPER_PROGRAM_ID} invoke [1]`,
      `Program log: instruction=purchase_permit`,
      `Program log: mint=${WOC_MINT}`,
      `Program log: price=${PERMIT_PRICE_WOC} WOC`,
    ],
  };

  if (existing?.unlocked) {
    tx.status = "failed";
    tx.error = "PermitAlreadyMinted";
    tx.logs.push("Program log: err=PermitAlreadyMinted");
    tx.logs.push(`Program ${VAULT_KEEPER_PROGRAM_ID} failed: custom program error: 0x1`);
    ledger.txs.unshift(tx);
    persistLedger();
    return tx;
  }

  const bal = ledger.balances[opts.owner] ?? 0n;
  if (bal < PERMIT_PRICE_BASE) {
    tx.status = "failed";
    tx.error = "InsufficientWoc";
    tx.logs.push(`Program log: err=InsufficientFunds have=${formatWoc(bal)}`);
    tx.logs.push(`Program ${VAULT_KEEPER_PROGRAM_ID} failed: custom program error: 0x2`);
    ledger.txs.unshift(tx);
    persistLedger();
    return tx;
  }

  ledger.balances[opts.owner] = bal - PERMIT_PRICE_BASE;
  ledger.balances[TREASURY_ADDRESS] =
    (ledger.balances[TREASURY_ADDRESS] ?? 0n) + PERMIT_PRICE_BASE;
  ledger.permits[pda] = {
    owner: opts.owner,
    unlocked: true,
    purchasedAt: now,
    txSignature: sig,
    pricePaid: formatWoc(PERMIT_PRICE_BASE),
  };

  tx.logs.push(`Program log: transfer ${PERMIT_PRICE_WOC} WOC -> treasury`);
  tx.logs.push(`Program log: init pda ${pda}`);
  tx.logs.push(`Program log: permit unlocked for ${opts.owner}`);
  tx.logs.push(`Program ${VAULT_KEEPER_PROGRAM_ID} success`);
  tx.status = "finalized";
  ledger.txs.unshift(tx);
  persistLedger();
  return tx;
}

export async function simulateConfirmDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 520));
}

export function explorerUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}?cluster=${CLUSTER}`;
}

export function mintShort(): string {
  return `${WOC_MINT.slice(0, 4)}…${WOC_MINT.slice(-4)}`;
}

export function fingerprintIx(ix: EncodedInstruction): string {
  return `${ix.kind}#${ix.hex.slice(0, 16)}`;
}

export function entropyTag(): string {
  return encodeBase58(randomBytes(4));
}

export async function hashState(): Promise<string> {
  const body = JSON.stringify({
    slot: ledger.slot,
    permits: Object.keys(ledger.permits),
  });
  return bytesToHex(await sha256(new TextEncoder().encode(body)));
}
