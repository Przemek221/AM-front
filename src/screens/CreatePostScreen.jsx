import React, {useState} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {Dialog, Button, Portal, TextInput, Text, Provider} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";

const App = () => {
    const [photo, setPhoto] = useState(null);
    const [postDescription, setPostDescription] = useState("");
    const [dialog, setDialog] = useState({visible: false, content: ""});

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
            setDialog({visible: true, content: "Post description is required"});
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
                setDialog({visible: true, content: "Something went wrong, please try again."});
                console.error(error)
            });
    };
    return (
        <Provider>
            <Portal>
                <Dialog visible={dialog.visible} onDismiss={() => setDialog({visible: false, content: ""})}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{dialog.content}</Text>
                    </Dialog.Content>
                </Dialog>
            </Portal>
            <View style={styles.wrapper}>
                <View style={styles.photosWrapper}>
                    <Button onPress={handleChoosePhoto} mode={"contained-tonal"} style={styles.add}>Add Photo</Button>
                    <View style={styles.photosContainer}>
                        {photo && (<Image source={{uri: photo.uri}} style={styles.photo}/>)}
                    </View>
                </View>
                <TextInput label="Description"
                           value={postDescription}
                           onChangeText={text => setPostDescription(text)}
                           style={styles.description}
                           multiline={true}
                />
                <Button onPress={handleSubmit} mode={"contained"} style={styles.create}>Create Post</Button>
            </View>
        </Provider>
    );
};
export default App;

const styles = StyleSheet.create({
    wrapper: {
        // display: "flex",
        // position: "absolute",
        // justifyContent: "center",
        // flexDirection: "column",
        padding: 10,
        marginTop: "auto",
        marginBottom: "auto",
        width: "100%",
    },
    create: {
        width: 150,
        marginLeft: "auto",
        marginRight: "auto",
    },
    add: {
        // width: "30%",
        // height: 40,
        // paddingVertical:"auto",
        position: "absolute",
        bottom: 0,
        // marginLeft: "auto",
        // marginRight: "auto",
        // display: "flex",
    },
    photo: {
        width: 270,
        height: 200,
    },
    photosContainer: {
        width: "70%",
        display: "flex",
        // flexDirection: "row-reverse",
        marginRight:"30%",
        overflow:"hidden"
    },
    photosWrapper: {
        display: "flex",
        flexDirection: "row-reverse",
    },
    description:{
        marginVertical:15,
        height:300,
    },
});
