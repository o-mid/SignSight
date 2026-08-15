import { StyleSheet, Text, View } from 'react-native';
import type { RiskSeverity } from '../risk/types';
import { color, radiusSm, space, type } from './theme';

type Props = {
  label: string;
  severity: RiskSeverity;
};

export function RiskRow({ label, severity }: Props) {
  const high = severity === 'high';
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${high ? 'High' : 'Medium'} risk. ${label}`}
      style={[styles.row, high ? styles.high : styles.medium]}
    >
      <View style={[styles.pip, high ? styles.pipHigh : styles.pipMedium]} />
      <Text style={[styles.label, high ? styles.highLabel : styles.mediumLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radiusSm,
    paddingHorizontal: space[2],
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  high: {
    backgroundColor: color.dangerBg,
  },
  medium: {
    backgroundColor: color.warningBg,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pipHigh: {
    backgroundColor: color.danger,
  },
  pipMedium: {
    backgroundColor: color.warning,
  },
  label: {
    ...type.callout,
    fontWeight: '600',
    flex: 1,
  },
  highLabel: {
    color: color.danger,
  },
  mediumLabel: {
    color: color.warning,
  },
});
