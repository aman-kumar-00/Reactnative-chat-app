import 'react-native-url-polyfill/auto';

import { Account, Client, ID,OAuthProvider } from 'appwrite';
import Config from 'react-native-config';
import databaseService from './databaseService';


// Create Client
const client = new Client();

client
  .setEndpoint(Config.APPWRITE_ENDPOINT!)
  .setProject(Config.APPWRITE_PROJECT_ID!)
  

// Create Account instance
const account = new Account(client);


// Types
type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};


class AppwriteService {

// Login with Google
async loginWithGoogle() {
  try {
    
    const redirectUrl = "appwrite-callback-69989370002b2b538f08://";

    const authUrl = await account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: redirectUrl,
      failure: redirectUrl,
    });

    return authUrl;

  } catch (error) {
    console.log("Google login error:", error);
    throw error;
  }
}


// =====================================
// CREATE SESSION AFTER GOOGLE CALLBACK
// =====================================

async createGoogleSession(
  userId: string,
  secret: string
) {

  try {

    // Create Appwrite session
    const session =
      await account.createSession({
        userId,
        secret,
      });


    // =====================================
    // SYNC GOOGLE USER TO USERS TABLE
    // =====================================

    await this.syncUserProfile();


    console.log(
      "Google user profile synced"
    );


    return session;

  } catch (error) {

    console.log(
      "Create Google session error:",
      error
    );

    throw error;

  }

}


// =====================================
// SYNC CURRENT USER TO USERS TABLE
// =====================================

async syncUserProfile() {
  try {

    // Get currently authenticated user
    const user = await account.get();

    // Create user profile in database
    await databaseService.createUserProfile(
      user.$id,
      user.name || "User"
    );

    console.log(
      "User profile synced:",
      user.name
    );

    return user;

  } catch (error) {

    console.log(
      "User profile sync error:",
      error
    );

    throw error;
  }
}



  // 🟢 Create Account
  async createAccount({
    email,
    password,
    name
  }: CreateUserAccount) {

    try {

      const user = await account.create(
        ID.unique(),
        email.trim(),
        password.trim(),
        name.trim()
      );

      // Auto login after signup
      if (user) {

        return await this.login({
          email,
          password
        });

      }

      return user;

    } catch (error) {

      console.log("Signup error:", error);
      throw error;

    }

  }


  // 🟢 Login
 
  // =====================================
// LOGIN WITH EMAIL AND PASSWORD
// =====================================

async login({
  email,
  password
}: LoginUserAccount) {

  try {

    // Remove old session if it exists
    try {

      await account.deleteSession("current");

    } catch (e) {

      // Ignore if there is no previous session
    }


    // Create new session
    const session =
      await account.createEmailPasswordSession(
        email.trim(),
        password.trim()
      );


    // =====================================
    // SYNC USER TO USERS TABLE
    // =====================================

    await this.syncUserProfile();


    return session;

  } catch (error) {

    console.log("Login error:", error);

    throw error;

  }

}

  // 🟢 Get Current User
  async getCurrentUser() {

    try {

      return await account.get();

    } catch {

      return null;

    }

  }


  // 🟢 Logout
  async logout() {

    try {

      await account.deleteSession("current");

      return true;

    } catch {

      // Already logged out
      return false;

    }

  }

}


const appwriteService = new AppwriteService();

export default appwriteService;