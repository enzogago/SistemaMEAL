import { useNavigate } from "react-router-dom";
import Bar from "../../user/Bar"
import { FaDownload } from "react-icons/fa6";


const FormatProject = () => {
    const navigate = useNavigate();
    return (
        <>
            <Bar currentStep={1} type='upload' />
            <div className="flex-grow-1 p2 overflow-auto">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ipsam excepturi? Quo praesentium alias rerum
                    minus beatae iste. Aliquid quo provident natus exercitationem qui fugit, libero voluptatibus amet doloribus optio.
                </p>
                <div className="overflow-auto p1">
                    <table className="PowerMas_Table_Format_Upload Phone_12 overflow-auto">
                        <thead>
                            <tr>
                                <th>Campos</th>
                                <th>Es Obligatorio</th>
                                <th>Caracteres</th>
                                <th>Formato</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nombre</td>
                                <td>Si</td>
                                <td>50</td>
                                <td>Letras</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>Si</td>
                                <td>50</td>
                                <td>Letras</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>Si</td>
                                <td>50</td>
                                <td>Letras</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>Si</td>
                                <td>50</td>
                                <td>Letras</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>Si</td>
                                <td>50</td>
                                <td>Letras</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>Si</td>
                                <td>50</td>
                                <td>Letras</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div className="flex jc-center p_5">
                    <button className="PowerMas_Buttom_Secondary flex ai-center jc-space-between p_5 Phone_3"> 
                        Descargar formato 
                        <FaDownload className="w-auto" /> 
                    </button>
                </div>
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/subir-proyecto')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={() => navigate('/subir-proyecto')} className="Large_3 m_75 PowerMas_Buttom_Primary">Siguiente</button>
            </footer>
        </>
    )
}

export default FormatProject