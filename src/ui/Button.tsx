import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, type } from './theme';

export type ButtonRole = 'primary' | 'secondary' | 'destructive' | 'ghost';

type Props = {
  label: string;
  role?: ButtonRole;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

export function Button({
  label,
  role = 'primary',
  onPress,
  disabled,
  loading,
  accessibilityHint,
}: Props) {
  const idle = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(idle), busy: Boolean(loading) }}
      disabled={idle}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[role],
        idle ? styles.idle : null,
        pressed && !idle ? styles.pressed : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={role === 'primary' ? color.onPrimary : color.ink}
          size="small"
        />
      ) : (
        <Text style={[styles.label, labelStyle[role]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: hit,
    borderRadius: radius,
    paddingHorizontal: space[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: color.ink,
  },
  secondary: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  destructive: {
    backgroundColor: color.dangerBg,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  idle: {
    opacity: 0.38,
  },
  pressed: {
    opacity: 0.72,
  },
  label: {
    ...type.callout,
    fontWeight: '600',
  },
});

const labelStyle = {
  primary: { color: color.onPrimary },
  secondary: { color: color.ink },
  destructive: { color: color.danger },
  ghost: { color: color.ink },
};
