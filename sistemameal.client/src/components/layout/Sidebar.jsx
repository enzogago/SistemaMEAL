// React
import { Link } from 'react-router-dom';
import {  useContext, useEffect, useState } from 'react';
// sources
import logo from '../../img/PowerMas_LogoAyudaEnAccionSidebar.svg';
// Libraries
import { FaCog, FaHome, FaSignOutAlt } from "react-icons/fa";
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
    const { userLogged  } = authInfo;
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
                    const groupData = groupByParent(data);
                    setMenuData(data);
                    setMenuGroup(groupData);
                } catch (error) {
                    console.error(error);
                    Notiflix.Loading.remove();
                }
            }
            Notiflix.Loading.remove();
        };
    
        fetchMenuData();
    }, [userLogged]); // Añade userLogged como dependencia
    
    
    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        resetStatus();
        setUsers([]);
    };

    
    return (
        <div className="PowerMas_Menu Phone_2 Large-inline none">
            <div className="PowerMas_SidebarHeader">
                <img className='Large_10 Large-m1' title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                <h1 className="Powermas_FontTitle center Large-f2_25">Menú</h1>
            </div>
            <div className="PowerMas_MenuContainer Large-f1">
                <div className="PowerMas_MenuOptions">
                    <div className='PowerMas_MainSingleLink'>
                        <Link to='/'>
                            <div className="PowerMas_SingleLink Large-f1">
                                <FaHome />
                                <span > Home </span>
                            </div>
                        </Link>
                    </div>
                    {menuGroup.map((menuItem, index) => (
                        <MenuItem key={index} menu={menuItem} level={1} />
                    ))}
                </div>
                <div className="PowerMas_MenuBottom">
                    <div>
                        <div className='PowerMas_MainSingleLink'>
                            <Link to='/'>
                                <div className="PowerMas_SingleLink">
                                    <FaCog />
                                    <span> Configuración </span>
                                </div>
                            </Link>
                        </div>
                        <div className='PowerMas_MainSingleLink'>
                            <Link to='/' onClick={handleLogout}>
                                <div className="PowerMas_SingleLink">
                                    <FaSignOutAlt />
                                    <span> Cerrar Sesión </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
};

export default Sidebar;
