import AsyncStorage from "@react-native-async-storage/async-storage";
import {authTokenNames} from "./helpers";

export const DEBUG = true;

export const debugLogin = (setUserSignedIn) => {
    const data = {
        "username": "admin",
        "password": "admin",
    }

    fetch('http://10.0.2.2:8000/api/token/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(JSON.stringify({code: response.status, message: response.statusText}));
        })
        .then(responseJson => {
            AsyncStorage.setItem(authTokenNames.access_token, responseJson.access)
                .catch(error => console.error(error));
            AsyncStorage.setItem(authTokenNames.refresh_token, responseJson.refresh)
                .catch(error => console.error(error));
            setUserSignedIn(true);
        })
        .catch(error => console.error(error));
};
