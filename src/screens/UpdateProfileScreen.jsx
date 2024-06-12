import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {Button, TextInput, IconButton, List, Dialog, Text, Portal} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";
import {useIsFocused} from "@react-navigation/native";
import {useTranslation} from "react-i18next";

function UpdateProfileScreen() {
    const [profileImage, setProfileImage] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [dialog, setDialog] = useState({visible: false, content: ""});
    const [refresh, setRefresh] = useState(false);
    const [imageIsChanged, setImageIsChanged] = useState(false);
    const isFocused = useIsFocused();
    const {t} = useTranslation();

    const successMessage = (message) => {
        setDialog({visible: true, content: message});
        setRefresh(true);
    }
    const handleFetchedData = (data) => {
        setEmail(data?.email);
        setUsername(data?.username);
        setProfileImage(data?.userprofile?.image);
    }
    const getData = async () => {
        try {
            const token = await AsyncStorage.getItem(authTokenNames.access_token)
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            // api will return currently logged user account no matter the url profile variable
            const response = await fetch('http://10.0.2.2:8000/api/profile/0/', options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
            handleFetchedData(await response.json());
        } catch (e) {
            console.error(`Home screen fetch ${e}`)
        }
    }

    const isPasswordFormValid = () => {
        if (newPassword === '' || confirmPassword === '') {
            setDialog({visible: true, content: t('allFieldsRequired')});
            return false;
        }
        if (newPassword !== confirmPassword) {
            setDialog({visible: true, content: t('passwordMismatch')});
            return false;
        }
        return true;
    }

    const handleChangePassword = async () => {
        if (!isPasswordFormValid())
            return;
        const token = await AsyncStorage.getItem(authTokenNames.access_token);
        const data = {
            "password": newPassword,
        }
        fetch('http://10.0.2.2:8000/api/profile/0/', {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok)
                    throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
                successMessage(t('passwordUpdateSuccess'));
            })
            .catch(error => console.error(error));
    };

    const isUserDataFormValid = () => {
        if (email === '' || username === '') {
            setDialog({visible: true, content: t('allFieldsRequired')});
            return false;
        }
        return true;
    }

    const handleUpdateProfileImage = async () => {
        const data = new FormData();
        const token = await AsyncStorage.getItem(authTokenNames.access_token);
        if (profileImage) data.append('userprofile.image',
            {
                name: profileImage.fileName,
                type: profileImage.type,
                uri: Platform.OS === 'android' ? profileImage.uri : profileImage.uri.replace('file://', ''),
            }
        );
        const options = {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            body: data
        }
        try {
            const response = await fetch(`http://10.0.2.2:8000/api/profile/0/`, options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
            successMessage(t('userImageUpdateSuccess'))
        } catch (e) {
            console.error(`Update Profile ${e}`)
        }

    };

    const handleUpdateProfile = async () => {
        if (!isUserDataFormValid()) return;

        const token = await AsyncStorage.getItem(authTokenNames.access_token);

        let data = {}
        if (username) data.username = username
        if (email) data.email = email

        try {
            const response = await fetch('http://10.0.2.2:8000/api/profile/0/', {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                if (response.status === 400) {
                    let errorContent = ''
                    const res = await response.json()
                    let cntr = 0;
                    for (let propName in res) {
                        if (res.hasOwnProperty(propName)) {
                            const propValue = res[propName];
                            errorContent += propValue;
                            errorContent += cntr > 0 ? '\n' : '';
                            cntr = 1;
                        }
                    }
                    setDialog({visible: true, content: errorContent})
                    throw new Error(JSON.stringify(res));
                }
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
            }
            successMessage(t('userDataUpdateSuccess'));
        } catch (e) {
            console.error(e)
        }
    };

    const handleChooseProfileImage = () => {
        const options = {noData: true,};
        ImagePicker.launchCamera(options, (response) => {
            if (response.assets) response = response.assets[0];
            if (response.uri) {
                if (!response.fileName) response.fileName = `${Date.now()}.jpg`;
                setProfileImage(response);
                setImageIsChanged(true);
            }
        });
    };

    useEffect(() => {
        if (isFocused || refresh) {
            getData().then(() => setRefresh(false));
            setImageIsChanged(false);
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [isFocused, refresh]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Portal>
                    <Dialog visible={dialog.visible} onDismiss={() => setDialog({visible: false, content: ""})}>
                        <Dialog.Content>
                            <Text variant="bodyMedium">{dialog.content}</Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <View style={styles.container}>
                    <TouchableOpacity onPress={handleChooseProfileImage} style={styles.imageContainer}>
                        {profileImage
                            ? <Image source={{uri: (profileImage.uri ? profileImage.uri : profileImage)}}
                                     style={styles.image}/>
                            : <IconButton icon="account" size={100}/>
                        }
                    </TouchableOpacity>
                    {imageIsChanged &&
                        <IconButton icon="content-save" onPress={handleUpdateProfileImage} iconColor={'#119634'}
                                    size={50}
                                    style={styles.saveImageButton}/>
                    }
                </View>

                <List.Section style={styles.list}>
                    <List.Accordion title={t('userData')}>
                        <TextInput
                            label={t('email')}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style={styles.input}
                        />
                        <TextInput
                            label={t('username')}
                            value={username}
                            onChangeText={text => setUsername(text)}
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={handleUpdateProfile} style={styles.button}>
                            {t('update')}
                        </Button>
                    </List.Accordion>
                </List.Section>

                <List.Section style={styles.list}>
                    <List.Accordion title={t('password')}>
                        <TextInput label={t('newPassword')}
                                   value={newPassword}
                                   onChangeText={text => setNewPassword(text)}
                                   secureTextEntry
                                   style={styles.input}
                        />
                        <TextInput label={t('passwordConfirm')}
                                   value={confirmPassword}
                                   onChangeText={text => setConfirmPassword(text)}
                                   secureTextEntry
                                   style={styles.input}
                        />
                        <Button mode="contained" onPress={handleChangePassword}
                                style={styles.button}> {t('changePassword')} </Button>
                    </List.Accordion>
                </List.Section>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        backgroundColor: "#000",
        width: 200,
        height: 200,
        borderRadius: 100,
        objectFit: "contain"
    },
    input: {
        marginBottom: 20,
        width: '100%',
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    list: {
        width: '100%',
    },
    saveImageButton: {
        position: "absolute",
        bottom: 0,
        right: -30,
        borderWidth: 1,
        borderColor: "#119634",
    }
});

export default UpdateProfileScreen;
