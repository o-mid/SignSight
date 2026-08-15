import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { PairError, pairWithUri } from '../wallet/pairUri';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { FadeIn } from '../ui/motion';
import { Screen } from '../ui/Screen';
import { type } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Pair'>;

export default function PairScreen({ navigation, route }: Props) {
  const [uri, setUri] = useState(route.params?.uri ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (route.params?.uri) {
      setUri(route.params.uri);
    }
  }, [route.params?.uri]);

  async function onPair(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      await pairWithUri(uri);
    } catch (caught: unknown) {
      if (caught instanceof PairError) {
        setError(caught.message);
      } else {
        setError('Pairing failed.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      scroll
      footer={
        <>
          <Button
            label={busy ? 'Pairing…' : 'Pair'}
            loading={busy}
            onPress={() => {
              void onPair();
            }}
          />
          <Button
            role="secondary"
            label="Scan QR"
            disabled={busy}
            onPress={() => navigation.navigate('Scan')}
          />
        </>
      }
    >
      <FadeIn>
        <View style={styles.intro}>
          <Text style={styles.title}>Connect a test dApp</Text>
          <Text style={styles.body}>
            Paste a WalletConnect URI. We only advertise Sepolia. The next sheet is the decision.
          </Text>
        </View>
      </FadeIn>
      <FadeIn delay={80}>
        <Field
          label="WalletConnect URI"
          value={uri}
          onChangeText={setUri}
          placeholder="wc:"
          error={error}
          helper="From a Sepolia test dApp. Nothing broadcasts."
        />
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 8,
  },
  title: {
    ...type.title,
  },
  body: {
    ...type.subhead,
  },
});
