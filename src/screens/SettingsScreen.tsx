import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { demoSignerConfigured } from '../wallet/demoSigner';
import { loadDemoSignerEnabled, saveDemoSignerEnabled } from '../wallet/demoSignerStore';
import { getState, setState, subscribe } from '../state/appState';
import { LockBadge } from '../ui/LockBadge';
import { FadeIn } from '../ui/motion';
import { Screen } from '../ui/Screen';
import { Toggle } from '../ui/Toggle';
import { color, hit, lift, radius, space, type } from '../ui/theme';

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
      <FadeIn>
        <Text style={styles.kicker}>Signing</Text>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.title}>Dry-run</Text>
            <Text style={styles.body}>
              On. Sepolia is never broadcast. A live dApp gets an error, not a fake hash or
              signature.
            </Text>
          </View>
          <LockBadge label="On · locked" />
        </View>
      </FadeIn>
      <FadeIn delay={80}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.title}>Demo signer</Text>
            <Text style={styles.body}>
              {configured
                ? 'Uses DEMO_SIGNER_KEY. Broadcasts only to the local RPC.'
                : 'Off. Set DEMO_SIGNER_KEY in local .env to enable.'}
            </Text>
          </View>
          <Toggle
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
          />
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...type.footnote,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: -8,
  },
  row: {
    minHeight: hit,
    backgroundColor: color.surface,
    borderRadius: radius,
    paddingHorizontal: space[2],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    ...lift,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  title: {
    ...type.body,
    fontWeight: '600',
  },
  body: {
    ...type.footnote,
  },
});
