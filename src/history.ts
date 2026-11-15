import { calculate, validateValues, type LineValue } from '../engines/iching';
export interface HistoryEntry {
  id: string;
  createdAt: string;
  values: LineValue[];
  theme?: string;
}
export const HISTORY_KEY = 'mysticatlas.history.v1';
export function loadHistory(): HistoryEntry[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, 100).flatMap((item) => {
      try {
        if (
          !item ||
          typeof item.id !== 'string' ||
          item.id.length > 100 ||
          typeof item.createdAt !== 'string' ||
          !Number.isFinite(Date.parse(item.createdAt))
        )
          return [];
        return [
          {
            id: item.id,
            createdAt: item.createdAt,
            values: validateValues(item.values),
            ...(typeof item.theme === 'string' ? { theme: item.theme.slice(0, 300) } : {}),
          },
        ];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}
export function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 100)));
}
export function exportHistory(entries: HistoryEntry[]) {
  return JSON.stringify(
    {
      app: 'MysticAtlas',
      version: '1.0.0',
      order: 'bottom-to-top',
      exportedAt: new Date().toISOString(),
      records: entries.map((e) => ({ ...e, chart: calculate(e.values) })),
    },
    null,
    2,
  );
}
