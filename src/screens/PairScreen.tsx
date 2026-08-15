import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { PairError, pairWithUri } from '../wallet/pairUri';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { Screen } from '../ui/Screen';

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
      <Field
        label="WalletConnect URI"
        value={uri}
        onChangeText={setUri}
        placeholder="wc:"
        error={error}
        helper="Paste a wc: URI from a Sepolia test dApp."
      />
    </Screen>
  );
}
