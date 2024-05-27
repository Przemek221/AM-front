import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useTranslation} from "react-i18next";

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const { t} = useTranslation();

    const handleRegister = () => {
        console.log('Register...');
    };

    return (
        <View style={styles.container}>
            <TextInput
                label={t('username')}
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label={t('passwordConfirm')}
                value={confirmedPassword}
                onChangeText={setConfirmedPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleRegister} style={styles.button}>
                {t('register')}
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
