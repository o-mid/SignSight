// Compat has to load first. If it doesn't, WalletConnect and the RN crypto polyfills step on each other.
import '@walletconnect/react-native-compat';
import 'react-native-get-random-values';
import 'fast-text-encoding';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
