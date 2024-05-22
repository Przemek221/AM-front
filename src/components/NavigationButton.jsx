import React from 'react';
import { Button } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";

export default function NavigationButton({destination,children}) {
    const navigation = useNavigation()
    return(
        <Button mode="outlined" /*title={title}*/ onPress={()=>navigation.navigate(destination)}>
            {children}
        </Button>
    )
}
