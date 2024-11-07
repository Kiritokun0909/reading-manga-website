import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const accessToken = localStorage.getItem("accessToken");
  const roleId = JSON.parse(localStorage.getItem("roleId"));

  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(roleId)) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
