import { useContext, useEffect } from "react";
// Libraries
import Notiflix from 'notiflix';
// Componentes
import Table from "./Table"
import { AuthContext } from "../../context/AuthContext";

const User = () => {
    // Variables State AuthContext 
    const { authInfo, authActions } = useContext(AuthContext);
    const { setUsers, setIsLoggedIn } = authActions;
    const { users } = authInfo;

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if(response.status == 401 || response.status == 403){
                        const data = await response.json();
                        Notiflix.Notify.failure(data.message);
                        setIsLoggedIn(false);
                    }
                    return;
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
    
        fetchUsuarios();
    }, []);
    return (
        <div className="PowerMas_StatusContainer">
            <Table
                data={ users }
            />
        </div>
    )
}

export default User