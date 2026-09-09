export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  setSteer?: (v: number) => void;
  setKeys?: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}

export const keys = new Set<string>();
let injected: string[] | null = null;
let lookX = 0;
let lookY = 0;
let rmb = false;

export function isRmb(): boolean {
  return rmb;
}

export function consumeLook(): { x: number; y: number } {
  const out = { x: lookX, y: lookY };
  lookX = 0;
  lookY = 0;
  return out;
}

export function held(): Set<string> {
  if (injected) return new Set(injected);
  return keys;
}

export function setInjectedKeys(codes: string[] | null) {
  injected = codes;
}

export function bindInput(target: HTMLElement | Window = window) {
  const onDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.code === "Space") e.preventDefault();
    keys.add(e.code);
  };
  const onUp = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };
  const onBlur = () => {
    keys.clear();
    rmb = false;
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.button === 2) rmb = true;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (e.button === 2) rmb = false;
  };
  const onMove = (e: PointerEvent) => {
    if (!rmb) return;
    lookX += e.movementX;
    lookY += e.movementY;
  };
  const onCtx = (e: Event) => e.preventDefault();

  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onBlur);
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointermove", onMove);
  target.addEventListener("contextmenu", onCtx);

  return () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onBlur);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointermove", onMove);
    target.removeEventListener("contextmenu", onCtx);
  };
}

export type TouchStick = { x: number; y: number };
export const touchMove: TouchStick = { x: 0, y: 0 };
export const touchLook: TouchStick = { x: 0, y: 0 };
