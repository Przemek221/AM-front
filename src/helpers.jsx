import {userSignedIn} from "./global";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const formatDate = (argDate) => {
    const date = new Date(argDate);
    const minutes = (date.getMinutes().toString().length === 1) ? `0${date.getMinutes()}` : date.getMinutes();
    const month = ((date.getMonth() + 1).toString().length === 1) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${date.getDate()}/${month}/${date.getFullYear()} ${date.getHours()}:${minutes}`;
}

export const authTokenNames = {
    access_token: 'access_token',
    refresh_token: 'refresh_token'
}

export const logout = async () => {
    try {
        await AsyncStorage.removeItem(authTokenNames.access_token);
        // localStorage.removeItem(authTokenNames.access_token);
    } catch (e) {
        console.error(e);
    }
}
