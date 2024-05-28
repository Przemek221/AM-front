import React, {useEffect, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "../helpers";
import Post from "../components/Post";
import {ActivityIndicator, Avatar, Card} from "react-native-paper";
import {useIsFocused, useNavigation} from "@react-navigation/native";


export default function ProfileScreen() {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const posts = data ? [...data?.user_posts].reverse() : [];

    const getData = async () => {
        try {
            const token = await AsyncStorage.getItem(authTokenNames.access_token)
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await fetch('http://10.0.2.2:8000/api/profile/', options)
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
            getData().then(() => setRefresh(false))
        }
    }, [refresh, isFocused]);

    const handlePressPost = (postId) => {
        navigation.navigate('PostDetails', {postId: postId});
    }

    // data?.userprofile?.image
    // data?.username
    // data?.email
    // data?.user_posts
    return (
        <SafeAreaView>
            {data != null ?
                <ScrollView contentInsetAdjustmentBehavior="automatic"
                            refreshControl={
                                <RefreshControl refreshing={refresh} onRefresh={() => setRefresh(true)}/>
                            }
                >
                    <View>
                        <Card mode={"contained"} style={{padding: 20, margin: 5}}>
                            <Card.Title
                                title={data?.username}
                                titleStyle={{fontSize: 25}}
                                right={() =>
                                    <Avatar.Image size={60} source={{uri: data?.userprofile?.image}}/>
                                }
                            />

                        </Card>
                    </View>
                    <View>
                        {/*{data?.user_posts?.map((post) => (*/}
                        {posts.map((post) => (
                            <Post key={post?.id} {...post}
                                  handlePressPost={handlePressPost}
                            />
                        ))}
                    </View>
                </ScrollView>
                :
                <View>
                    <ActivityIndicator animating={true}/>
                </View>
            }
        </SafeAreaView>
    );
}
