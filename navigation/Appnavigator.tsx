import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import Camera from "../screens/Camera";
import Chatbox from "../screens/Chatbox";
import LogoWithText from "../components/LogoWithText";


const Stack = createNativeStackNavigator();

export default function Appnavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTab"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainTab" component={TabNavigator} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name = "Chatbox" component={Chatbox}/>
      
    </Stack.Navigator>
  );
}
