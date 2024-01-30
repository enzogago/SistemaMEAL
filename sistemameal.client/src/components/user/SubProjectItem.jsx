const SubProjectItem = ({ subProyecto, proyecto, handleCheck, checkedSubProyectos }) => {
    return (
    <li className="Large-f_75 p_5 flex gap-1">
        <input 
            type="checkbox" 
            value={subProyecto.subProCod} 
            checked={!!checkedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`]}
            onChange={(event) => handleCheck(subProyecto, event.target.checked, true, proyecto)}
        />
        <label>
            {subProyecto.subProNom}
        </label>
    </li>
  )
}

export default SubProjectItem