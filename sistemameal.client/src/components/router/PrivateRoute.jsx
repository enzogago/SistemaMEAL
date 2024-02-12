import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Notiflix from 'notiflix';
const PrivateRoute = ({ children }) => {
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userLogged, cargando } = authInfo;

    if (cargando) return Notiflix.Loading.pulse();
    Notiflix.Loading.remove()
    return (
        <>
            {
                Object.keys(userLogged).length > 0 ? children : <Navigate to='/login' />
            }
        </>
    );
};

export default PrivateRoute;