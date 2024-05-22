import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    let userSignedIn=true

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userSignedIn
                    ? <>
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            // options={{title: 'Welcome'}}
                        />
                        <Stack.Screen name="Profile" component={ProfileScreen}/>
                    </>
                    : <>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="Register" component={RegisterScreen}/>
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}
