import { useNavigate } from 'react-router-dom'
import logo from '../../img/Logo_Normal.webp';
import { useForm } from 'react-hook-form';
import { Send_Email_Forgot_Password } from './PowerMas_EmailJs';
import Notiflix from 'notiflix';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, dirtyFields, isSubmitted }, reset, setValue, watch, trigger } = useForm({ mode: "onChange"});

    const onSubmit = async(dataForm) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            // Obtén la dirección IP del cliente
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const clientIp = ipData.ip;
            // Obtenemos los datos
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/forgot-password/${dataForm.usuCorEle}`);
            if (!response.ok || response.status === 204) {
                Notiflix.Notify.failure('Usuario no existe o esta inactivo.')
                return;
            }

            const data = await response.json();
            const { usuAno, usuCod, usuNom, usuApe, usuFecNac, usuCorEle } = data;
            const password = (usuNom.charAt(0) + usuApe.split(' ')[0] + usuFecNac.slice(-4)).toLowerCase();
            const response2 = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/forgot-restablecer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuAno, usuCod, usuPas: password, usuIp: clientIp })
            });
            const data2 = await response2.json();
            if (!response2.ok) {
                Notiflix.Notify.failure(data2.message);
                return;
            }
            await Send_Email_Forgot_Password(usuNom, usuCorEle, password);
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
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-column h-100'>
                        <h1 className="Large-f1_75 Small-f1_5 Medium-f1_75 bold Powermas_FontTitle center">
                            ¿Olvidaste tu contraseña?
                        </h1>
                        <br />
                        <article>
                            <p className='Medium-f1 Small-f_75'>
                               No te preocupes, estamos aquí para ayudarte. Por favor, ingresa tu email con la cual te registraste, y te enviaremos un correo electrónico con tu nueva contraseña. Recuerda actualizar tu contraseña para garantizar la seguridad de tu cuenta. ¡Gracias!
                            </p>
                        </article>
                        <br />
                        <div className='flex flex-column flex-grow-1'>
                            {/* <label htmlFor="usuCorEle">Email</label> */}
                            <input 
                                type="text" 
                                id="usuCorEle" 
                                className={`PowerMas_InputLogin PowerMas_Modal_Form_${dirtyFields.usuCorEle || isSubmitted ? (errors.usuCorEle ? 'invalid' : 'valid') : ''} Medium-f1 Small-f_75`} 
                                placeholder="Ejm: correo@correo.es"
                                autoComplete='off'
                                maxLength={50}
                                {...register('usuCorEle', { 
                                    required: 'El Email es requerido',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'Dirección de correo electrónico inválida',
                                    },
                                })} 
                            />
                            {errors.usuCorEle ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuCorEle.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className='PowerMas_Forgot_Footer center flex flex-column gap-1'>
                            <button
                                type='submit'
                                id="btnAcceso" 
                                className="PowerMas_ButtomLogin block"
                            >
                                Enviar
                            </button>
                            <font onClick={() => {navigate('/login')}} className="pointer Medium-f1 Small-f_75">Iniciar Sesión</font>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword