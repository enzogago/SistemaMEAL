import { FaEdit, FaPlus, FaRegTrashAlt, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import { handleSubmit } from "./eventHandlers";
import { GrFormPreviousLink } from "react-icons/gr";
import { fetchData } from "../reusable/helper";

const FormProject = () => {
    const navigate = useNavigate();

    const { id: safeCiphertext } = useParams();
    let id = '';
    if (safeCiphertext) {
        const ciphertext = atob(safeCiphertext);
        // Desencripta el ID
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        id = bytes.toString(CryptoJS.enc.Utf8);
    }

    const isEditing = id && id.length === 10;


    // Estados del AuthContext
    const { authInfo } = useContext(AuthContext);
    const { userLogged  } = authInfo;
    // Estados locales
    const [ implementadores, setImplementadores ] = useState([])
    const [ proyecto, setProyecto ] = useState(null)
    const [ subProyectos, setSubproyectos ] = useState([])
    const [selectCount, setSelectCount] = useState(1);
    const [ paises, setPaises ] = useState([]);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)


    const handleCountryChange = async (ubicacion, index) => {
        const selectedCountry = JSON.parse(ubicacion);
        if (ubicacion === '0') {
            setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
            return;
        }

        try {
            setCargando(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/${selectedCountry.ubiAno}/${selectedCountry.ubiCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if(response.status == 401 || response.status == 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                }
                return;
            }
            const data = await response.json();
            if (data.success == false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            if (data.length > 0) {
                setSelects(prevSelects => prevSelects.slice(0, index + 1).concat([data]));  // Reinicia los selects por debajo del nivel actual
            } else {
                setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
            }
        } catch (error) {
            console.error('Error:', error);
        } finally{
            setCargando(false);
        }
    };

    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue 
    } = useForm({ mode: "onChange"});

    const pais = watch('pais');
    useEffect(() => {
        if (pais) {
            if (pais == '0') {
                setSelects([]);
                return;
            }
            handleCountryChange(pais);
        }
    }, [pais]);
    
    useEffect(() => {
        const fetchOptions = async () => {
            await Promise.all([
                fetchData('Implementador',setImplementadores),
                fetchData('Ubicacion', setPaises),
            ]);
        };
    
        fetchOptions().then(() => {
            if (isEditing) {
                const proAno = id.slice(0, 4);
                const proCod = id.slice(4,10);
                // Ejecuta la función para traer los datos del registro a modificar
                if(isEditing){
                    const fetchProyecto = async () => {
                        try {
                            const token = localStorage.getItem('token');
                            Notiflix.Loading.pulse('Cargando...');
                            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/${proAno}/${proCod}`, {
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
                            setProyecto(data);
                            console.log(data);

                            let newData = {};
                            for (let key in data) {
                                if (typeof data[key] === 'string') {
                                    // Convierte cada cadena a minúsculas
                                    newData[key] = data[key].toLowerCase();
                                } else {
                                    // Mantiene los valores no string tal como están
                                    newData[key] = data[key];
                                }
                            }
                            reset(newData);
                        } catch (error) {
                            console.error('Error:', error);
                        } finally {
                            Notiflix.Loading.remove();
                        }
                    }
                    const fetchSubproyectos = async () => {
                        try {
                            const token = localStorage.getItem('token');
                            Notiflix.Loading.pulse('Cargando...');
                            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/SubProyecto/proyecto/${proAno}/${proCod}`, {
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
                            setSubproyectos(data);
                        } catch (error) {
                            console.error('Error:', error);
                        } finally {
                            Notiflix.Loading.remove();
                        }
                    }
                    fetchProyecto();
                    fetchSubproyectos();
                };
            }
        });
    }, [isEditing]);


    const Guardar_Proyecto = () => {
        validateForm((data) => {
            // Crear un array para almacenar los valores de los selects
            const selectValues = [];

            // Iterar sobre los campos del formulario
            for (let key in data) {
                // Si el campo es uno de los selects
                if (key.startsWith('impCod')) {
                    // Añadir el valor al array
                    selectValues.push(data[key]);
                }
            }

            // Ahora selectValues contiene los valores de todos tus selects
            console.log(selectValues);

            console.log(data)
            handleSubmit(data, isEditing);
        })();
    }

    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/projects')} />
                <h1 className="f1_75"> {isEditing ? 'Editar' : 'Nueva'} Proyecto</h1>
            </div>

            <div className="overflow-auto flex-grow-1 flex">
                <div className="PowerMas_Content_Form_Beneficiarie_Card Large_6 overflow-auto m1 p1">
                    <div className="m_75">
                        <label htmlFor="proNom" className="">
                            Nombre
                        </label>
                        <input type="text"
                            id="proNom"
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proNom || isSubmitted ? (errors.proNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Enzo Fabricio"
                            autoComplete="disabled"
                            {...register('proNom', { 
                                required: 'El campo es requerido',
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.proNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proNom.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="proDes" className="">
                            Descripción
                        </label>
                        <textarea
                            id="proDes"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proDes || isSubmitted ? (errors.proDes ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Enzo Fabricio"
                            autoComplete="disabled"
                            style={{textTransform: 'capitalize'}}
                            {...register('proDes', { 
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.proDes ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proDes.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="proRes" className="">
                            Responsable
                        </label>
                        <input type="text"
                            id="proRes"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proRes || isSubmitted ? (errors.proRes ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Enzo Fabricio"
                            autoComplete="disabled"
                            style={{textTransform: 'capitalize'}}
                            {...register('proRes', { 
                                required: 'El campo es requerido',
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.proRes ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proRes.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="flex">
                        <div className="Large_6 m_75">
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
                                    required: 'El campo es requerido',
                                    minLength: {
                                        value: 4,
                                        message: 'El campo debe tener al menos 6 dígitos'
                                    },
                                    maxLength: {
                                        value: 4,
                                        message: 'El campo no debe tener más de 10 dígitos'
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'El campo solo debe contener números'
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
                        </div>
                        <div className="Large_6 m_75">
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
                        </div>
                    </div>
                    <div className="flex">
                        <div className="Large_6 m_75">
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
                                    required: 'El campo es requerido',
                                    minLength: {
                                        value: 4,
                                        message: 'El campo debe tener al menos 6 dígitos'
                                    },
                                    maxLength: {
                                        value: 4,
                                        message: 'El campo no debe tener más de 10 dígitos'
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'El campo solo debe contener números'
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
                        </div>
                        <div className="Large_6 m_75">
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
                    </div>
                </div>
                <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto flex flex-column gap-1">
                    <div className="flex flex-column gap_5 p1_75" style={{backgroundColor: '#fff', border: '1px solid #372e2c3d'}}>
                        <div className="flex ai-center jc-space-between">
                            <h3 className="f1_25">Implementadores</h3>
                            <FaPlus className='w-auto f1 pointer' onClick={() => setSelectCount(count => count + 1)} /> 
                        </div>
                        {Array.from({ length: selectCount }, (_, index) => (
                            <select 
                                key={index}
                                id={`impCod${index}`} 
                                style={{textTransform: 'capitalize'}}
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields[`impCod${index}`] || isSubmitted ? (errors[`impCod${index}`] ? 'invalid' : 'valid') : ''}`} 
                                {...register(`impCod${index}`, { 
                                    validate: value => value !== '0' || 'El campo es requerido' 
                                })}
                            >
                                <option value="0">--Seleccione Implementador--</option>
                                {implementadores.map(item => (
                                    <option 
                                        key={item.impCod} 
                                        value={item.impCod}
                                        style={{textTransform: 'capitalize'}}
                                    > 
                                        {item.impNom.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        ))}
                    </div>
                    <div className="p1" style={{backgroundColor: '#fff', border: '1px solid #372e2c3d'}}>
                        <h2 className="f1_25 m_75">Datos de Ubicación</h2>
                        <div className="m_75">
                            <label htmlFor="pais" className="">
                                Pais:
                            </label>
                            <select 
                                id="pais"
                                style={{textTransform: 'capitalize'}}
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.pais || isSubmitted ? (errors.pais ? 'invalid' : 'valid') : ''}`} 
                                {...register('pais', { 
                                    validate: {
                                        required: value => value !== '0' || 'El campo es requerido',
                                    }
                                })}
                            >
                                <option value="0">--Seleccione País--</option>
                                {paises.map(pais => (
                                    <option 
                                        key={pais.ubiCod} 
                                        value={JSON.stringify({ ubiCod: pais.ubiCod, ubiAno: pais.ubiAno })}
                                    > 
                                        {pais.ubiNom.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.pais ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.pais.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        
                        {selects.map((options, index) => (
                            <div className="m_75" key={index}>
                                <label style={{textTransform: 'capitalize'}} htmlFor={index} className="">
                                    {options[0].ubiTip.toLowerCase()}
                                </label>
                                <select
                                    id={index}
                                    key={index} 
                                    name={`select${index}`} 
                                    onChange={(event) => handleCountryChange(event.target.value, index)} 
                                    style={{textTransform: 'capitalize'}}
                                    className="block Phone_12"
                                >
                                    <option style={{textTransform: 'capitalize'}} value="0">--Seleccione {options[0].ubiTip.toLowerCase()}--</option>
                                    {options.map(option => (
                                        <option key={option.ubiCod} value={JSON.stringify({ ubiCod: option.ubiCod, ubiAno: option.ubiAno })}>
                                            {option.ubiNom.toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        {
                            cargando &&
                            <div id="loading" className="m_75">Cargando...</div>
                        }
                    </div>
                </div>
            </div>

            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/projects')} className="PowerMas_Buttom_Secondary Large_3 m_75">Atras</button>
                <button onClick={Guardar_Proyecto} className="PowerMas_Buttom_Primary Large_3 m_75">Grabar</button>
            </div>

        </>
    )
}

export default FormProject