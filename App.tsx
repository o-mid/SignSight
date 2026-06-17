import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigation/RootStack';
import { initWalletKit } from './src/wallet/walletKit';

function App() {
  useEffect(() => {
    const projectId = process.env.WALLETCONNECT_PROJECT_ID ?? '';
    if (projectId.length === 0) {
      return;
    }
    void initWalletKit(projectId);
  }, []);

  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}

export default App;
