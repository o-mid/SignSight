import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEMO_SIGNER_KEY = '@signsight/demo-signer';

export async function loadDemoSignerEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(DEMO_SIGNER_KEY);
  return raw === '1';
}

export async function saveDemoSignerEnabled(value: boolean): Promise<void> {
  await AsyncStorage.setItem(DEMO_SIGNER_KEY, value ? '1' : '0');
}
