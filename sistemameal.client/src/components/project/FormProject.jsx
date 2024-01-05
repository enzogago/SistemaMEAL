import { FaPlus, FaTrash } from "react-icons/fa"
import SubProject from "./SubProject"

const FormProject = () => {
    return (
        <div className="PowerMas_FormProject bg-white h-100">
            <div className="Large-p2">
                <h1 className="flex left Large-f1_75"> Crear un nuevo proyecto </h1>
            </div>

            <div className="PowerMas_MainNewProject Large-12">
                <div className="PowerMas_ProjectInfo Large_6">
                    <h2 className="Large-f1_5">Nombre del proyecto</h2>
                    <input className="Large-f1" type="text" placeholder="Cadenas de valor" />
                    <h2 className="Large-f1_5">Descripción del proyecto</h2>
                    <textarea placeholder="Descripcion en cadenas de valor" defaultValue=""></textarea>
                    <h2 className="Large-f1_5">Periodo</h2>
                    <input className="" type="text" placeholder="2020-2022" />
                    <h2 className="Large-f1_5">Responsable</h2>
                    <input className="Large-f1" type="text" placeholder="Ayuda en Accion" />
                </div>

                <div className="PowerMas_ProjectDetails Large_6">
                    <div className="PowerMas_NewSubproject">
                        <h2 className="Large-f1_5">Subproyectos</h2>
                        <div className="PowerMas_ButtomContainer">
                            <button className="PowerMas_ImportButton">
                                Importar
                                <span className="arrow">{[">"]}</span>
                            </button>

                            <FaPlus className="Large-f1_25" />
                        </div>
                    </div>

                    <SubProject />
                    <SubProject />
                    <SubProject />
                    <SubProject />
                    <SubProject />
                </div>
            </div>

            <div>
                <div>
                    <button className="PowerMas_FooterButton">Limpiar</button>
                    <button className="PowerMas_FooterButton">Editar</button>
                </div>
            </div>

        </div>
    )
}

export default FormProject