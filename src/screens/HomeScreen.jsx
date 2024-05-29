import React, {useEffect, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    View
} from 'react-native';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import Post from "../components/Post";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";

export default function HomeScreen() {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [pagination, setPagination] = useState(null);
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
            const requestUrl = pagination ? pagination.toString() : 'http://10.0.2.2:8000/api/posts/';
            const response = await fetch(requestUrl, options);
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
    }, [refresh, isFocused, pagination]);

    const handlePressPost = (postId) => {
        navigation.navigate('PostDetails', {postId: postId});
    }

    // "next": "http://localhost:8000/api/posts/?page=3",
    // "previous": "http://localhost:8000/api/posts/",
    const handleNextPress = () => {
        if (!data?.next) return;
        setPagination(data?.next);
    }
    const handlePrevPress = () => {
        if (!data?.previous) return;
        setPagination(data?.previous);
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
                            (
                                <>
                                    <View>
                                        {data?.results.map(post => (
                                            <Post key={post?.id} {...post} handlePressPost={handlePressPost}/>
                                        ))}
                                    </View>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginHorizontal: 30,
                                    }}>
                                        <IconButton disabled={!data?.previous}
                                                    icon={'arrow-left-bold-box'}
                                                    size={30}
                                                    onPress={handlePrevPress}/>
                                        <IconButton disabled={!data?.next}
                                                    icon={'arrow-right-bold-box'}
                                                    size={30}
                                                    onPress={handleNextPress}/>
                                    </View>
                                </>
                            )
                            : (<ActivityIndicator animating={true}/>)
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
