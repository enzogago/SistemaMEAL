import { Navigate } from 'react-router-dom'
import Login from '../auth/Login'
import { cloneElement } from 'react';
import { isTokenExpired } from '../auth/auth';

const PublicRoute = ({ setIsLoggedIn, children }) => {
    const token = localStorage.getItem('token');

    return (
        token && !isTokenExpired(token) ? <Navigate to='/' /> : cloneElement(children, { setIsLoggedIn })
    );
};


export default PublicRoute
