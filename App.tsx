import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigation/RootStack';

function App() {
  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}

export default App;
