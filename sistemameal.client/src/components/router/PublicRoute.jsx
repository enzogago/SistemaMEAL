import { Navigate } from 'react-router-dom'
import Login from '../auth/Login'
import { cloneElement } from 'react';

// En PublicRoute.js
const PublicRoute = ({ isLogggedIn, setIsLoggedIn, children }) => {
    return isLogggedIn
        ? <Navigate  to='/' />
        : cloneElement(children, { setIsLoggedIn });
}


export default PublicRoute
