import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "./src/helpers";

const Stack = createNativeStackNavigator();

export const AuthContext = React.createContext();

export default function App() {
    const [userSignedIn, setUserSignedIn] = useState(false);

    //     = useState(async () => {
    //     try {
    //         const isKeyInStorage = await AsyncStorage.getItem(authTokenNames.access_token);
    //         return isKeyInStorage !== null;
    //     } catch (e) {
    //         console.error(e);
    //     }
    // });

    return (
        <NavigationContainer>
            <AuthContext.Provider value={{userSignedIn, setUserSignedIn}}>
                <Stack.Navigator>
                    {userSignedIn
                        ? <>
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                // options={{title: 'Welcome'}}
                            />
                            <Stack.Screen name="Profile" component={ProfileScreen}/>
                            <Stack.Screen name="CreatePost" component={CreatePostScreen}/>
                        </>
                        : <>
                            <Stack.Screen name="Login" component={LoginScreen}/>
                            <Stack.Screen name="Register" component={RegisterScreen}/>
                        </>
                    }
                </Stack.Navigator>
            </AuthContext.Provider>
        </NavigationContainer>
    );
}
