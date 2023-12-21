import { useContext, useEffect } from 'react';
import Notiflix from 'notiflix';
import Table from './Table';
import Modal from './Modal';
import { StatusContext } from '../../../context/StatusContext';

const Status = () => {
    // Variables State useContext
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
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Estado`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
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
