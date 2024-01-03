const SubProjectItem = ({ subProyecto, proyecto, handleCheck, checkedSubProyectos }) => {
  return (
    <li>
        <label>
        <input 
            type="checkbox" 
            value={subProyecto.subProCod} 
            checked={!!checkedSubProyectos[subProyecto.subProCod]}
            onChange={(event) => handleCheck(proyecto, event.target.checked, true)} // usa el proyecto padre
        />
        {subProyecto.subProNom}
        </label>
    </li>
  )
}

export default SubProjectItem