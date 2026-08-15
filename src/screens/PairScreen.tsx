import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { PairError, pairWithUri } from '../wallet/pairUri';

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
    <View style={styles.wrap}>
      <Text style={styles.title}>Pair</Text>
      <TextInput
        style={styles.input}
        value={uri}
        onChangeText={setUri}
        placeholder="wc:"
        placeholderTextColor="#71717a"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={styles.button}
        onPress={() => {
          void onPair();
        }}
        disabled={busy}
      >
        <Text style={styles.buttonText}>Pair</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Scan')}>
        <Text style={styles.buttonText}>Scan QR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f4f4f5',
  },
  title: {
    fontSize: 22,
    color: '#111',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    backgroundColor: '#fff',
    color: '#111',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});
