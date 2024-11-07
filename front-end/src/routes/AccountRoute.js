import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/account/ProfilePage";
import PasswordPage from "../pages/account/PasswordPage";

export default function AccountRoute() {
  return (
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/password" element={<PasswordPage />} />
    </Routes>
  );
}
