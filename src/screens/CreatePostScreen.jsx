import React, {useState} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {Dialog, Button, Portal, TextInput, Text, PaperProvider} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";
import {useTranslation} from "react-i18next";

const CreatePostScreen = () => {
    const [photo, setPhoto] = useState(null);
    const [postDescription, setPostDescription] = useState("");
    const [dialog, setDialog] = useState({visible: false, content: ""});
    const { t} = useTranslation();

    const handleChoosePhoto = () => {
        const options = {noData: true,};
        ImagePicker.launchCamera(options, (response) => {
            if (response.assets) response = response.assets[0];
            if (response.uri) {
                if (!response.fileName) response.fileName = `${Date.now()}.jpg`;
                setPhoto(response);
            }
        });
    };
    const handleSubmit = async () => {
        if (postDescription === "") {
            setDialog({visible: true, content: t('postDescRequired')});
            return;
        }

        const data = new FormData();
        if (photo !== null)
            data.append('attachments', {
                name: photo.fileName,
                type: photo.type,
                uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
            });
        if (postDescription !== null)
            data.append('content', postDescription);

        const token = await AsyncStorage.getItem(authTokenNames.access_token);

        fetch('http://10.0.2.2:8000/api/posts/', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            body: data
        })
            .then(response => {
                if (!response.ok)
                    throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
                return response.json()
            })
            .then(responseJson => {
                console.log(responseJson)
            })
            .catch(error => {
                setDialog({visible: true, content: t('somethingWentWrong')});
                console.error(error)
            });
    };
    return (
        <>
            <Portal>
                <Dialog visible={dialog.visible} onDismiss={() => setDialog({visible: false, content: ""})}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{dialog.content}</Text>
                    </Dialog.Content>
                </Dialog>
            </Portal>
            <View style={styles.container}>
                <TextInput label={t('description')}
                           value={postDescription}
                           onChangeText={text => setPostDescription(text)}
                           style={styles.description}
                           multiline={true}
                />
                <Button onPress={handleChoosePhoto} mode={"contained-tonal"} style={styles.button}>{t('addPhoto')}</Button>
                {photo && (<Image source={{uri: photo.uri}} style={styles.photo}/>)}
                <Button onPress={handleSubmit} mode={"contained"} style={styles.button}>{t('createPost')}</Button>
            </View>
        </>
    );
};
export default CreatePostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    button: {
        marginTop: 10,
    },
    photo: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        marginTop: 10,
    },
    description: {
        marginBottom: 10,
    },
});
