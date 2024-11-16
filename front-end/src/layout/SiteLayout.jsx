import { Outlet } from "react-router-dom";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";

import "../styles/admin/AdminSidebar.css";

export default function SiteLayout() {
  return (
    <>
      <Header />
      <div className="content">
        <div className="column-item__sidebar-one"></div>
        <div className="column-item__main-column">
          <Outlet />
        </div>
        <div className="column-item__sidebar-two"></div>
      </div>
      <Footer />
    </>
  );
}
