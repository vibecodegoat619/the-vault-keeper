export type AABB = { minX: number; maxX: number; minZ: number; maxZ: number };

export const WORLD_BOUNDS: AABB = { minX: -22, maxX: 22, minZ: -22, maxZ: 22 };

export const BUILDINGS: { name: string; box: AABB; h: number; color: string; roof: string }[] = [
  { name: "The Gilded Hart", box: { minX: -5, maxX: 5, minZ: -18, maxZ: -11 }, h: 4.2, color: "#6b4a32", roof: "#5a2e24" },
  { name: "Eastbrook Market", box: { minX: 11, maxX: 18, minZ: -8, maxZ: 2 }, h: 3.6, color: "#7a5640", roof: "#6a3828" },
  { name: "Chapel of the Vale", box: { minX: -18, maxX: -11, minZ: -8, maxZ: 4 }, h: 5.4, color: "#8a7a68", roof: "#4a3a32" },
  { name: "Weaver's Cottage", box: { minX: -17, maxX: -10, minZ: 10, maxZ: 16 }, h: 3.2, color: "#6e5038", roof: "#4e2c20" },
  { name: "Miller's House", box: { minX: 10, maxX: 17, minZ: 10, maxZ: 16 }, h: 3.2, color: "#745438", roof: "#523024" },
  { name: "Stables", box: { minX: -6, maxX: 6, minZ: 17, maxZ: 21 }, h: 3.0, color: "#5a4030", roof: "#3e281c" },
];

export const FOUNTAIN: AABB = { minX: -1.6, maxX: 1.6, minZ: -1.6, maxZ: 1.6 };

export const STALL: AABB = { minX: 5.2, maxX: 8.6, minZ: 1.6, maxZ: 4.4 };

export const COLLIDERS: AABB[] = [
  ...BUILDINGS.map((b) => b.box),
  FOUNTAIN,
  STALL,
];

export const VENDOR_POS = { x: 6.9, y: 0, z: 5.2 };

function overlaps(px: number, pz: number, radius: number, box: AABB) {
  return (
    px + radius > box.minX &&
    px - radius < box.maxX &&
    pz + radius > box.minZ &&
    pz - radius < box.maxZ
  );
}

export function isBlocked(x: number, z: number, radius: number): boolean {
  if (
    x - radius < WORLD_BOUNDS.minX ||
    x + radius > WORLD_BOUNDS.maxX ||
    z - radius < WORLD_BOUNDS.minZ ||
    z + radius > WORLD_BOUNDS.maxZ
  ) {
    return true;
  }
  return COLLIDERS.some((box) => overlaps(x, z, radius, box));
}

export function resolveMove(
  x: number,
  z: number,
  dx: number,
  dz: number,
  radius: number,
): { x: number; z: number } {
  let nx = x + dx;
  let nz = z + dz;
  nx = Math.min(WORLD_BOUNDS.maxX - radius, Math.max(WORLD_BOUNDS.minX + radius, nx));
  nz = Math.min(WORLD_BOUNDS.maxZ - radius, Math.max(WORLD_BOUNDS.minZ + radius, nz));

  for (const box of COLLIDERS) {
    if (overlaps(nx, z, radius, box)) nx = x;
  }
  for (const box of COLLIDERS) {
    if (overlaps(nx, nz, radius, box)) nz = z;
  }
  return { x: nx, z: nz };
}
