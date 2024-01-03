import SubProjectItem from "./SubProjectItem";

const ProjectItem = ({ proyecto, handleCheck, checkedProyectos, checkedSubProyectos }) => {
    return (
    <li>
        <div>
            <label>
                <input 
                    type="checkbox" 
                    value={proyecto.proCod} 
                    checked={!!checkedProyectos[proyecto.proCod]}
                    onChange={(event) => handleCheck(proyecto, event.target.checked, false)}
                />
                {proyecto.proNom}
            </label>
            <span> 
                &gt; 
            </span>
        </div>
        <ul>
        {proyecto.subProyectos.map(subProyecto => (
            <SubProjectItem 
                key={subProyecto.subProCod} 
                subProyecto={subProyecto} 
                proyecto={proyecto} // pasa el proyecto padre
                handleCheck={handleCheck} 
                checkedSubProyectos={checkedSubProyectos} 
            />
        ))}
        </ul>
    </li>
  )
}

export default ProjectItem;