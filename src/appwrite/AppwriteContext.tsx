import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus, Linking } from 'react-native';
import appwriteService from './service';

type AppContextType = {
  appwrite: any;
  isLoggedIn: boolean;
  authReady: boolean;
  setiSLoggedIn: (isLoggedIn: boolean) => void;
};

export const AppwriteContext = createContext<AppContextType>({
  appwrite:  appwriteService,
  isLoggedIn: false,
  authReady: false,
  setiSLoggedIn: () => {},
});

type AppwriteProviderProps = {
  children: React.ReactNode;
};

export function AppwriteProvider({ children }: AppwriteProviderProps) {
  const [appwrite] = useState(appwriteService);
  const [isLoggedIn, setiSLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const appState = useRef(AppState.currentState);

 useEffect(() => {

  const syncSession = async () => {

    try {

      const session =
        await appwrite.getCurrentUser();

      setiSLoggedIn(Boolean(session));

    } catch {

      setiSLoggedIn(false);

    } finally {

      // 🔥 VERY IMPORTANT
      setAuthReady(true);

    }

  };

  // 🔥 THIS LINE WAS MISSING
  syncSession();

}, [appwrite]);

  const defaultValue = useMemo(
    () => ({
      appwrite,
      isLoggedIn,
      authReady,
      setiSLoggedIn,
    }),
    [appwrite, authReady, isLoggedIn],
  );

  return (
    <AppwriteContext.Provider value={defaultValue}>
      {children}
    </AppwriteContext.Provider>
  );
}

export default AppwriteProvider;
