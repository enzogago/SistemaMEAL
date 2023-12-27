import { Navigate } from 'react-router-dom'
import { isTokenExpired } from '../auth/auth';


const PrivateRoute = ({ children }) => {
    // Storage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        user && token && !isTokenExpired(token) ? children : <Navigate to="/login" />
        );
    };

export default PrivateRoute;