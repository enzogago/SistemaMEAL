import { Navigate } from 'react-router-dom'
import { cloneElement } from 'react';

const PublicRoute = ({ setIsLoggedIn, children }) => {
    const token = localStorage.getItem('token');

    return (
        token ? <Navigate to='/' /> : cloneElement(children, { setIsLoggedIn })
    );
};


export default PublicRoute
