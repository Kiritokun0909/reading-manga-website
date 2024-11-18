import React from "react";
import { Link } from "react-router-dom";
import "../../styles/site/Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="social-links">
          <Link to="/privacy">Chính sách và điều khoản</Link> |
          <Link to="/about">Giới thiệu ứng dụng</Link>
        </div>

        <div className="personal-info">
          <p>Created by Ho Duc Hoang</p>
          <p>Email: n20dccn018@student.ptithcm.edu.vn</p>
        </div>
      </div>
    </footer>
  );
}
