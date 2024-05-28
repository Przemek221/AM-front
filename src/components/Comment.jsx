import {StyleSheet, View} from "react-native";
import {Avatar, Button, Card, Text} from "react-native-paper";
import React from "react";
import {formatDate} from "../helpers";
import {useTranslation} from "react-i18next";
import DeleteDialog from "./DeleteDialog";

/**
 * @param {number} id
 * @param {number} creator
 * @param {Array} likes
 * @param {String} createdDate
 * @param {String} content
 * @param {boolean} requestUserIsOwner
 * @param {function} setRefresh
 */
export default function Comment({id, requestUserIsOwner, content, createdDate, creator, setRefresh}) {
    const {username, userprofile} = creator;
    const {t} = useTranslation()
    const [showDialog, setShowDialog] = React.useState(false);

    const handleDeleteButton = () => {
        setShowDialog(true);
    }

    return (
        <View>
            {requestUserIsOwner &&
                <>
                    <Button mode={"text"}
                            onPress={handleDeleteButton}
                            style={styles.updateButton}>
                        {t("delete")}
                    </Button>

                    <DeleteDialog objectId={id} objectType={'comment'} visibility={showDialog}
                                  setVisibility={setShowDialog} afterDelete={() => setRefresh(true)}/>
                </>
            }
            <Card mode={"elevated"} style={styles.card}>

                <View style={styles.creatorContainer}>
                    <Avatar.Image size={37} source={{uri: userprofile?.image}}/>
                    <Text style={styles.username}> {username}</Text>
                </View>
                <Text style={styles.date}> {formatDate(createdDate)} </Text>
                <Text style={styles.text}> {content} </Text>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    username: {
        fontWeight: "bold",
        fontSize: 15,
    },
    card: {
        margin: 10,
        padding: 5,
    },
    profileImage: {
        width: 50,
        height: 10,
    },
    updateButton: {
        margin: 10,
        padding: 5,
        right: 0,
        position: "absolute",
        zIndex: 1,
    },
    creatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
    },
    date: {
        marginVertical: 5,
        fontSize: 12,
    },
    text: {
        marginVertical: 5,
    }
});
