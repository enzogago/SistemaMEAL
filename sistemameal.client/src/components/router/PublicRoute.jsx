import { Navigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userLogged } = authInfo;

    return (
        <>
            {
                Object.keys(userLogged).length > 0 ? <Navigate to='/' /> : children
            }
        </>
    );
};


export default PublicRoute
