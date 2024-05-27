import React from 'react';
import {View, StyleSheet} from 'react-native';
import {List, Switch, Button, Appbar, useTheme} from 'react-native-paper';
import {PreferencesContext, AuthContext} from "../../App";
import {removeTokenAndLogout} from "../helpers";

export default function SettingsScreen() {
    const theme = useTheme();
    const {isThemeDark, toggleTheme} = React.useContext(PreferencesContext);
    const {userSignedIn, setUserSignedIn} = React.useContext(AuthContext);
    const onToggleSwitch = () => toggleTheme(!isThemeDark);
    const handleLogout = () => {
        removeTokenAndLogout();
        setUserSignedIn(false);
    }
    return (
        <View style={styles.container}>
            <Appbar.Header theme={{
                colors: {primary: theme?.colors.surface}
            }}
            >
                <Appbar.Content title={"Settings"}/>
            </Appbar.Header>
            <List.Section>
                <List.Item title="Dark Theme"
                           left={() => <List.Icon icon={isThemeDark ? "brightness-3" : "brightness-7"}/>}
                           right={() => <Switch value={isThemeDark} onValueChange={onToggleSwitch}/>}
                />
            </List.Section>
            <Button mode={"contained"} onPress={handleLogout} style={styles.logoutButton}>
                Logout
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
