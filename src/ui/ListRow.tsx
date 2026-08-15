import { Children, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, type } from './theme';

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
    <>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {accessory ? <Text style={styles.accessory}>{accessory}</Text> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{body}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: color.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: color.line,
    overflow: 'hidden',
  },
  row: {
    minHeight: hit,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  divided: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.line,
  },
  pressed: {
    backgroundColor: color.bg,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...type.body,
  },
  subtitle: {
    ...type.footnote,
  },
  accessory: {
    ...type.subhead,
  },
});
