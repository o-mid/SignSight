import { StyleSheet, Text, View } from 'react-native';

export default function PairScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Pair</Text>
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
  },
});
