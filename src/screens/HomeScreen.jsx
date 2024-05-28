import React, {useEffect, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    View
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Post from "../components/Post";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";

export default function HomeScreen() {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const getData = async () => {
        try {
            const token = await AsyncStorage.getItem(authTokenNames.access_token);
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await fetch('http://10.0.2.2:8000/api/posts/', options)
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
            setData(await response.json());
        } catch (e) {
            console.error(`Home screen fetch ${e}`)
        }
    }

    useEffect(() => {
        if (isFocused || refresh) {
            getData().then(() => setRefresh(false));
        }
    }, [refresh, isFocused]);

    const handlePressPost = (postId) => {
        navigation.navigate('PostDetails', {postId: postId});
    }

    return (
        <>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => setRefresh(true)}/>}
                >
                    <View>
                        {data ?
                            (data?.results.map((post) => (
                                    <Post key={post?.id} {...post} handlePressPost={handlePressPost}/>))
                            )
                            : (<ActivityIndicator animating={true}/>)
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
