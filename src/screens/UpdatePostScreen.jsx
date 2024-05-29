import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Platform} from 'react-native';
import {Button, Dialog, IconButton, Portal, Text, TextInput} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import {authTokenNames, isImage} from "../helpers";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused, useNavigation} from "@react-navigation/native";


function UpdatePostScreen({route}) {
    const {postId} = route?.params;
    const [dialog, setDialog] = useState({visible: false, content: ""});
    const [content, setContent] = useState('');
    const [currentAttachments, setCurrentAttachments] = useState([]);
    const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);
    const [newAttachments, setNewAttachments] = useState([]);
    const {t} = useTranslation();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const sendData = async () => {
        // attachments_delete_ids
        if (!postId)
            throw new Error("Post id is undefined")

        if (!content) {
            setDialog({visible: true, content: t('postDescRequired')});
            return;
        }

        const data = new FormData();

        if (attachmentsToDelete)
            attachmentsToDelete.map(id => {
                data.append('attachments_delete_ids', id);
            })

        newAttachments.map(photo => {
                data.append('attachments', {
                    name: photo.fileName,
                    type: photo.type,
                    uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
                });
            }
        );
        data.append('content', content);

        const token = await AsyncStorage.getItem(authTokenNames.access_token);
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            body: data
        }
        const response = await fetch(`http://10.0.2.2:8000/api/posts/${postId}/`, options)
        if (!response.ok) {
            throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
        }
        navigation.goBack();
    };

    const handleUpdate = () => {
        sendData().catch(e =>
            console.error(`Update ${e}`)
        )
    };

    const handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchCamera(options, response => {
            if (response.assets) response = response.assets[0];
            if (response.uri) {
                if (!response.fileName) response.fileName = `${Date.now()}.jpg`;
                setNewAttachments([...newAttachments, response]);
            }
        });
    };
    const handleFetchedData = (argData) => {
        setContent(argData?.content);
        setCurrentAttachments(argData?.attachments);
    }

    const getData = async () => {
        try {
            if (!postId)
                throw new Error("Post id is undefined")

            const token = await AsyncStorage.getItem(authTokenNames.access_token);
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await fetch(`http://10.0.2.2:8000/api/posts/${postId}/`, options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
            // setData(await response.json());
            handleFetchedData(await response.json());
        } catch (e) {
            console.error(`Post details fetch ${e}`)
        }
    };

    const handleRemoveCurrentAttachment = (index, attachmentId) => {
        setAttachmentsToDelete([...attachmentsToDelete, attachmentId]);
        setCurrentAttachments(currentAttachments.filter((_, i) => i !== index));
    };

    const handleRemoveNewAttachment = (index) => {
        setNewAttachments(newAttachments.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (isFocused) {
            getData();
        }
    }, [isFocused]);


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
                label={t('description')}
                value={content}
                onChangeText={text => setContent(text)}
                multiline
                style={styles.input}
            />
            <View style={styles.attachments}>
                {currentAttachments.map((attachment, index) => (
                    isImage(attachment?.attachment) &&
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{uri: attachment?.attachment}} style={styles.image}/>
                        <IconButton
                            style={styles.deleteIcon}
                            iconColor={"crimson"}
                            icon="delete"
                            size={20}
                            onPress={() => handleRemoveCurrentAttachment(index, attachment.id)}
                        />
                    </View>
                ))}
            </View>
            <Button mode="contained-tonal" onPress={handleChoosePhoto} style={styles.button}>
                {t('addPhoto')}
            </Button>
            <View style={styles.attachments}>
                {newAttachments.map((attachment, index) => (
                    isImage(attachment.uri) &&
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{uri: attachment.uri}} style={styles.image}/>
                        <IconButton
                            style={styles.deleteIcon}
                            iconColor={"crimson"}
                            icon="delete"
                            size={20}
                            onPress={() => handleRemoveNewAttachment(index)}
                        />
                    </View>
                ))}
            </View>
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                {t('update')}
            </Button>
        </View>
    )
        ;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
    },
    attachments: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
});

export default UpdatePostScreen;
