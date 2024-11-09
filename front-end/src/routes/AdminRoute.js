import React from "react";
import { Route, Routes } from "react-router-dom";
import ManageGenrePage from "../pages/admin/ManageGenrePage";
import ManageAuthorPage from "../pages/admin/ManageAuthorPage";
import ManageListMangaPage from "../pages/admin/ManageListMangaPage";
import AddMangaPage from "../pages/admin/AddMangaPage";
import UpdateMangaPage from "../pages/admin/UpdateMangaPage";
import UploadChapterPage from "../pages/admin/chapter/UploadChapterPage";
import UpdateChapterPage from "../pages/admin/chapter/UpdateChapterPage";

export default function AdminRoute() {
  return (
    <Routes>
      <Route path="/*" element={<ManageListMangaPage />} />
      <Route path="/manage-genre" element={<ManageGenrePage />} />
      <Route path="/manage-author" element={<ManageAuthorPage />} />
      <Route path="/manage-manga" element={<ManageListMangaPage />} />
      <Route path="/manga/add" element={<AddMangaPage />} />
      <Route path="/manga/:mangaId" element={<UpdateMangaPage />} />
      <Route path="/chapter/upload/:mangaId" element={<UploadChapterPage />} />
      <Route path="/chapter/:chapterId" element={<UpdateChapterPage />} />
    </Routes>
  );
}
