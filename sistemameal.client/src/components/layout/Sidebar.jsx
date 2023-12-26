import { Link } from 'react-router-dom';
import { FaCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import logo from '../../img/PowerMas_LogoAyudaEnAccionSidebar.svg';
import { useContext, useEffect, useState } from 'react';
import Notiflix from 'notiflix';
import MenuItem from './MenuItem';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ setIsLoggedIn }) => {
    const { authInfo } = useContext(AuthContext);
    const { user } = authInfo;

    const [menuData, setMenuData] = useState([]);

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
            Notiflix.Loading.pulse('Cargando...'); // Muestra la notificación de carga
    
            const rolCod = user.rol.rolCod; // Aquí debes implementar la lógica para obtener el rol del usuario
            const token = localStorage.getItem('token');
    
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/${rolCod}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    const text = await response.text();
                    Notiflix.Notify.failure(text);
                    throw new Error(text);
                }
    
                const data = await response.json();
                const groupData = groupByParent(data);
                setMenuData(groupData);
            } catch (error) {
                console.error(error);
            }
    
            Notiflix.Loading.remove(); // Oculta la notificación de carga
        };
    
        fetchMenuData();
    }, []);
    
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };
    
    return (
        <div className="PowerMas_Menu">
            <div className="PowerMas_SidebarHeader">
                <img className='Large-p2' title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
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
                    {menuData.map((menuItem, index) => (
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
