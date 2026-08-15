import { StyleSheet, Text, TextInput, View } from 'react-native';
import { color, hit, radius, space, type } from './theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  helper?: string;
};

export function Field({ label, value, onChangeText, placeholder, error, helper }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.inkFaint}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space[1],
  },
  label: {
    ...type.footnote,
    fontWeight: '600',
    color: color.ink,
  },
  input: {
    minHeight: hit,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
    color: color.ink,
    borderRadius: radius,
    paddingHorizontal: space[2],
    fontSize: 17,
  },
  inputError: {
    borderColor: color.danger,
  },
  error: {
    ...type.footnote,
    color: color.danger,
  },
  helper: {
    ...type.footnote,
  },
});
