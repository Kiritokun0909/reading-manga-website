import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/admin/DashboardPage";
import ManageGenrePage from "../pages/admin/ManageGenrePage";
import ManageAuthorPage from "../pages/admin/ManageAuthorPage";
import ManageListMangaPage from "../pages/admin/ManageListMangaPage";
import AddMangaPage from "../pages/admin/AddMangaPage";
import UpdateMangaPage from "../pages/admin/UpdateMangaPage";

export default function AdminRoute() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/manage-genre" element={<ManageGenrePage />} />
      <Route path="/manage-author" element={<ManageAuthorPage />} />
      <Route path="/manage-manga" element={<ManageListMangaPage />} />
      <Route path="/manga/add" element={<AddMangaPage />} />
      <Route path="/manga/:mangaId" element={<UpdateMangaPage />} />
    </Routes>
  );
}
