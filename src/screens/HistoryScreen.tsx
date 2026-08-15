import { useEffect, useState } from 'react';
import { loadHistory } from '../wallet/historyStore';
import { getState, setState, subscribe } from '../state/appState';
import { EmptyState } from '../ui/EmptyState';
import { ListGroup, ListRow } from '../ui/ListRow';
import { Screen } from '../ui/Screen';

function outcomeLabel(outcome: string): string {
  if (outcome === 'dry-run') {
    return 'Dry-run';
  }
  if (outcome === 'malformed') {
    return 'Malformed';
  }
  if (outcome === 'demo-sign') {
    return 'Demo sign';
  }
  return 'Rejected';
}

export default function HistoryScreen() {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    void loadHistory().then(history => {
      setState({ history });
    });
  }, []);

  return (
    <Screen scroll>
      {snapshot.history.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          body="Rejected and dry-run requests appear here after you decide."
        />
      ) : (
        <ListGroup>
          {snapshot.history.map(row => (
            <ListRow
              key={row.id}
              title={row.summary}
              subtitle={[row.method, row.dappUrl].filter(Boolean).join(' · ')}
              accessory={outcomeLabel(row.outcome)}
            />
          ))}
        </ListGroup>
      )}
    </Screen>
  );
}
