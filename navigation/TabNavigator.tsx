import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Notification from "../screens/Notification";
import Camera from "../screens/Camera";

const Tab = createBottomTabNavigator();

function CustomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 10);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={[styles.barWrap, { bottom }]}>
        <BottomTabBar {...props} />
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let icon: any = null;

          if (route.name === "Home") {
            icon = require("../assets/home-button.png");
          }

          if (route.name === "Notification") {
            icon = require("../assets/notification-bell.png");
          }

            if (route.name === "Profile") {
            icon = require("../assets/user.png");
          }


          if(route.name==="camera"){
            icon=require("../assets/add.png");
          }

        
          return (
            <Image
              source={icon}
              style={[styles.tabIcon, focused && styles.tabIconFocused]}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="camera" component={Camera} />
      <Tab.Screen name="Profile" component={Profile} />
       
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  tabBar: {
    backgroundColor: "#000",
    borderTopWidth: 0,
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
    
  },
  tabIcon: {
    width: 30,
    height: 30,
    opacity: 0.85,
  },
  tabIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.06 }],
  },
  
  addIcon: {
    width: 28,
    height: 28,
  },
});
