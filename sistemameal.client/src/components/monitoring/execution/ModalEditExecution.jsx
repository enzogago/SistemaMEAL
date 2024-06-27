import Notiflix from 'notiflix';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { fetchData, fetchDataReturn } from '../../reusable/helper';

const ModalEditExecution = ({ modalVisible, closeModal, record, initialSelectCount, setRefresh, metaData }) => {
    const [ paises, setPaises ] = useState([]);
    const [ selects, setSelects ] = useState([]);
    const [ isDataLoaded, setIsDataLoaded ] = useState(false);
    const [ cargando, setCargando ] = useState(false);

    const [ selectedValues, setSelectedValues ] = useState([]);
    const [ firstEdit, setFirstEdit ] = useState(false);
    const [ verificarPais, setVerificarPais ] = useState(null);
    const [ initialData, setInitialData ] = useState(null);

    const { 
        register, 
        watch, 
        handleSubmit, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
    } = useForm({ mode: "onChange"});

    const pais = watch('pais');
    useEffect(() => {
        if (pais && firstEdit) {
            if (pais == '0') {
                setSelects([]);
                return;
            } 
            handleCountryChange(pais);
        }
    }, [pais]);

    useEffect(() => {
        if (modalVisible && isDataLoaded) {
            fetchSelects(record.ubiAno,record.ubiCod);
            reset(record)
            setInitialData(record)
        }
    }, [isDataLoaded, modalVisible]);

    useEffect(() => {
        Promise.all([
            fetchDataReturn('Ubicacion'),
            setFirstEdit(false),
        ]).then(([dataPaises]) => {
            setPaises(dataPaises)
            setIsDataLoaded(true);
        });
    }, []);

    const onSubmit = async(data) => {
        // Definimos variables de ubicacion
        let ubiAno, ubiCod;
        // Si los selects dinamicos son mayor a 1
        if (selects.length > 1) {
            // Obtiene el ubiAno y ubiCod del último select
            const lastSelectElement = document.querySelector(`select[name=execution-select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;
            if (lastSelect === '0') {
                // Si el último select tiene un valor de '0', obtén el ubiAno y ubiCod del penúltimo select
                const penultimateSelectElement = document.querySelector(`select[name=execution-select${selects.length - 2}]`);
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
            const lastSelectElement = document.querySelector(`select[name=execution-select${selects.length - 1}]`);
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
        
        const record = {
            ...data,
            ubiAno,
            ubiCod,
            metAnoOri: initialData.metAno,
            metCodOri: initialData.metCod,
            ubiAnoOri: initialData.ubiAno,
            ubiCodOri: initialData.ubiCod,
            metEjeAnoEjeTecOri: initialData.metEjeAnoEjeTec,
            metEjeMesEjeTecOri: initialData.metEjeMesEjeTec,
        }

        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/goal-execution`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(record),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                if(response.status === 409){
                    Notiflix.Notify.warning(`${errorData.message}`);
                    return;
                } else {
                    Notiflix.Notify.failure(errorData.message);
                    return;
                }
            }
    
            const successData = await response.json();
            Notiflix.Notify.success(successData.message);
            closeAndReset();
            setRefresh(prevRef => !prevRef);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const closeAndReset = () => {
        closeModal();
        handleReset();
    }

    const handleReset = () => {
        setSelects([]);
        reset({
            pais: '',
            metEjeVal: '',
            metEjeDet: '',
            metEjeAnoEjeTec: '',
            metEjeMesEjeTec: '',
        });
    }

    const fetchSelects = async (ubiAno,ubiCod) => {
        try {
            const token = localStorage.getItem('token');
            if (document.querySelector('.content-block')) {
                Notiflix.Block.pulse('.content-block', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
            
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
                await handleCountryChange(JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                const newSelectedValues = data.slice(1).map(location => JSON.stringify({ubiCod:location.ubiCod,ubiAno:location.ubiAno}));
                setSelectedValues(newSelectedValues);
                for (const [index, location] of data.slice(1).entries()) {
                    // Espera a que handleCountryChange termine antes de continuar con la siguiente iteración
                    await handleCountryChange(JSON.stringify({ubiCod: location.ubiCod,ubiAno: location.ubiAno}), index);
                }
                setFirstEdit(true)
            } else {
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                setFirstEdit(true);
            }
            setVerificarPais({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Block.remove('.content-block');
        }
    }
    
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

    const currentYear = new Date().getFullYear();

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalVisible}
            onRequestClose={closeModal}
            closeTimeoutMS={200}
            className='PowerMas_React_Modal_Content Large_6'
            overlayClassName='PowerMas_React_Modal_Overlay'
            style={{
                content: {
                    height: '90%',
                },
                overlay: {
                    zIndex: 30
                }
            }}
        >  
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeAndReset}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Editar Meta Ejecución</h2>
            <div className='overflow-auto flex flex-column gap_5 flex-grow-1'>
                <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75 flex flex-column gap_25 content-block">
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
                    </div>
                    {selects.map((options, index) => {
                        return(
                        <div className="m_75" key={index}>
                            <label style={{textTransform: 'capitalize'}} htmlFor={index} className="">
                                {options[0].ubiTip.toLowerCase()}
                            </label>
                            <select
                                id={index}
                                key={index} 
                                value={selectedValues[index]}
                                name={`execution-select${index}`} 
                                onChange={(event) => {
                                    // Si el selector está deshabilitado, no hagas nada
                                    if (index+1 < initialSelectCount) {
                                        return;
                                    }
                                    
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
                                disabled={index+1 < initialSelectCount}
                            >
                                <option style={{textTransform: 'capitalize'}} value="0">--Seleccione {options[0].ubiTip.toLowerCase()}--</option>
                                {options.map(option => (
                                    <option key={option.ubiCod} value={JSON.stringify({ ubiCod: option.ubiCod, ubiAno: option.ubiAno })}>
                                        {option.ubiNom.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )})}
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
                                    validate: value => {
                                        if (Number(value) < metaData.metAnoPlaTec){
                                            return 'El año debe ser mayor o igual a ' + metaData.metAnoPlaTec;
                                        }
                                        if (Number(value) > Number(metaData.metAnoPlaTec) + 1) {
                                            return 'El año debe ser menor o igual a ' + (Number(metaData.metAnoPlaTec) + 1);
                                        }
                                    }
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
                                            const year = watch('metEjeAnoEjeTec');
                                            return (year > metaData.metAnoPlaTec) || (year === metaData.metAnoPlaTec && month >= metaData.metMesPlaTec) || 'El mes y el año deben ser mayores o iguales al mes y al año planificados';
                                        }
                                    }
                                })}
                                id="metEjeMesEjeTec" 
                            >
                                <option value="0">--Seleccione Mes--</option>
                                <option value="01">ENERO</option>
                                <option value="02">FEBRERO</option>
                                <option value="03">MARZO</option>
                                <option value="04">ABRIL</option>
                                <option value="05">MAYO</option>
                                <option value="06">JUNIO</option>
                                <option value="07">JULIO</option>
                                <option value="08">AGOSTO</option>
                                <option value="09">SEPTIEMBRE</option>
                                <option value="10">OCTUBRE</option>
                                <option value="11">NOVIEMBRE</option>
                                <option value="12">DICIEMBRE</option>
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
                    <h2 className="f1_25">Datos de Ejecución</h2>
                    <div className="m_75">
                        <label htmlFor="metEjeVal" className="">
                            Cantidad de {metaData && metaData.uniNom.toLowerCase()}:
                        </label>
                        <input
                            id="metEjeVal"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metEjeVal || isSubmitted ? (errors.metEjeVal ? 'invalid' : 'valid') : ''}`} 
                            type="text" 
                            placeholder="Ejm: 10"
                            autoComplete='off'
                            maxLength={10}
                            onInput={(event) => {
                                // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                const sanitizedValue = event.target.value.replace(/^0+|[^0-9]/g, '');
                                event.target.value = sanitizedValue;
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
                                },
                                validate: {
                                    positive: value => parseInt(value, 10) > 0 || 'El valor debe ser mayor a cero',
                                    notZeroPadded: value => /^[1-9][0-9]*$/.test(value) || 'El valor no debe tener ceros a la izquierda'
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
                    <div className="m_75">
                        <label htmlFor="metEjeDet" style={{textTransform: "capitalize"}}>
                            {metaData && (metaData.uniDetLab ? metaData.uniDetLab.toLowerCase() : 'Alternativa')}
                        </label>
                        <textarea
                            rows="4" cols="50"
                            id="metEjeDet"
                            autoComplete='off'
                            placeholder={metaData && (metaData.uniDetPla ? metaData.uniDetPla.toLowerCase() : 'Alternativa')}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metEjeDet   || isSubmitted ? (errors.metEjeDet   ? 'invalid' : 'valid') : ''}`} 
                            {...register('metEjeDet', { 
                                required: 'El campo es requerido',
                                maxLength: {
                                    value: 600,
                                    message: 'El campo no debe tener más de 600 dígitos'
                                },
                            })}
                        >
                        </textarea>
                        {errors.metEjeDet ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metEjeDet.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={closeModal} className="Large_3 m_75 PowerMas_Buttom_Secondary">Cerrar</button>
                <button onClick={handleSubmit(onSubmit)} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar</button>
            </footer>
        </Modal>
    )
}

export default ModalEditExecution