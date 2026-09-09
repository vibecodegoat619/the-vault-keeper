let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ac();
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.05, delay = 0) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime + delay;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export function sfxClick() {
  tone(520, 0.08, "square", 0.03);
}
export function sfxOpen() {
  tone(220, 0.16, "triangle", 0.04);
  tone(330, 0.2, "sine", 0.03, 0.04);
}
export function sfxSummon() {
  tone(196, 0.4, "sine", 0.05);
  tone(294, 0.45, "triangle", 0.04, 0.08);
  tone(392, 0.5, "sine", 0.035, 0.16);
  tone(588, 0.35, "triangle", 0.03, 0.28);
}
export function sfxBuy() {
  tone(523, 0.18, "triangle", 0.05);
  tone(659, 0.22, "sine", 0.04, 0.1);
  tone(784, 0.28, "triangle", 0.04, 0.2);
}
export function sfxError() {
  tone(140, 0.22, "sawtooth", 0.04);
}
