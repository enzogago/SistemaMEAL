import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Notiflix from 'notiflix';
import LoadingComponent from '../LoadingComponent';
const PrivateRoute = ({ children }) => {
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userLogged, cargando } = authInfo;

    if (cargando) return <LoadingComponent />;
    return (
        <>
            {
                Object.keys(userLogged).length > 0 ? children : <Navigate to='/login' />
            }
        </>
    );
};

export default PrivateRoute;