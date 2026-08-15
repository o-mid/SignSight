import { useState } from 'react';
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
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused ? styles.inputFocus : null,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.inkFaint}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: color.line,
    backgroundColor: color.surface,
    color: color.ink,
    borderRadius: radius,
    paddingHorizontal: space[2],
    fontSize: 17,
  },
  inputFocus: {
    borderColor: color.ink,
  },
  inputError: {
    borderColor: color.danger,
    backgroundColor: color.dangerBg,
  },
  error: {
    ...type.footnote,
    color: color.danger,
    fontWeight: '600',
  },
  helper: {
    ...type.footnote,
  },
});
