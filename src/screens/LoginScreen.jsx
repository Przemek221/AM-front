import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Tutaj możesz dodać logikę logowania, np. wywołując API
        console.log('Logging in...');
    };

    return (
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
        </View>
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
