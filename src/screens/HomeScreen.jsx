import React, {useEffect, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    View
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Post from "../components/Post";
import {useNavigation} from "@react-navigation/native";

export default function HomeScreen() {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const getData = async () => {
        try {
            const response = await fetch('http://10.0.2.2:8000/api/posts/?page=2')
            if (!response.ok) {
                throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
            }
            setData(await response.json());
        } catch (e) {
            console.error(`Home screen fetch ${e}`)
        }
    }

    useEffect(() => {
        getData().then(() => setRefresh(false))
    }, [refresh]);

    const handlePressPost = (postId) => {
        navigation.navigate('PostDetails');
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
                                    <Post key={post?.id} {...post} handlePressPost={()=> {
                                        handlePressPost(post?.id);
                                    }}/>))
                            )
                            : (<ActivityIndicator animating={true}/>)
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
