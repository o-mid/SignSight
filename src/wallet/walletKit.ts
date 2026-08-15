import '@walletconnect/react-native-compat';
import { Core } from '@walletconnect/core';
import { WalletKit, type IWalletKit } from '@reown/walletkit';

let walletKit: IWalletKit | undefined;

export async function initWalletKit(projectId: string): Promise<IWalletKit> {
  const core = new Core({ projectId });
  walletKit = await WalletKit.init({
    core,
    metadata: {
      name: 'SignSight',
      description: 'Portfolio demo wallet. See the request before you sign.',
      url: 'https://signsight.app',
      icons: [],
      redirect: {
        native: 'signsight://',
      },
    },
  });
  return walletKit;
}

export function getWalletKit(): IWalletKit {
  if (!walletKit) {
    throw new Error('WalletKit has not been initialized.');
  }
  return walletKit;
}
