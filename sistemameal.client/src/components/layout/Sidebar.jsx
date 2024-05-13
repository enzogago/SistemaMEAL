// React
import { Link, NavLink, useMatch } from 'react-router-dom';
import {  useContext, useEffect, useState } from 'react';
// sources
import logo from '../../img/Logo_Blanco.webp';
import FaHome from '../../icons/FaHome';
// Libraries
import Notiflix from 'notiflix';
// Componentes
import MenuItem from './MenuItem';
// Context
import { AuthContext } from '../../context/AuthContext';
import { StatusContext } from '../../context/StatusContext';
const Sidebar = () => {
    // Estados del AuthContext
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn, setMenuData, setUsers } = authActions;
    const { userLogged, menuData  } = authInfo;
     // Variables State statusContext
    const { statusActions } = useContext(StatusContext);
    const { resetStatus } = statusActions;
    // Estados local - useState
    const [ menuGroup, setMenuGroup ] = useState([])

    const groupByParent = (menuData) => {
        // Primero, creamos un objeto donde las claves son los códigos de los menús (menCod)
        // y los valores son los elementos del menú correspondientes.
        const menuMap = menuData.reduce((map, item) => {
            map[item.menCod] = { ...item, subMenus: [] };
            return map;
        }, {});
    
        // Luego, recorremos menuData de nuevo para asignar cada menú a su menú padre.
        menuData.forEach((item) => {
            if (item.menCodPad) {
                const parent = menuMap[item.menCodPad];
                if (parent) {
                    parent.subMenus.push(menuMap[item.menCod]);
                }
            }
        });
    
        // Finalmente, filtramos menuData para obtener solo los menús principales.
        const rootMenus = menuData.filter(item => item.menAnoPad === null).map(item => menuMap[item.menCod]);
    
        return rootMenus;
    };
    

    useEffect(() => {
        const fetchMenuData = async () => {
            if (userLogged) {
                Notiflix.Loading.pulse('Cargando...');
                // Storage
                const token = localStorage.getItem('token');
                const usuAno = userLogged.usuAno;
                const usuCod = userLogged.usuCod;
    
                try {
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/${usuAno}/${usuCod}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        const data = await response.json();
                        if (data.result) {
                            setIsLoggedIn(false);
                        }
            
                        Notiflix.Notify.failure(data.message);
                        Notiflix.Loading.remove();
                        return;
                    }
        
                    const data = await response.json();
                    setMenuData(data);
                } catch (error) {
                    console.error(error);
                    Notiflix.Loading.remove();
                }
            }
            Notiflix.Loading.remove();
        };
    
        fetchMenuData();
    }, [userLogged]);

    useEffect(() => {
        if (menuData.length > 0) {
            const groupData = groupByParent(menuData);
            setMenuGroup(groupData);
        }
    }, [menuData]);
    

    // Detectar el tamaño de la ventana
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Establecer el estado inicial de isOpen en función del tamaño de la ventana
    const [isOpen, setIsOpen] = useState(windowWidth >= 768);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const match = useMatch('/'); // Comprueba si la ruta actual es la página de inicio
    const isHome = match ? 'PowerMas_Active_Menu' : '';
    
    return (
        <div className={`PowerMas_Menu Large_2 Medium_3 flex flex-column`}>
            <div className="PowerMas_SidebarHeader Large-p1 Medium-p_75 Small-p1 center Medium-block Small-flex flex Small-jc-space-between jc-space-between">
                <img className='Large_8 Medium_10 Phone_6' height="auto"  title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                <span className='flex ai-center jc-center Medium-none' onClick={handleMenuClick} style={{color: '#fff'}}>
                    <FaHome size={1.5}  />
                </span>
            </div>
            <div className={`PowerMas_SidebarResponsive flex flex-column flex-grow-1 overflow-auto ${isOpen ? 'open' : 'closed'}`}>
                <div className="PowerMas_MenuContainer Large-f1 flex-grow-1 overflow-auto">
                    <div className="PowerMas_MenuOptions overflow-auto">
                        <div className='PowerMas_MainSingleLink'>
                            <NavLink className={`${isHome}`} to='/'>
                                <div className="PowerMas_SingleLink Large-f1">
                                    <FaHome />
                                    <span > Home </span>
                                </div>
                            </NavLink>
                        </div>
                        {menuGroup.map((menuItem, index) => (
                            <MenuItem key={index} menu={menuItem} level={1} closeSidebar={closeSidebar} />
                        ))}
                    </div>
                </div>
                <div className="PowerMas_MenuBottom center p1">
                    <article className='p_5'>
                        <p>Sistema Web MEAL</p>
                        <p className='Large-f_75'>Versión 1.0</p>
                    </article>
                    {/* <hr className='p0 m0' style={{ border: '1px solid #fff'}} />   */}
                </div>
            </div>
        </div>)
};

export default Sidebar;
