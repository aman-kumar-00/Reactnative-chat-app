import 'react-native-url-polyfill/auto';

import { Account, Client, ID,OAuthProvider } from 'appwrite';
import Config from 'react-native-config';


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


// Create session after Google OAuth callback
async createGoogleSession(userId: string, secret: string) {
  try {
    const session = await account.createSession({
      userId,
      secret,
    });

    return session;
  } catch (error) {
    console.log("Create Google session error:", error);
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
  async login({
    email,
    password
  }: LoginUserAccount) {

    try {

      // Remove old session if exists
      try {
        await account.deleteSession("current");
      } catch (e) {
        // Ignore if no session
      }

      return await account.createEmailPasswordSession(
        email.trim(),
        password.trim()
      );

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