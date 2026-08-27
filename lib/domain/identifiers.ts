import type { ZemaDatabase } from "@/lib/domain/types";

export function nextId(db: ZemaDatabase, prefix: string): string {
  const value = db.counters.id;
  db.counters.id += 1;
  return `${prefix}_${String(value).padStart(5, "0")}`;
}

export function issueIsrc(db: ZemaDatabase): string {
  const value = db.counters.isrc;
  db.counters.isrc += 1;
  return `ET-ZMA-26-${String(value).padStart(5, "0")}`;
}

export function issueUpc(db: ZemaDatabase): string {
  const value = db.counters.upc;
  db.counters.upc += 1;
  return `8${600_000_000_000 + value}`;
}
