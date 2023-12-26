import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
// Librerias
import Notiflix from 'notiflix';
// Source
import logo from '../../img/PowerMas_LogoAyudaEnAccion.svg';
import portadaLogin from '../../img/PowerMas_PortadaLogin.webp';

const Login = () => {
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn, setUser } = authActions;
    // States locales
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Notiflix.Notify.failure("Por favor, rellena todos los campos.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
        
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return;
            }
        
            const data = await response.json();
            if (data.success) {
                Notiflix.Notify.success(data.message);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.result);
                setUser(data.user);
                setIsLoggedIn(true);
            } else {
                Notiflix.Notify.failure(data.message);
            }
        } catch (error) {
            console.error(`Error al hacer la solicitud: ${error}`);
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
                                <font className="Large-f2 Small-f1_5 Medium-f1_75 bold Powermas_FontTitle">¡Hola de nuevo!</font>
                            </p>
                            <br />
                            <p className="Small-p0 justify">
                                <font className="Large-f1_2 Small-f1 Medium-f1_2">
                                    Horem ipsum dolor sit amet,
                                    consectetur elit vulputate libero
                                    et velit interdum, ac aliquet odio
                                    mattis
                                </font>
                            </p>

                            <form id="formulario" className="left" autoComplete="on">
                                <input
                                    aria-label='Correo Electronico'
                                    id="txtCorreoElectronico" 
                                    onChange={e => setEmail(e.target.value)} 
                                    className="block PowerMas_InputLogin" 
                                    placeholder="Email" 
                                    type="email" 
                                    name="txtCorreoElectronico" 
                                    maxLength="50" 
                                    autoComplete="email" 
                                />
                                <input
                                    aria-label="Contraseña"
                                    id="txtPassword" 
                                    onChange={e => setPassword(e.target.value)} 
                                    className="block PowerMas_InputLogin" 
                                    placeholder="Password" 
                                    type="password" 
                                    name="txtPassword" 
                                    autoComplete="current-password" 
                                />
                                <p id="lblErrorLogin" className="PowerMas_LabelError"></p>
                                <p className="p2 Small-p0 Small-f_75 Large-f1 Medium-f_75 PowerMas_RememberMe">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            id="rememberMe" 
                                            name="rememberMe" 
                                        />
                                        Recordar
                                    </label>
                                    <font href="#" className="">Olvidé mi contraseña</font>
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
                        <img title="Imagen niños" src={portadaLogin} alt="Portada Login" width="auto" height="auto" />
                    </article>
                </div>
            </article>
        </article>
    </section>
  )
}

export default Login