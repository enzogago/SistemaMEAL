import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { useEffect } from 'react';

const Modal = ({ isOpen, closeModal, user }) => {
    const { usuAno, usuCod } = user || {};

    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, getValues } = useForm({ mode: "onChange"});

    const onSubmit = async(data) => {
        // Crea el objeto a enviar
        const payload = {
            usuPas: data.confirmarContraseña,
            usuAno,
            usuCod
        };
    
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario/restablecerPassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            console.log("desde response: ",response)
            const data = await response.json();
            if (!response.ok) {
                console.log(data);
                Notiflix.Notify.failure(data.message);
                return;
            }
    
            Notiflix.Notify.success(data.message);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            closeModalAndReset();
            Notiflix.Loading.remove();
        }
    };
    

    // Activar focus en input
    useEffect(() => {
        if (isOpen) {
            document.getElementById('nuevaContraseña').focus();
        }
    }, [isOpen]);

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
                <h2 className="PowerMas_Title_Modal center f1_5"> Cambiar Contraseña </h2>
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
                                minLength:  { value: 8, message: 'El campo no puede tener menos de 8 caracteres' },
                                pattern: {
                                    value: /^[A-Za-z0-9ñÑ\s@#.$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+$/,
                                    message: 'Por favor, introduce solo letras, números y caracteres especiales permitidos',
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
                                validate: {
                                    noLeadingSpaces: validateNoLeadingSpaces,
                                    matchesPassword: (value) => {
                                        const { nuevaContraseña } = getValues();
                                        return nuevaContraseña === value || "Las contraseñas deben coincidir";
                                    }
                                },
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
