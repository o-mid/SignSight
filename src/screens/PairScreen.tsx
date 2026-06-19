import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { pairWithUri } from '../wallet/pairUri';

export default function PairScreen() {
  const [uri, setUri] = useState('');
  const [busy, setBusy] = useState(false);

  async function onPair(): Promise<void> {
    setBusy(true);
    try {
      await pairWithUri(uri);
    } catch {
      // surfaced in a later commit
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
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});
