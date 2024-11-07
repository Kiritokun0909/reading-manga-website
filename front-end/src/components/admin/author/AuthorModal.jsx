import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AuthorModal({ author, onClose, onSave }) {
  const [avatar, setAvatar] = useState(author?.avatar || "");
  const [authorName, setAuthorName] = useState(author?.authorName || "");
  const [authorBio, setAuthorBio] = useState(author?.biography || "");

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (author) {
      setAvatar(author.avatar);
      setAuthorName(author.authorName);
      setAuthorBio(author.biography);
    }
  }, [author]);

  const handleSave = () => {
    if (
      authorName === undefined ||
      authorName === "" ||
      authorName.trim() === ""
    ) {
      toast.error("Không được để trống tên tác giả");
      return;
    }

    const updatedAuthor = {
      ...author,
      authorName: authorName,
      biography: authorBio,
      avatarFile: avatarFile,
    };
    onSave(updatedAuthor);
  };

  const handleButtonClick = () => {
    document.getElementById("avatarUpload").click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-wrap justify-center border shadow rounded-lg p-3 bg-white">
        <div className="w-full text-center">
          <h2 className="text-xl text-gray-600 dark:text-gray-300 pb-2">
            {author ? "Chỉnh sửa tác giả" : "Thêm tác giả mới"}
          </h2>
          <img
            className="w-20 h-20 rounded-full mx-auto"
            src={
              avatar
                ? avatar
                : "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
            }
            alt="Avatar"
          />

          <button
            type="button"
            onClick={handleButtonClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Chọn ảnh
          </button>

          <input
            id="avatarUpload"
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex flex-col gap-2 w-full border-gray-400">
          <div>
            <label className="text-gray-600 dark:text-gray-400">
              Tên tác giả:
            </label>
            <input
              className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-400">
              Thông tin thêm:
            </label>
            <textarea
              className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="text"
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
            />
          </div>
        </div>

        <button
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={handleSave}
        >
          {author ? "Cập nhật" : "Thêm"}
        </button>
        <button
          onClick={onClose}
          className="z-10 p-2 py-1.5 px-3 m-1 text-center bg-red-700 border rounded-md text-white  hover:bg-red-500 hover:text-gray-100 red:text-white-200 dark:bg-red-700"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
