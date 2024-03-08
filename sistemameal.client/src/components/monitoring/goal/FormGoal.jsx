import { FaLessThanEqual, FaPlus, FaTrash } from "react-icons/fa";
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
    const [ estados, setEstados ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(null);
    const [ isSecondInputEnabled, setIsSecondInputEnabled ] = useState(false);
    const [ jerarquia, setJerarquia ] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)

    const { register, watch, handleSubmit, formState: { errors, dirtyFields, isSubmitted }, reset, setValue, trigger } = 
    useForm({ mode: "onChange"});

    const pais = watch('pais');

    useEffect(() => {
        if (pais) {
            if (pais === '0') {
                setSelects([]);
                return;
            }

            handleCountryChange(pais);
        }
    }, [pais]);
    
    useEffect(() => {
        if (!selectedOption || indicadores.length === 0) {
            setIsSecondInputEnabled(false);
            setValue('indActResNom', '');
        } 
    }, [selectedOption, indicadores]);


    useEffect(() => {
        // Verifica si el valor actual de 'proNom' coincide con alguna de las opciones
        const matchingOption = proyectos.find(option => option.proNom === watch('proNom'));

        if (!matchingOption) {
            // Si no hay ninguna opción que coincida, limpia ambos campos
            setValue('indActResNom', '');
            setIsSecondInputEnabled(false);
        } 
    }, [watch('proNom')]);

    useEffect(() => {
        // Si el valor de 'indActResNom' está vacío, entonces limpia los datos
        if (!watch('indActResNom')) {
            setJerarquia(null);
        }
    }, [watch('indActResNom')]);


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
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
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

    const handleCountryChange = async (ubicacion, index) => {
        const selectedCountry = JSON.parse(ubicacion);
        console.log(selectedCountry.ubiAno, selectedCountry.ubiCod);
        if (ubicacion === '0') {
            console.log("entramos")
            setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
            console.log(selects)
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
                console.log("aver if")
            } else {
                setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
                console.log("aver else")
            }
        } catch (error) {
            console.error('Error:', error);
        } finally{
            setCargando(false);
        }
    };

    const onSubmit = (data) => {
        // Definimos variables de ubicacion
        let ubiAno, ubiCod;

        // Si los selects dinamicos son mayor a 1
        if (selects.length > 1) {
            // Obtiene el ubiAno y ubiCod del último select
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;
            if (lastSelect === '0') {
                // Si el último select tiene un valor de '0', obtén el ubiAno y ubiCod del penúltimo select
                const penultimateSelectElement = document.querySelector(`select[name=select${selects.length - 2}]`);
                const penultimateSelect = JSON.parse(penultimateSelectElement.value);
                ubiAno = penultimateSelect.ubiAno;
                ubiCod = penultimateSelect.ubiCod;
            } else {
                // Si el último select tiene un valor distinto de '0', usa ese
                const ultimo = JSON.parse(lastSelect);
                ubiAno = ultimo.ubiAno;
                ubiCod = ultimo.ubiCod;
            }
        } else {
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;

            // Si luego del siguiente nivel de Pais no se selecciona nada
            if(lastSelect === '0'){
                // Se toman los valores pasados del select pais
                const { ubiAno: paisUbiAno, ubiCod: paisUbiCod } = JSON.parse(data.pais);
                ubiAno = paisUbiAno;
                ubiCod = paisUbiCod;
            } else{
                // Caso contrario se toma el unico valor que tiene ese select ya que no tiene más niveles por debajo
                const ultimo = JSON.parse(lastSelect);
                ubiAno = ultimo.ubiAno;
                ubiCod = ultimo.ubiCod;
            }
        }

        
        console.log(ubiAno)
        console.log(ubiCod)

        
        
        const metMetTec = parseInt(data.metMetTec, 10)
        
        let MetaIndicadorActividad = {
            Meta: { 
                metMetTec: metMetTec,
                metEjeTec: 0,
                metPorAvaTec: 0,
                metMesPlaTec: data.metMesPlaTec,
                metAnoPlaTec: data.metAnoPlaTec,
                finCod: data.finCod,
                impCod: data.impCod,
                ubiAno,
                ubiCod,
             },
             MetaIndicadorActividadResultado: {
                metIndActResAno: data.indActResAno,
                metIndActResCod: data.indActResCod,
                metIndActResTipInd: data.tipInd,
            },
        }
        handleSubmitMetaIndicadorActividad(MetaIndicadorActividad);
      }

      const handleSubmitMetaIndicadorActividad= async (data) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/MetaIndicador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                if(response.status === 409){
                    Notiflix.Notify.warning(`${errorData.message}`);
                    console.log(errorData.message)
                    return;
                } else {
                    Notiflix.Notify.failure(errorData.message);
                    console.log(errorData.message)
                    return;
                }
            }

            const successData = await response.json();
            Notiflix.Notify.success(successData.message);
            console.log(successData);
            fetchBeneficiarie();
            reset({
                benApe: '',
                benApeApo: '',
                benCorEle: '',
                benFecNac: '',
                benNom: '',
                benNomApo: '',
                benSex: '',
                benTel: '',
                benTelCon: '',
                genCod: '0',
                pais: '0',
            });
            reset2({
                benNumDoc: '',
                docIdeCod: '0',
            });
            setSelects([]);
            setDocumentosAgregados([])
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="PowerMas_StatusContainer bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="f1_75"> {isEditing ? 'Editar' : 'Nueva'} Meta</h1>
            </div>
            <div className="overflow-auto flex-grow-1 flex">
                <div className="PowerMas_Form_Goal Large_6 m1 overflow-auto">
                    <div className="m_75">
                        <label htmlFor="pais" className="">
                            Pais:
                        </label>
                        <select 
                            id="pais"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.pais || isSubmitted ? (errors.pais ? 'invalid' : 'valid') : ''}`} 
                            {...register('pais', { 
                                validate: value => value !== '0' || 'El dcoumento de identidad es requerido' 
                            })}
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
                            <label htmlFor={index} className="">
                                {options[0].ubiTip}
                            </label>
                            <select
                                id={index}
                                key={index} 
                                name={`select${index}`} 
                                onChange={(event) => handleCountryChange(event.target.value, index)} 
                                className="block Phone_12"
                            >
                                <option style={{textTransform: 'capitalize'}} value="0">--Seleccione {options[0].ubiTip.toLowerCase()}--</option>
                                {options.map(option => (
                                    <option key={option.ubiCod} value={JSON.stringify({ ubiCod: option.ubiCod, ubiAno: option.ubiAno })}>
                                        {option.ubiNom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                    {
                        cargando &&
                        <div id="loading" className="m_75">Cargando...</div>
                    }
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
                        <label htmlFor="metMetTec" className="">
                            Meta:
                        </label>
                        <input
                            id="metMetTec"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metMetTec || isSubmitted ? (errors.metMetTec ? 'invalid' : 'valid') : ''}`} 
                            type="text" 
                            placeholder="500"
                            autoComplete="disabled"
                            maxLength={10}
                            onKeyDown={(event) => {
                                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                    event.preventDefault();
                                }
                            }}
                            {...register('metMetTec', {
                                required: 'La meta es requerida',
                                maxLength: {
                                    value: 10,
                                    message: 'La meta no debe tener más de 10 dígitos'
                                },
                                pattern: {
                                    value: /^[0-9]*$/,
                                    message: 'El número de documento solo debe contener números'
                                },
                                validate: value => parseInt(value, 10) > 0 || 'El valor debe ser mayor a 0'
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
                            setIsSecondInputEnabled(true);
                            fetchIndicadorActividad(option.proAno,option.proCod);
                        }}
                        name='proNom'
                        errors={errors}
                        titulo='Proyecto'
                        trigger={trigger}
                    />
                    <AutocompleteInput 
                        options={indicadores} 
                        register={register} 
                        watch={watch}
                        setValue={setValue}
                        setSelectedOption={setSelectedOption}
                        dirtyFields={dirtyFields}
                        isSubmitted={isSubmitted} 
                        optionToString={(option) => option.indActResNum + ' - ' + option.indActResNom}
                        handleOption={async(option) => {
                            console.log(option);
                            setValue('indActResCod',option.indActResCod)
                            setValue('indActResAno',option.indActResAno)
                            setValue('tipInd',option.tipInd)

                            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/jerarquia/${option.indActResAno}/${option.indActResCod}/${option.tipInd}`);
                            const data = await response.json();
                            console.log(data);
                            setJerarquia(data);
                        }}
                        name='indActResNom'
                        errors={errors}
                        disabled={!isSecondInputEnabled}
                        titulo='Indicador'
                        trigger={trigger}
                    />
                    <hr className="PowerMas_Hr" />
                    {jerarquia && (
                        <div>
                            <article>
                                <h3 className="Large-f1_25 m_5" style={{textTransform: 'capitalize'}}>{jerarquia.tipInd.toLowerCase()}</h3>
                                <p className="m_5">{jerarquia.indActResNum + ' - ' + jerarquia.indActResNom.charAt(0).toUpperCase() + jerarquia.indActResNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5"> Resultado </h3>
                                <p className="m_5">{jerarquia.resNum + ' - ' + jerarquia.resNom.charAt(0).toUpperCase() + jerarquia.indActResNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Objetivo Específico</h3>
                                <p className="m_5">{jerarquia.objEspNum + ' - ' + jerarquia.objEspNom.charAt(0).toUpperCase() + jerarquia.objEspNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Objetivo</h3>
                                <p className="m_5">{jerarquia.objNum + ' - ' + jerarquia.objNom.charAt(0).toUpperCase() + jerarquia.objNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5"> Subproyecto </h3>
                                <p className="m_5">{jerarquia.subProNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Proyecto</h3>
                                <p className="m_5">{jerarquia.proNom}</p>
                            </article>
                        </div>
                    )}
                </div>
                
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar</button>
                <button className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
            </footer>
        </form>
    )
}

export default FormGoal