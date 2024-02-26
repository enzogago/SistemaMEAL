import * as Icons from "react-icons/fa";
import { Link } from "react-router-dom";

const MenuItem = ({ menu, level }) => {
    const IconName = Icons[menu.menIco];

    const toggleActive = (event, level) => {
        event.stopPropagation();
        const className = `active-level-${level}`;
        event.currentTarget.classList.toggle(className);
    };
    
    const isDashboard = menu.menRef === 'dashboard';
    
    return (
        <div className={`PowerMas_LinkMenuContainer level-${level}`} onClick={(event) => toggleActive(event, level)} key={menu.menCod}>
            <div className="Phone_12 flex ai-center overflow-hidden">
                <Link 
                    className="menu-item flex ai-center flex-grow-1 gap-1" 
                    to={menu.subMenus.length > 0 ? '#' : `/${menu.menRef}`}
                    target={isDashboard ? '_blank' : '_self'}
                >
                    {IconName && <IconName style={{marginLeft: '1rem'}} />}
                    <span className="Large-f1 Medium-f_75 Small-f_75"> {menu.menNom} </span>
                </Link>
                {menu.subMenus.length > 0 && <span className="arrow Large_1"> &gt; </span>}
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
