import React from 'react';
import { Button } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";

export default function NavigationButton({destination,children, ...props}) {
    const navigation = useNavigation()
    return(
        <Button {...props} mode="outlined" onPress={()=>navigation.navigate(destination)}>
            {children}
        </Button>
    )
}
