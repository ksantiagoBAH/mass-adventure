export function readSaved<T>(key: string, parse: (value: unknown) => T, fallback: T): T {
  try { const raw = localStorage.getItem(`rosary-web:${key}`); return raw ? parse(JSON.parse(raw)) : fallback; } catch { return fallback; }
}
export function save(key: string, value: unknown) {
  try { localStorage.setItem(`rosary-web:${key}`, JSON.stringify(value)); return true; } catch { return false; }
}
