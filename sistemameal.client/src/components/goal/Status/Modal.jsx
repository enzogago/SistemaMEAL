import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StatusContext } from '../../../context/StatusContext'; // Importa el contexto
import { handleSubmit } from './eventHandlers';
import { AuthContext } from '../../../context/AuthContext';

const Modal = ({ closeModal }) => {
    // variables state de AuthContext
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    // variables state de StatusContext
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estadoEditado, modalVisible } = statusInfo;
    const { setEstados, setModalVisible } = statusActions;

    const { register, handleSubmit: validateForm, formState: { errors }, reset, setValue } = useForm();

    const onSubmit = (data) => {
        handleSubmit(estadoEditado, data.nombre, setEstados, setModalVisible, setIsLoggedIn);
        reset();
    };

    // Activar focus en input
    useEffect(() => {
        if (modalVisible) {
            document.getElementById('nombre').focus();
        }
    }, [modalVisible]);

    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado) {
            setValue('nombre', estadoEditado.estNom);
        }
    }, [estadoEditado, setValue]);
    
    const closeModalAndReset = () => {
        closeModal();
        reset();
    };

    return (
        <div className={`PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent">
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="center">{estadoEditado ? 'Editar Estado' : 'Nuevo Estado'}</h2>
                <form className='Large-f1_25 PowerMas_FormStatus' onSubmit={validateForm(onSubmit)}>
                    <label className="block">
                        Nombre:
                    </label>
                    <input 
                        id="nombre"
                        className="flex" 
                        type="text" 
                        placeholder='EJM: EJECUTADO' 
                        maxLength={100} 
                        name="nombre" 
                        {...register(
                            'nombre', { 
                                required: 'El nombre es requerido',
                                maxLength: { value: 50, message: 'El nombre no puede tener más de 50 caracteres' },
                                minLength:  { value: 5, message: 'El nombre no puede tener menos de 5 caracteres' },
                                pattern: {
                                    value: /^[A-Za-zñÑ\s]+$/,
                                    message: 'Por favor, introduce solo letras y espacios',
                                },
                            }
                        )}
                    />
                    {errors.nombre && <p className='errorInput Large-p_5'>{errors.nombre.message}</p>}
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;
