import * as Icons from "react-icons/fa";
import { Link } from "react-router-dom";

const MenuItem = ({ menu, level }) => {
    const IconName = Icons[menu.menIco];

    const toggleActive = (event, level) => {
        event.stopPropagation();
        const className = `active-level-${level}`;
        event.currentTarget.classList.toggle(className);
    };
    
    
    return (
        <div className={`PowerMas_LinkMenuContainer level-${level}`} onClick={(event) => toggleActive(event, level)} key={menu.menCod}>
            <div className="menu-item">
                <div className="menu-text">
                    <Link to={menu.subMenus.length > 0 ? '#' : `/${menu.menRef}`}>
                        {IconName && <IconName />}
                        <span> {menu.menNom} </span>
                    </Link>
                </div>
                {menu.subMenus.length > 0 && <span className="arrow"> &gt; </span>}
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