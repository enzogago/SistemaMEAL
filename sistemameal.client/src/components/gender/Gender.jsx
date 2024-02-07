import { useContext, useEffect, useState } from 'react';
// Libraries
import Notiflix from 'notiflix';
// Componentes
import Table from './Table';
import Modal from './Modal';
// Context
import { AuthContext } from '../../context/AuthContext';
import { StatusContext } from '../../context/StatusContext';

const Gender = () => {
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn, setUserLogged } = authActions;
    // Variables State statusContext
    const { statusActions } = useContext(StatusContext);
    const { setModalVisible, setEstadoEditado } = statusActions;
    // States locales
    const [ data, setData ] = useState([])
    
    // TOGGLE MODAL
    const openModal = (estado = null) => {
        setEstadoEditado(estado);
        setModalVisible(true);
    };
    const closeModal = () => {
        setEstadoEditado(null);
        setModalVisible(false);
    };

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchData = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Genero`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(response)
                console.log(data)
                if (!response.ok) {
                    if(response.status == 401){
                        Notiflix.Notify.failure(data.message);
                        setUserLogged({})
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                    }
                    return;
                }
                if (data.success == false) {
                    console.log(data)
                    Notiflix.Notify.failure(data.message);
                    setUserLogged({})
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    return;
                }
                setData(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
    
        fetchData();
    }, []);
    
    

    return (
        <div className="PowerMas_StatusContainer">
            <Table 
                data={data} 
                openModal={openModal}
                setData={setData}
            />
            <Modal 
                closeModal={closeModal}
                setData={setData}
            />
        </div>
    );
}

export default Gender;
