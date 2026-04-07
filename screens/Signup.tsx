import { useContext} from "react";
import { AppwriteContext } from "../src/appwrite/AppwriteContext";
import { Alert, ImageBackground } from "react-native";


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function Signup({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  

    // Later we connect Appwrite here
    const { appwrite, setiSLoggedIn } = useContext(AppwriteContext)

    
// sinup handling 

const handleSignup = async () => {

  console.log("SIGNUP DATA:", name, email, password);

  if (!name || !email || !password) {
    Alert.alert("Please fill all fields");
    return;
  }

  try {

    await appwrite.createAccount({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    // 🔥 THIS WAS MISSING
    setiSLoggedIn(true);

    // clear inputs
    setName("");
    setEmail("");
    setPassword("");

  } catch (error) {

    console.log("Signup error:", error);

  }
};

  

  return (

     <ImageBackground
            source={require("../assets/talking.png")}
            style={styles.background}
            resizeMode="cover"
          >
    <View style={styles.overlay}>
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>Create Account 🚀</Text>
        <Text style={styles.subtitle}>Join us today</Text>

        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.link}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
      
    </KeyboardAvoidingView>
    </View>
    </ImageBackground>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

   background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.6)",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
  },

  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: "#fff",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#16A34A", // green
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  link: {
    color: "#60A5FA",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
