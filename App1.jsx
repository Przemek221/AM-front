import React, {useEffect} from 'react';
import {Text, StyleSheet, SafeAreaView, Button, Image} from 'react-native';
import messaging from '@react-native-firebase/messaging';


const App1 = () => {

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
