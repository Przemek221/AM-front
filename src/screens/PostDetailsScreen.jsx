import React, {useEffect} from 'react';
import {Modal, Portal, Text, Button, PaperProvider, Avatar, Card} from 'react-native-paper';
import {Image, View} from "react-native";
import {formatDate} from "../helpers";
import LikeButton from "../components/LikeButton";
import Comment from "../components/Comment";

/**
 // * @param {number} id
 // * @param {number} creator
 // * @param {Array} likes
 // * @param {String} createdDate
 // * @param {Array} attachments
 // * @param {Array} comments
 // * @param {String} content
 // * @param {boolean} visible
 // * @param {function} setVisible
 */
export default function PostDetailsScreen({postId}) {
    // const {username, userprofile} = creator;
    // const {id, creator, likes, createdDate, attachments, content, comments,visible, setVisible}
    const getData=(id)=>{
        console.log("abc1 "+postId)
    }

    React.useEffect(() => {
        getData(postId)
    }, [postId]);

    return (
            <Text>Example Modal.  Click outside this area to dismiss.</Text>
    )
}
