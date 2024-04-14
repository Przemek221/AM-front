/**
 * @format
 */

import {Alert, AppRegistry} from 'react-native';
import App1 from './App1';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';




// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    //notifee can be used for this

});
AppRegistry.registerComponent(appName, () => App1);
