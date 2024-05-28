import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Dialog, Text, Portal} from 'react-native-paper';
import {useTranslation} from "react-i18next";
import {useIsFocused, useNavigation} from "@react-navigation/native";

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [dialog, setDialog] = useState({visible: false, content: ""});
    const {t} = useTranslation();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const isFormValid = () => {
        if (password === '' || confirmedPassword === '' || username === '') {
            setDialog({visible: true, content: t('allFieldsRequired')});
            return false;
        }
        if (password !== confirmedPassword) {
            setDialog({visible: true, content: t('passwordMismatch')});
            return false;
        }
        return true
    }

    const successMessage = () => {
        navigation.navigate('Login');
        setDialog({visible: true, content: t('userRegisterSuccess')});
    }

    const handleRegister = () => {
        if (!isFormValid())
            return;

        const data = {
            "username": username,
            "password": password,
        }
        fetch('http://10.0.2.2:8000/api/users/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok)
                    throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
                successMessage();
            })
            .catch(error => console.error(error));
    };

    React.useEffect(() => {
        if (!isFocused) {
            setPassword('');
            setConfirmedPassword('');
            setUsername('');
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <Portal>
                <Dialog visible={dialog.visible} onDismiss={() => setDialog({visible: false, content: ""})}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{dialog.content}</Text>
                    </Dialog.Content>
                </Dialog>
            </Portal>
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
