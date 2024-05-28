import React, {useEffect, useState} from 'react';
import {Button, ActivityIndicator} from 'react-native-paper';
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {authTokenNames} from "../helpers";
import Comment from "../components/Comment";
import Post from "../components/Post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";
import DeleteDialog from "../components/DeleteDialog";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import CommentCreateForm from "../components/CommentCreateForm";

const dummy = {
    creator: {
        username: '',
        userprofile: '',
    },
    likes: '',
    createdDate: '',
    attachments: '',
    content: '',
    comments: '',
    requestUserIsOwner: false,
    requestUserLiked: false,
}

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

export default function PostDetailsScreen({route}) {
    const {postId} = route?.params;
    const navigation = useNavigation()
    const {t} = useTranslation();
    // const [valid, setValid] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState(null);
    const [showDialog, setShowDialog] = React.useState(false);
    const isFocused = useIsFocused();

    const {comments, requestUserIsOwner} = (data ? data : dummy);
    const commentsReversed = data ? [...comments].reverse() : [];

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
            setData(await response.json());
        } catch (e) {
            console.error(`Post details fetch ${e}`)
        }
    }


    const navigateToHomePage = () => {
        navigation.navigate("HomeTabNavigation");
    }

    useEffect(() => {
        if (isFocused || refresh) {
            getData().then(() => setRefresh(false))
        }
    }, [refresh, isFocused]);

    return (
        <>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => setRefresh(true)}/>}
                >
                    <View>
                        {!data ?
                            (<ActivityIndicator animating={true}/>)
                            :
                            (<>

                                {requestUserIsOwner &&
                                    <View style={styles.ownerButtonsContainer}>
                                        <Button mode={"text"}
                                                onPress={() => {
                                                    console.log("updateBtn")
                                                }}
                                                style={styles.ownerButton}>
                                            {t("update")}
                                        </Button>
                                        <Button mode={"text"}
                                                onPress={() => {
                                                    setShowDialog(true)
                                                }}
                                                style={styles.ownerButton}>
                                            {t("delete")}
                                        </Button>
                                        <DeleteDialog objectId={postId} objectType={'post'} visibility={showDialog}
                                                      setVisibility={setShowDialog} afterDelete={navigateToHomePage}/>

                                    </View>
                                }

                                <Post {...data} handlePressPost={() => {
                                }}/>
                                {/*<View style={styles.commentForm}>*/}
                                {/*    <Text>{"Comment create form"}</Text>*/}
                                {/*</View>*/}
                                <CommentCreateForm postId={postId} setRefresh={setRefresh}/>

                                {commentsReversed.map((comment, key) => (
                                    <Comment {...comment} key={key} setRefresh={setRefresh}/>
                                ))}
                            </>)
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({
    ownerButtonsContainer: {
        flexDirection: "row",
        margin: 10,
        padding: 5,
        right: 0,
        position: "absolute",
        zIndex: 1,
    },
    ownerButton: {},
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
});
