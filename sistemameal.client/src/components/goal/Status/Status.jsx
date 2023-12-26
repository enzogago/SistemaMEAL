import { useContext, useEffect } from 'react';
import { StatusContext } from '../../../context/StatusContext';
import { AuthContext } from '../../../context/AuthContext';
// Libraries
import Notiflix from 'notiflix';
// Componentes
import Table from './Table';
import Modal from './Modal';

const Status = () => {
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    // Variables State statusContext
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estados, estadoEditado } = statusInfo;
    const { setEstados, setNombreEstado, setModalVisible, setEstadoEditado } = statusActions;
    
    // TOGGLE MODAL
    const openModal = (estado = null) => {
        setEstadoEditado(estado);
        setModalVisible(true);
    };
    const closeModal = () => {
        setEstadoEditado(null);
        setModalVisible(false);
        setNombreEstado("");
    };

    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado) {
            setNombreEstado(estadoEditado.estNom);
        } else {
            setNombreEstado("");
        }
    }, [estadoEditado]);
    

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Estado`, {
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
                setEstados(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
    
        fetchEstados();
    }, []);
    
    

    return (
        <div className="PowerMas_StatusContainer">
            <Table 
                data={estados} 
                openModal={openModal} 
            />
            <Modal 
                closeModal={closeModal} 
            />
        </div>
    );
}

export default Status;
