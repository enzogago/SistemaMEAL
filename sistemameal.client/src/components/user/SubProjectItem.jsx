const SubProjectItem = ({ subProyecto, proyecto, handleCheck, checkedSubProyectos }) => {
    return (
    <li>
        <label>
            <input 
                type="checkbox" 
                value={subProyecto.subProCod} 
                checked={!!checkedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`]}
                onChange={(event) => handleCheck(subProyecto, event.target.checked, true, proyecto)}
            />
        {subProyecto.subProNom}
        </label>
    </li>
  )
}

export default SubProjectItem