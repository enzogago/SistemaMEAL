import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
    // Storage
    const token = localStorage.getItem('token');

    return (
        token ? children : <Navigate to="/login" />
        );
    };

export default PrivateRoute;