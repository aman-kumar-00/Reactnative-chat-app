import React from "react";

// Hooks
import { useEffect, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";

import LogoWithText from "./LogoWithText";
import { useNavigation } from "@react-navigation/native";


export default function Home() {

  // ==============================
  // 1. NAVIGATION
  // ==============================
  const navigation = useNavigation<any>();


  // ==============================
  // 2. ANIMATION VALUES
  // ==============================

  // Starts invisible (0)
  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  // Starts slightly smaller (0.8)
  const scaleAnim = useRef(
    new Animated.Value(0.8)
  ).current;


  // ==============================
  // 3. ANIMATION LOGIC
  // ==============================

  useEffect(() => {

    Animated.sequence([

      // Run fade + scale together
      Animated.parallel([

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),

        // Scale animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),

      ]),

      // Keep welcome message visible
      Animated.delay(2000),

      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),

    ]).start();

  }, []);


  // ==============================
  // 4. UI
  // ==============================

  return (

    <View style={styles.container}>


      {/* =========================
          WELCOME ANIMATION
      ========================= */}

      <Animated.View
        style={[
          styles.welcomeContainer,

          {
            // Connect fade animation
            opacity: fadeAnim,

            // Connect scale animation
            transform: [
              { scale: scaleAnim }
            ],
          },
        ]}
      >

        <Text style={styles.wave}>
          👋
        </Text>

        <Text style={styles.welcomeText}>
          Hey, Admin! 🎉
        </Text>

        <Text style={styles.subText}>
          Welcome back
        </Text>

      </Animated.View>


      {/* =========================
          HOME CONTENT
      ========================= */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* CHAT */}
        <LogoWithText
          image={require("../assets/talking.png")}
          title="chat"
          onPress={() => navigation.navigate("Chatbox")}
        />


        {/* VIDEO CALL */}
        <LogoWithText
          image={require("../assets/video-call.png")}
          title="vc: soon"
        />


        {/* PUBLIC ROOM */}
        <LogoWithText
          image={require("../assets/ancestors.png")}
          title="Public room"
          onPress={() => navigation.navigate("Publicroom")}
        />

      </ScrollView>

    </View>
  );
}


// ==============================
// STYLES
// ==============================

const styles = StyleSheet.create({

  // Main full-screen container
  container: {
    flex: 1,
    backgroundColor: "pink",
  },


  // Welcome popup overlay
  welcomeContainer: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    alignItems: "center",

    backgroundColor: "#fff",

    padding: 20,
    borderRadius: 20,

    elevation: 5,

    // Keeps popup above other UI
    zIndex: 10,
  },


  // Waving emoji
  wave: {
    fontSize: 45,
  },


  // "Hey Admin!"
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },


  // "Welcome back"
  subText: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },


  // ScrollView content
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

});