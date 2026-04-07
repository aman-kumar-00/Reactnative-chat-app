import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Notification() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>

      <View style={{ flex: 1 }}>
      <Text>Notification screen</Text>
    </View>
    
    </SafeAreaView>
  
  )
}
