import { useSyncExternalStore } from "react";
import type { LevelId, SportId, TierId } from "./sports";
import { LESSONS } from "./curriculum";

export interface Athlete {
  name: string; level: LevelId; sport: SportId; tier: TierId;
  experience: string; goals: string[]; days: number; created: number;
}
export interface Submission {
  id: string; lessonId: string; at: number;
  ratings: number[];            // 1-5 per rubric item
  effort: number;               // 1-5
  score: number;                // 0-100
  grade: string;
  note: string;
  hasVideo: boolean;
  seconds: number;
}

const A_KEY = "cil.academy.athlete";
const S_KEY = "cil.academy.subs";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full */ } emit(); };

let cache = { a: read<Athlete | null>(A_KEY, null), s: read<Submission[]>(S_KEY, []) };
const refresh = () => { cache = { a: read<Athlete | null>(A_KEY, null), s: read<Submission[]>(S_KEY, []) }; };
const subscribe = (cb: () => void) => { const f = () => { refresh(); cb(); }; listeners.add(f); window.addEventListener("storage", f); return () => { listeners.delete(f); window.removeEventListener("storage", f); }; };

export function useAcademy() {
  const snap = useSyncExternalStore(subscribe, () => cache);
  return { athlete: snap.a, subs: snap.s };
}
export const saveAthlete = (a: Athlete) => { write(A_KEY, a); refresh(); emit(); };

export function letter(score: number) {
  if (score >= 97) return "A+"; if (score >= 93) return "A"; if (score >= 90) return "A-";
  if (score >= 87) return "B+"; if (score >= 83) return "B"; if (score >= 80) return "B-";
  if (score >= 77) return "C+"; if (score >= 73) return "C"; if (score >= 70) return "C-";
  if (score >= 60) return "D"; return "F";
}
// 75% technique rubric, 25% effort. Honest self-assessment, coach can override later.
export function computeScore(ratings: number[], effort: number) {
  const tech = ratings.reduce((a, b) => a + b, 0) / (ratings.length * 5);
  return Math.round(tech * 75 + (effort / 5) * 25);
}
export function addSubmission(s: Submission) {
  write(S_KEY, [s, ...read<Submission[]>(S_KEY, [])]); refresh(); emit();
}
export function stats(subs: Submission[]) {
  const gpaMap: Record<string, number> = { "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, D: 1, F: 0 };
  const gpa = subs.length ? subs.reduce((a, s) => a + (gpaMap[s.grade] ?? 0), 0) / subs.length : 0;
  const days = new Set(subs.map((s) => new Date(s.at).toDateString()));
  let streak = 0; const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  return { gpa, streak, total: subs.length, avg: subs.length ? Math.round(subs.reduce((a, s) => a + s.score, 0) / subs.length) : 0 };
}
export function bestFor(subs: Submission[], lessonId: string) {
  return subs.filter((s) => s.lessonId === lessonId).sort((a, b) => b.score - a.score)[0];
}
export function sportProgress(subs: Submission[], sport: SportId, tier?: TierId) {
  const ids = LESSONS.filter((l) => l.sport === sport && (!tier || l.tier === tier)).map((l) => l.id);
  const done = ids.filter((id) => subs.some((s) => s.lessonId === id && s.score >= 70)).length;
  return { done, total: ids.length };
}

// Video blobs live in IndexedDB so nothing leaves the device.
const DB = "cil-academy-videos";
const open = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open(DB, 1);
  r.onupgradeneeded = () => r.result.createObjectStore("v");
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
});
export async function saveVideo(id: string, blob: Blob) {
  const db = await open();
  await new Promise<void>((res, rej) => { const t = db.transaction("v", "readwrite"); t.objectStore("v").put(blob, id); t.oncomplete = () => res(); t.onerror = () => rej(t.error); });
}
export async function loadVideo(id: string): Promise<Blob | undefined> {
  const db = await open();
  return new Promise((res, rej) => { const q = db.transaction("v").objectStore("v").get(id); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
}
