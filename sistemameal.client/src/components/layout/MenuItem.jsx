import { NavLink, useMatch } from "react-router-dom";
import FaProjectDiagram from "../../icons/FaProjectDiagram";
import FaMaitenance from "../../icons/FaMaitenance";
import FaWatchmanMonitoring from "../../icons/FaWatchmanMonitoring";
import FaMoneyCheckAlt from "../../icons/FaMoneyCheckAlt";
import FaShieldAlt from "../../icons/FaShieldAlt";
import FaRegObjectGroup from "../../icons/FaRegObjectGroup";
import FaFlag from "../../icons/FaFlag";
import FaMosque from "../../icons/FaMosque";
import FaSquare from "../../icons/FaSquare";
import FaAdministration from "../../icons/FaAdministration";

const componentMap = {
    'FaProjectDiagram': FaProjectDiagram,
    'FaMaitenance': FaMaitenance,
    'FaWatchmanMonitoring': FaWatchmanMonitoring,
    'FaMoneyCheckAlt': FaMoneyCheckAlt,
    'FaShieldAlt': FaShieldAlt,
    'FaRegObjectGroup': FaRegObjectGroup,
    'FaFlag': FaFlag,
    'FaMosque': FaMosque,
    'FaSquare': FaSquare,
    'FaAdministration': FaAdministration
};


const MenuItem = ({ menu, level }) => {
    const Icono  = componentMap[menu.menIco.trim()];

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
                    <span style={{marginLeft: '1rem'}} >
                    {Icono && <Icono />}
                    </span>
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
