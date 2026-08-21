// client/src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is logged in AND isAdmin is true, show the page
  if (user?.isAdmin) {
    return children;
  }

  // Otherwise, redirect them to the home page
  return <Navigate to="/" replace />;
};

export default AdminRoute;