import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { Button } from '../ui/Button';
import { Screen } from '../ui/Screen';
import { color, space, type } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
  const [error, setError] = useState<string | null>(null);
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      const value = codes[0]?.value;
      if (value && value.startsWith('wc:')) {
        navigation.navigate('Pair', { uri: value });
      }
    },
  });

  if (device == null) {
    return (
      <Screen
        footer={
          <Button role="secondary" label="Close" onPress={() => navigation.goBack()} />
        }
      >
        <Text style={styles.meta}>No camera available on this device.</Text>
      </Screen>
    );
  }

  return (
    <View style={styles.wrap}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        onError={event => {
          setError(event.message);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: color.ink,
  },
  camera: {
    flex: 1,
  },
  meta: {
    ...type.body,
  },
  error: {
    ...type.footnote,
    color: color.danger,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    backgroundColor: color.dangerBg,
  },
});
