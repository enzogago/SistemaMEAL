import { useContext } from 'react';
import { StatusContext } from '../../../context/StatusContext'; // Importa el contexto
import { handleSubmit } from './eventHandlers';

const Modal = ({ closeModal }) => {
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estadoEditado, nombreEstado } = statusInfo;
    const { setEstados, setNombreEstado, setModalVisible } = statusActions;

    const handleNombreChange = (e) => {
        setNombreEstado(e.target.value);
    };

    return (
        <div className="PowerMas_Modal">
            <div className="PowerMas_ModalContent">
                <span className="PowerMas_CloseModal" onClick={closeModal}>×</span>
                <h2 className="center">{estadoEditado ? 'Editar Estado' : 'Nuevo Estado'}</h2>
                <form onSubmit={(e) => handleSubmit(e, estadoEditado, nombreEstado, setEstados, setNombreEstado, setModalVisible)}>
                    <label className="block">
                        Nombre:
                    </label>
                    <input className="block" type="text" maxLength={50} name="nombre" value={nombreEstado} onChange={handleNombreChange} />
                    <input type="submit" value="Guardar" />
                </form>
            </div>
        </div>
    );
}

export default Modal;
