import { View, Text,TouchableOpacity,StyleSheet } from 'react-native'
import {AppwriteContext} from '../src/appwrite/AppwriteContext';

import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState,useContext,useEffect } from "react";

export default function Profile() {

   const { appwrite, setiSLoggedIn } = useContext(AppwriteContext);

      const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    const loadUser = async () => {

      try {

        console.log("Getting current user...");

        const currentUser =
          await appwrite.getCurrentUser();

        console.log("USER ID:", currentUser?.$id);
        console.log("USER NAME:", currentUser?.name);
        console.log("USER EMAIL:", currentUser?.email);

        setUser(currentUser);

      } catch (error) {

        console.log(
          "GET USER ERROR:",
          error
        );

      }

    };

    loadUser();

  }, [appwrite]);

  

  

  const handleLogout = async () => {
    try {
      await appwrite.logout(); // delete session
      setiSLoggedIn(false);    // go to login
    } catch (error) {
      console.log("Logout error:", error);
    }
  };


  // UI
  return (

    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >

      <View style={styles.container}>

        {/* Profile Title */}

        <Text style={styles.profileTitle}>
           Welcome {user?.name}
        </Text>


        {/* Name */}

        <View style={styles.infoBox}>

          <Text style={styles.label}>
            Name
          </Text>

          <Text style={styles.value}>
            {user?.name || "Loading..."}
          </Text>

        </View>


        {/* Email */}

        <View style={styles.infoBox}>

          <Text style={styles.label}>
            Email
          </Text>

          <Text style={styles.value}>
            {user?.email || "Loading..."}
          </Text>

        </View>


        {/* User ID */}

        <View style={styles.infoBox}>

          <Text style={styles.label}>
            User ID
          </Text>

          <Text style={styles.idValue}>
            {user?.$id || "Loading..."}
          </Text>

        </View>


        {/* Logout */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >

          <Text style={styles.buttonText}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F172A",
  },

  profileTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 6,
  },

  value: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  idValue: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 8,
    width: 140,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

});