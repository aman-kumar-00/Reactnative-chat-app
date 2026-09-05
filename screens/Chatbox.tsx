import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import databaseService from "../src/appwrite/databaseService";

import { AppwriteContext } from "../src/appwrite/AppwriteContext";

import {
  useRoute,
  useNavigation,
} from "@react-navigation/native";


const Chatbox = () => {

  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const receiverId =
    route.params?.receiverId;


  const { appwrite } =
    useContext(AppwriteContext);


  const [messages, setMessages] =
    useState<any[]>([]);

  const [text, setText] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState("");


  // -------------------------
  // GET LOGGED IN USER
  // -------------------------

  useEffect(() => {

    const loadUser = async () => {

      try {

        const user =
          await appwrite.getCurrentUser();

        if (user) {

          setCurrentUserId(user.$id);

        }

      } catch (error) {

        console.log(
          "Get user error:",
          error
        );

      }

    };

    loadUser();

  }, [appwrite]);


  // -------------------------
  // LOAD MESSAGES
  // -------------------------

  useEffect(() => {

    if (!currentUserId || !receiverId) {
      return;
    }


    const loadMessages = async () => {

      try {

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

      } catch (error) {

        console.log(
          "Load messages error:",
          error
        );

      }

    };


    loadMessages();

  }, [currentUserId, receiverId]);


  // -------------------------
  // REALTIME
  // -------------------------

  useEffect(() => {

    if (!currentUserId || !receiverId) {
      return;
    }


    const unsubscribe =
      databaseService.subscribeToMessages(
        currentUserId,
        receiverId,
        (msg: any) => {

          setMessages(prev => {

            const exists =
              prev.some(
                m => m.$id === msg.$id
              );


            if (exists) {
              return prev;
            }


            return [
              ...prev,
              msg
            ];

          });

        }
      );


    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, [
    currentUserId,
    receiverId
  ]);


  // -------------------------
  // SEND MESSAGE
  // -------------------------

  const handleSend = async () => {

    if (!text.trim()) {
      return;
    }


    try {

      await databaseService.sendMessage(
        currentUserId,
        receiverId,
        text.trim()
      );

      setText("");

    } catch (error) {

      console.log(
        "Send message error:",
        error
      );

    }

  };


  // -------------------------
  // RENDER ONE MESSAGE
  // -------------------------

  const renderItem = ({ item }: any) => {

    const isSender =
      item.senderid === currentUserId;


    return (

      <View
        style={[
          styles.messageRow,

          isSender
            ? styles.myMessageRow
            : styles.otherMessageRow,
        ]}
      >

        <View
          style={[
            styles.messageBox,

            isSender
              ? styles.myMessage
              : styles.otherMessage,
          ]}
        >

          <Text
            style={[
              styles.messageText,

              isSender
                ? styles.myMessageText
                : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>

        </View>

      </View>

    );

  };


  // -------------------------
  // MAIN UI
  // -------------------------

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.backText}>
            ‹
          </Text>

        </TouchableOpacity>


        <View style={styles.headerInfo}>

          <Text style={styles.headerTitle}>
            Chat
          </Text>

          <Text style={styles.headerStatus}>
            Online
          </Text>

        </View>

      </View>


      {/* MESSAGES */}

      <FlatList
        style={styles.messageList}
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        contentContainerStyle={
          styles.messagesContent
        }
        keyboardShouldPersistTaps="handled"
      />


      {/* INPUT */}

      <View style={styles.inputContainer}>

        <View style={styles.inputWrapper}>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={text}
            onChangeText={setText}
            multiline
          />


          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
          >

            <Text style={styles.sendText}>
              ➤
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </KeyboardAvoidingView>

  );

};


// -------------------------
// STYLES
// -------------------------

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },


  // HEADER

  header: {
    height: 65,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,

    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",

    elevation: 3,
  },


  backButton: {
    width: 42,
    height: 42,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 8,
  },


  backText: {
    fontSize: 38,

    color: "#0F172A",

    fontWeight: "300",

    marginTop: -5,
  },


  headerInfo: {
    justifyContent: "center",
  },


  headerTitle: {
    fontSize: 18,

    fontWeight: "700",

    color: "#0F172A",
  },


  headerStatus: {
    fontSize: 12,

    color: "#22C55E",

    marginTop: 2,
  },


  // MESSAGE LIST

  messageList: {
    flex: 1,
  },


  messagesContent: {
    paddingHorizontal: 12,

    paddingVertical: 15,

    flexGrow: 1,
  },


  // MESSAGE ROW

  messageRow: {
    width: "100%",

    marginVertical: 4,
  },


  myMessageRow: {
    alignItems: "flex-end",
  },


  otherMessageRow: {
    alignItems: "flex-start",
  },


  // MESSAGE BUBBLE

  messageBox: {
    maxWidth: "78%",

    paddingHorizontal: 14,

    paddingVertical: 10,

    borderRadius: 18,
  },


  myMessage: {
    backgroundColor: "#2563EB",

    borderBottomRightRadius: 4,
  },


  otherMessage: {
    backgroundColor: "#FFFFFF",

    borderBottomLeftRadius: 4,

    borderWidth: 1,

    borderColor: "#E2E8F0",
  },


  messageText: {
    fontSize: 16,

    lineHeight: 21,
  },


  myMessageText: {
    color: "#FFFFFF",
  },


  otherMessageText: {
    color: "#0F172A",
  },


  // INPUT

  inputContainer: {
    paddingHorizontal: 10,

    paddingVertical: 60,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,

    borderTopColor: "#E2E8F0",
  },


  inputWrapper: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#F1F5F9",

    borderRadius: 25,

    paddingLeft: 16,

    paddingRight: 5,

    minHeight: 50,
  },


  input: {
    flex: 1,

    fontSize: 16,

    color: "#0F172A",

    paddingVertical: 8,

    maxHeight: 100,
  },


  sendButton: {
    width: 42,

    height: 42,

    borderRadius: 21,

    backgroundColor: "#2563EB",

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 5,
  },


  sendText: {
    color: "#FFFFFF",

    fontSize: 20,

    marginLeft: 2,
  },

});


export default Chatbox;