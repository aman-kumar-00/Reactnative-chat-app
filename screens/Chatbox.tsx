import React,
{
  useState,
  useEffect,
  useContext
}
from "react";

import
{
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
}
from "react-native";

import databaseService
from "../src/appwrite/databaseService";

import { AppwriteContext }
from "../src/appwrite/AppwriteContext";


const Chatbox = () => {

  const { appwrite } =
    useContext(AppwriteContext);

  const [messages,
         setMessages] =
    useState<any[]>([]);

  const [text,
         setText] =
    useState("");

  const [currentUserId,
         setCurrentUserId] =
    useState("");

  /* TEMP receiver */
  const receiverId =
  "PUT_OTHER_USER_ID_HERE";

  /* Get logged user */

  useEffect(() => {

    const loadUser =
      async () => {

      const user =
        await appwrite.getCurrentUser();

      if (user) {

        setCurrentUserId(
          user.$id
        );

      }

    };

    loadUser();

  }, []);

  /* Load Messages */

  useEffect(() => {

    if (!currentUserId)
      return;

    const loadMessages =
      async () => {

      const result =
        await databaseService.getMessages(
          currentUserId,
          receiverId
        );

      if (result) {

        setMessages(
          result.documents
        );

      }

    };

    loadMessages();

  }, [currentUserId]);

  /* Realtime */

useEffect(() => {

  const unsubscribe =
    databaseService.subscribeToMessages(
      (msg: any) => {

        setMessages(prev => [
          ...prev,
          msg
        ]);

      }
    );

  return () => {

    if (unsubscribe) {

      unsubscribe();

    }

  };

}, []);

  /* Send Message */

  const handleSend =
    async () => {

    if (!text.trim())
      return;

    await databaseService.sendMessage(
      currentUserId,
      receiverId,
      text
    );

    setText("");

  };

  /* Render Messages */

  const renderItem =
    ({ item }: any) => (

    <View style={styles.messageBox}>

      <Text style={styles.messageText}>

        {item.content}

      </Text>

    </View>

  );

  return (

    <View style={styles.container}>

      {/* Messages */}

      <FlatList
        data={messages}
        keyExtractor={
          (item) => item.$id
        }
        renderItem={renderItem}
      />

      {/* Input */}

      <View style={styles.inputRow}>

        <TextInput
          style={styles.input}
          placeholder="Type message"
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSend}
        >

          <Text style={styles.buttonText}>
            Send
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};

export default Chatbox;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff"
  },

  messageBox: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8
  },

  messageText: {
    fontSize: 16
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8
  },

  button: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8
  },

  buttonText: {
    color: "#fff"
  }

});