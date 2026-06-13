/** CSV → 2D 配列に変換（簡易、日本語ダブルクオート対応） */
export function parseCSV(text: string): string[][] {
  // BOM 除去
  const cleaned = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuote = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inQuote) {
      if (ch === '"') {
        if (cleaned[i + 1] === '"') { currentField += '"'; i++; }
        else inQuote = false;
      } else currentField += ch;
    } else {
      if (ch === '"') inQuote = true;
      else if (ch === ",") { currentRow.push(currentField); currentField = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (currentField !== "" || currentRow.length > 0) {
          currentRow.push(currentField);
          rows.push(currentRow);
          currentRow = [];
          currentField = "";
        }
        if (ch === "\r" && cleaned[i + 1] === "\n") i++;
      } else currentField += ch;
    }
  }
  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

/** Map から baseYear=100 でリベース */
export function rebaseTo100(data: Map<number, number>, baseYear: number): Map<number, number> {
  const base = data.get(baseYear);
  if (!base) throw new Error(`${baseYear}年のデータが見つかりません`);
  const result = new Map<number, number>();
  for (const [year, val] of data) {
    result.set(year, Math.round((val / base) * 1000) / 10);
  }
  return result;
}

/**
 * AbortController + setTimeout で fetch をラップ。
 * 外部 API（e-Stat / BOJ / MOF）が応答しないままビルドがハングするのを防ぐ。
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 20_000,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Shift-JIS 含む可能性のあるレスポンスを decode（fetch + 文字コード判定） */
export async function fetchText(url: string, encoding: "utf-8" | "shift_jis" = "utf-8"): Promise<string> {
  const res = await fetchWithTimeout(url, {
    headers: { "User-Agent": "Mozilla/5.0 (KeizaiMap data fetcher)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const buffer = await res.arrayBuffer();
  const decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}

export function round1(n: number | null | undefined): number | null {
  if (n == null || isNaN(n)) return null;
  return Math.round(n * 10) / 10;
}

export function parseNumberClean(s: string): number | null {
  if (!s) return null;
  // 全角数字、カンマ、円記号、空白を除去
  const cleaned = s.replace(/[,\s¥円]/g, "").replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}
