import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {authTokenNames} from "../helpers";
import {AuthContext} from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {debugLogin} from "../debug";

const LoginScreen = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {setUserSignedIn} = React.useContext(AuthContext);

    const handleLogin = () => {
        const data = {
            "username": username,
            "password": password,
        }

        fetch('http://10.0.2.2:8000/api/token/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
            })
            .then(responseJson => {
                AsyncStorage.setItem(authTokenNames.access_token, responseJson.access)
                    .catch(error => console.error(error));
                AsyncStorage.setItem(authTokenNames.refresh_token, responseJson.refresh)
                    .catch(error => console.error(error));
                setUserSignedIn(true);
            })
            .catch(error => console.error(error));
    };

    return (
        <>
            <View style={styles.container}>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Login
                </Button>
                <Button mode="contained" onPress={() => {
                    debugLogin(setUserSignedIn)
                }} style={styles.button}>
                    debugLogin
                </Button>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default LoginScreen;



