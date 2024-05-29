import {IconButton, TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import React from "react";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";

const CommentCreateForm = ({setRefresh, postId}) => {
    const [content, setContent] = React.useState('');
    const {t} = useTranslation();

    const isFormValid = () => {
        return (content !== '');
    }

    const handleComment = async () => {
        if (!isFormValid())
            return;
        try {
            const token = await AsyncStorage.getItem(authTokenNames.access_token);
            const data = {
                "content": content,
                "relatedPost": postId
            }
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }
            const response = await fetch(`http://10.0.2.2:8000/api/comments/`, options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
            setContent('');
            setRefresh(true);
        } catch (e) {
            console.error(`Comment create ${e}`)
        }
    };

    return (
        <View style={styles.commentForm}>
            <TextInput
                multiline={true}
                label={t('comment')}
                value={content}
                onChangeText={setContent}
                mode="outlined"
                style={styles.input}
            />
            <IconButton icon="send" size={styles.commentCreateButton.size}
                        style={styles.commentCreateButton} onPress={handleComment}/>
        </View>
    )
}
export default CommentCreateForm


const styles = StyleSheet.create({
    commentForm: {
        margin: 10,
        padding: 5,
        // paddingRight: 50,
        flexDirection: "row",
        alignItems: "center",
    },
    commentCreateButton: {
        size: 25,
        flexDirection: "row",
    },
    input: {
        width: 330,
    }
});
