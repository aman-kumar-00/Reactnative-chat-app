import 'react-native-url-polyfill/auto';

import { Account, Client, ID } from 'appwrite';
import Config from 'react-native-config';


// Create Client
const client = new Client();

client
  .setEndpoint(Config.APPWRITE_ENDPOINT!)
  .setProject(Config.APPWRITE_PROJECT_ID!);


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