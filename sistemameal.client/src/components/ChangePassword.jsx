import { useNavigate } from 'react-router-dom'
import logo from '../img/Logo_Normal.webp';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Notiflix from 'notiflix';

const ChangePassord = () => {
    const { authInfo, authActions } = useContext(AuthContext);
    const { userLogged } = authInfo;
    const { setUserLogged } = authActions;

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, dirtyFields, isSubmitted }, reset, getValues } = useForm({ mode: "onChange"});

    const validateNoLeadingSpaces = (value) => {
        if (value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };


    const onSubmit = async(data) => {
        // Crea el objeto a enviar
        const payload = {
            usuPas: data.confirmarContraseña,
            usuAno: userLogged.usuAno,
            usuCod: userLogged.usuCod
        };

        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/restablecerPassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
    
            Notiflix.Notify.success(data.message);
            setUserLogged({})
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleSkip = async() => {
        userLogged.usuSes = 'N';
        console.log(userLogged)
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/${userLogged.usuAno}/${userLogged.usuCod}` , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userLogged),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                Notiflix.Notify.failure(errorData.message);
                return;
            }
    
            const successData = await response.json();
            // Si se está creando un nuevo usuario, obtén el usuAno y usuCod del último usuario
            Notiflix.Notify.success(successData.message);
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    return (
        <div className='PowerMas_ParentLogin vh-100 flex ai-center jc-center'>
            <div className='Large_5 PowerMas_MainContainer flex Small-p2 Small-m1'>
                <div className='h-100 flex flex-column Medium-p1 Small-p0'>
                    <picture className=''>
                        <img className='Large_4 Phone_8' title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                    </picture>
                    <br />
                    <form className='Large-f1_25' onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="Large-f1_75 Small-f1_5 Medium-f1_75 bold Powermas_FontTitle center">
                            Cambiemos tu contraseña
                        </h1>
                        <br />
                        <label
                            htmlFor='nuevaContraseña'
                            className="block f1"
                        >
                            Nueva Contraseña:
                        </label>
                        <input 
                            id="nuevaContraseña"
                            style={{borderRadius: '0'}}
                            className={`PowerMas_InputLogin PowerMas_Modal_Form_Li_${dirtyFields.nuevaContraseña || isSubmitted ? (errors.nuevaContraseña ? 'invalid' : 'valid') : ''}`}  
                            type="password" 
                            placeholder='Ingresa nueva contraseña' 
                            maxLength={50} 
                            autoComplete='off'
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
                            style={{borderRadius: '0'}}
                            className={`PowerMas_InputLogin PowerMas_Modal_Form_Li_${dirtyFields.confirmarContraseña || isSubmitted ? (errors.confirmarContraseña ? 'invalid' : 'valid') : ''}`}  
                            type="password" 
                            placeholder='Confirma la contraseña' 
                            maxLength={50} 
                            autoComplete='off'
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
                        <div className='PowerMas_Forgot_Footer center flex flex-column gap-1'>
                            <button
                                type='submit'
                                className="PowerMas_ButtomLogin block"
                            >
                                Cambiar
                            </button>
                            <font onClick={handleSkip} className="pointer Medium-f1 Small-f_75">Omitir</font>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassord