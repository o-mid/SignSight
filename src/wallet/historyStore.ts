import AsyncStorage from '@react-native-async-storage/async-storage';

export const HISTORY_KEY = '@signsight/history';

export type HistoryOutcome = 'rejected' | 'dry-run' | 'malformed' | 'demo-sign';

export type HistoryRow = {
  id: string;
  at: number;
  method: string;
  dappUrl: string;
  summary: string;
  risks: string[];
  outcome: HistoryOutcome;
};

export async function loadHistory(): Promise<HistoryRow[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryRow[]) : [];
  } catch {
    return [];
  }
}

export async function appendHistory(row: HistoryRow): Promise<void> {
  const current = await loadHistory();
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([...current, row]));
}
