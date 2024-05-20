import React from 'react';
import {Button} from "react-native";
import {useNavigation} from "@react-navigation/native";

export default function NavigationButton({destination,title}) {
    const navigation = useNavigation()
    return(
        <Button title={title} onPress={()=>navigation.navigate(destination)}/>
    )
}
