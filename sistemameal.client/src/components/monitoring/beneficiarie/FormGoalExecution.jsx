import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import { fetchData } from "../../reusable/helper";
import { handleSubmitMetaEjecucion } from "./eventHandlers";
import InfoGoal from "./InfoGoal";
import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';
import ModalGoalExecuting from "./ModalGoalExecuting";

const FormGoalExecution = () => {
    const navigate = useNavigate();
    const { id: safeCiphertext } = useParams();
    // Reemplaza los caracteres a su representación original en base64 y decodifica la cadena
    const ciphertext = atob(safeCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const metAno = id.slice(0, 4);
    const metCod = id.slice(4);

    // Estados locales
    const [ paises, setPaises ] = useState([]);
    const [ metaData, setMetaData] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)
    
    const [ verificarPais, setVerificarPais ] = useState(null);
    
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [selectedValues, setSelectedValues] = useState([]);
    const [firstEdit, setFirstEdit] = useState(false);
    
    const [ openModalGoalExecuting, setOpenModalGoalExecuting] = useState(false);

    // Cargamos la Informacion a tratar en este Formulario
    const fetchBeneficiarie = async () => {
        try {
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/${metAno}/${metCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            setMetaData(data);
            console.log(data)
            setValue('metEjeMesEjeTec', data.metMesPlaTec)
            setValue('metEjeAnoEjeTec', data.metAnoPlaTec)
            // setValue('pais', JSON.stringify({ ubiCod: data.ubiCod, ubiAno: data.ubiAno }))
            fetchSelects(data.ubiAno, data.ubiCod);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }
    
    useEffect(() => {
        if (id.length === 10 && isDataLoaded) {
            fetchBeneficiarie();
        }
    }, [id, isDataLoaded]);
    useEffect(() => {
        Promise.all([
            fetchData('Ubicacion', setPaises),
        ]).then(() => setIsDataLoaded(true));
    }, []);

    // Propiedades Form Principal
    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger,
        setFocus
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
    
    
    const handleCountryChange = async (ubicacion, index) => {
        const selectedCountry = JSON.parse(ubicacion);
        if (ubicacion == '0') {
            setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual

            // Aquí actualizamos selectedValues para los selectores de nivel inferior
            setSelectedValues(prevSelectedValues => {
                const newSelectedValues = [...prevSelectedValues];
                for (let i = index; i < newSelectedValues.length; i++) {
                    newSelectedValues[i] = '0';
                }
                return newSelectedValues;
            });
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

    const fetchSelects = async (ubiAno,ubiCod) => {
        try {
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/select/${ubiAno}/${ubiCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            console.log(data)
            if (data.length > 1) {
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                const newSelectedValues = data.slice(1).map(location => JSON.stringify({ubiCod:location.ubiCod,ubiAno:location.ubiAno}));
                setSelectedValues(newSelectedValues);
                console.log(newSelectedValues)
                for (const [index, location] of data.slice(1).entries()) {
                    await handleCountryChange(JSON.stringify({ubiCod: location.ubiCod,ubiAno: location.ubiAno}), index);
                    setFirstEdit(true);  // Indica que estás estableciendo el valor del select de país
                }
            } else {
                setFirstEdit(true);
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
            }
            setVerificarPais({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const Registrar_Beneficiario =  () => {
        validateForm( (data) => {
            // Obtiene el ubiAno y ubiCod del último select
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = JSON.parse(lastSelectElement.value);
            const ubiAno = lastSelect.ubiAno;
            const ubiCod = lastSelect.ubiCod;
            // Verifica que todos los selects tengan una opción válida seleccionada
            for (let i = 0; i < selects.length; i++) {
                const selectElement = document.querySelector(`select[name=select${i}]`);
                if (selectElement && selectElement.value === '0') {
                    console.error(`El select ${i} no tiene una opción válida seleccionada.`);
                    selectElement.classList.remove('PowerMas_Modal_Form_valid');
                    selectElement.classList.add('PowerMas_Modal_Form_invalid');
                    selectElement.focus();
                    return;
                } else {
                    selectElement.classList.remove('PowerMas_Modal_Form_invalid');
                    selectElement.classList.add('PowerMas_Modal_Form_valid');
                }
            }
            const { metEjeVal, metEjeMesEjeTec, metEjeAnoEjeTec } = data;

            const MetaEjecucion = {
                metAno,
                metCod,
                ubiAno,
                ubiCod,
                metEjeMesEjeTec,
                metEjeAnoEjeTec,
                metEjeVal
            }

            console.log(MetaEjecucion);
            handleSubmitMetaEjecucion(MetaEjecucion, handleReset, fetchBeneficiarie);
        })();
    };

    const handleReset = () => {
        // reset({
        //     benApe: '',
        //     benApeApo: '',
        //     benCorEle: '',
        //     benFecNac: '',
        //     benNom: '',
        //     benNomApo: '',
        //     benSex: '',
        //     benAut: '',
        //     benDir: '',
        //     genCod: '0',
        //     nacCod: '0',
        //     benTel: '0',
        //     pais: '0',
        //     benTelCon: '0',
        // });
        // setDocumentosAgregados([]);
        // setFieldsDisabled(true);
        // setMostrarAgregarDocumento(false);
        // setAccionActual('buscar');
        // setValue('metEjeMesEjeTec', metaData.metMesPlaTec)
        // setValue('metEjeAnoEjeTec', metaData.metAnoPlaTec)
        // setValue('pais', JSON.stringify(verificarPais));

        // // Resetear campos del telefono
        // setPhoneNumber('');
        // phoneInputRef.current.value = '';
        // setIsTouched(false);
        // setPhoneContactNumber('');
        // phoneContactInputRef.current.value = '';
        // setContactIsTouched(false);
    };

    // Observar Cambios de campos registrados
    const metEjeAnoEjeTec = watch('metEjeAnoEjeTec');

    const openModalExecuting = () => {
        setOpenModalGoalExecuting(true);
    };
    const closeModalExecuting = () => {
        setOpenModalGoalExecuting(false);
    };

    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="f1_75">Nuevo Ejecucion</h1>
            </div>
            
            <div className="PowerMas_Content_Form_Beneficiarie overflow-auto flex-grow-1 flex">
                    <div className="Large_6 m1 overflow-auto flex flex-column gap-1">
                        <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                            <h2 className="f1_25">Datos de Ubicación</h2>
                            <div className="m_75">
                                <label htmlFor="pais" className="">
                                    Pais:
                                </label>
                                <select 
                                    id="pais"
                                    style={{textTransform: 'capitalize'}}
                                    disabled={true}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.pais || isSubmitted ? (errors.pais ? 'invalid' : 'valid') : ''}`} 
                                    {...register('pais', { 
                                        validate: {
                                            required: value => value !== '0' || 'El campo es requerido',
                                            equal: value => metaData && JSON.stringify(verificarPais) === value || 'El país debe ser el planificado'
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
                                        value={selectedValues[index]}
                                        name={`select${index}`} 
                                        onChange={(event) => {
                                            handleCountryChange(event.target.value, index);
                                            // Aquí actualizamos el valor seleccionado en el estado
                                            setSelectedValues(prevSelectedValues => {
                                                const newSelectedValues = [...prevSelectedValues];
                                                newSelectedValues[index] = event.target.value;
                                                return newSelectedValues;
                                            });
                                        }} 
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
                            <div className="flex">
                                <div className="m_75 Large_6">
                                    <label htmlFor="metEjeAnoEjeTec" className="">
                                        Año de Ejecución
                                    </label>
                                    <input 
                                        type="text" 
                                        id="metEjeAnoEjeTec"
                                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metEjeAnoEjeTec || isSubmitted ? (errors.metEjeAnoEjeTec ? 'invalid' : 'valid') : ''}`} 
                                        placeholder="2024"
                                        autoComplete='off'
                                        maxLength={4}
                                        onInput={(event) => {
                                            // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        {...register('metEjeAnoEjeTec', { 
                                            required: 'El campo es requerido',
                                            minLength: { value: 4, message: 'El campo debe tener minimo 4 digitos' },
                                            maxLength: { value: 4, message: 'El campo debe tener minimo 4 digitos' },
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: 'Solo se aceptan numeros'
                                            },
                                            validate: value => parseInt(value) >= metaData.metAnoPlaTec || 'El año debe ser mayor o igual al año planificado'
                                        })} 
                                    />
                                    {errors.metEjeAnoEjeTec ? (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metEjeAnoEjeTec.message}</p>
                                    ) : (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                            Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                                </div>
                                <div className="m_75 Large_6">
                                    <label htmlFor="metEjeMesEjeTec" className="">
                                        Mes de Ejecución
                                    </label>
                                    <select 
                                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metEjeMesEjeTec || isSubmitted ? (errors.metEjeMesEjeTec ? 'invalid' : 'valid') : ''}`} 
                                        {...register('metEjeMesEjeTec', { 
                                            validate: {
                                                required: value => value !== '0' || 'El campo es requerido',
                                                greaterOrEqual: value => {
                                                    const month = value;
                                                    const year = metEjeAnoEjeTec;
                                                    return (year > metaData.metAnoPlaTec) || (year === metaData.metAnoPlaTec && month >= metaData.metMesPlaTec) || 'El mes y el año deben ser mayores o iguales al mes y al año planificados';
                                                }
                                            }
                                        })}
                                        id="metEjeMesEjeTec" 
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
                                    {errors.metEjeMesEjeTec ? (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metEjeMesEjeTec.message}</p>
                                    ) : (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                            <h2 className="f1_25">Datos de Ejecucion</h2>
                            <div className="m_75">
                                <label htmlFor="metEjeVal" className="">
                                    Cantidad de {metaData && metaData.uniNom.toLowerCase()}:
                                </label>
                                <input
                                    id="metEjeVal"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metEjeVal || isSubmitted ? (errors.metEjeVal ? 'invalid' : 'valid') : ''}`} 
                                    type="text" 
                                    placeholder="Emj: 10"
                                    autoComplete='off'
                                    maxLength={10}
                                    onInput={(event) => {
                                        // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                        event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                    }}
                                    {...register('metEjeVal', { 
                                        required: 'El campo es requerido',
                                        maxLength: {
                                            value: 10,
                                            message: 'El campo no debe tener más de 10 dígitos'
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'El campo solo debe contener números'
                                        }
                                    })}
                                />
                                {errors.metEjeVal ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metEjeVal.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <InfoGoal 
                        metaData={metaData}
                        openModal={openModalExecuting}
                    />
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button className="PowerMas_Buttom_Primary Large_3 m_75" onClick={Registrar_Beneficiario} >Guardar</button>
                <button className="PowerMas_Buttom_Secondary Large_3 m_75" onClick={handleReset}>Limpiar</button>
            </div>

            <ModalGoalExecuting
                openModalGoalExecuting={openModalGoalExecuting}
                closeModalExecuting={closeModalExecuting}
                metaData={metaData}
            />
        </>
    )
}

export default FormGoalExecution