import React from "react";
import { View, Image, Text, StyleSheet,TouchableOpacity } from "react-native";

type LogoProps = {
  image: any;
  title: string;
   onPress?: () => void;
};

const LogoWithText = ({ image, title ,onPress}: LogoProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container}
         onPress={onPress}
      >

         <Image
        source={image}
        style={styles.logo}
      />

      <Text style={styles.logoText}>
        {title}
      </Text>


      </TouchableOpacity>
     

    </View>
  );
};

export default LogoWithText;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width:"100%"
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain"
  },

  logoText: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold"
  }
});