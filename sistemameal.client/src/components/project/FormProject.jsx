import { FaPlus, FaTrash } from "react-icons/fa";
import SubProject from "./SubProject";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";

const FormProject = () => {
    const { id: encodedCiphertext } = useParams();
    // Decodifica la cadena cifrada
    const ciphertext = decodeURIComponent(encodedCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const proAno = id.slice(0, 4);
    const proCod = id.slice(4);

    // Estados del AuthContext
    const { authInfo } = useContext(AuthContext);
    const { userLogged  } = authInfo;
    // Estados locales
    const [ project, setProject] = useState({
        proNom: '',
        proDes: '',
        proRes: '',
        subProyectos: [{}]
    })
    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        const fetchProyecto = async () => {
            if(userLogged && id.length === 10){
                const token = localStorage.getItem('token');
                Notiflix.Loading.pulse('Cargando...');
                
                const usuAno = userLogged.usuAno;
                const usuCod = userLogged.usuCod;
                try {
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/${usuAno}/${usuCod}/proyecto/${proAno}/${proCod}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(response)
                    const data = await response.json();
                    if (!response.ok) {
                        Notiflix.Notify.failure(data.message);
                        return;
                    }
                    console.log(data);
                    setProject(data[0]);
                    setIsEditing(true);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    Notiflix.Loading.remove();
                }
            }
        };
    
        fetchProyecto();
    }, [userLogged, id]);
    console.log(project)
    return (
        <div className="PowerMas_FormProject bg-white h-100">
            <div className="Large-p2">
                <h1 className="flex left Large-f1_75"> 
                    {isEditing ? 'Editar proyecto' : 'Crear un nuevo proyecto'} 
                </h1>
            </div>

            <div className="PowerMas_MainNewProject Large-12">
                <div className="PowerMas_ProjectInfo Large_6">
                    <h2 className="Large-f1_5">
                    Nombre del proyecto
                    </h2>
                    <input 
                        className="Large-f1" 
                        type="text" 
                        placeholder="Cadenas de valor" 
                        defaultValue={project ? project.proNom : ''} 
                    />
                    <h2 className="Large-f1_5">
                        Descripción del proyecto
                    </h2>
                    <textarea 
                        placeholder="Descripcion en cadenas de valor" 
                        defaultValue={project ? project.proDes : ''} 
                    ></textarea>
                    <h2 className="Large-f1_5">
                        Responsable
                    </h2>
                    <input 
                        className="Large-f1" 
                        type="text" 
                        placeholder="Ayuda en Accion" 
                        defaultValue={project ? project.proRes : ''} 
                    />
                </div>

                <div className="PowerMas_ProjectDetails Large_6">
                    <div className="PowerMas_NewSubproject">
                        <h2 className="Large-f1_5">Subproyectos</h2>
                        <div className="PowerMas_ButtomContainer">
                            <button className="PowerMas_ImportButton">
                                Importar
                                <span className="arrow">{[">"]}</span>
                            </button>

                            <FaPlus 
                                className="Large-f1_5 grey grey-hover pointer"
                                onClick={() => setProject(prevState => ({
                                    ...prevState,
                                    subProyectos: [...(prevState.subProyectos || []), { objetivos: [''], resultados: [''] }]
                                }))} 
                            />

                        </div>
                    </div>

                    {project.subProyectos && project.subProyectos.map((subProyecto, index) => (
                        <SubProject key={index} {...subProyecto} />
                    ))}
                </div>
            </div>

            <div>
                <div>
                    <button className="PowerMas_FooterButton">Limpiar</button>
                    <button className="PowerMas_FooterButton">{isEditing ? 'Guardar' : 'Crear'}</button>
                </div>
            </div>

        </div>
    )
}

export default FormProject