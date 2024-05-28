import React from 'react';
import {View, StyleSheet} from 'react-native';
import {List, Switch, Button, Appbar, useTheme} from 'react-native-paper';
import {PreferencesContext, AuthContext} from "../../App";
import {authTokenNames} from "../helpers";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
    const theme = useTheme();
    const {isThemeDark, toggleTheme} = React.useContext(PreferencesContext);
    const {userSignedIn, setUserSignedIn} = React.useContext(AuthContext);
    const {t, i18n} = useTranslation();

    const onToggleSwitch = () => toggleTheme(!isThemeDark);
    const sendLogoutRequest = async () => {
        const token = await AsyncStorage.getItem(authTokenNames.access_token)
        const token_refresh = await AsyncStorage.getItem(authTokenNames.refresh_token)
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: {
                'refresh': `${token_refresh}`
            }
        }
        const response = await fetch('http://10.0.2.2:8000/api/logout/', options)
        if (!response.ok)
            throw new Error(JSON.stringify({code: response.status, message: response.statusText}))
    }
    const handleLogout = async () => {
        try {
            await sendLogoutRequest();
            await AsyncStorage.removeItem(authTokenNames.access_token);
            // localStorage.removeItem(authTokenNames.refresh_token);
            setUserSignedIn(false);
        } catch (e) {
            console.error(e);
        }
    }

    const handleLanguageChange = (languageId) => {
        i18n.changeLanguage(languageId)
    }

    return (
        <View style={styles.container}>
            <Appbar.Header theme={{
                colors: {primary: theme?.colors.surface}
            }}
            >
                <Appbar.Content title={t('settings')}/>
            </Appbar.Header>
            <List.Section>
                <List.Item title={t('darkTheme')}
                           left={() => <List.Icon icon={isThemeDark ? "brightness-3" : "brightness-7"}/>}
                           right={() => <Switch value={isThemeDark} onValueChange={onToggleSwitch}/>}
                />

                <List.Accordion
                    title={t('language')}
                    left={() => <List.Icon icon="alphabet-greek"/>}>
                    <List.Item title="EN"
                               right={() => (i18n.language === 'en' ?
                                       <List.Icon icon={"check"}/>
                                       :
                                       <></>
                               )
                               }
                               style={{paddingHorizontal: 50}}
                               onPress={() => handleLanguageChange('en')}
                    />
                    <List.Item title="PL"
                               right={() => (i18n.language === 'pl' ?
                                       <List.Icon icon={"check"}/>
                                       :
                                       <></>
                               )
                               }
                               style={{paddingHorizontal: 50}}
                               onPress={() => handleLanguageChange('pl')}
                    />
                </List.Accordion>
            </List.Section>
            <Button mode={"contained"} onPress={handleLogout} style={styles.logoutButton}>
                {t('logout')}
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    logoutButton: {
        marginTop: 30,
    }
})
