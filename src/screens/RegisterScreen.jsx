import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const handleRegister = () => {
        console.log('Register...');
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
            <TextInput
                label="Password Confirmation"
                value={confirmedPassword}
                onChangeText={setConfirmedPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleRegister} style={styles.button}>
                Register
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

export default RegisterScreen;
