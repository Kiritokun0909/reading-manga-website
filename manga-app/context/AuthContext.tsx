import { createContext, useContext, useEffect, useState } from "react";
import { loginApi } from "@/api/authApi";
import { saveItem, getItem, deleteItem } from "@/services/storageService";

interface AuthProps {
  authState: {
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  };
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

export const AuthContext = createContext<AuthProps>({
  authState: {
    accessToken: null,
    refreshToken: null,
    authenticated: false,
  },
  onLogin: async () => {},
  onLogout: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  }>({
    accessToken: null,
    refreshToken: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadTokens = async () => {
      const accessToken = await getItem("accessToken");
      const refreshToken = await getItem("refreshToken");
      if (accessToken) {
        setAuthState({
          accessToken: accessToken,
          refreshToken: refreshToken,
          authenticated: true,
        });
      }
    };

    loadTokens();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    if (!data.success) {
      return false;
    }

    const tokens = data.tokens;
    await saveItem("accessToken", tokens.accessToken);
    await saveItem("refreshToken", tokens.refreshToken);
    console.log("save token");
    setAuthState({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      authenticated: true,
    });

    return true;
  };

  const logout = async () => {
    await deleteItem("accessToken");
    await deleteItem("refreshToken");
    console.log("clear token");

    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
