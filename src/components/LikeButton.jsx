import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";


const LikeButton = ({postId, likesAmount, requestUserLiked}) => {
    const [liked, setLiked] = useState(requestUserLiked);
    const [numOfLikes, setNumOfLikes] = useState(likesAmount);

    React.useEffect(()=>{
        setNumOfLikes(likesAmount);
        setLiked(requestUserLiked);
    },[likesAmount])
    const handleLike = async (id) => {
        const token = await AsyncStorage.getItem(authTokenNames.access_token);
        fetch(`http://10.0.2.2:8000/api/posts/${id}/like/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok)
                    throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
                if (response.status === 204) {
                    setLiked(false);
                    setNumOfLikes(prevNum => prevNum - 1);
                } else if (response.status === 201) {
                    setLiked(true);
                    setNumOfLikes(prevNum => prevNum + 1);
                }
            })
            .catch(error => {
                console.error(error)
            });
    };

    return (
        <View style={styles.container}>
            <Text>{numOfLikes}</Text>
            <IconButton icon={liked ? 'heart' : 'heart-outline'}
                        color={'red'} size={20}
                        onPress={() => {
                            handleLike(postId);
                        }}/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export default LikeButton;
