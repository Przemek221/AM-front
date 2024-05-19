/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App1 from './App1';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from "@notifee/react-native";


async function onDisplayNotification(arg) {
    // Request permissions (required for iOS)
    // await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        // id: 'default',
        id: '2',
        name: 'backgroundNotifications',
        importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
        // title: 'Notification Title',
        title: arg.notification.title,
        // body: 'Main body content of the notification',
        body: arg.notification.body,
        android: {
            channelId,
            // smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
        },
    });
}


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    remoteMessage.notification; // this makes that the notification is handled by the device
    await onDisplayNotification(remoteMessage);

});
AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => App1);
