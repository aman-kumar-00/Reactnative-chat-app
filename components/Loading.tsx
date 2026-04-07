import React from "react";
import { View, ActivityIndicator, StyleSheet, Text, ImageBackground } from "react-native";

export default function Loading() {
  return (
    <ImageBackground
      source={require("../assets/talking.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Loading...</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.6)",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
