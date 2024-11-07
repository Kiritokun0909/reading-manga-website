// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Tạo Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId"));

  // Hàm login - lưu token vào localStorage và cập nhật trạng thái
  const login = (accessToken, refreshToken, roleId) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("roleId", roleId);
    setIsLoggedIn(true);
    setRoleId(roleId);
  };

  // Hàm logout - xóa token và cập nhật trạng thái
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roleId");
    setIsLoggedIn(false);
    setRoleId(null);
  };

  // Theo dõi sự thay đổi của accessToken trong localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("roleId");
      setIsLoggedIn(!!token);
      setRoleId(role);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, roleId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
