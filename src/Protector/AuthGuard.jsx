import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

const AuthGuard = ({ children, requireAdmin = false }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Check if user is authenticated
    if (!token) {
        // Redirect to login page with return url
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }
    
    // Check if admin access is required
    if (requireAdmin && role !== 'Admin' && role !== 'admin') {
        // Redirect to home if not admin
        return <Navigate to="/" replace />;
    }
    
    // User is authenticated and authorized
    return children;
};

export default AuthGuard;
