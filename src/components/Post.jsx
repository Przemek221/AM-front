import React from 'react';
import {StyleSheet, Text, View} from "react-native";

export default function Post({postData}) {
    return <>
        <View>
            <View>
                <Text> {postData.creator} </Text>
            </View>
            <Text> {postData.likes} </Text>
            <Text> Created date </Text>
            <Text> attachments </Text>
            <Text> content </Text>
        </View>
    </>
}

const styles = StyleSheet.create({
    text: {
        // width: 300,
        // alignSelf: 'stretch',
        // fontSize: 20,
        // backgroundColor: 'red',
        // marginTop: "auto",
        // marginBottom: "auto",
    },
});
