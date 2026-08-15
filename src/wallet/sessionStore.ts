import AsyncStorage from '@react-native-async-storage/async-storage';

export const SESSIONS_KEY = '@signsight/sessions';

export type SessionSnapshot = {
  topic: string;
  dappUrl: string;
  name: string;
};

export async function loadSessions(): Promise<SessionSnapshot[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((row): row is SessionSnapshot => {
      if (typeof row !== 'object' || row === null) {
        return false;
      }
      const item = row as Record<string, unknown>;
      return (
        typeof item.topic === 'string' &&
        typeof item.dappUrl === 'string' &&
        typeof item.name === 'string'
      );
    });
  } catch {
    return [];
  }
}

export async function saveSessions(sessions: SessionSnapshot[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}
