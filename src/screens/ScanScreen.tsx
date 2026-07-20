import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
  const [error, setError] = useState<string | null>(null);
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const value = codes[0]?.value;
      if (value && value.startsWith('wc:')) {
        navigation.navigate('Pair', { uri: value });
      }
    },
  });

  if (device == null) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Scan QR</Text>
        <Text style={styles.meta}>No camera.</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Scan QR</Text>
      {error ? <Text style={styles.meta}>{error}</Text> : null}
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        onError={(event) => {
          setError(event.message);
        }}
      />
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
  meta: {
    fontSize: 16,
    color: '#111',
    marginBottom: 12,
  },
  camera: {
    flex: 1,
    minHeight: 240,
  },
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});
