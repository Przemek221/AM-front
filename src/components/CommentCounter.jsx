import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';

const CommentCounter = ({commentsAmount}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.commentText}>{commentsAmount}</Text>
            <Icon source="comment-text-outline" size={20} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    commentText: {
        marginRight: 10,
    },
});

export default CommentCounter;
