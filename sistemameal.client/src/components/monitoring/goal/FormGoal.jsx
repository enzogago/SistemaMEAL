import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useEffect, useRef, useState } from "react";
import Notiflix from "notiflix";
import { GrFormPreviousLink } from "react-icons/gr";
import { useForm } from 'react-hook-form';
import AutocompleteInput from "../../reusable/AutoCompleteInput";
import { fetchRegistroAModificar } from "./helper";
import { fetchData } from "../../reusable/helper";

const FormGoal = () => {
    const navigate = useNavigate();
    const tableRef = useRef();
    // Estados locales
    const [ paises, setPaises ] = useState([]);
    const [ implementadores, setImplementadores ] = useState([]);
    const [ proyectos, setProyectos ] = useState([]);
    const [ indicadores, setIndicadores ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(null);
    const [ isSecondInputEnabled, setIsSecondInputEnabled ] = useState(false);
    const [ jerarquia, setJerarquia ] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)


    const [initialData, setInitialData] = useState(null);
    const [firstEdit, setFirstEdit] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [esActividad, setEsActividad] = useState(false);
    //
    const { id: safeCiphertext } = useParams();
    let id = '';
    if (safeCiphertext) {
        const ciphertext = atob(safeCiphertext);
        // Desencripta el ID
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        id = bytes.toString(CryptoJS.enc.Utf8);
    }

    const isEditing = id && id.length === 20;

    // Configuracion del formulario
    const { 
        register, 
        watch, 
        handleSubmit, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        const fetchOptions = async () => {
            Notiflix.Loading.pulse('Cargando...');
            await Promise.all([
                fetchData('Proyecto', setProyectos),
                fetchData('Implementador', setImplementadores),
                fetchData('Ubicacion', setPaises)
            ]);
        };
    
        fetchOptions().then(() => {
            if (isEditing) {
                const metAno = id.slice(0, 4);
                const metCod = id.slice(4,10);
                const metIndAno = id.slice(10,14);
                const metIndCod = id.slice(14,20);
                // Ejecuta la función para traer los datos del registro a modificar
                fetchRegistroAModificar(metAno, metCod, metIndAno, metIndCod, reset, fetchSelects, setValue, fetchIndicadorActividad, setIsSecondInputEnabled, setSelectedOption, setJerarquia, setInitialData);
            }
        });
    }, [isEditing]);

    // Evento onChange del select Pais
    useEffect(() => {
        const pais = watch('pais');

        if (pais) {
            if (pais === '0') {
                setSelects([]);
                setSelectedValues([]);
                return;
            }

            if (firstEdit || !isEditing) {
                handleCountryChange(pais);
            }
        }
    }, [watch('pais')]);
    
    // Manejamos el cambio del select de proyectos para desactivar el de indicadores
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

    //
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

            if (data.length > 1) {
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                const newSelectedValues = data.slice(1).map(location => JSON.stringify({ubiCod:location.ubiCod,ubiAno:location.ubiAno}));
                setSelectedValues(newSelectedValues);
                
                for (const [index, location] of data.entries()) {
                    await handleCountryChange(JSON.stringify({ubiAno: location.ubiAno,ubiCod: location.ubiCod}), index);
                    setFirstEdit(true);  // Indica que estás estableciendo el valor del select de país
                }
            } else {
                setFirstEdit(true);
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const fetchIndicadorActividad = async (proAno, proCod) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
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
                console.log(data);
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

        if (ubicacion === '0') {
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

    const onSubmit = async(data) => {
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

        let MetaIndicadorActividad = {
            Meta: {
                metAno: data.metAno,
                metCod: data.metCod,
                metMetTec: data.metMetTec,
                metMetPre: data.metMetPre,
                metMesPlaTec: data.metMesPlaTec,
                metAnoPlaTec: data.metAnoPlaTec,
                finCod: data.finCod,
                impCod: data.impCod,
                ubiAno,
                ubiCod,
            },
            MetaIndicador: {
                metAno: data.metAno,
                metCod: data.metCod,
                metIndActResAno: data.metIndActResAno,
                metIndActResCod: data.metIndActResCod,
                metIndActResTipInd: data.metIndActResTipInd,
            },
        }


        
        if (isEditing) {
            MetaIndicadorActividad.MetaIndicador.metAnoOri = initialData.metAno;
            MetaIndicadorActividad.MetaIndicador.metCodOri = initialData.metCod;
            MetaIndicadorActividad.MetaIndicador.metIndActResAnoOri = initialData.metIndActResAno;
            MetaIndicadorActividad.MetaIndicador.metIndActResCodOri = initialData.metIndActResCod;
            MetaIndicadorActividad.MetaIndicador.metIndActResTipIndOri = initialData.metIndActResTipInd;

            const hasChangedIndicator = ['metIndActResAno', 'metIndActResCod', 'metIndActResTipInd'].some(key => data[key] !== initialData[key]);
            const hasChangedGoal = ['impCod', 'finCod', 'metAnoPlaTec', 'metMesPlaTec', 'metMetPre', 'metMetTec'].some(key => data[key] !== initialData[key]) || ubiAno !== initialData.ubiAno || ubiCod !== initialData.ubiCod;

            if(hasChangedGoal && hasChangedIndicator){
                // UPDATE TM_META & TV_META_INDICADOR
                handleEditMetaIndicador(MetaIndicadorActividad)
            } else if (hasChangedGoal) {
                // UPDATE TM_META
                let MetaSubmit = {...MetaIndicadorActividad.Meta};
                console.log(MetaSubmit)
                handleEdit(MetaSubmit)
            } else if (hasChangedIndicator){
                // UPDATE TV_META_INDICADOR
                let IndicadorSubmit = {...MetaIndicadorActividad.MetaIndicador};
                handleEditIndicador(IndicadorSubmit)
            } else {
                Notiflix.Notify.warning('No se realizaron cambios');
            }
        } else {
            if (tableRef.current) {
                const rows = Array.from(tableRef.current.children);
                let mes = 1;
        
                // Itera sobre cada fila
                await rows.reduce(async (promise, row) => {
                    await promise; // Espera a que la promesa anterior se resuelva
        
                    // Selecciona los inputs en la fila actual
                    const inputs = row.querySelectorAll('input[type="number"]');
                    console.log(inputs.length)
                    if (inputs.length >= 2) {
                        const metTec = inputs[0].value;
                        const metPre = inputs[1].value;
                        // Comprueba si ambos inputs tienen un valor
                        if (metTec && metPre) {
                            console.log(`Fila: ${row.rowIndex}, Primer input: ${metTec}, Segundo input: ${inputs[1].value}`);
                            MetaIndicadorActividad.Meta.metMetTec = metTec;
                            MetaIndicadorActividad.Meta.metMetPre = metPre;
                            MetaIndicadorActividad.Meta.metPorAvaPre = '0';
                            MetaIndicadorActividad.Meta.metEjePre= '0';
                            MetaIndicadorActividad.Meta.metAnoPlaTec = '2024';
                            MetaIndicadorActividad.Meta.metMesPlaTec = mes < 10 ? `0${mes}` : `${mes}`;
                            // Haz una copia del objeto antes de imprimirlo
                            const MetaIndicadorActividadCopy = JSON.parse(JSON.stringify(MetaIndicadorActividad));
                            console.log(MetaIndicadorActividadCopy);
                            await handleSubmitMetaIndicador(MetaIndicadorActividadCopy); // Asegúrate de que esta función devuelva una promesa
                        }
                    } else {
                        const metTec = inputs[0].value;
                        // Comprueba si ambos inputs tienen un valor
                        if (metTec) {
                            console.log(`Fila: ${row.rowIndex}, Primer input: ${metTec}`);
                            MetaIndicadorActividad.Meta.metMetTec = metTec;
                            MetaIndicadorActividad.Meta.metMetPre = '';
                            MetaIndicadorActividad.Meta.metPorAvaPre = '';
                            MetaIndicadorActividad.Meta.metEjePre= '';
                            MetaIndicadorActividad.Meta.metAnoPlaTec = '2024';
                            MetaIndicadorActividad.Meta.metMesPlaTec = mes < 10 ? `0${mes}` : `${mes}`;
                            // Haz una copia del objeto antes de imprimirlo
                            const MetaIndicadorActividadCopy = JSON.parse(JSON.stringify(MetaIndicadorActividad));
                            console.log(MetaIndicadorActividadCopy);
                            await handleSubmitMetaIndicador(MetaIndicadorActividadCopy); // Asegúrate de que esta función devuelva una promesa
                        }
                    }
                    mes++;
                }, Promise.resolve()); // Inicia con una promesa resuelta
                navigate('/monitoring')
            }
        }

      }

      const handleEdit = async (data) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                Notiflix.Notify.failure(errorData.message);
                return;
            }
    
            const successData = await response.json();
            Notiflix.Notify.success(successData.message);
            console.log(successData)
            navigate('/monitoring');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
      const handleEditMetaIndicador = async (data) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-indicador`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                Notiflix.Notify.failure(errorData.message);
                return;
            }
    
            const successData = await response.json();
            Notiflix.Notify.success(successData.message);
            console.log(successData)
            navigate('/monitoring');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
      const handleEditIndicador = async (data) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/indicador`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                Notiflix.Notify.failure(errorData.message);
                return;
            }
    
            const successData = await response.json();
            Notiflix.Notify.success(successData.message);
            console.log(successData)
            navigate('/monitoring');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

      const handleSubmitMetaIndicador= async (dataForm) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-indicador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm),
            });

            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message)
                return;
            }
            setValue('metAnoPlaTec','');
            setValue('metMesPlaTec','0');
            Notiflix.Notify.success(data.message);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="f1_75"> {isEditing ? 'Editar' : 'Nueva'} Meta</h1>
            </div>
            <div className="overflow-auto flex-grow-1 flex">
            <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto">
                    <h3>Datos del Proyecto</h3>
                    <AutocompleteInput 
                        options={proyectos} 
                        register={register} 
                        watch={watch}
                        setValue={setValue}
                        setSelectedOption={setSelectedOption}
                        dirtyFields={dirtyFields}
                        isSubmitted={isSubmitted} 
                        optionToString={(option) => option.proNom.charAt(0) + option.proNom.slice(1).toLowerCase()}
                        handleOption={(option) => {
                            setIsSecondInputEnabled(true);
                            setJerarquia(null);
                            setValue('indActResNom','');
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
                        optionToString={(option) => option.indActResNum + ' - ' + option.indActResNom.charAt(0).toUpperCase() + option.indActResNom.slice(1).toLowerCase() }
                        handleOption={async(option) => {
                            setValue('metIndActResCod',option.indActResCod)
                            setValue('metIndActResAno',option.indActResAno)
                            setValue('metIndActResTipInd',option.tipInd)
                            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/jerarquia/${option.indActResAno}/${option.indActResCod}/${option.tipInd}`);
                            const data = await response.json();
                            
                            setJerarquia(data);
                            console.log(option.tipInd)
                            if(option.tipInd === 'IAC'){
                                setEsActividad(true);
                            } else {
                                setEsActividad(false);
                            }
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
                                <h3 className="Large-f1 m_5" style={{textTransform: 'capitalize'}}>{jerarquia.tipInd.toLowerCase()}</h3>
                                <p className="m_5">{jerarquia.indActResNum + ' - ' + jerarquia.indActResNom.charAt(0).toUpperCase() + jerarquia.indActResNom.slice(1).toLowerCase()}</p>
                            </article>
                            {
                                jerarquia.resNom &&
                                <>
                                    <article>
                                        <h3 className="Large-f1 m_5"> Resultado </h3>
                                        <p className="m_5">{jerarquia.resNum + ' - ' + jerarquia.resNom.charAt(0).toUpperCase() + jerarquia.indActResNom.slice(1).toLowerCase()}</p>
                                    </article>
                                </>
                            }
                            {
                                jerarquia.objEspNom &&
                                <>
                                    <article>
                                        <h3 className="Large-f1 m_5">Objetivo Específico</h3>
                                        <p className="m_5">{jerarquia.objEspNum + ' - ' + jerarquia.objEspNom.charAt(0).toUpperCase() + jerarquia.objEspNom.slice(1).toLowerCase()}</p>
                                    </article>
                                </>
                            }
                            <article>
                                <h3 className="Large-f1 m_5">Objetivo</h3>
                                <p className="m_5">{jerarquia.objNum + ' - ' + jerarquia.objNom.charAt(0).toUpperCase() + jerarquia.objNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1 m_5"> Subproyecto </h3>
                                <p className="m_5" style={{textTransform: 'capitalize'}}>{jerarquia.subProNom.toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1 m_5">Proyecto</h3>
                                <p className="m_5" style={{textTransform: 'capitalize'}}>{jerarquia.proNom.toLowerCase()}</p>
                            </article>
                        </div>
                    )}
                </div>
                <div className="PowerMas_Content_Form_Beneficiarie_Card Large_6 m1 overflow-auto">
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
                                onChange={(event) => {
                                    handleCountryChange(event.target.value, index);
                                    // Aquí actualizamos el valor seleccionado en el estado
                                    setSelectedValues(prevSelectedValues => {
                                        const newSelectedValues = [...prevSelectedValues];
                                        newSelectedValues[index] = event.target.value;
                                        console.log(newSelectedValues)
                                        return newSelectedValues;
                                    });
                                }} 
                                value={selectedValues[index]} 
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
                    <div className="m_75">
                        <label htmlFor="impCod" className="">
                            Implementador:
                        </label>
                        <select 
                            id="impCod" 
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.impCod || isSubmitted ? (errors.impCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('impCod', { 
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
                        {errors.impCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.impCod.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    {/* <div className="m_75">
                        <label htmlFor="finCod" className="">
                            Financiador:
                        </label>
                        <select 
                            style={{textTransform: 'capitalize'}}
                            id="finCod" 
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.finCod || isSubmitted ? (errors.impCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('finCod', { 
                                validate: value => value !== '0' || 'El campo es requerido' 
                            })}
                        >
                            <option value="0">--Seleccione Financiador--</option>
                            {financiadores.map(item => (
                                <option 
                                    key={item.finCod} 
                                    value={item.finCod}
                                    style={{textTransform: 'capitalize'}}
                                > 
                                    {item.finNom.toLowerCase()}
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
                    </div> */}
                    {
                        isEditing ?
                        <>
                        <div className="m_75 flex gap_5">
                            <div className="Large_6">
                                <label htmlFor="metAnoPlaTec" className="">
                                    Año Programática:
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
                                        required: 'El campo es requerido',
                                        minLength: {
                                            value: 4,
                                            message: 'El campo debe tener al menos 4 dígitos'
                                        },
                                        maxLength: {
                                            value: 4,
                                            message: 'El campo no debe tener más de 4 dígitos'
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'El campo solo debe contener números'
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
                                    Mes Programática:
                                </label>
                                <select 
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metMesPlaTec || isSubmitted ? (errors.metMesPlaTec ? 'invalid' : 'valid') : ''}`} 
                                    {...register('metMesPlaTec', { 
                                        validate: value => value !== '0' || 'El campo es requerido' 
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
                                Meta Programática:
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
                                        message: 'El campo no debe tener más de 10 dígitos'
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'El campo solo debe contener números'
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
                            <label htmlFor="metMetPre" className="">
                                Meta Presupuesto:
                            </label>
                            <input
                                id="metMetPre"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metMetPre || isSubmitted ? (errors.metMetPre ? 'invalid' : 'valid') : ''}`} 
                                type="text" 
                                placeholder="500"
                                autoComplete="disabled"
                                maxLength={10}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('metMetPre', {
                                    required: 'La meta es requerida',
                                    maxLength: {
                                        value: 10,
                                        message: 'El campo no debe tener más de 10 dígitos'
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'El campo solo debe contener números'
                                    },
                                    validate: value => parseInt(value, 10) > 0 || 'El valor debe ser mayor a 0'
                                })}
                            />
                            {errors.metMetPre ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metMetPre.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        </>
                        :
                        <>
                            <div className="PowerMas_TableContainer">
                                <table className="PowerMas_TableStatus">
                                    <thead>
                                        <tr>
                                            <th>Año - Mes</th>
                                            <th>Meta Programática</th>
                                            {
                                                esActividad &&
                                                <th>Meta Presupuesto</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody ref={tableRef}>
                                        <tr>
                                            <td> 2024 - Abril </td>
                                            <td> 
                                                <input type="number" 
                                                onInput={(e) => {
                                                    if (e.target.value.length > 10) {
                                                        e.target.value = e.target.value.slice(0, 10);
                                                    }}}  
                                                /> 
                                            </td>
                                            {
                                                esActividad &&
                                                <td> 
                                                    <input type="number" 
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 10) {
                                                            e.target.value = e.target.value.slice(0, 10);
                                                        }}}  
                                                    /> 
                                                </td>
                                            }
                                        </tr>
                                        <tr>
                                            <td> 2024 - Mayo </td>
                                            <td> 
                                                <input type="number" 
                                                onInput={(e) => {
                                                    if (e.target.value.length > 10) {
                                                        e.target.value = e.target.value.slice(0, 10);
                                                    }}}  
                                                /> 
                                            </td>
                                            {
                                                esActividad &&
                                                <td> 
                                                    <input type="number" 
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 10) {
                                                            e.target.value = e.target.value.slice(0, 10);
                                                        }}}  
                                                    /> 
                                                </td>
                                            }
                                        </tr>
                                        <tr>
                                            <td> 2024 - Junio </td>
                                            <td> 
                                                <input type="number" 
                                                onInput={(e) => {
                                                    if (e.target.value.length > 10) {
                                                        e.target.value = e.target.value.slice(0, 10);
                                                    }}}  
                                                /> 
                                            </td>
                                            {
                                                esActividad &&
                                                <td> 
                                                    <input type="number" 
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 10) {
                                                            e.target.value = e.target.value.slice(0, 10);
                                                        }}}  
                                                    /> 
                                                </td>
                                            }
                                        </tr>
                                        <tr>
                                            <td> 2024 - Julio </td>
                                            <td> 
                                                <input type="number" 
                                                onInput={(e) => {
                                                    if (e.target.value.length > 10) {
                                                        e.target.value = e.target.value.slice(0, 10);
                                                    }}}  
                                                /> 
                                            </td>
                                            {
                                                esActividad &&
                                                <td> 
                                                    <input type="number" 
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 10) {
                                                            e.target.value = e.target.value.slice(0, 10);
                                                        }}}  
                                                    /> 
                                                </td>
                                            }
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </>
                    }
                    
                    
                </div>

                
                
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={handleSubmit(onSubmit)} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar</button>
                <button className="Large_3 m_75 PowerMas_Buttom_Secondary">Limpiar datos</button>
            </footer>
        </>
    )
}

export default FormGoal