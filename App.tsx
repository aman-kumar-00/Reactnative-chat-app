import 'react-native-url-polyfill/auto';
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AuthResolver from "./navigation/Authresolver";
import AppwriteProvider from "./src/appwrite/AppwriteContext";




export default function App() {
  return (
    <AppwriteProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthResolver />
        </NavigationContainer>
      </SafeAreaProvider>
      </AppwriteProvider>
    
  );
}

