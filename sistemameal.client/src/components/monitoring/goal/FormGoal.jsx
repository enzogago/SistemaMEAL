import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import { AuthContext } from "../../../context/AuthContext";
import { GrFormPreviousLink } from "react-icons/gr";
import { useForm } from 'react-hook-form';
import AutocompleteInput from "../../reusable/AutoCompleteInput";

const FormGoal = () => {
    const navigate = useNavigate();
    const { id: encodedCiphertext } = useParams();
    // Decodifica la cadena cifrada
    const ciphertext = decodeURIComponent(encodedCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const metAno = id.slice(0, 4);
    const metCod = id.slice(4);

    // Estados del AuthContext
    const { authInfo } = useContext(AuthContext);
    const { userLogged  } = authInfo;
    // Estados locales
    const [ isEditing, setIsEditing ] = useState(false);
    const [ paises, setPaises ] = useState([]);
    const [ financiadores, setFinanciadores ] = useState([]);
    const [ implementadores, setImplementadores ] = useState([]);
    const [ proyectos, setProyectos ] = useState([]);
    const [ indicadores, setIndicadores ] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSecondInputEnabled, setIsSecondInputEnabled] = useState(false);

    useEffect(() => {
        if (!selectedOption || indicadores.length === 0) {
            setIsSecondInputEnabled(false);
            setValue('indActResNom', '');
        }
    }, [selectedOption, indicadores]);

    const { register, watch, handleSubmit, formState: { errors, dirtyFields, isSubmitted }, reset, setValue } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion`, {
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
                console.log(data)
                setPaises(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchFinanciadores = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Financiador`, {
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
                console.log(data)
                setFinanciadores(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchImplementadores = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Implementador`, {
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
                console.log(data)
                setImplementadores(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchProyectos = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto`, {
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
                console.log(data)
                setProyectos(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        fetchProyectos();
        fetchFinanciadores();
        fetchImplementadores();
        fetchPaises();
    }, []);

    const fetchIndicadorActividad = async (proAno, proCod) => {
        const token = localStorage.getItem('token');
        Notiflix.Loading.pulse('Cargando...');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/autocomplete/${proAno}/${proCod}`, {
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
            if (data.length === 0) {
                setIsSecondInputEnabled(false);
            } else {
                setIndicadores(data);
                setIsSecondInputEnabled(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const onSubmit = (data) => {
        console.log(data);
      }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="PowerMas_StatusContainer bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_25">
                <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className=""> {isEditing ? 'Editar' : 'Nueva'} Meta</h1>
            </div>
            <div className="overflow-auto flex-grow-1 flex">
                <div className="PowerMas_Form_Goal Large_6 m1 overflow-auto">
                    <div className="m_75">
                        <label htmlFor="ubicacion" className="">
                            Pais:
                        </label>
                        <select 
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.ubicacion || isSubmitted ? (errors.ubicacion ? 'invalid' : 'valid') : ''}`} 
                            {...register('ubicacion', { 
                                validate: value => value !== '0' || 'El pais es requerido' 
                            })}
                            id="ubicacion" 
                        >
                            <option value="0">--Seleccione País--</option>
                            {paises.map(pais => (
                                <option 
                                    key={pais.ubiCod} 
                                    value={JSON.stringify({ ubiCod: pais.ubiCod, ubiAno: pais.ubiAno })}
                                > 
                                    {pais.ubiNom}
                                </option>
                            ))}
                        </select>
                        {errors.ubicacion ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.ubicacion.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75 flex gap_5">
                        <div className="Large_6">
                            <label htmlFor="metAnoPlaTec" className="">
                                Año:
                            </label>
                            <input
                                id="metAnoPlaTec"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metAnoPlaTec || isSubmitted ? (errors.metAnoPlaTec ? 'invalid' : 'valid') : ''}`} 
                                type="text" 
                                placeholder="2023"
                                autoComplete="disabled"
                                maxLength={4}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('metAnoPlaTec', { 
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
                            {errors.metAnoPlaTec ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metAnoPlaTec.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6">
                            <label htmlFor="metMesPlaTec" className="">
                                Mes:
                            </label>
                            <select 
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metMesPlaTec || isSubmitted ? (errors.metMesPlaTec ? 'invalid' : 'valid') : ''}`} 
                                {...register('metMesPlaTec', { 
                                    validate: value => value !== '0' || 'El mes es requerido' 
                                })}
                                id="metMesPlaTec" 
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
                            {errors.metMesPlaTec ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metMesPlaTec.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="m_75">
                        <label htmlFor="" className="">
                            Meta:
                        </label>
                        <input
                            id="metMetTec"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metMetTec || isSubmitted ? (errors.metMetTec ? 'invalid' : 'valid') : ''}`} 
                            type="text" 
                            placeholder="2023"
                            autoComplete="disabled"
                            maxLength={10}
                            onKeyDown={(event) => {
                                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                    event.preventDefault();
                                }
                            }}
                            {...register('metMetTec', { 
                                required: 'El número de documento es requerido',
                                minLength: {
                                    value: 6,
                                    message: 'El número de documento debe tener al menos 6 dígitos'
                                },
                                maxLength: {
                                    value: 10,
                                    message: 'El número de documento no debe tener más de 10 dígitos'
                                },
                                pattern: {
                                    value: /^[0-9]*$/,
                                    message: 'El número de documento solo debe contener números'
                                }
                            })}
                        />
                        {errors.metMetTec ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metMetTec.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="impCod" className="">
                            Implementador:
                        </label>
                        <select 
                            id="impCod" 
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.impCod || isSubmitted ? (errors.impCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('impCod', { 
                                validate: value => value !== '0' || 'El Implementador es requerido' 
                            })}
                        >
                            <option value="0">--Seleccione Implementador--</option>
                            {implementadores.map(item => (
                                <option 
                                    key={item.impCod} 
                                    value={item.impCod}
                                > 
                                    {item.impNom}
                                </option>
                            ))}
                        </select>
                        {errors.impCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.impCod.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="finCod" className="">
                            Financiador:
                        </label>
                        <select 
                            id="finCod" 
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.finCod || isSubmitted ? (errors.impCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('finCod', { 
                                validate: value => value !== '0' || 'El dcoumento de identidad es requerido' 
                            })}
                        >
                            <option value="0">--Seleccione Financiador--</option>
                            {financiadores.map(item => (
                                <option 
                                    key={item.finCod} 
                                    value={item.finCod}
                                > 
                                    {item.finNom}
                                </option>
                            ))}
                        </select>
                        {errors.finCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.finCod.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                </div>

                <div className="PowerMas_Info_Goal Large_6 m1 p1 overflow-auto">
                    <h3>Datos del Proyecto</h3>
                    <AutocompleteInput 
                        options={proyectos} 
                        register={register} 
                        watch={watch}
                        setValue={setValue}
                        setSelectedOption={setSelectedOption}
                        dirtyFields={dirtyFields}
                        isSubmitted={isSubmitted} 
                        optionToString={(option) => option.proNom}
                        handleOption={(option) => {
                            console.log(option);
                            console.log(option.proAno,option.proCod);
                            setIsSecondInputEnabled(true);
                            fetchIndicadorActividad(option.proAno,option.proCod);
                        }}
                        name='proNom'
                        errors={errors}
                        titulo='Proyecto'
                    />
                    <AutocompleteInput 
                        options={indicadores} 
                        register={register} 
                        watch={watch}
                        setValue={setValue}
                        setSelectedOption={setSelectedOption}
                        dirtyFields={dirtyFields}
                        isSubmitted={isSubmitted} 
                        optionToString={(option) => option.indActResNom}
                        handleOption={(option) => {
                            console.log(option);
                        }}
                        name='indActResNom'
                        errors={errors}
                        disabled={!isSecondInputEnabled}
                        titulo='Indicador'
                    />
                    <hr className="PowerMas_Hr" />
                </div>
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button type="submit" className="Large_5 m2">Guardar</button>
                <button type="button" className="Large_5 m2">Eliminar Todo</button>
            </div>
        </form>
    )
}

export default FormGoal