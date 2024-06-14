import React from 'react';
import {Image, StyleSheet, View} from "react-native";
import {formatDate, isImage} from "../helpers";
import {Avatar, Card, Text} from "react-native-paper";
import LikeButton from "./LikeButton";
import CommentCounter from "./CommentCounter";

/**
 * @param {number} id
 * @param {Object} creator
 * @param {Array} likes
 * @param {String} createdDate
 * @param {Array} attachments
 * @param {String} content
 * @param {Array} comments
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
                                 comments,
                                 handlePressPost,
                                 requestUserIsOwner,
                                 requestUserLiked
                             }) {
    const {username, userprofile} = creator;

    return <>
        <Card mode={"elevated"} style={styles.card} onPress={() => handlePressPost(id)}>
            <View style={styles.postCreatorContainer}>
                <Avatar.Image size={45} source={{uri: userprofile?.image}}/>
                <Text style={styles.username}> {username}</Text>
            </View>
            <Text style={styles.date}> {formatDate(createdDate)} </Text>
            {attachments &&
                <View style={styles.attachments}>
                    {attachments.map((attachment) => (
                        isImage(attachment?.attachment) &&
                        <Image key={attachment?.id} source={{uri: attachment?.attachment}} style={styles.image}/>
                    ))}
                </View>
            }
            <Text style={styles.text}> {content} </Text>
            <View style={styles.likeContainer}>
                <CommentCounter postId={id} commentsAmount={comments.length} requestUserLiked={requestUserLiked}/>
                <LikeButton postId={id} likesAmount={likes.length} requestUserLiked={requestUserLiked}/>
            </View>
        </Card>
    </>
}



const styles = StyleSheet.create({
    attachments: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: 180,
        height: 250,
        margin: 5,
        objectFit: "contain",
    },
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
    },
});
