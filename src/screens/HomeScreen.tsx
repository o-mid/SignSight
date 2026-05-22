import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const sessionCount = 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>SignSight</Text>
      <Text style={styles.meta}>Sessions: {sessionCount}</Text>
      <Pressable style={styles.link} onPress={() => navigation.navigate('Pair')}>
        <Text style={styles.linkText}>Pair</Text>
      </Pressable>
      <Pressable style={styles.link} onPress={() => navigation.navigate('History')}>
        <Text style={styles.linkText}>History</Text>
      </Pressable>
      <Pressable style={styles.link} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.linkText}>Settings</Text>
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
  meta: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  link: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#111',
  },
});
