import { useState } from 'react';
import SubProjectItem from "./SubProjectItem";

const ProjectItem = ({ proyecto, handleCheck, checkedProyectos, checkedSubProyectos }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className="PowerMas_Permission_Dropdown" >
            <div className="p_5"  style={{color: '#F7775A'}}>
                <div className="flex gap-1">
                    <input 
                        type="checkbox" 
                        value={proyecto.proCod} 
                        checked={!!checkedProyectos[`${proyecto.proAno}-${proyecto.proCod}`]}
                        onChange={(event) => handleCheck(proyecto, event.target.checked, false)}
                    />
                    <label>
                        {proyecto.proNom}
                    </label>
                </div>
                {
                    proyecto.subProyectos &&
                    <span 
                        className={`pointer round p_25 bold arrow ${isOpen ? 'down' : 'right'}`} 
                        onClick={handleToggle}
                    > 
                        &gt;
                    </span>
                }
            </div>
            <div className={`PowerMas_Permission_Dropdown ${isOpen ? 'menu open' : 'menu'}`}>
                {proyecto.subProyectos && proyecto.subProyectos.map(subProyecto => (
                    <SubProjectItem 
                        key={subProyecto.subProCod} 
                        subProyecto={subProyecto} 
                        proyecto={proyecto} 
                        handleCheck={handleCheck} 
                        checkedSubProyectos={checkedSubProyectos} 
                    />
                ))}
            </div>
        </li>
    )
}

export default ProjectItem;
