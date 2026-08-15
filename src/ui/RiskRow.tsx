import { StyleSheet, Text, View } from 'react-native';
import type { RiskSeverity } from '../risk/types';
import { color, radius, space, type } from './theme';

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
      <Text style={[styles.label, high ? styles.highLabel : styles.mediumLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
  },
  high: {
    backgroundColor: color.dangerBg,
  },
  medium: {
    backgroundColor: color.warningBg,
  },
  label: {
    ...type.callout,
    fontWeight: '600',
  },
  highLabel: {
    color: color.danger,
  },
  mediumLabel: {
    color: color.warning,
  },
});
