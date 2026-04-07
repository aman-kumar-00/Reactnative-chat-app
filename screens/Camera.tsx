import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from "react-native";

import React, { useState } from "react";
import { launchCamera, ImagePickerResponse } from "react-native-image-picker";



export default function Camera() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS !== "android") {
      return true;
    }

    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    if (alreadyGranted) {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "App needs access to your camera to take photos.",
        buttonPositive: "Allow",
        buttonNegative: "Deny",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        "Permission blocked",
        "Camera permission is blocked. Please enable it from app settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert("Permission denied", "Camera permission is required.");
      return;
    }

    const result: ImagePickerResponse = await launchCamera({
      mediaType: "photo",
      cameraType: "back",
      saveToPhotos: false,
      quality: 0.8,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert("Camera error", result.errorMessage || "Something went wrong.");
      return;
    }

    const pickedUri = result.assets?.[0]?.uri || null;
    setImageUri(pickedUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Screen</Text>
      <Text style={styles.subtitle}>Tap below to open camera.</Text>

      <Pressable style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </Pressable>

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  preview: {
    marginTop: 20,
    width: 260,
    height: 320,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
});
