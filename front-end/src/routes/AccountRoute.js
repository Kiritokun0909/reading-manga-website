import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/account/ProfilePage";
import PasswordPage from "../pages/account/PasswordPage";
import LikeFollowPage from "../pages/account/LikeFollowPage";
import SiteLayout from "../layout/SiteLayout";

export default function AccountRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/like-list" element={<LikeFollowPage type="like" />} />
        <Route path="/follow-list" element={<LikeFollowPage type="follow" />} />
      </Route>
    </Routes>
  );
}
