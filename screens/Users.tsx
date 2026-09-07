import React, {
  useEffect,
  useState,
  useContext
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { AppwriteContext } from "../src/appwrite/AppwriteContext";

import appwrite from "../src/appwrite/service";
import databaseService from "../src/appwrite/databaseService";


// ===============================
// USER TYPE
// ===============================

interface AppUser {
  $id: string;
  userid: string;
  name: string;
  email?: string;
}


// ===============================
// USERS SCREEN
// ===============================

export default function Users() {

  // ===============================
  // CONTEXT
  // ===============================

  const { appwrite } =
    useContext(AppwriteContext);


  // ===============================
  // NAVIGATION
  // ===============================

  const navigation =
    useNavigation<any>();


  // ===============================
  // STATE
  // ===============================

  const [users, setUsers] =
    useState<AppUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [currentUserId, setCurrentUserId] =
    useState("");


  // ===============================
  // LOAD USERS
  // ===============================

  useEffect(() => {

    const loadUsers = async () => {

      try {

        // ===============================
        // GET CURRENT LOGGED-IN USER
        // ===============================

        const currentUser =
          await appwrite.getCurrentUser();

          console.log("CURRENT USER:", currentUser);

        if (!currentUser) {
          return;
        }


        // Save current user ID
        setCurrentUserId(
          currentUser.$id
        );


        // ===============================
        // GET ALL USERS
        // ===============================

        const allUsers =
  await databaseService.getAllUsers();

          console.log("========== USER LIST DEBUG ==========");
            console.log("ALL USERS FROM DATABASE:", allUsers);
            console.log("TOTAL USERS:", allUsers.length);
            console.log("CURRENT USER ID:", currentUser.$id);



        // ===============================
        // REMOVE CURRENT USER
        // ===============================

            const otherUsers = allUsers.filter( (user) => user.userid !== currentUser.$id);
           
        
            console.log("OTHER USERS:", otherUsers);
            console.log("=====================================");

        // Save other users
        setUsers(otherUsers);


      } catch (error) {

        console.log(
          "Error loading users:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadUsers();

  }, []);


  // ===============================
  // OPEN PRIVATE CHAT
  // ===============================

  const openChat = (user: AppUser) => {

    navigation.navigate(
      "Chatbox",

      {
        // Selected user's Appwrite ID
        receiverId: user.$id,

        // Selected user's display name
        receiverName: user.name,
      }
    );

  };


  // ===============================
  // RENDER EACH USER
  // ===============================

  const renderUser = ({
    item
  }: {
    item: AppUser
  }) => {

    return (

      <TouchableOpacity
        style={styles.userCard}

        // Open chat when user is clicked
        onPress={() => openChat(item)}
      >

        {/* ===========================
            USER AVATAR
        ============================ */}

        <View style={styles.avatar}>

          <Text style={styles.avatarText}>

            {/* First letter of name */}

            {item.name
              ? item.name.charAt(0).toUpperCase()
              : "U"}

          </Text>

        </View>


        {/* ===========================
            USER INFORMATION
        ============================ */}

        <View style={styles.userInfo}>

          <Text style={styles.userName}>

            {item.name || "User"}

          </Text>


          {/* Online status is static for now */}

          <Text style={styles.status}>

            🟢 Online

          </Text>

        </View>

      </TouchableOpacity>

    );

  };


  // ===============================
  // LOADING SCREEN
  // ===============================

  if (loading) {

    return (

      <View style={styles.center}>

        <ActivityIndicator
          size="large"
        />

        <Text style={styles.loadingText}>
          Loading users...
        </Text>

      </View>

    );

  }


  // ===============================
  // MAIN UI
  // ===============================

  return (

    <View style={styles.container}>


      {/* ===============================
          HEADER
      =============================== */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.backButton}>
            ←
          </Text>

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Chats
        </Text>

      </View>


      {/* ===============================
          USERS LIST
      =============================== */}

      <FlatList
        data={users}

        keyExtractor={(item) =>
          item.$id
        }

        renderItem={renderUser}


        // Show message if no other users
        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyText}>
              No other users found
            </Text>

          </View>

        }

      />

    </View>

  );

}


// ===============================
// STYLES
// ===============================

const styles = StyleSheet.create({

  // ===============================
  // MAIN CONTAINER
  // ===============================

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },


  // ===============================
  // CENTER / LOADING
  // ===============================

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },


  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#64748B",
  },


  // ===============================
  // HEADER
  // ===============================

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,

    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },


  backButton: {
    fontSize: 30,
    marginRight: 20,
  },


  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },


  // ===============================
  // USER CARD
  // ===============================

  userCard: {

    flexDirection: "row",

    alignItems: "center",

    padding: 16,

    marginHorizontal: 15,

    marginTop: 12,

    backgroundColor: "#FFFFFF",

    borderRadius: 15,

    elevation: 2,
  },


  // ===============================
  // AVATAR
  // ===============================

  avatar: {

    width: 50,
    height: 50,

    borderRadius: 25,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#6366F1",
  },


  avatarText: {

    fontSize: 20,

    fontWeight: "bold",

    color: "#FFFFFF",
  },


  // ===============================
  // USER INFO
  // ===============================

  userInfo: {

    marginLeft: 15,

    flex: 1,
  },


  userName: {

    fontSize: 17,

    fontWeight: "600",
  },


  status: {

    marginTop: 4,

    fontSize: 13,

    color: "#64748B",
  },


  // ===============================
  // EMPTY STATE
  // ===============================

  emptyContainer: {

    alignItems: "center",

    marginTop: 60,
  },


  emptyText: {

    fontSize: 16,

    color: "#64748B",
  },

});