import { AppwriteContext } from "../src/appwrite/AppwriteContext";
import { Alert,Linking } from "react-native";
import React, { useState, useContext,useEffect } from "react";


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image
} from "react-native";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { appwrite, setiSLoggedIn } = useContext(AppwriteContext);
// fill email and pass login 
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill all fields");
      return;
    }

    try {
      await appwrite.login({
        email: email.trim(),
        password: password.trim(),
      });

      setiSLoggedIn(true);
      
    } catch (error) {
      console.log("Login error:", error);
     
    }
  };


  // ===============================
// GOOGLE LOGIN
// ===============================
const handleGoogleLogin = async () => {
  try {
    console.log("Starting Google login...");

    const authUrl = await appwrite.loginWithGoogle();

    console.log("Opening Google login...");
    await Linking.openURL(authUrl);

  } catch (error) {
    console.log("Google login error:", error);
    Alert.alert("Google Login Failed");
  }
};

// ===============================
// HANDLE GOOGLE CALLBACK
// ===============================
useEffect(() => {

  const handleDeepLink = async ({ url }: { url: string }) => {
    try {
      console.log("OAuth callback URL:", url);

    const userIdMatch = url.match(/[?&]userId=([^&#]+)/);
    const secretMatch = url.match(/[?&]secret=([^&#]+)/);
    
      const userId = userIdMatch?.[1];
      const secret = secretMatch?.[1];

      if (userId && secret) {

        console.log("Google user received:", userId);

        await appwrite.createGoogleSession(
          decodeURIComponent(userId),
          decodeURIComponent(secret)
        );

        console.log("Google login successful!");

        setiSLoggedIn(true);
      }

    } catch (error) {
      console.log("OAuth callback error:", error);
      Alert.alert("Google authentication failed");
    }
  };


  // App already open
  const subscription = Linking.addEventListener(
    "url",
    handleDeepLink
  );


  // App was closed during OAuth
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink({ url });
    }
  });


  return () => {
    subscription.remove();
  };

}, []);




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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
          
          
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}>Don't have an account? Sign up</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.card2}>

            <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
            <Image
                source={require("../assets/google.png")}
                 style={styles.icon}
                   />
            <Text style={styles.buttonText}>continue with google</Text>
            </TouchableOpacity>            
           
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
    
  );
}

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
    backgroundColor: "rgba(2, 6, 23, 0.92)",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  card2:{
    width:"100%",
    maxWidth:380,
    borderRadius:30,
    padding:24,
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
    flexDirection:"row",
    backgroundColor: "#2563EB",
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

  icon:{
    width:26,
    height:26,
    marginRight:40
  }
});
