import React, {
  useContext,
  useEffect,
  useState,
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
  ActivityIndicator,
} from "react-native";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  AppwriteContext,
} from "../src/appwrite/AppwriteContext";

import databaseService from "../src/appwrite/databaseService";


export default function PublicRoom() {

  const navigation =
    useNavigation<any>();

  const insets =
    useSafeAreaInsets();

    const { appwrite } =
    useContext(AppwriteContext);

  // =====================================
  // USER
  // =====================================

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [currentUserName, setCurrentUserName] =
    useState("");


  // =====================================
  // CHAT
  // =====================================

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);


  // =====================================
  // GET CURRENT USER
  // =====================================

  useEffect(() => {

    const getUser = async () => {

      try {

        console.log(
          "Getting current user..."
        );


        const user =
          await appwrite.getCurrentUser();


        if (user) {

          console.log(
            "PUBLIC ROOM USER:",
            user.$id,
            user.name
          );


          setCurrentUserId(
            user.$id
          );

          setCurrentUserName(
            user.name || "User"
          );

        }

      } catch (error) {

        console.log(
          "Get current user error:",
          error
        );

      }

    };


    getUser();

  }, []);


  // =====================================
  // LOAD OLD MESSAGES
  // =====================================

  useEffect(() => {

    const loadMessages = async () => {

      try {

        setLoading(true);


       const response =
  await databaseService.getPublicMessages();

if (response) {
  setMessages(response.documents);
}


      } catch (error) {

        console.log(
          "Load messages error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadMessages();

  }, []);


  // =====================================
  // REALTIME
  // =====================================

  useEffect(() => {

    console.log(
      "Starting public room realtime..."
    );


    const unsubscribe =
      databaseService
        .subscribeToPublicMessages(
          (newMessage) => {

            console.log(
              "NEW PUBLIC MESSAGE:",
              newMessage
            );


            setMessages(
              previousMessages => {

                // Prevent duplicate message

                const alreadyExists =
                  previousMessages.some(
                    item =>
                      item.$id ===
                      newMessage.$id
                  );


                if (alreadyExists) {

                  return previousMessages;

                }


                return [
                  ...previousMessages,
                  newMessage,
                ];

              }
            );

          }
        );


    // Cleanup when leaving screen

    return () => {

      console.log(
        "Stopping public room realtime..."
      );

      unsubscribe();

    };

  }, []);


  // =====================================
  // SEND MESSAGE
  // =====================================

  const handleSend = async () => {

    const trimmedMessage =
      message.trim();


    if (!trimmedMessage) {
      return;
    }


    if (!currentUserId) {

      console.log(
        "User ID not available"
      );

      return;

    }


    try {

      setSending(true);


      await databaseService
        .sendPublicMessage(
          currentUserId,
          currentUserName,
          trimmedMessage
        );


      // Clear input

      setMessage("");


    } catch (error) {

      console.log(
        "Send message error:",
        error
      );

    } finally {

      setSending(false);

    }

  };


  // =====================================
  // RENDER MESSAGE
  // =====================================

  const renderMessage = ({
    item,
  }: any) => {

    const isMine =
      item.senderid ===
      currentUserId;


    return (

      <View
        style={[
          styles.messageRow,

          isMine
            ? styles.myMessageRow
            : styles.otherMessageRow,
        ]}
      >

        <View
          style={[
            styles.messageBubble,

            isMine
              ? styles.myBubble
              : styles.otherBubble,
          ]}
        >

          {/* OTHER USER NAME */}

          {!isMine && (

            <Text style={styles.senderName}>
              {item.sendername ||
                "User"}
            </Text>

          )}


          {/* MESSAGE */}

          <Text
            style={[
              styles.messageText,

              isMine
                ? styles.myText
                : styles.otherText,
            ]}
          >
            {item.content}
          </Text>

        </View>

      </View>

    );

  };


  // =====================================
  // UI
  // =====================================

  return (

    <KeyboardAvoidingView
      style={styles.container}

      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >

      {/* ================= HEADER ================= */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.backText}>
            ‹
          </Text>

        </TouchableOpacity>


        <View>

          <Text style={styles.title}>
            Public Chat
          </Text>

          <Text style={styles.subtitle}>
            Everyone can chat
          </Text>

        </View>

      </View>


      {/* ================= MESSAGES ================= */}

      {loading ? (

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
          />

          <Text style={styles.loadingText}>
            Loading messages...
          </Text>

        </View>

      ) : (

        <FlatList
          data={messages}

          keyExtractor={(item) =>
            item.$id
          }

          renderItem={
            renderMessage
          }

          style={styles.list}

          contentContainerStyle={
            styles.messageList
          }

          keyboardShouldPersistTaps="handled"

          showsVerticalScrollIndicator={
            false
          }
        />

      )}


      {/* ================= INPUT ================= */}

      <View
        style={[
          styles.inputContainer,

          {
            paddingBottom:
              insets.bottom + 8,
          },
        ]}
      >

        <View
          style={styles.inputWrapper}
        >

          <TextInput
            style={styles.input}

            value={message}

            onChangeText={
              setMessage
            }

            placeholder={
              "Write a message..."
            }

            placeholderTextColor={
              "#94A3B8"
            }

            multiline

            maxLength={500}

            editable={!sending}
          />


          <TouchableOpacity
            style={[
              styles.sendButton,

              sending &&
                styles.disabledButton,
            ]}

            onPress={handleSend}

            disabled={sending}
          >

            <Text style={styles.sendText}>
              {sending
                ? "..."
                : "➤"}
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </KeyboardAvoidingView>

  );

}


// =====================================
// STYLES
// =====================================

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


  title: {
    fontSize: 18,

    fontWeight: "700",

    color: "#0F172A",
  },


  subtitle: {
    fontSize: 12,

    color: "#22C55E",

    marginTop: 2,
  },


  // LOADING

  loadingContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },


  loadingText: {
    marginTop: 10,

    color: "#64748B",
  },


  // LIST

  list: {
    flex: 1,
  },


  messageList: {
    paddingHorizontal: 12,

    paddingTop: 15,

    paddingBottom: 10,

    flexGrow: 1,
  },


  // MESSAGE

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


  messageBubble: {
    maxWidth: "80%",

    paddingHorizontal: 14,

    paddingVertical: 9,

    borderRadius: 18,
  },


  myBubble: {
    backgroundColor: "#2563EB",

    borderBottomRightRadius: 4,
  },


  otherBubble: {
    backgroundColor: "#FFFFFF",

    borderBottomLeftRadius: 4,

    borderWidth: 1,

    borderColor: "#E2E8F0",
  },


  senderName: {
    fontSize: 12,

    fontWeight: "700",

    color: "#2563EB",

    marginBottom: 3,
  },


  messageText: {
    fontSize: 16,

    lineHeight: 21,
  },


  myText: {
    color: "#FFFFFF",
  },


  otherText: {
    color: "#0F172A",
  },


  // INPUT

  inputContainer: {
    paddingHorizontal: 10,

    paddingTop: 8,

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


  disabledButton: {
    opacity: 0.5,
  },


  sendText: {
    color: "#FFFFFF",

    fontSize: 20,

    marginLeft: 2,
  },

});