// src/components/LoginPage.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../../styles/site/Login.css";
import { loginApi, register } from "../../api/AuthService.js";
import { AuthContext } from "../../context/AuthContext";
import HandleCode from "../../utilities/HandleCode.js";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, confirmPassword } = event.target.elements;

    try {
      if (!isLogin && password.value !== confirmPassword.value) {
        toast.error("Mật khẩu không trùng khớp");
        return;
      }

      const response = await (isLogin
        ? loginApi(email.value, password.value)
        : register(email.value, password.value));

      if (isLogin) {
        login(response.accessToken, response.refreshToken, response.roleId);
        toast.success("Đăng nhập thành công");
        if (response.roleId === HandleCode.ROLE_ADMIN) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.success(
          "Đăng ký tài khoản thành công! Bạn có thể sử dụng tài khoản vừa đăng ký để đăng nhập."
        );
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="font-bold text-2xl">
        {isLogin ? "Đăng nhập" : "Đăng ký"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input type="password" name="password" required />
        </div>
        {!isLogin && (
          <div>
            <label>Nhập lại mật khẩu:</label>
            <input type="password" name="confirmPassword" required />
          </div>
        )}

        <div></div>
        <button type="submit" className="submit-button">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>

        <button
          type="button"
          className="toggle-button"
          onClick={toggleAuthMode}
        >
          {isLogin
            ? "Chưa có tài khoản? Đăng ký"
            : "Đã có tài khoản? Đăng nhập"}
        </button>
        <Link to="/forgot-password">Quên mật khẩu</Link>
      </form>
    </div>
  );
}
