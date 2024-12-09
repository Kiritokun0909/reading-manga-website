// src/components/Header.js
import React, { useEffect, useState } from "react";
import "../../styles/site/Home.css";

import { updateUserPassword } from "../../api/AccountService.js";
import { toast } from "react-toastify";
import Loading from "../../components/Loading.jsx";

export default function PasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const validatePassword = () => {
    if (newPassword !== "" && newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không trùng khớp");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await updateUserPassword(oldPassword, newPassword);
      toast.success("Cập nhật mật khẩu thành công");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setConfirmPassword("");
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="flex justify-center mt-10 px-8">
      {loading && <Loading />}

      <form className="max-w-2xl">
        <div className="flex flex-wrap border shadow rounded-lg p-3 dark:bg-gray-600">
          <div className="w-full text-center">
            <h2 className="text-xl text-gray-600 dark:text-gray-300 pb-2">
              Đổi mật khẩu
            </h2>
          </div>

          <div className="flex flex-col gap-2 w-full border-gray-400">
            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Mật khẩu cũ:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Mật khẩu mới:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Nhập lại mật khẩu mới:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
                type="submit"
                onClick={handleSubmit}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
