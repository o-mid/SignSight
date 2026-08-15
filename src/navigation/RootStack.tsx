import { NavigationContainer, DefaultTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PairScreen from '../screens/PairScreen';
import ScanScreen from '../screens/ScanScreen';
import SessionScreen from '../screens/SessionScreen';
import ReviewScreen from '../screens/ReviewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { color, hit, type } from '../ui/theme';

export type RootStackParamList = {
  Home: undefined;
  Pair: { uri?: string } | undefined;
  Scan: undefined;
  Session: undefined;
  Review: undefined;
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function ScanCancel() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Scan'>>();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Cancel"
      onPress={() => navigation.goBack()}
      hitSlop={8}
      style={styles.cancelHit}
    >
      <Text style={styles.cancel}>Cancel</Text>
    </Pressable>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.bg,
    card: color.bg,
    text: color.ink,
    border: color.line,
    primary: color.ink,
  },
};

export default function RootStack() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          headerTintColor: color.ink,
          headerStyle: { backgroundColor: color.bg },
          headerTitleStyle: { ...type.callout, fontWeight: '600' },
          contentStyle: { backgroundColor: color.bg },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SignSight' }} />
        <Stack.Screen name="Pair" component={PairScreen} options={{ title: 'Pair' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Group
          screenOptions={{
            presentation: 'formSheet',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.78, 1],
            sheetCornerRadius: 16,
          }}
        >
          <Stack.Screen name="Session" component={SessionScreen} options={{ title: 'Session' }} />
          <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review' }} />
        </Stack.Group>
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            presentation: 'fullScreenModal',
            title: 'Scan',
            headerLeft: ScanCancel,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  cancelHit: {
    minHeight: hit,
    justifyContent: 'center',
  },
  cancel: {
    ...type.callout,
    color: color.ink,
  },
});
