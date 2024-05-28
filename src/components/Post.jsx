import React, {useState} from 'react';
import {Image, StyleSheet, View} from "react-native";
import {formatDate} from "../helpers";
import {Avatar, Card, Text} from "react-native-paper";
import LikeButton from "./LikeButton";

/**
 * @param {number} id
 * @param {Object} creator
 * @param {Array} likes
 * @param {String} createdDate
 * @param {Array} attachments
 * @param {String} content
 * @param {function} handlePressPost
 * @param {boolean} requestUserIsOwner
 * @param {boolean} requestUserLiked
 */
export default function Post({
                                 id,
                                 creator,
                                 likes,
                                 createdDate,
                                 attachments,
                                 content,
                                 handlePressPost,
                                 requestUserIsOwner,
                                 requestUserLiked
                             }) {
    const {username, userprofile} = creator;
    const [valid, setValid] = useState(true);

    return <>
        <Card mode={"elevated"} style={styles.card} onPress={() => handlePressPost(id)}>
            <View style={styles.postCreatorContainer}>
                <Avatar.Image size={50} source={{uri: userprofile?.image}}/>
                <Text style={styles.username}> {username}</Text>
            </View>
            <Text style={styles.date}> {formatDate(createdDate)} </Text>
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
            <Text style={styles.text}> {content} </Text>
            <View style={styles.likeContainer}>
                <LikeButton postId={id} likesAmount={likes.length} requestUserLiked={requestUserLiked}/>
            </View>
        </Card>
    </>
}

const styles = StyleSheet.create({
    username: {
        fontWeight: "bold",
        fontSize: 20,
    },
    commentForm: {
        margin: 10,
        padding: 5,
    },
    card: {
        margin: 10,
        padding: 5,
    },
    profileImage: {
        width: 50,
        height: 50,
        marginLeft: 5,
    },
    attachmentImage: {
        width: "90%",
        height: 200,
        maxHeight: 300,
        objectFit: "scale-down",
        margin: 15,
    },
    postCreatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    date: {
        marginVertical: 10,
    },
    likeContainer: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    text: {
        marginHorizontal: 10,
        fontSize: 16,
    }
});
