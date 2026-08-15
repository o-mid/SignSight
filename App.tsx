import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigation/RootStack';
import { walletConnectProjectId } from './src/app/env';
import { initWalletKit, getWalletKit } from './src/wallet/walletKit';
import { listenSessionProposals } from './src/wallet/sessionActions';
import {
  listenSessionAuthenticate,
  listenSessionRequests,
} from './src/wallet/requestActions';

function App() {
  useEffect(() => {
    const projectId = walletConnectProjectId();
    // UI still works without a project id. Pairing just never starts.
    if (projectId.length === 0) {
      return;
    }
    void initWalletKit(projectId).then(() => {
      listenSessionProposals();
      listenSessionRequests();
      listenSessionAuthenticate();
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
