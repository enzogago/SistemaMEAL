import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { StatusContext } from '../../context/StatusContext';
import { handleSubmit } from '../reusable/helper';

const Modal = ({ isOpen, closeModal, setData }) => {
    // variables state de AuthContext
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    // variables state de StatusContext
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estadoEditado, modalVisible } = statusInfo;
    const { setModalVisible } = statusActions;

    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue } = useForm({ mode: "onChange"});

    const onSubmit = (data) => {
        const fieldMapping = {
            nombre: 'genNom',
        };

        // Elimina los espacios en blanco adicionales
        data.nombre = data.nombre.replace(/\s+/g, ' ').trim();
        
        handleSubmit('Genero', estadoEditado, data, setData, setModalVisible, setIsLoggedIn, fieldMapping, 'genCod',reset);
    };

    // Activar focus en input
    useEffect(() => {
        if (isOpen) {
            document.getElementById('nuevaContraseña').focus();
        }
    }, [isOpen]);

    // Efecto al editar estado
    // useEffect(() => {
    //     if (estadoEditado) {
    //         const nombre = estadoEditado.genNom.charAt(0).toUpperCase() + estadoEditado.genNom.slice(1).toLowerCase();
    //         setValue('nombre', nombre);
    //     }
    // }, [estadoEditado, setValue]);
    
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
        <div className={`PowerMas_Modal ${isOpen ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent">
                <span 
                    className="PowerMas_CloseModal" 
                    onClick={closeModalAndReset}
                >
                    ×
                </span>
                <h2 className="center f1_5"> Cambiar Contraseña </h2>
                <form className='Large-f1_25 PowerMas_FormStatus color-black' onSubmit={validateForm(onSubmit)}>
                    <label
                        htmlFor='nuevaContraseña'
                        className="block f1"
                    >
                        Nueva Contraseña:
                    </label>
                    <input 
                        id="nuevaContraseña"
                        className={`p1 PowerMas_Modal_Form_${dirtyFields.nuevaContraseña || isSubmitted ? (errors.nuevaContraseña ? 'invalid' : 'valid') : ''}`}  
                        type="password" 
                        placeholder='Ingresa nueva contraseña' 
                        maxLength={50} 
                        autoComplete='disabled'
                        name="nuevaContraseña"
                        {...register(
                            'nuevaContraseña', { 
                                required: 'El campo es requerido',
                                maxLength: { value: 50, message: 'El campo no puede tener más de 50 caracteres' },
                                minLength:  { value: 3, message: 'El campo no puede tener menos de 3 caracteres' },
                                pattern: {
                                    value: /^[A-Za-zñÑ\s]+$/,
                                    message: 'Por favor, introduce solo letras y espacios',
                                },
                                validate: validateNoLeadingSpaces,
                            }
                        )}
                    />
                    {errors.nuevaContraseña ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.nuevaContraseña.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label
                        htmlFor='confirmarContraseña'
                        className="block f1"
                    >
                        Confirmar Contraseña:
                    </label>
                    <input 
                        id="confirmarContraseña"
                        className={`p1 PowerMas_Modal_Form_${dirtyFields.confirmarContraseña || isSubmitted ? (errors.confirmarContraseña ? 'invalid' : 'valid') : ''}`}  
                        type="password" 
                        placeholder='Confirma la contraseña' 
                        maxLength={50} 
                        autoComplete='disabled'
                        name="confirmarContraseña"
                        {...register(
                            'confirmarContraseña', { 
                                required: 'El campo es requerido',
                                maxLength: { value: 50, message: 'El campo no puede tener más de 50 caracteres' },
                                minLength:  { value: 3, message: 'El campo no puede tener menos de 3 caracteres' },
                                pattern: {
                                    value: /^[A-Za-zñÑ\s]+$/,
                                    message: 'Por favor, introduce solo letras y espacios',
                                },
                                validate: validateNoLeadingSpaces,
                            }
                        )}
                    />
                    {errors.confirmarContraseña ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.confirmarContraseña.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Cambiar Contraseña" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;
