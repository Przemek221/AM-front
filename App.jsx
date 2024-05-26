import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {PaperProvider} from 'react-native-paper';


// const Stack = createNativeStackNavigator();
const Stack = createMaterialBottomTabNavigator();

export const AuthContext = React.createContext();

export default function App() {
    const [userSignedIn, setUserSignedIn] = useState(false);

    return (
        <NavigationContainer>
            <AuthContext.Provider value={{userSignedIn, setUserSignedIn}}>
                <SafeAreaProvider>
                    <PaperProvider>
                        <Stack.Navigator>
                            {userSignedIn
                                ? <>
                                    <Stack.Screen
                                        name="Home"
                                        component={HomeScreen}
                                        // options={{title: 'Welcome'}}
                                        // options={{ headerShown: false }}
                                    />
                                    <Stack.Screen name="Profile" component={ProfileScreen}/>
                                    <Stack.Screen name="CreatePost" component={CreatePostScreen}
                                                  options={{title: "+"}}
                                    />
                                </>
                                : <>
                                    <Stack.Screen name="Login" component={LoginScreen}/>
                                    <Stack.Screen name="Register" component={RegisterScreen}/>
                                </>
                            }
                        </Stack.Navigator>
                    </PaperProvider>
                </SafeAreaProvider>
            </AuthContext.Provider>
        </NavigationContainer>
    );
}
