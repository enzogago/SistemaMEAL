import { FaPlus, FaTrash } from "react-icons/fa";

const SubProject = () => (
    <div className="PowerMas_SubProjectItem">
        <div className="PowerMas_SAPInput">
            <input className="" type="text" placeholder="codigo SAP: 15465" />
            <i className="fas fa-trash"></i>
        </div>
        <div className="">
            <textarea className="" defaultValue="Nombre de subproyecto 1"></textarea>
        </div>
        <div className="PowerMas_ObjectiveContainer">
            <div className="PowerMas_HeaderObjective">
                <h3 className="Large-f1_25">Objetivos</h3>
                <div className="Large-f1_25">
                    <FaPlus />
                    <FaTrash />
                </div>
            </div>
            <input className="" type="text"  />
            <input className="" type="text"  />
        </div>

        <div className="PowerMas_ResultContainer">
            <div className="PowerMas_HeaderResult">
                <h3 className="Large-f1_25">Resultados</h3>
                <div className="Large-f1_25">
                    <FaPlus />
                    <FaTrash />
                </div>
            </div>
            <input className="" type="text"/>
            <input className="" type="text" />
            <input className="PowerMas_InputBudget" type="text" />
        </div>
    </div>
);

export default SubProject;
