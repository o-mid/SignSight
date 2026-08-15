import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { FadeIn } from '../ui/motion';
import { Screen } from '../ui/Screen';
import { color, space, type } from '../ui/theme';
import { Viewfinder } from '../ui/Viewfinder';

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
      <Screen>
        <FadeIn style={styles.empty}>
          <Viewfinder />
          <Text style={styles.title}>No camera on this device</Text>
          <Text style={styles.body}>Cancel and paste a wc: URI on Pair instead.</Text>
        </FadeIn>
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
      <View style={styles.overlay} pointerEvents="none">
        <Viewfinder />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingBottom: space[5],
  },
  title: {
    ...type.headline,
    textAlign: 'center',
  },
  body: {
    ...type.subhead,
    textAlign: 'center',
    maxWidth: 280,
  },
  wrap: {
    flex: 1,
    backgroundColor: color.ink,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...type.footnote,
    color: color.danger,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    backgroundColor: color.dangerBg,
  },
});
