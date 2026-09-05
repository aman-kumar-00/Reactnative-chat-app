import {
  Client,
  Databases,
  ID,
  Query
} from "appwrite";

import Config from "react-native-config";
import AsyncStorage from '@react-native-async-storage/async-storage';

/*Databse connection*/

const DATABASE_ID =
  Config.APPWRITE_DATABASE_ID!;

const COLLECTION_ID =
  Config.APPWRITE_MESSAGES_COLLECTION_ID!;


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

  /* REALTIME SUBSCRIBE */

subscribeToMessages(callback: any, receiverId: any, p0: (msg: any) => void) {

  const unsubscribe =
    client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      (response) => {

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {

          callback(
            response.payload
          );

        }

      }
    );

  return unsubscribe;

}

  /* SEND MESSAGE */

  async sendMessage(
    senderId: string,
    receiverId: string,
    text: string
  ) {

    try {

      return await this.databases
        .createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            senderid: senderId,
            receiverid: receiverId,
            content: text,
            senttimestamp:
              new Date().toISOString()
          }
        );

    } catch (error) {

      console.log(
        "Send message error:",
        error
      );

      return null;

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

  /* PUBLIC ROOM - GET ALL MESSAGES */

async getPublicMessages() {

  try {

    return await this.databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.orderAsc("senttimestamp"),
        Query.limit(100)
      ]
    );

  } catch (error) {

    console.log(
      "Get public messages error:",
      error
    );

    return null;
  }
}


/* PUBLIC ROOM - SEND MESSAGE */

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
        content: text,
        senttimestamp: new Date().toISOString()
      }
    );

  } catch (error) {

    console.log(
      "Send public message error:",
      error
    );

    return null;
  }
}

/* PUBLIC ROOM - REALTIME */

subscribeToPublicMessages(
  callback: (message: any) => void
) {

  const unsubscribe = client.subscribe(
    `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
    (response) => {

      if (
        response.events.some(
          (event: string) =>
            event.endsWith(".create")
        )
      ) {

        callback(response.payload);

      }

    }
  );

  return unsubscribe;
}

}

export default new DatabaseService();