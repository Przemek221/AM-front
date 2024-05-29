import React, {useState} from 'react';
import {Image, Keyboard, Platform, StyleSheet, View} from 'react-native';
import {Dialog, Button, Portal, TextInput, Text, IconButton} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames, isImage} from "../helpers";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";

const CreatePostScreen = () => {
    const [photos, setPhotos] = useState([]);
    const [postDescription, setPostDescription] = useState("");
    const [dialog, setDialog] = useState({visible: false, content: ""});
    const {t} = useTranslation();
    const navigation = useNavigation();

    const handleChoosePhoto = () => {
        const options = {noData: true,};
        ImagePicker.launchCamera(options, (response) => {
            if (response.assets) response = response.assets[0];
            if (response.uri) {
                if (!response.fileName) response.fileName = `${Date.now()}.jpg`;
                setPhotos([...photos, response]);
            }
        });
    };
    const handleSubmit = async () => {
        if (!postDescription) {
            setDialog({visible: true, content: t('postDescRequired')});
            return;
        }

        const data = new FormData();
        photos.map(photo => {
                data.append('attachments', {
                    name: photo.fileName,
                    type: photo.type,
                    uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
                });
            }
        );
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
                setPostDescription('');
                setPhotos([]);
                Keyboard.dismiss();
                navigation.navigate("Home");
            })
            .catch(error => {
                setDialog({visible: true, content: t('somethingWentWrong')});
                console.error(error)
            });
    };

    const handleRemovePhotos = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
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
                <Button onPress={handleChoosePhoto} mode={"contained-tonal"}
                        style={styles.button}>
                    {t('addPhoto')}
                </Button>
                <View style={styles.attachments}>
                    {photos.map((attachment, index) => (
                        isImage(attachment.uri) &&
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{uri: attachment.uri}} style={styles.image}/>
                            <IconButton
                                style={styles.deleteIcon}
                                iconColor={"crimson"}
                                icon="delete"
                                size={20}
                                onPress={() => handleRemovePhotos(index)}
                            />
                        </View>
                    ))}
                </View>
                <Button onPress={handleSubmit} mode={"contained"} style={styles.button}>{t('createPost')}</Button>
            </View>
        </>
    );
};
export default CreatePostScreen;

const styles = StyleSheet.create({
    attachments: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
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
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
});
