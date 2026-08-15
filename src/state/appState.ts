import type { HistoryRow } from '../wallet/historyStore';
import type { SessionSnapshot } from '../wallet/sessionStore';

export type AppState = {
  sessions: SessionSnapshot[];
  pendingProposal: unknown | null;
  pendingRequest: {
    topic: string;
    id: number;
    method: string;
    params: unknown;
    dappUrl: string;
    chainId?: string;
  } | null;
  pendingAuth: {
    id: number;
    topic?: string;
    fields: Record<string, string | undefined>;
    dappUrl: string;
  } | null;
  history: HistoryRow[];
  demoSignerEnabled: boolean;
  pendingCount: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();

function pendingCountOf(state: Omit<AppState, 'pendingCount'>): number {
  let count = 0;
  if (state.pendingProposal !== null) {
    count += 1;
  }
  if (state.pendingRequest !== null) {
    count += 1;
  }
  if (state.pendingAuth !== null) {
    count += 1;
  }
  return count;
}

let state: AppState = {
  sessions: [],
  pendingProposal: null,
  pendingRequest: null,
  pendingAuth: null,
  history: [],
  demoSignerEnabled: false,
  pendingCount: 0,
};

export function getState(): AppState {
  return state;
}

export function setState(patch: Partial<Omit<AppState, 'pendingCount'>>): void {
  const next: AppState = {
    ...state,
    ...patch,
    pendingCount: 0,
  };
  next.pendingCount = pendingCountOf(next);
  state = next;
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
