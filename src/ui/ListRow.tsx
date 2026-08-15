import { Children, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressScale } from './motion';
import { color, hit, lift, radius, space, type } from './theme';

type RowProps = {
  title: string;
  subtitle?: string;
  accessory?: string;
  onPress?: () => void;
};

export function ListGroup({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <View style={styles.group}>
      {items.map((child, index) => (
        <View key={index} style={index < items.length - 1 ? styles.divided : null}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function ListRow({ title, subtitle, accessory, onPress }: RowProps) {
  const body = (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {accessory ? <Text style={styles.accessory}>{accessory}</Text> : null}
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <PressScale accessibilityLabel={title} onPress={onPress}>
      {body}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: color.surface,
    borderRadius: radius,
    ...lift,
    overflow: 'hidden',
  },
  row: {
    minHeight: hit,
    paddingHorizontal: space[2],
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  divided: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.line,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...type.body,
    fontWeight: '600',
  },
  subtitle: {
    ...type.footnote,
  },
  accessory: {
    ...type.footnote,
    fontWeight: '600',
    color: color.inkMuted,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    color: color.inkFaint,
    marginTop: -2,
  },
});
