import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, space } from './theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  padTop?: boolean;
};

export function Screen({ children, scroll, footer, padTop }: Props) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, space[2]);
  const top = padTop ? Math.max(insets.top, space[2]) : space[2];
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        { paddingTop: top },
        footer ? null : { paddingBottom: bottom },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        styles.content,
        { paddingTop: top },
        footer ? null : { paddingBottom: bottom },
      ]}
    >
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
    gap: space[3],
  },
  footer: {
    paddingHorizontal: space[3],
    paddingTop: space[2],
    gap: space[1],
    backgroundColor: color.bg,
  },
});
