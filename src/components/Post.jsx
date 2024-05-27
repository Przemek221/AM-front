import React, {useState} from 'react';
import {Image, StyleSheet, View} from "react-native";
import Comment from "./Comment";
import {authTokenNames, formatDate} from "../helpers";
import {Avatar, Card, Modal, Portal, Text} from "react-native-paper";
import LikeButton from "./LikeButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * @param {number} id
 * @param {number} creator
 * @param {Array} likes
 * @param {String} createdDate
 * @param {Array} attachments
 * @param {Array} comments
 * @param {String} content
 * @param {function} handlePressPost
 */
export default function Post({id, creator, likes, createdDate, attachments, content, comments, handlePressPost}) {
    const {username, userprofile} = creator;
    const [valid, setValid] = useState(true);

    const handleLike = async () => {
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
                // return response.json()
            })
            // .then(responseJson => {
            //     console.log(responseJson)
            // })
            .catch(error => {
                console.error(error)
            });

    };

    const containerStyle = {backgroundColor: 'white', padding: 20};
    return <>
        <Card mode={"elevated"} style={{margin: 10, padding: 5}} onPress={() => handlePressPost(true)}>
            <View>
                <Avatar.Image size={50} source={{uri: userprofile?.image}}/>
                <Text> {username}</Text>
            </View>
            <Text> {likes.length} likes </Text>
            <Text> {formatDate(createdDate)} </Text>
            {attachments &&
                attachments.map((attachment) => (
                        valid &&
                        <Image key={attachment?.id}
                               source={{uri: attachment?.attachment}}
                               style={styles.attachmentImage}
                               onError={() => setValid(false)}
                        />
                    )
                )
            }
            <Text> {content} </Text>
            <LikeButton handleLike={handleLike}/>
            {comments &&
                comments.map((comment) => (
                        <Comment /*to be developed*//>
                    )
                )
            }
        </Card>
    </>
}

const styles = StyleSheet.create({
    profileImage: {
        width: 50,
        height: 50,
        marginLeft: 5,
    },
    attachmentImage: {
        width: 200,
        height: 200,
        marginLeft: 15
    },
    text: {
        // width: 300,
        // alignSelf: 'stretch',
        // fontSize: 20,
        // backgroundColor: 'red',
        // marginTop: "auto",
        // marginBottom: "auto",
    },
});
