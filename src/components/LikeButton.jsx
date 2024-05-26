import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

const LikeButton = ({handleLike}) => {
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.container}>
            <IconButton icon={liked ? 'heart' : 'heart-outline'}
                        color={'red'} size={20}
                        onPress={() => {
                            setLiked(liked => !liked);
                            handleLike();
                        }}/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export default LikeButton;
