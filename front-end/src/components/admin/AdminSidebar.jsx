import { Link, useNavigate } from "react-router-dom";

import "../../styles/admin/AdminSidebar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  return (
    <div className="flex flex-col w-2/12 bg-gray-800 pl-2">
      <Link to="#" className="no-underline text-white">
        <div className="flex justify-center p-2 border-b border-gray-700 row-manager">
          <span className=" text-lg font-bold">CHỨC NĂNG</span>
        </div>
      </Link>

      <Link to="/admin/manage-manga" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Quản lý truyện</span>
        </div>
      </Link>

      <Link to="/admin/manage-genre" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Quản lý thể loại</span>
        </div>
      </Link>

      <Link to="/admin/manage-author" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Quản lý tác giả</span>
        </div>
      </Link>

      <Link to="/admin/manage-plan" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Quản lý gói đăng ký</span>
        </div>
      </Link>

      <Link to="/admin/statistic" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className="text-lg">Thống kê</span>
        </div>
      </Link>

      <Link to="/admin/manage-document" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Quản lý tài liệu</span>
        </div>
      </Link>

      <Link to="/admin/manage-user" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Quản lý người dùng</span>
        </div>
      </Link>

      <Link to="/admin/profile" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Đổi thông tin</span>
        </div>
      </Link>

      <Link to="/admin/password" className="no-underline text-white">
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Đổi mật khẩu</span>
        </div>
      </Link>

      <Link
        to="/"
        className="no-underline text-white"
        onClick={handleLogoutClick}
      >
        <div className="p-2 border-b border-gray-700 row-manager hover:bg-gray-600 hover:text-orange-500">
          <span className=" text-lg">Đăng xuất</span>
        </div>
      </Link>
    </div>
  );
}
