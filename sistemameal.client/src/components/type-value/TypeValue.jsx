import { useContext, useEffect } from 'react';
// Libraries
import Notiflix from 'notiflix';
// Context
import { AuthContext } from '../../context/AuthContext';
import { StatusContext } from '../../context/StatusContext';
// Componentes
import Table from './Table';
import Modal from './Modal';

const TypeValue = () => {
  // Variables State AuthContext 
  const { authActions } = useContext(AuthContext);
  const { setIsLoggedIn } = authActions;
  // Variables State statusContext
  const { statusInfo, statusActions } = useContext(StatusContext);
  const { tiposValor } = statusInfo;
  const { setTiposValor, setModalVisible, setEstadoEditado } = statusActions;
  
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
    const fetchTiposValor = async () => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/TipoValor`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response)
            if (!response.ok) {
                if(response.status == 401 || response.status == 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                    setIsLoggedIn(false);
                }
                return;
            }
            const data = await response.json();
            console.log(data)
            if (data.success == false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            setTiposValor(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    fetchTiposValor();
  }, []);

  return (
    <div className="PowerMas_StatusContainer">
        <Table 
            data={tiposValor} 
            openModal={openModal} 
        />
        <Modal 
            closeModal={closeModal} 
        />
    </div>
  )
}

export default TypeValue