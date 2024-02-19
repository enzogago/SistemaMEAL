import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import Result from "./Result";
import Objective from "./Objective";

const SubProject = ({subProAno, subProCod, subProNom, subProSap, objetivos, resultados }) => {

    const [ editObjetivos, setEditObjetivos] = useState([]);
    const [ editResultados, setEditResultados] = useState([]);

    useEffect(() => {
        setEditObjetivos(objetivos || []);
    }, [objetivos]);

    useEffect(() => {
        setEditResultados(resultados || []);
    }, [resultados]);

    return (
    <div className="PowerMas_SubProjectItem">
        <div className="Large-f1_5 Large-m_5 flex jc-flex-end">
            <FaTrash className="Large_1 pointer red red-hover" />
        </div>
        <div className="PowerMas_SAPInput">
            <input 
                className="" 
                type="text" 
                placeholder="codigo SAP: 15465" 
                defaultValue={subProSap}
            />
        </div>
        <div className="">
            <textarea 
                className="" 
                placeholder="Nombre de subproyecto 1" 
                defaultValue={subProNom} 
            ></textarea>
        </div>
        <div className="PowerMas_ObjectiveContainer">
            <div className="PowerMas_HeaderObjective">
                <h3 className="Large-f1_25">Objetivos</h3>
                <div className="Large-f1_25">
                    <FaPlus
                        className="grey grey-hover pointer"
                        onClick={() => setEditObjetivos(prevObjetivos => [...prevObjetivos, ''])} 
                    />
                    <FaTrash 
                        className="pointer grey grey-hover"
                    />
                </div>
            </div>
            {editObjetivos.map((objetivo, index) => (
                <Objective key={index} {...objetivo} />
            ))}
        </div>

        <div className="PowerMas_ResultContainer">
            <div className="PowerMas_HeaderResult">
                <h3 className="Large-f1_25">Resultados</h3>
                <div className="Large-f1_25">
                    <FaPlus
                        className="grey grey-hover pointer"
                        onClick={() => setEditResultados(prevResultados => [...prevResultados, ''])} 
                    />
                    <FaTrash 
                        className="pointer grey grey-hover"
                    />
                </div>
            </div>
            {editResultados.map((resultado, index) => (
                <Result key={index} {...resultado} />
            ))}
            <input 
                className="PowerMas_InputBudget" 
                placeholder="Presupuesto"
                type="text" 
            />
        </div>
    </div>
)};

export default SubProject;
