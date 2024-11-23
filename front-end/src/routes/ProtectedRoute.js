import { Navigate, Outlet } from "react-router-dom";
import HandleCode from "../utilities/HandleCode";

const ProtectedRoute = ({ allowedRoles }) => {
  const accessToken = localStorage.getItem("accessToken");
  const roleId = JSON.parse(localStorage.getItem("roleId"));

  if (!accessToken && allowedRoles) {
    return <Navigate to="/login" />;
  }

  // Redirect admin users trying to access public routes
  if (roleId === HandleCode.ROLE_ADMIN && !allowedRoles) {
    return <Navigate to="/admin" />;
  }

  if (allowedRoles && !allowedRoles.includes(roleId)) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
