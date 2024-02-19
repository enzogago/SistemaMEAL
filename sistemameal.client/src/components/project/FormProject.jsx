import { FaPlus, FaTrash } from "react-icons/fa";
import SubProject from "./SubProject";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import { handleSubmit } from "./eventHandlers";

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

    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue 
    } = useForm({ mode: "onChange"});

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
                    reset(data[0]);
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

    const Guardar_Proyecto = () => {
        validateForm((data) => {
            console.log(data)
            handleSubmit(data, isEditing);
        })();
    }

    return (
        <div className="bg-white h-100 flex flex-column">
            <div className="">
                <h1 className="flex flex-grow-1"> 
                    {isEditing ? 'Editar proyecto' : 'Crear un nuevo proyecto'} 
                </h1>
            </div>

            <div className="flex flex-grow-1 overflow-auto  p1_25">
                <div className="PowerMas_ProjectInfo Large_6 overflow-auto">
                    <label htmlFor="proNom" className="">
                        Nombre
                    </label>
                    <input type="text"
                        id="proNom"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proNom || isSubmitted ? (errors.proNom ? 'invalid' : 'valid') : ''}`} 
                        placeholder="Enzo Fabricio"
                        autoComplete="disabled"
                        {...register('proNom', { 
                            required: 'El nombre es requerido',
                            minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                        })} 
                    />
                    {errors.proNom ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proNom.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label htmlFor="proDes" className="">
                        Descripción
                    </label>
                    <textarea
                        id="proDes"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proDes || isSubmitted ? (errors.proDes ? 'invalid' : 'valid') : ''}`} 
                        placeholder="Enzo Fabricio"
                        autoComplete="disabled"
                        {...register('proDes', { 
                            required: 'El nombre es requerido',
                            minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                        })} 
                    />
                    {errors.proDes ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proDes.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label htmlFor="proRes" className="">
                        Responsable
                    </label>
                    <input type="text"
                        id="proRes"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proRes || isSubmitted ? (errors.proRes ? 'invalid' : 'valid') : ''}`} 
                        placeholder="Enzo Fabricio"
                        autoComplete="disabled"
                        {...register('proRes', { 
                            required: 'El nombre es requerido',
                            minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                        })} 
                    />
                    {errors.proRes ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proRes.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label htmlFor="proPerAnoIni" className="">
                        Año:
                    </label>
                    <input
                        id="proPerAnoIni"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerAnoIni || isSubmitted ? (errors.proPerAnoIni ? 'invalid' : 'valid') : ''}`} 
                        type="text" 
                        placeholder="2023"
                        autoComplete="disabled"
                        maxLength={4}
                        onKeyDown={(event) => {
                            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                event.preventDefault();
                            }
                        }}
                        {...register('proPerAnoIni', { 
                            required: 'El número de documento es requerido',
                            minLength: {
                                value: 4,
                                message: 'El número de documento debe tener al menos 6 dígitos'
                            },
                            maxLength: {
                                value: 4,
                                message: 'El número de documento no debe tener más de 10 dígitos'
                            },
                            pattern: {
                                value: /^[0-9]*$/,
                                message: 'El número de documento solo debe contener números'
                            }
                        })}
                    />
                    {errors.proPerAnoIni ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerAnoIni.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label htmlFor="proPerMesIni" className="">
                        Mes:
                    </label>
                    <select 
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerMesIni || isSubmitted ? (errors.proPerMesIni ? 'invalid' : 'valid') : ''}`} 
                        {...register('proPerMesIni', { 
                            validate: value => value !== '0' || 'El mes es requerido' 
                        })}
                        id="proPerMesIni" 
                    >
                        <option value="0">--Seleccione Mes--</option>
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                    {errors.proPerMesIni ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerMesIni.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label htmlFor="proPerAnoFin" className="">
                        Año:
                    </label>
                    <input
                        id="proPerAnoFin"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerAnoFin || isSubmitted ? (errors.proPerAnoFin ? 'invalid' : 'valid') : ''}`} 
                        type="text" 
                        placeholder="2023"
                        autoComplete="disabled"
                        maxLength={4}
                        onKeyDown={(event) => {
                            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                event.preventDefault();
                            }
                        }}
                        {...register('proPerAnoFin', { 
                            required: 'El número de documento es requerido',
                            minLength: {
                                value: 4,
                                message: 'El número de documento debe tener al menos 6 dígitos'
                            },
                            maxLength: {
                                value: 4,
                                message: 'El número de documento no debe tener más de 10 dígitos'
                            },
                            pattern: {
                                value: /^[0-9]*$/,
                                message: 'El número de documento solo debe contener números'
                            }
                        })}
                    />
                    {errors.proPerAnoFin ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerAnoFin.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
                    <label htmlFor="proPerMesFin" className="">
                        Mes:
                    </label>
                    <select 
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerMesFin || isSubmitted ? (errors.proPerMesFin ? 'invalid' : 'valid') : ''}`} 
                        {...register('proPerMesFin', { 
                            validate: value => value !== '0' || 'El mes es requerido' 
                        })}
                        id="proPerMesFin" 
                    >
                        <option value="0">--Seleccione Mes--</option>
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                    {errors.proPerMesFin ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerMesFin.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                        Espacio reservado para el mensaje de error
                        </p>
                    )}
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

            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/projects')} className="PowerMas_Buttom_Secondary Large_3 m_75">Atras</button>
                <button onClick={Guardar_Proyecto} className="PowerMas_Buttom_Primary Large_3 m_75">Siguiente</button>
            </div>

        </div>
    )
}

export default FormProject