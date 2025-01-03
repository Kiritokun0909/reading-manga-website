import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/account/ProfilePage";
import PasswordPage from "../pages/account/PasswordPage";
import LikeFollowPage from "../pages/account/LikeFollowPage";
import SiteLayout from "../layout/SiteLayout";
import NotificationPage from "../pages/account/NotificationPage";
import PlanPage from "../pages/account/PlanPage";
import PaymentPage from "../pages/account/PaymentPage";

export default function AccountRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/like-list" element={<LikeFollowPage type="like" />} />
        <Route path="/follow-list" element={<LikeFollowPage type="follow" />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>
    </Routes>
  );
}
