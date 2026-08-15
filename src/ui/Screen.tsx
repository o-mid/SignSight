import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, space } from './theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
};

export function Screen({ children, scroll, footer }: Props) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, space[2]);
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, footer ? null : { paddingBottom: bottom }]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, footer ? null : { paddingBottom: bottom }]}>
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      {body}
      {footer ? <View style={[styles.footer, { paddingBottom: bottom }]}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space[3],
    paddingTop: space[2],
    gap: space[2],
  },
  footer: {
    paddingHorizontal: space[3],
    paddingTop: space[1],
    gap: space[1],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
    backgroundColor: color.bg,
  },
});
