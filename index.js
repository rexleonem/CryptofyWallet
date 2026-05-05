import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer; // Fix for libraries expecting global Buffer
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/app/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
