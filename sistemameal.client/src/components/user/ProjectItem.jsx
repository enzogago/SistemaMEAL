import { useState } from 'react';
import SubProjectItem from "./SubProjectItem";

const ProjectItem = ({ proyecto, handleCheck, checkedProyectos, checkedSubProyectos }) => {
    const [ isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <li className="PowerMas_Permission_Dropdown" >
            <div className="p_5 flex jc-ac-space-between ai-center"  style={{color: '#F7775A'}}>
                <div className="flex flex-grow-1 gap-1">
                    <input
                        id={`P${proyecto.proAno}-${proyecto.proCod}`}
                        type="checkbox" 
                        value={`${proyecto.proAno}-${proyecto.proCod}`}
                        className='m0'
                        checked={!!checkedProyectos[`${proyecto.proAno}-${proyecto.proCod}`]}
                        onChange={(event) => handleCheck(proyecto, event.target.checked, false)}
                    />
                    <label htmlFor={`P${proyecto.proAno}-${proyecto.proCod}`}>
                        {proyecto.proNom}
                    </label>
                </div>
                {
                    proyecto.subProyectos &&
                    <span 
                        className={`pointer round p_25 bold ${isOpen ? 'open-user': 'closed'}`}
                        onClick={handleToggle}
                    > 
                        &gt;
                    </span>
                }
            </div>
            <div className={`flex flex-column menu ${isOpen && 'active'}`}>
                {proyecto.subProyectos && proyecto.subProyectos.map((subProyecto, index) => (
                    <SubProjectItem 
                        key={index} 
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
