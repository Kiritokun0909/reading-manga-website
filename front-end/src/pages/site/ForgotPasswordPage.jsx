// src/components/Header.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/site/Home.css";

import { forgotPassword, resetPassword } from "../../api/AuthService.js";
import { toast } from "react-toastify";
import Loading from "../../components/Loading.jsx";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // true: forgot password, false: reset password
  const [isForgot, setIsForgot] = useState(true);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isForgot) {
        await forgotPassword(email);
        setIsForgot(false);
        toast.success("Mã OTP đã gửi đến email của bạn");
      } else {
        await resetPassword(email, otpCode);
        toast.success("Đã gửi mật khẩu mới đến email của bạn");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20 px-8">
      {loading && <Loading />}

      <form className="max-w-2xl">
        <div className="flex flex-wrap border shadow rounded-lg p-3 dark:bg-gray-600">
          <div className="w-full text-center">
            <h2 className="text-xl text-gray-600 dark:text-gray-300 pb-2">
              Quên mật khẩu
            </h2>
          </div>

          <div className="flex flex-col gap-2 w-full border-gray-400">
            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Nhập email:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isForgot}
              />
            </div>

            {!isForgot && (
              <div>
                <label className="text-gray-600 dark:text-gray-400">
                  Nhập mã OTP:
                </label>
                <input
                  className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col justify-center pt-2">
              <button
                className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
                type="submit"
                onClick={handleSubmit}
              >
                {isForgot ? "Gửi" : "Xác nhận"}
              </button>
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
