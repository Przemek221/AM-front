import React, {useEffect} from 'react';
import {Text, StyleSheet, SafeAreaView, Button, Image} from 'react-native';
import messaging from '@react-native-firebase/messaging';

// moze niepotrzebne
// import notifee from '@notifee/react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
// moze niepotrzebne


const App1 = () => {

    async function onDisplayNotification() {
        // Request permissions (required for iOS)
        // await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            // id: 'default',
            id: '1',
            name: 'test1',
            importance: AndroidImportance.HIGH,
        });

        // Display a notification
        await notifee.displayNotification({
            title: 'Notification Title',
            body: 'Main body content of the notification',
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

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    const getToken = async () => {
        const token = await messaging().getToken()
        console.log("token: ", token)
    }

    useEffect(() => {
        requestUserPermission()
        getToken()
    }, []);

    let getData = () => {
        fetch("http://10.0.2.2:8000/api/posts/")
            .then(res => {
                console.log(res.status);
                console.log(res.headers);
                return res.json();
            })
            .then((result) => {
                console.log(result);
            }, (error) => {
                console.error(error);
            })
    }
    return (
        // <View
        //     style={{
        //         flex: 1,
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //     }}>
        //     <Text>Hello, world!</Text>
        // </View>
        <SafeAreaView>
            <Text style={styles.abc}>Hello, world!</Text>
            <Button title={"Get"} onPress={getData}/>
            <Button title={"test1"} onPress={()=>{console.log('test1 btn')}}/>
            <Button title={"notification"} onPress={onDisplayNotification}/>
            <Image source={{
                uri: 'https://engineering.fb.com/wp-content/uploads/2016/04/yearinreview.jpg',
            }}
                   style={{width: 'auto', height: 50, objectFit: 'contain'}}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    abc: {
        width: 200,
        fontSize: 50,
        backgroundColor: 'red',
        marginTop: "auto",
        marginBottom: "auto",
    },
});
export default App1;
