import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import Appnavigator from "./Appnavigator";
import Authnavigator from "./Authnavigator";
import { AppwriteContext } from "../src/appwrite/AppwriteContext";

export default function AuthResolver() {

  const {
    authReady,
    isLoggedIn
  } = useContext(AppwriteContext);

  // Loading until auth check finishes
  if (!authReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isLoggedIn
    ? <Appnavigator />
    : <Authnavigator />;
}