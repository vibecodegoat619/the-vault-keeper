import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function noise(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function make(key: string, size: number, paint: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

export function grassTex() {
  return make("grass", 256, (ctx, s) => {
    ctx.fillStyle = "#3d5a2a";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      ctx.fillStyle = `rgb(${48 + noise(x, y) * 40},${90 + noise(x, y + 2) * 50},${30 + noise(x, y + 4) * 24})`;
      ctx.fillRect(x, y, 2, 3);
    }
  });
}

export function dirtTex() {
  return make("dirt", 256, (ctx, s) => {
    ctx.fillStyle = "#6b4f32";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(${80 + Math.random() * 40},${55 + Math.random() * 25},${30},0.55)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 4, 3);
    }
  });
}

export function cobbleTex() {
  return make("cobble", 256, (ctx, s) => {
    ctx.fillStyle = "#5a564c";
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 16) {
      for (let x = 0; x < s; x += 20) {
        const ox = (Math.floor(y / 16) % 2) * 10;
        ctx.fillStyle = `rgb(${90 + Math.random() * 30},${86 + Math.random() * 24},${76 + Math.random() * 18})`;
        ctx.fillRect(x + ox + 1, y + 1, 17, 13);
      }
    }
  });
}

export function woodTex() {
  return make("wood", 128, (ctx, s) => {
    for (let y = 0; y < s; y++) {
      const v = 70 + Math.sin(y * 0.4) * 12 + noise(0, y) * 18;
      ctx.fillStyle = `rgb(${v + 30},${v},${v - 20})`;
      ctx.fillRect(0, y, s, 1);
    }
  });
}

export function thatchTex() {
  return make("thatch", 128, (ctx, s) => {
    ctx.fillStyle = "#6a3e24";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 400; i++) {
      ctx.strokeStyle = `rgba(${140 + Math.random() * 40},${80 + Math.random() * 20},30,0.4)`;
      ctx.beginPath();
      const x = Math.random() * s;
      ctx.moveTo(x, Math.random() * s);
      ctx.lineTo(x + 8, Math.random() * s);
      ctx.stroke();
    }
  });
}

export function disposeTextures() {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
