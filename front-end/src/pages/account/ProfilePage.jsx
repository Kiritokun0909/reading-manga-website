// src/components/Header.js
import React, { useEffect, useState } from "react";
import "../../styles/site/Home.css";

import {
  getUserInfo,
  updateUserEmail,
  updateUserInfo,
} from "../../api/AccountService.js";
import { toast } from "react-toastify";
import Loading from "../../components/Loading.jsx";

export default function ProfilePage() {
  const [oldEmail, setOldEmail] = useState("");
  const [oldUserName, setOldUserName] = useState("");

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");

  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo();
      data.avatar = data.avatar
        ? `${data.avatar}`
        : "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";
      setAvatar(data.avatar);
      setEmail(data.email);
      setUsername(data.username);

      setOldEmail(data.email);
      setOldUserName(data.username);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setNewAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const handleButtonClick = () => {
    document.getElementById("avatarUpload").click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (username !== oldUserName || newAvatarFile) {
        await updateUserInfo(username, newAvatarFile);
        // toast.success("Cập nhật username và avatar thành công");
      }

      if (email !== oldEmail) {
        await updateUserEmail(email);
      }

      toast.success("Cập nhật thành công");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

    fetchUserInfo();
  };

  return (
    <div className="flex justify-center mt-10 px-8">
      {loading && <Loading />}

      <form className="max-w-2xl">
        <div className="flex flex-wrap border shadow rounded-lg p-3 dark:bg-gray-600">
          <div className="w-full text-center">
            <h2 className="text-xl text-gray-600 dark:text-gray-300 pb-2">
              Thông tin tài khoản
            </h2>
            <img
              className="w-20 h-20 rounded-full mx-auto"
              src={avatar}
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
              <label className="text-gray-600 dark:text-gray-400">Email:</label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Username:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
                type="submit"
                onClick={handleSubmit}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
