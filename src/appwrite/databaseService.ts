import {
  Client,
  Databases,
  ID,
  Query
} from "appwrite";

import Config from "react-native-config";
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===============================
// USER DATABASE TYPE
// ===============================

export interface AppUser {
  $id: string;       // Database row ID
  userid: string;    // Appwrite Auth user ID
  name: string;
  email?: string;
}


/*Databse connection*/

const DATABASE_ID =
  Config.APPWRITE_DATABASE_ID!;

const COLLECTION_ID =
  Config.APPWRITE_MESSAGES_COLLECTION_ID!;

const USERS_COLLECTION_ID =
  Config.APPWRITE_USERS_COLLECTION_ID!;


/* CLIENT */

const client = new Client();

client
  .setEndpoint(
    Config.APPWRITE_ENDPOINT!
  )
  .setProject(
    Config.APPWRITE_PROJECT_ID!
  )

 

class DatabaseService {

  databases;

  constructor() {

    this.databases =
      new Databases(client);

  }

 // =====================================
// PRIVATE CHAT REALTIME
// =====================================

subscribeToMessages(
  currentUserId: string,
  receiverId: string,
  callback: (message: any) => void
) {

  const unsubscribe = client.subscribe(

    `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,

    (response) => {

      const isCreated = response.events.some(
        (event: string) => event.endsWith(".create")
      );

      if (!isCreated) {
        return;
      }

      const message = response.payload as any;

      // Only messages belonging to this conversation
      const isCurrentConversation =
        (
          message.senderid === currentUserId &&
          message.receiverid === receiverId
        ) ||
        (
          message.senderid === receiverId &&
          message.receiverid === currentUserId
        );

      if (isCurrentConversation) {
        callback(message);
      }

    }
  );

  return unsubscribe;
}

// =====================================
// SEND PRIVATE MESSAGE
// =====================================

async sendMessage(
  senderId: string,
  senderName: string,
  receiverId: string,
  text: string
) {

  try {

    return await this.databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),

      {
        senderid: senderId,
        sendername: senderName,
        receiverid: receiverId,
        content: text,
        senttimestamp: new Date().toISOString()
      }
    );

  } catch (error) {

    console.log(
      "Send private message error:",
      error
    );

    throw error;
  }
}

  /* GET MESSAGES */

  async getMessages(
    userId: string,
    otherUserId: string
  ) {

    try {

      return await this.databases
        .listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [

            Query.or([

              Query.and([
                Query.equal(
                  "senderid",
                  userId
                ),
                Query.equal(
                  "receiverid",
                  otherUserId
                )
              ]),

              Query.and([
                Query.equal(
                  "senderid",
                  otherUserId
                ),
                Query.equal(
                  "receiverid",
                  userId
                )
              ])

            ]),

            Query.orderAsc(
              "senttimestamp"
            )

          ]
        );

    } catch (error) {

      console.log(
        "Get messages error:",
        error
      );

      return null;

    }

  }

  // =====================================
// GET PUBLIC MESSAGES ONLY
// =====================================

async getPublicMessages() {

  try {

    return await this.databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,

      [
        // Only messages with empty receiverid
        Query.equal("receiverid", ""),

        Query.orderAsc("senttimestamp"),

        Query.limit(100)
      ]
    );

  } catch (error) {

    console.log(
      "Get public messages error:",
      error
    );

    throw error;
  }
}


// =====================================
// SEND PUBLIC MESSAGE
// =====================================

async sendPublicMessage(
  senderId: string,
  senderName: string,
  text: string
) {

  try {

    return await this.databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),

      {
        senderid: senderId,
        sendername: senderName,

        // Empty means PUBLIC message
        receiverid: "",

        content: text,

        senttimestamp:
          new Date().toISOString()
      }
    );

  } catch (error) {

    console.log(
      "Send public message error:",
      error
    );

    throw error;
  }
}


// =====================================
// PUBLIC ROOM REALTIME
// =====================================

subscribeToPublicMessages(
  callback: (message: any) => void
) {

  const unsubscribe = client.subscribe(

    `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,

    (response) => {

      const isCreated =
        response.events.some(
          (event: string) =>
            event.endsWith(".create")
        );


      // Only accept newly created messages
      if (!isCreated) {
        return;
      }


      const message = response.payload as any;


      // IMPORTANT:
      // Public messages have empty receiverid
      if (message.receiverid === "") {

        callback(message);

      }

    }
  );

  return unsubscribe;
}

  // =====================================
  // CREATE / SYNC USER PROFILE
  // =====================================

  async createUserProfile(
    userId: string,
    name: string
  ) {

    try {

      // We use the Appwrite Auth userId
      // as the document ID.
      //
      // This ensures one profile per user.

      return await this.databases.createDocument(

        DATABASE_ID,

        USERS_COLLECTION_ID,

        userId,

        {
          userid: userId,
          name: name,
        }

      );

    } catch (error: any) {

      // If profile already exists,
      // don't create a duplicate.

      if (error?.code === 409) {

        console.log(
          "User profile already exists"
        );

        return null;
      }


      console.log(
        "Create user profile error:",
        error
      );

      throw error;

    }

  }


  // =====================================
  // GET ALL USERS
  // =====================================
  

async getAllUsers(): Promise<AppUser[]> {

  try {

    const response =
      await this.databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.limit(100)
        ]
      );

    // Return typed users
    return response.documents as unknown as AppUser[];

  } catch (error) {

    console.log("Get all users error:", error);
    throw error;

  }
}

}

export default new DatabaseService();