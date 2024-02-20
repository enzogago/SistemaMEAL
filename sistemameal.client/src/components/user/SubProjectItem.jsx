const SubProjectItem = ({ subProyecto, proyecto, handleCheck, checkedSubProyectos }) => {
    return (
    <li className="PowerMas_Sub_Project_Item Large-f_75 p_5 flex gap-1">
        <input 
            type="checkbox"
            className="m0"
            id={`S${subProyecto.subProAno}-${subProyecto.subProCod}`}
            value={`S${subProyecto.subProAno}-${subProyecto.subProCod}`}
            checked={!!checkedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`]}
            onChange={(event) => handleCheck(subProyecto, event.target.checked, true, proyecto)}
        />
        <label htmlFor={`S${subProyecto.subProAno}-${subProyecto.subProCod}`}>
            {subProyecto.subProNom}
        </label>
    </li>
  )
}

export default SubProjectItem