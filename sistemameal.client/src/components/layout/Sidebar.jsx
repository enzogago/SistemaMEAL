// React
import { Link } from 'react-router-dom';
import {  useContext, useEffect, useState } from 'react';
// sources
import logo from '../../img/PowerMas_LogoAyudaEnAccionSidebar.svg';
// Libraries
import { FaCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
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
    
    
    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        resetStatus();
        setUsers([]);
    };

    
    return (
        <div className="PowerMas_Menu Large_2 Medium_3 Small_12 flex flex-column">
            <div className="PowerMas_SidebarHeader Large-p1 Medium-p_75 Small-p1 center Medium-block Small-flex flex Small-jc-space-between jc-space-between">
                <img className='Large_12 Medium_10 Phone_6' height="auto"  title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                <IoMenu className='Large-f0 Medium-f0 Small-f2_5 Phone_1' />
            </div>
            <div className="PowerMas_MenuContainer Large-f1 flex-grow-1 overflow-auto">
                <div className="PowerMas_MenuOptions overflow-auto">
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
            </div>
            <div className="PowerMas_MenuBottom center p1">
                <article className='p_5'>
                    <p>Sistema MEAL</p>
                    <p className='Large-f_75'>Version 0.0.1</p>
                </article>
                <hr className='p0 m0' style={{ border: '1px solid #fff'}} />  
                <article className='p_5'>
                    <p className='Large-f_75'>31 de Enero del 2024</p>
                    <p className='Large-f_75'>05:20 PM</p>
                </article>                   
            </div>
        </div>)
};

export default Sidebar;
