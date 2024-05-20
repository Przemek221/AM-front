import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';


export default function ProfileScreen() {
    return (
        <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View>
                    <Text>
                        Profile screen
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
