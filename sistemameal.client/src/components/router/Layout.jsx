import { useLocation, useNavigate } from 'react-router-dom';
import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";
import { Tooltip } from 'react-tooltip';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // const showSidebarAndBar = location.pathname !== '/dashboard';
    const path = location.pathname;
    // Variables state AuthContext
    const { authInfo } = useContext(AuthContext);
    const { userLogged } = authInfo;

    useEffect(() => {
        if (userLogged) {
            if (userLogged.usuSes === 'S') {
                navigate('/user-first')
            } else {
                if (location.pathname === '/user-first') {
                    navigate('/')
                } else {
                    navigate(location.pathname)
                }
            }
        }
    }, [location.pathname])

    const handleMouseMove = (e) => {
        // Obtener la hora y minutos guardados en el localStorage
        let [horaGuardada, minutoGuardado] = localStorage.getItem('timeInit').split(':').map(Number);
    
        // Crear una fecha con la hora y minutos guardados
        let fechaGuardada = new Date();
        fechaGuardada.setHours(horaGuardada, minutoGuardado);
    
        // Agregar 2 horas a la fecha guardada
        fechaGuardada.setHours(fechaGuardada.getHours() + 2);
    
        // Obtener la fecha y hora actuales
        let fechaActual = new Date();
        // Comparar si la fecha guardada más 2 horas es menor que la fecha actual
        if (fechaGuardada < fechaActual) {
            // Aquí va tu código si la condición es verdadera


        } else {
            // Aquí va tu código si la condición es falsa
            // Notiflix.Confirm.show(
            //     'Notiflix Confirm',
            //     'Do you agree with me?',
            //     'Yes',
            //     'No',
            //     () => {
            //         // Seteamos la hora con la nueva
            //         alert('Thank you.');
            //     },
            //     () => {
            //         // Validar usuario
            //         alert('If you say so...');
            //     },
            //     {
            //     },
            //     );
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        // Función para manejar el clic en el documento
        const handleDocumentClick = () => {
            setIsOpen(false); // Cierra el menú cuando se hace clic fuera de él
        };

        // Agrega el event listener cuando el componente se monta
        document.addEventListener('click', handleDocumentClick);

        // Limpia el event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []); 
    

    return(
        <div className="PowerMas_MainHome flex Large-flex-row Medium-flex-row Small-flex-column flex-column" onMouseMove={handleMouseMove} >
            {
                path !== '/dashboard' && path !== '/user-first' &&
                <>
                    <Sidebar />
                    <div className="PowerMas_MainRender Large_10 Medium_9 Small_12 relative">
                        {/* <div
                            className='flex ai-center jc-center'
                            style={{
                                position: 'absolute',
                                right: '20%',
                                left: '20%'
                            }}
                        >
                            <h3
                                className='p_5 Medium-f1_5 Small-f1'
                                style={{
                                    backgroundColor: '#000000',
                                    color: '#FFFFFF'
                                }}
                            >
                                Modo Simulador
                            </h3>
                        </div> */}
                        <Bar showSidebarAndBar={true} isOpen={isOpen} setIsOpen={setIsOpen} />
                        <section className="PowerMas_Content Large-m1">
                            {children}
                        </section>
                        <footer 
                            className='p_5 flex flex-column center Medium-none'
                            style={{backgroundColor: '#372E2C', color: '#FFFFFF'}}
                        >
                            <p className='f_75'>Todos los derechos reservados </p>
                            <p className='f_75'>Copyright 2024 © </p>
                        </footer>
                        
                    </div>
                </>
            }
            {
                path === '/dashboard' &&
                <div className='flex flex-column Large_12'>
                    <Bar showSidebarAndBar={false} isOpen={isOpen} setIsOpen={setIsOpen} />
                    {children}
                </div>
            }
            {
                path === '/user-first' &&
                <div className='flex flex-column Large_12'>
                    {children}
                </div>
            }
            <Tooltip 
                    id="error-tooltip"
                    effect="solid"
                    place='bottom-start'
                    className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                    id="info-tooltip"
                    effect="solid"
                    place='bottom-start'
                    className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="edit-tooltip"
                effect="solid"
                place='top-end'
                className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="delete-tooltip" 
                effect="solid"
                place='top-start'
                className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="select-tooltip" 
                effect="solid"
                place='top-start'
                className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="error-total" 
                effect="solid"
                place='top-start'
                className="PowerMas_Tooltip_Error"
            />

        </div>)
};
export default Layout;
