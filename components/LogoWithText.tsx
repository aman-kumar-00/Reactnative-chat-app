import React from "react";
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type LogoProps = {
  image: any;
  title: string;
  onPress?: () => void;
};

const LogoWithText = ({
  image,
  title,
  onPress,
}: LogoProps) => {
  return (

    // TouchableOpacity itself acts as container
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >

      {/* Logo Image */}
      <Image
        source={image}
        style={styles.logo}
      />

      {/* Logo Title */}
      <Text style={styles.logoText}>
        {title}
      </Text>

    </TouchableOpacity>
  );
};

export default LogoWithText;


const styles = StyleSheet.create({

  // Container for one menu item
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 18,
  },

  // Logo size
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  // Text below logo
  logoText: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
  },

});