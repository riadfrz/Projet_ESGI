import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoutes = () => {
    // const { isAuthenticated } = useAuthStore();
    const isAuthenticated = true;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
