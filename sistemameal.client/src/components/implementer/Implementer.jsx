import { useContext, useEffect, useState } from 'react';
// Libraries
import Notiflix from 'notiflix';
// Context
import { AuthContext } from '../../context/AuthContext';
// Componentes
import Table from './Table';
import Modal from './Modal';
import { StatusContext } from '../../context/StatusContext';

const Implementer = () => {
  // Variables State AuthContext 
  const { authActions } = useContext(AuthContext);
  const { setIsLoggedIn } = authActions;
  // Variables State statusContext
  const { statusActions } = useContext(StatusContext);
  const { setModalVisible, setEstadoEditado } = statusActions;
  // States locales
  const [ implementadores, setImplementadores ] = useState([])
  
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
    const fetchImplementadores = async () => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Implementador`, {
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
            if (data.success == false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            setImplementadores(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    fetchImplementadores();
  }, []);
  
  return (
    <div className="PowerMas_StatusContainer">
        <Table 
            data={implementadores} 
            openModal={openModal} 
            setImplementadores={setImplementadores}
        />
        <Modal 
            closeModal={closeModal} 
            setImplementadores={setImplementadores}
        />
    </div>
  )
}

export default Implementer