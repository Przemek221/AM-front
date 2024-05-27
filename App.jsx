import React from 'react';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Icon, PaperProvider} from 'react-native-paper';
import {MD3DarkTheme, MD3LightTheme, adaptNavigationTheme,} from 'react-native-paper';
import merge from 'deepmerge';
import SettingsScreen from "./src/screens/SettingsScreen";
import PostDetailsScreen from "./src/screens/PostDetailsScreen";
import myTranslation from "./src/translations/i18n";
import {useTranslation} from "react-i18next";

const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});
const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
export const AuthContext = React.createContext();
export const PreferencesContext = React.createContext({
    toggleTheme: () => {
    },
    isThemeDark: false,
});

const tabBarIconSize = 29

function HomeTabNavigation() {
    return (
        <Tab.Navigator labeled={false}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                renderIcon={'home'}
                options={{
                    tabBarIcon: (() =>
                            <Icon source="home" size={tabBarIconSize}/>
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                        options={{
                            tabBarIcon: (() =>
                                    <Icon source="account-circle" size={tabBarIconSize}/>
                            ),
                        }}
            />
            <Tab.Screen name="CreatePost" component={CreatePostScreen}
                        options={{
                            tabBarIcon: (() =>
                                    <Icon source="plus-thick" size={tabBarIconSize}/>
                            ),
                        }}
            />
            <Tab.Screen name="Settings" component={SettingsScreen}
                        options={{
                            tabBarIcon: (() =>
                                    <Icon source="cog" size={tabBarIconSize}/>
                            ),
                        }}
            />
        </Tab.Navigator>
    )
}

export default function App() {
    const [userSignedIn, setUserSignedIn] = React.useState(false);
    const [isThemeDark, setIsThemeDark] = React.useState(false);
    const {t} = useTranslation();

    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

    const toggleTheme = React.useCallback(() => {
        return setIsThemeDark(isThemeDark => !isThemeDark);
    }, [isThemeDark]);

    const preferences = React.useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );

    return (
        <PreferencesContext.Provider value={preferences}>
            <AuthContext.Provider value={{userSignedIn, setUserSignedIn}}>
                <SafeAreaProvider>
                    <PaperProvider theme={theme}>
                        <NavigationContainer theme={theme}>
                            {userSignedIn
                                ?
                                <Stack.Navigator>
                                    <Stack.Screen name="HomeTabNavigation" component={HomeTabNavigation}
                                                  options={{headerShown: false}}
                                    />
                                    <Stack.Screen name="PostDetails" component={PostDetailsScreen}
                                                  options={{title: ''}}
                                    />
                                </Stack.Navigator>
                                : <Tab.Navigator labeled={false}>
                                    <Tab.Screen name="Login" component={LoginScreen}
                                                options={{
                                                    tabBarIcon: (() =>
                                                            <Icon source="login" size={tabBarIconSize}/>
                                                    ),
                                                }}
                                    />
                                    <Tab.Screen name="Register" component={RegisterScreen}
                                                options={{
                                                    tabBarIcon: (() =>
                                                            <Icon source="account-plus" size={tabBarIconSize}/>
                                                    ),
                                                }}
                                    />
                                </Tab.Navigator>
                            }
                        </NavigationContainer>
                    </PaperProvider>
                </SafeAreaProvider>
            </AuthContext.Provider>
        </PreferencesContext.Provider>
    );
}
