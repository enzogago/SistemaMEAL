import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ isLogggedIn, children }) => (
    isLogggedIn ? children : <Navigate to='/login' />
);


export default PrivateRoute
