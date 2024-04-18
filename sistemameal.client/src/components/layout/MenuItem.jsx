import * as Icons from "react-icons/fa";
import { Link, NavLink, useMatch } from "react-router-dom";

const MenuItem = ({ menu, level, closeSidebar }) => {
    const IconName = Icons[menu.menIco.trim()];

    const match = useMatch(menu.menRef === '#' || menu.menRef === '' ? '#' : `/${menu.menRef}`);
    const isActive = match ? 'PowerMas_Active_Menu' : '';

    const toggleActive = (event, level) => {
        event.stopPropagation();
        const className = `active-level-${level}`;
        event.currentTarget.classList.toggle(className);
    };
    
    const isDashboard = menu.menRef === 'dashboard';
    
    return (
        <div className={`PowerMas_LinkMenuContainer level-${level}`} onClick={(event) => toggleActive(event, level)} key={menu.menCod}>
            <div className="Phone_12 flex ai-center overflow-hidden">
                <NavLink
                    className={`menu-item flex ai-center flex-grow-1 gap-1 ${isActive}`} 
                    to={menu.menRef === '#' || menu.menRef === '' ? '#' : `${menu.menRef}`}
                    target={isDashboard ? '_blank' : '_self'}
                >
                    {IconName && <IconName style={{marginLeft: '1rem'}} />}
                    <span className={`  Medium-f_75 Small-f_75`} style={{fontSize: `${level == 1 ? '16px': '14px'}`}}> {menu.menNom} </span>
                </NavLink>
                {menu.subMenus.length > 0 && <span className="arrow Large_1 flex ai-center jc-center" style={{padding: '0 10px'}}> &gt; </span>}
            </div>
            <div className="PowerMas_Submenu">
                {menu.subMenus.map((subMenu, index) => (
                    <MenuItem key={index} menu={subMenu} level={level + 1} /> // Llamada recursiva
                ))}
            </div>
        </div>
    );
};
export default MenuItem;
