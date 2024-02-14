import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { StatusContext } from '../../context/StatusContext';
import { handleSubmit } from '../reusable/helper';

const Modal = ({ closeModal, setData }) => {
    // variables state de AuthContext
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    // variables state de StatusContext
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estadoEditado, modalVisible } = statusInfo;
    const { setModalVisible } = statusActions;

    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted  }, reset, setValue } = useForm({ mode: "onChange"});

    const onSubmit = (data) => {
        const fieldMapping = {
            nombre: 'uniNom',
            involucra: 'uniInvPer',
        };

        // Elimina los espacios en blanco adicionales
        data.nombre = data.nombre.replace(/\s+/g, ' ').trim();
        data.involucra = data.involucra.replace(/\s+/g, ' ').trim();

        handleSubmit('Unidad', estadoEditado, data, setData, setModalVisible, setIsLoggedIn, fieldMapping, 'uniCod', reset);
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
            const nombre = estadoEditado.uniNom.charAt(0).toUpperCase() + estadoEditado.uniNom.slice(1).toLowerCase();
            const involucra = estadoEditado.uniInvPer.charAt(0).toUpperCase() + estadoEditado.uniInvPer.slice(1).toLowerCase();
            setValue('nombre', nombre);
            setValue('involucra', involucra);
        }
    }, [estadoEditado, setValue]);
    
    const closeModalAndReset = () => {
        closeModal();
        reset();
    };

    // Función de validación personalizada
    const validateNoLeadingSpaces = (value) => {
        if (value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };
    
    return (
        <div className={`PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent">
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="center">{estadoEditado ? 'Editar' : 'Nuevo'} Unidad</h2>
                <form className='Large-f1 PowerMas_FormStatus' onSubmit={validateForm(onSubmit)}>
                    <label htmlFor='nombre' className="block">
                        Nombre:
                    </label>
                    <input 
                        id="nombre"
                        type="text" 
                        placeholder='Ejm: Evento'
                        className={`p1 PowerMas_Modal_Form_${dirtyFields.nombre || isSubmitted ? (errors.nombre ? 'invalid' : 'valid') : ''}`}  
                        maxLength={100} 
                        name="nombre" 
                        autoComplete='disabled'
                        {...register(
                            'nombre', { 
                                required: 'El campo es requerido',
                                maxLength: { value: 50, message: 'El campo no puede tener más de 50 caracteres' },
                                minLength:  { value: 5, message: 'El campo no puede tener menos de 5 caracteres' },
                                pattern: {
                                    value: /^[A-Za-zñÑ\s]+$/,
                                    message: 'Por favor, introduce solo letras y espacios',
                                },
                                validate: validateNoLeadingSpaces,
                            }
                        )}
                    />
                    {errors.nombre ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.nombre.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label className="block f1">
                        Involucra Persona:
                    </label>
                    <div className="flex gap-1">
                        <div className="flex gap_5">
                            <input 
                                type="radio" 
                                id="activo" 
                                name="uniInvPer" 
                                value="S"
                                {...register('involucra', { required: 'Por favor, selecciona una opción' })}
                            />
                            <label htmlFor="activo">Si</label>
                        </div>
                        <div className="flex gap_5">
                            <input 
                                type="radio" 
                                id="inactivo" 
                                name="uniInvPer" 
                                value="N"
                                {...register('involucra', { required: 'Por favor, selecciona una opción' })}
                            />
                            <label htmlFor="inactivo">No</label>
                        </div>
                    </div>
                    {errors.involucra ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.involucra.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal