import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/site/HomePage";
import MangaListPage from "../pages/site/MangaListPage";
import PrivacyPage from "../pages/site/PrivacyPage";
import LoginPage from "../pages/site/LoginPage";
import UnauthorizedPage from "../pages/site/UnauthorizedPage";
import NotFoundPage from "../pages/site/NotFoundPage";
import ForgotPasswordPage from "../pages/site/ForgotPasswordPage";
import MangaPage from "../pages/site/MangaPage";
import ChapterPage from "../pages/site/ChapterPage";

export default function SiteRoute() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/genre" element={<MangaListPage type="genre" />} />
      <Route path="/author" element={<MangaListPage type="author" />} />
      <Route path="/search" element={<MangaListPage type="search" />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/manga/:mangaId" element={<MangaPage />} />
      <Route path="/chapter/:chapterId" element={<ChapterPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}
