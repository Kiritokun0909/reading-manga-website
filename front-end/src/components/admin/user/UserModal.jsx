import React, { useState } from "react";
import { toast } from "react-toastify";

export default function UserModal({ onClose, onSave }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");

  const handleSave = () => {
    if (email === undefined || email === "" || email.trim() === "") {
      toast.error("Không được để trống tên tác giả");
      return;
    }

    if (password === undefined || password === "" || password.trim() === "") {
      toast.error("Không được để trống mật khẩu");
      return;
    }

    const account = {
      email: email,
      password: password,
    };
    onSave(account);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-wrap justify-center border shadow rounded-lg p-3 bg-white">
        <div className="w-full text-center">
          <h2 className="text-xl text-gray-600 dark:text-gray-300 pb-2">
            Tạo quản lý mới
          </h2>
        </div>

        <div className="flex flex-col gap-2 w-full border-gray-400">
          <div>
            <label className="text-gray-600 dark:text-gray-400">Email:</label>
            <input
              className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-400">
              Mật khẩu (mặc định: 123456):
            </label>
            <input
              className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={handleSave}
        >
          Tạo
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
