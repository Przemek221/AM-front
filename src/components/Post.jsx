import React, {useState} from 'react';
import {Image, StyleSheet, View} from "react-native";
import Comment from "./Comment";
import {formatDate} from "../helpers";
import {Avatar, Card, Text} from "react-native-paper";


/**
 * @param {number} creator
 * @param {Array} likes
 * @param {String} createdDate
 * @param {Array} attachments
 * @param {Array} comments
 * @param {String} content
 */
export default function Post({creator, likes, createdDate, attachments, content, comments}) {
    // const date = new Date(createdDate);
    const {username, userprofile} = creator;
    const [valid, setValid] = useState(true)

    return <>
        <Card mode={"elevated"} style={{margin: 10, padding:5}}>
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
