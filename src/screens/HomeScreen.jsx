import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Post from "../components/Post";
import NavigationButton from "../components/NavigationButton";

export default function HomeScreen() {
    const [data, setData] = useState(null);
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
        getData();
    }, []);


    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <View>
                    <NavigationButton destination={"Profile"}>Profile</NavigationButton>
                    <NavigationButton destination={"Login"}>Login</NavigationButton>
                </View>
                <View>
                {data ?
                // (data?.results.map((post)=>(<Text key={post?.id}>{post?.content}</Text>))
                (data?.results.map((post)=>(<Post key={post?.id} {...post}  />))
                // console.log(data.results)
                )
                : (<Text style={styles.text}> Loading... </Text>)
                }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        alignSelf: 'stretch',
        fontSize: 50,
        backgroundColor: 'red',
        marginTop: "auto",
        marginBottom: "auto",
    },
});
