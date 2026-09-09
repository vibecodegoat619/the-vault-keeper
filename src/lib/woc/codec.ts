const ALPH =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function encodeBase58(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  const digits = [0];
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i]!;
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j]! * 256;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let out = "1".repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) out += ALPH[digits[i]!];
  return out;
}

export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", data.slice().buffer);
  return new Uint8Array(digest);
}

export async function signMessage(
  secretSeed: string,
  message: Uint8Array,
): Promise<string> {
  const seed = new TextEncoder().encode(secretSeed);
  const payload = new Uint8Array(seed.length + message.length);
  payload.set(seed, 0);
  payload.set(message, seed.length);
  const hash = await sha256(payload);
  return encodeBase58(hash);
}

export function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  crypto.getRandomValues(out);
  return out;
}

export function writeU64LE(buf: Uint8Array, offset: number, value: bigint) {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  view.setBigUint64(offset, value, true);
}

export function pubkeyFromSeed(seed: string): string {
  const bytes = new TextEncoder().encode(seed);
  let h = 2166136261;
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    let v = h;
    for (let j = 0; j < bytes.length; j++) {
      v ^= bytes[j]! + i;
      v = Math.imul(v, 16777619);
    }
    out[i] = v & 255;
    h = v;
  }
  return encodeBase58(out);
}
