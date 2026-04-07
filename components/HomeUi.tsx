import React from "react";
import { useState,useEffect } from "react";
import { View, Text,TextInput,TouchableOpacity,FlatList,StyleSheet,ScrollView,Image } from "react-native";
import LogoWithText from "./LogoWithText";
import { useNavigation } from "@react-navigation/native";

const logo  = { uri: 'https://reactnative.dev/img/tiny_logo.png'};
const logo1 = {uri:'https://cdn-icons-png.flaticon.com/512/733/733579.png' };



export default function Home() {

    const navigation = useNavigation<any>();
  return (

    
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.title}>Hello</Text>
      <Text style={styles.card}>This is Text Y Talk App</Text>

       <LogoWithText
      image={require("../assets/talking.png")}
       title="chat"
       onPress={() => navigation.navigate("Chatbox")}
      />

        <LogoWithText
      image={require("../assets/video-call.png")}
       title="vc: soon"
      />

      
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"pink"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },

  logo:{
    width:64,
    height:64,
    margin:64,
    resizeMode: "contain",
    alignSelf: "center"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 64,
    marginBottom: 60,
    elevation: 4
  },
});
