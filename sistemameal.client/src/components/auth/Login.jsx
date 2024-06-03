import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
// Librerias
import Notiflix from 'notiflix';
// Source
import logo from '../../img/Logo_Normal.webp';
import portadaLogin from '../../img/PowerMas_Portada_Login.webp';

import CryptoJS from 'crypto-js';
import EyeIcon from '../../icons/EyeIcon';
import EyeOffIcon from '../../icons/EyeOffIcon';

const Login = () => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn, setUserLogged, setMenuData } = authActions;
    // States locales
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        setMenuData([]);
        const savedCredentials = JSON.parse(localStorage.getItem('credentials'));
        if (savedCredentials) {
            const bytes  = CryptoJS.AES.decrypt(savedCredentials.encryptedPassword, 'secret key 123');
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
            setEmail(savedCredentials.email);
            setPassword(originalPassword);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validacion de datos ingresados
        if (!email || !password) {
            Notiflix.Notify.failure("Por favor, rellena todos los campos.");
            return;
        }

        try {
            Notiflix.Loading.pulse();

            // Obtén la dirección IP del cliente
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const clientIp = ipData.ip;


            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, clientIp })
            });
        
            if (!response.ok || response.status === 204) {
                console.error(`HTTP error! status: ${response.status}`);
                return;
            }
        
            const data = await response.json();
            if (data.success) {
                setUserLogged(data.user);
                if (rememberMe) {
                    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret key 123').toString();
                    localStorage.setItem('credentials', JSON.stringify({ email, encryptedPassword }));
                }
                localStorage.setItem('token', data.result);

                let fecha = new Date();
                let hora = fecha.getHours();
                let minutos = fecha.getMinutes();

                localStorage.setItem('timeInit', `${hora}:${minutos}`);
                setIsLoggedIn(true);
            } else {
                Notiflix.Notify.failure(data.message);
            }
        } catch (error) {
            console.error(`Error al hacer la solicitud: ${error}`);
        } finally {
            Notiflix.Loading.remove();
        }
       
    };

    return (
        <section className="container-fluid allvh PowerMas_ParentLogin">
            <article className="container flex flex-wrap">
                <article className="PowerMas_MainContainer container Small-m1 flex flex-wrap">
                    <div className="item  Phone_12  Medium_7 Small_7 Large_7 Tablet_6 Large-m0 Small-m1">
                        <article className="PowerMas_Form_Contact_First_Part">
                            <picture>
                                <img title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                            </picture>
                            <article className="PowerMas_FormLogin Small-p0">
                                <p className="Small-p0">
                                    <font className="Large-f1_75 Small-f1_5 Medium-f1_75 bold Powermas_FontTitle">¡Bienvenidos al Sistema MEAL!</font>
                                </p>
                                <br />
                                <p className="Small-p0">
                                    <font className="Large-f1 Medium-f1 Small-f_75">
                                        Tu plataforma central para gestionar y monitorear proyectos de AEA Ecuador. Explora de forma intuitiva el registro y seguimiento de beneficiarios, metas y presupuestos, garantizando una experiencia fácil y eficiente.
                                    </font>
                                </p>
                                <br />
                                <form id="formulario" className="left flex flex-column gap_25" autoComplete="on">
                                    <input
                                        aria-label='Correo Electronico'
                                        id="txtCorreoElectronico" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)} 
                                        className="block PowerMas_InputLogin Medium-f1 Small-f_75" 
                                        placeholder="Email" 
                                        type="email" 
                                        name="txtCorreoElectronico" 
                                        maxLength="50" 
                                        autoComplete="email" 
                                    />
                                    <div className='flex relative ai-center'>
                                        <input
                                            aria-label="Contraseña"
                                            id="txtPassword" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block PowerMas_InputLogin Medium-f1 Small-f_75" 
                                            placeholder="Password" 
                                            type={showPassword ? 'text' : 'password'}
                                            name="txtPassword" 
                                            autoComplete="current-password" 
                                        />
                                        <span className='flex pointer f1_5' style={{position: 'absolute', right: 0}} onClick={toggleShowPassword}>
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </span>
                                    </div>
                                    <p className="p2 Small-p0 Small-f_75 Large-f1 Medium-f_75 PowerMas_RememberMe">
                                        <label className='flex gap_5' >
                                            <input 
                                                type="checkbox" 
                                                id="rememberMe" 
                                                name="rememberMe"
                                                className='m0' 
                                                checked={rememberMe}
                                                onChange={e => setRememberMe(e.target.checked)}
                                            />
                                            Recordar
                                        </label>
                                        <font onClick={() => {navigate('/forgot-password')}} className="pointer">Olvidé mi contraseña</font>
                                    </p>
                                    <button 
                                        id="btnAcceso" 
                                        onClick={handleLogin} 
                                        className="PowerMas_ButtomLogin block"
                                    >
                                        Ingresar
                                    </button>
                                    <br />
                                </form>

                            </article>
                        
                        </article>
                    </div>
                    <div className="item  Phone_12  Medium_5 Small_5 Large_5 Tablet_6 Large-m0 Small-m1 p0 PowerMas_ImageLogin">
                        <article>
                            <img 
                                title="Portada Login" 
                                src={portadaLogin} 
                                alt="Portada Login" 
                                width="auto" 
                                height="auto" 
                            />
                        </article>
                    </div>
                </article>
            </article>
        </section>
    )
}

export default Login