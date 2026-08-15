import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PairError, pairWithUri } from '../wallet/pairUri';

export default function PairScreen() {
  const [uri, setUri] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
