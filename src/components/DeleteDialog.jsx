import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Dialog, Portal, Button} from 'react-native-paper';
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";


const DeleteDialog = ({objectType, objectId, visibility, setVisibility, afterDelete}) => {
    const {t} = useTranslation()
    const hideDialog = () => {
        setVisibility(false);
    };
    const deletePost = async () => {
        afterDelete(); //before delete navigate to home screen
        try {
            if (!objectId)
                throw new Error("Post id is undefined")

            const token = await AsyncStorage.getItem(authTokenNames.access_token);
            const options = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await fetch(`http://10.0.2.2:8000/api/posts/${objectId}/`, options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
        } catch (e) {
            console.error(`Post delete ${e}`)
        }
    }
    const deleteComment = async () => {
        try {
            if (!objectId)
                throw new Error("Comment id is undefined")

            const token = await AsyncStorage.getItem(authTokenNames.access_token);
            const options = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await fetch(`http://10.0.2.2:8000/api/comments/${objectId}/`, options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
        } catch (e) {
            console.error(`Comment delete ${e}`)
        }
        afterDelete();
    }

    const handleDeleteButton = () => {
        switch (objectType) {
            case 'post':
                deletePost();
                break;
            case 'comment':
                deleteComment();
                break;
            default:
                break;
        }
    }

    return (
        <Portal>
            <Dialog visible={visibility} onDismiss={hideDialog}>
                <Dialog.Icon icon="alert"/>
                <Dialog.Title style={styles.title}>{t('deleteAlert')}</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>{t('cancel')}</Button>
                    <Button onPress={handleDeleteButton}>{t('delete')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
})

export default DeleteDialog;
