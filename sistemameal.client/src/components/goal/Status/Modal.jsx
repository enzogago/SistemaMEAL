import { useContext, useEffect, useRef } from 'react';
import { StatusContext } from '../../../context/StatusContext'; // Importa el contexto
import { handleSubmit } from './eventHandlers';
import { AuthContext } from '../../../context/AuthContext';

const Modal = ({ closeModal }) => {
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    //
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estadoEditado, nombreEstado, modalVisible } = statusInfo;
    const { setEstados, setNombreEstado, setModalVisible } = statusActions;

    const handleNombreChange = (e) => {
        setNombreEstado(e.target.value);
    };

    const inputRef = useRef();
    useEffect(() => {
        if (modalVisible) {
            inputRef.current.focus();
        }
    }, [modalVisible]);

    return (
        <div className={`PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent">
                <span className="PowerMas_CloseModal" onClick={closeModal}>×</span>
                <h2 className="center">{estadoEditado ? 'Editar Estado' : 'Nuevo Estado'}</h2>
                <form className='Large-f1_25 PowerMas_FormStatus' onSubmit={(e) => handleSubmit(e, estadoEditado, nombreEstado, setEstados, setNombreEstado, setModalVisible, setIsLoggedIn)}>
                    <label className="block">
                        Nombre:
                    </label>
                    <input 
                        ref={inputRef}
                        className="flex" 
                        type="text" 
                        placeholder='EJM: EJECUTADO' 
                        maxLength={50} 
                        name="nombre" 
                        value={nombreEstado} 
                        onChange={handleNombreChange} 
                    />
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;
