import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeUI from "../components/HomeUi";
import { useNavigation } from "@react-navigation/native";
import{Button} from "react-native"
import { Tabs } from "react-native-screens";

export default function Home() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <HomeUI />
    </SafeAreaView>
  );
}
