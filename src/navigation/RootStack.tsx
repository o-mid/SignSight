import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PairScreen from '../screens/PairScreen';
import ScanScreen from '../screens/ScanScreen';
import SessionScreen from '../screens/SessionScreen';
import ReviewScreen from '../screens/ReviewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

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

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Pair" component={PairScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Session" component={SessionScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
