import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { demoSignerConfigured } from '../wallet/demoSigner';
import { loadDemoSignerEnabled, saveDemoSignerEnabled } from '../wallet/demoSignerStore';
import { getState, setState, subscribe } from '../state/appState';
import { Screen } from '../ui/Screen';
import { color, hit, radius, space, type } from '../ui/theme';

export default function SettingsScreen() {
  const [snapshot, setSnapshot] = useState(getState);
  const configured = demoSignerConfigured();

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    void loadDemoSignerEnabled().then(enabled => {
      setState({ demoSignerEnabled: configured && enabled });
    });
  }, [configured]);

  async function onToggle(value: boolean): Promise<void> {
    if (!configured) {
      return;
    }
    await saveDemoSignerEnabled(value);
    setState({ demoSignerEnabled: value });
  }

  return (
    <Screen>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>Dry-run</Text>
          <Text style={styles.body}>On. Sepolia is never broadcast. A live dApp gets an error, not a fake hash or signature.</Text>
        </View>
        <Switch
          value={true}
          disabled={true}
          accessibilityLabel="Dry-run"
          accessibilityHint="Dry-run is locked on."
          accessibilityState={{ disabled: true, checked: true }}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>Demo signer</Text>
          <Text style={styles.body}>
            {configured
              ? 'Uses DEMO_SIGNER_KEY. Broadcasts only to the local RPC.'
              : 'Off. Set DEMO_SIGNER_KEY in local .env to enable.'}
          </Text>
        </View>
        <Switch
          value={configured && snapshot.demoSignerEnabled}
          disabled={!configured}
          onValueChange={value => {
            void onToggle(value);
          }}
          accessibilityLabel="Demo signer"
          accessibilityHint={
            configured
              ? 'Return a real local signature or Anvil hash.'
              : 'Add DEMO_SIGNER_KEY in local .env first.'
          }
          accessibilityState={{ disabled: !configured, checked: configured && snapshot.demoSignerEnabled }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: hit,
    backgroundColor: color.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: space[2],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...type.body,
    fontWeight: '600',
  },
  body: {
    ...type.footnote,
  },
});
