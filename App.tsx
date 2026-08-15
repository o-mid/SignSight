import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigation/RootStack';
import { initWalletKit, getWalletKit } from './src/wallet/walletKit';
import { listenSessionProposals } from './src/wallet/sessionActions';
import { listenSessionRequests } from './src/wallet/requestActions';

function App() {
  useEffect(() => {
    const projectId = process.env.WALLETCONNECT_PROJECT_ID ?? '';
    if (projectId.length === 0) {
      return;
    }
    void initWalletKit(projectId).then(() => {
      listenSessionProposals();
      listenSessionRequests();
      void getWalletKit();
    });
  }, []);

  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}

export default App;
