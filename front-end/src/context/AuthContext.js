import React, { createContext, useState, useEffect } from "react";
import apiClient, { setAccessToken, registerLogoutCallback } from "../api/ApiClient";

// Tạo Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm logout - clear token và cập nhật trạng thái
  const localLogout = () => {
    setAccessToken(null);
    setIsLoggedIn(false);
    setRoleId(null);
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
    localLogout();
  };

  const login = (accessToken, refreshToken, roleId) => {
    // Note: refreshToken argument is deprecated as it is now HttpOnly cookie.
    // Keeping argument to maintain compatibility if called elsewhere with 3 args.
    setAccessToken(accessToken);
    setRoleId(roleId);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    // Register logout callback for ApiClient 401s
    registerLogoutCallback(localLogout);

    // Try to refresh token on mount
    const initAuth = async () => {
      try {
        // Assume verified if we can get a new access token
        const response = await apiClient.post("/auth/refresh-token");
        const { accessToken, roleId } = response.data;
        setAccessToken(accessToken);
        setRoleId(roleId);
        setIsLoggedIn(true);
      } catch (error) {
        // If refresh fails, we are not logged in.
        // If we were previously logged in (e.g. persisted state ??), we are now logged out.
        localLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, roleId, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
