import { Navigate, Outlet } from 'react-router-dom';
import HandleCode from '../utilities/HandleCode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loading } from '../components/Loading';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, roleId, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!isLoggedIn && allowedRoles) {
    return <Navigate to='/login' />;
  }

  // Redirect admin users trying to access public routes
  if (roleId === HandleCode.ROLE_ADMIN && !allowedRoles) {
    return <Navigate to='/admin' />;
  }

  if (allowedRoles && !allowedRoles.includes(roleId)) {
    return <Navigate to='/' />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
