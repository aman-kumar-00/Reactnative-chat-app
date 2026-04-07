import { View, Text,TouchableOpacity,StyleSheet } from 'react-native'
import {AppwriteContext} from '../src/appwrite/AppwriteContext';

import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState,useContext } from "react";

export default function Profile() {

   const { appwrite, setiSLoggedIn } = useContext(AppwriteContext);

  const handleLogout = async () => {
    try {
      await appwrite.logout(); // delete session
      setiSLoggedIn(false);    // go to login
    } catch (error) {
      console.log("Logout error:", error);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>

     <View style={{ flex: 1 }}>
      <Text>Profile screen</Text>

       <Text style={styles.title}>Welcome 🎉</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>

    </SafeAreaView>
   
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },

  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 8,
    width: 140,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
