import React, {useState} from 'react';
import {Button, Image, Platform} from 'react-native';
import {TextInput} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';

const App = () => {
    const [photo, setPhoto] = useState(null);
    const [postDescription, setPostDescription] = useState("");
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
    const handleSubmit = () => {
        // const data = new FormData();
        // data.append('photo', {
        //     name: photo.fileName,
        //     type: photo.type,
        //     uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        // });
        // data.append('description', postDescription);
        let data = {
            "content": "dsads-reactNative",
            "creator": 1,
        }
        console.log("data:")
        console.log(data)
        // fetch('http://10.0.2.2:8000/api/posts/', {
        fetch('http://10.0.2.2:8000/post/new/', {
            method: 'POST',
            body: data,
        })
            .then(response => response.json())
            .then(responseJson => console.log(responseJson))
            .catch(error => console.error(error));
    };
    return (
        <>
            <Button title="Take Photo" onPress={handleChoosePhoto}/>
            {photo && (<Image source={{uri: photo.uri}} style={{width: 300, height: 300}}/>)}
            <TextInput label="Description"
                       value={postDescription}
                       onChangeText={text => setPostDescription(text)}
            />
            <Button title="Submit Post" onPress={handleSubmit}/>
        </>
    );
};
export default App;
