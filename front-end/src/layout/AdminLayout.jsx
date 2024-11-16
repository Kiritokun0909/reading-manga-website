import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import Footer from "../components/site/Footer";

import "../styles/admin/AdminSidebar.css";

export default function AdminLayout() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center bg-[#343a40] p-4 row-manager">
        <Link to="/admin/" className="font-bold text-2xl">
          Admin dashboard
        </Link>
      </div>
      <div className="flex flex-row h-4/5">
        <AdminSidebar />
        <div className="content w-full flex justify-center px-32">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
