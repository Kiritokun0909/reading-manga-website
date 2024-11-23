import React from "react";
import { Route, Routes } from "react-router-dom";
import ManageMangaPage from "../pages/admin/ManageMangaPage";
import ManageGenrePage from "../pages/admin/ManageGenrePage";
import ManageAuthorPage from "../pages/admin/ManageAuthorPage";
import AddMangaPage from "../pages/admin/manga/AddMangaPage";
import UpdateMangaPage from "../pages/admin/manga/UpdateMangaPage";
import UploadChapterPage from "../pages/admin/chapter/UploadChapterPage";
import UpdateChapterPage from "../pages/admin/chapter/UpdateChapterPage";
import AdminLayout from "../layout/AdminLayout";
import ProfilePage from "../pages/account/ProfilePage";
import PasswordPage from "../pages/account/PasswordPage";
import NotFoundPage from "../pages/site/NotFoundPage";
import MangaPage from "../pages/site/MangaPage";
import ManageUserPage from "../pages/admin/ManageUserPage";
import ManageDocumentPage from "../pages/admin/ManageDocumentPage";
import ManagePlanPage from "../pages/admin/ManagePlanPage";

export default function AdminRoute() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<ManageMangaPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/manage-genre" element={<ManageGenrePage />} />
        <Route path="/manage-author" element={<ManageAuthorPage />} />
        <Route path="/manage-manga" element={<ManageMangaPage />} />
        <Route path="/manga/:mangaId" element={<MangaPage />} />
        <Route path="/manga/add" element={<AddMangaPage />} />
        <Route path="/update-manga/:mangaId" element={<UpdateMangaPage />} />
        <Route
          path="/chapter/upload/:mangaId"
          element={<UploadChapterPage />}
        />
        <Route path="/chapter/:chapterId" element={<UpdateChapterPage />} />
        <Route path="/manage-user" element={<ManageUserPage />} />
        <Route path="/manage-document" element={<ManageDocumentPage />} />
        <Route path="/manage-plan" element={<ManagePlanPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
