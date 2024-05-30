import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { useEffect, useRef, useState } from 'react';
import { fetchData } from '../../reusable/helper';
import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';
import { initPhoneInput } from './eventHandlers';

const ModalEditBeneficiarie = ({modalVisible, closeModalEdit, record, setUpdate, metaData, initialSelectCount}) => {

    if (!modalVisible) return; 
    const [ paises, setPaises ] = useState([]);
    const [ generos, setGeneros ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ selects, setSelects ] = useState([]);
    const [ isDataLoaded, setIsDataLoaded ] = useState(false);
    const [ cargando, setCargando ] = useState(false);

    const [ initialData, setInitialData ] = useState(null);
    const [ fieldsDisabled, setFieldsDisabled ] = useState(true);
    const [ esMenorDeEdad, setEsMenorDeEdad ] = useState(true);

    // Estados Numero de Telefono
    const phoneInputRef = useRef();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    // Estados Telefono de contacto
    const phoneContactInputRef = useRef();
    const [phoneContactNumber, setPhoneContactNumber] = useState('');
    const [contactIsValid, setContactIsValid] = useState(false);
    const [errorContactMessage, setErrorContactMessage] = useState('');
    const [contactIsTouched, setContactIsTouched] = useState(false);

    const [selectedValues, setSelectedValues] = useState([]);
    const [firstEdit, setFirstEdit] = useState(false);
    const [ verificarPais, setVerificarPais ] = useState(null);

    // Luego puedes llamar a esta función para cada input de teléfono en tu función afterOpenModal
    const afterOpenModal = () => {
        initPhoneInput(phoneInputRef, setIsValid, setPhoneNumber, setErrorMessage, record.benTel, metaData.ubiNom, setIsTouched);
        initPhoneInput(phoneContactInputRef, setContactIsValid, setPhoneContactNumber, setErrorContactMessage, record.benTelCon, metaData.ubiNom, setContactIsTouched);
    };

    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = useForm({ mode: "onChange"});

    // Efecto para la concatenación automatica en la separacion de día mes y año
    useEffect(() => {
        const fechaNacimiento = watch('benFecNac');
        if (fechaNacimiento) {
            // Remueve cualquier guión existente
            let cleanFecha = fechaNacimiento.replace(/-/g, '');
            
            // Inserta los guiones después del año y el mes
            if (cleanFecha.length >= 2) {
                cleanFecha = cleanFecha.slice(0, 2) + '-' + cleanFecha.slice(2);
            }
            if (cleanFecha.length >= 5) {
                cleanFecha = cleanFecha.slice(0, 5) + '-' + cleanFecha.slice(5);
            }
            
            // Si el usuario borra los dígitos de la fecha, también borra los guiones
            if (cleanFecha.length <= 3) {
                cleanFecha = cleanFecha.slice(0, 2);
            }
            if (cleanFecha.length <= 6) {
                cleanFecha = cleanFecha.slice(0, 5);
            }
            
            // Actualiza el valor del campo con los guiones insertados
            setValue('benFecNac', cleanFecha);
        }

        if (fechaNacimiento) {
            const generarCamposApoderado = async () => {
                const esNombreValido = await trigger('benFecNac');
        
                if (esNombreValido) {
                    const fechaFormateada = fechaNacimiento.split("-").reverse().join("-");
                    const fecha = new Date(fechaFormateada);
                    const hoy = new Date();
                    let edad = hoy.getFullYear() - fecha.getFullYear();
                    const m = hoy.getMonth() - fecha.getMonth();
                    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
                        edad--;
                    }
                    setEsMenorDeEdad(edad < 18);
                } else{
                    setEsMenorDeEdad(false);
                    setValue('benNomApo', '');
                    setValue('benApeApo', '');
                }
            };
            generarCamposApoderado();
        }
    }, [watch('benFecNac')]);

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

    const handleEdit = () => {
        validateForm((data) => {
            const lastSelectElement = document.querySelector(`select[name=select-form${selects.length - 1}]`);
            const lastSelect = JSON.parse(lastSelectElement.value);
            const ubiAno = lastSelect.ubiAno;
            const ubiCod = lastSelect.ubiCod;
            // Verifica que todos los selects tengan una opción válida seleccionada
            for (let i = 0; i < selects.length; i++) {
                const selectElement = document.querySelector(`select[name=select-form${i}]`);
                if (selectElement && selectElement.value === '0') {
                    selectElement.classList.remove('PowerMas_Modal_Form_valid');
                    selectElement.classList.add('PowerMas_Modal_Form_invalid');
                    selectElement.focus();
                    return;
                } else {
                    selectElement.classList.remove('PowerMas_Modal_Form_invalid');
                    selectElement.classList.add('PowerMas_Modal_Form_valid');
                }
            }

            if (!isValid || !contactIsValid) {
                return;
            }

            const hasChanged = ['metAno', 'metCod', 'benAno', 'benCod', 'metBenMesEjeTec', 'metBenAnoEjeTec'].some(key => data[key] !== initialData[key]) || ubiAno !== initialData.ubiAno || ubiCod !== initialData.ubiCod;

            const { metAno, metCod, benAno, benCod, metBenEda, metBenMesEjeTec, metBenAnoEjeTec} = data;
            const dataMetaBeneficiario ={
                metAnoOri: initialData.metAno,
                metCodOri: initialData.metCod,
                benAnoOri: initialData.benAno,
                benCodOri: initialData.benCod,
                ubiAnoOri: initialData.ubiAno,
                ubiCodOri: initialData.ubiCod,
                metBenMesEjeTecOri: initialData.metBenMesEjeTec,
                metBenAnoEjeTecOri: initialData.metBenAnoEjeTec,
                metAno,
                metCod,
                benAno,
                benCod,
                ubiAno,
                ubiCod,
                metBenEda,
                metBenMesEjeTec,
                metBenAnoEjeTec
            };
            
            data.benTel=phoneNumber;
            data.benTelCon=phoneContactNumber;

            // Crea una copia de 'data' sin la propiedad 'pais'
            const dataWithoutPais = {...data};
            delete dataWithoutPais.pais;

            // Define las propiedades que quieres excluir de la comparación
            const excludedProperties = ['ubiAno', 'ubiCod', 'metAno', 'metCod', 'metBenAnoEjeTec', 'metBenMesEjeTec'];

            // Ahora puedes comparar 'dataWithoutPais' e 'initialData', excluyendo las propiedades especificadas
            const hasChangedBeneficiarie = Object.keys(dataWithoutPais).some(key => {
                if (!excludedProperties.includes(key)) {
                    return dataWithoutPais[key] !== initialData[key];
                }
            });

            if (!hasChanged && !fieldsDisabled) { // No cambió y los campos habilitados
                // UPDATE BENEFICIARIO
                console.log(data)
                handleSubmitBeneficiarie(data, closeModalEdit, setUpdate);
            } else if(fieldsDisabled){ // Cambió y los campos deshabilitados
                // Update META_BENEFICIARIO
                console.log(dataMetaBeneficiario)
                handleSubmiMetaBeneficiario(dataMetaBeneficiario, closeModalEdit);
            } else if(!fieldsDisabled){
                if(hasChanged && hasChangedBeneficiarie){ // Si cambian los datos de Meta_Beneficiario y Beneficiario
                    // UPDATE META_BENEFICAIRIO y BENEFICIARIO
                    console.log(dataBeneficiarioMetaBeneficiario)
                    const dataBeneficiarioMetaBeneficiario= {
                        Beneficiario: { ...data },
                        MetaBeneficiario: { ...dataMetaBeneficiario},
                    }
                    handleSubmiBeneficiarioMetaBeneficiario(dataBeneficiarioMetaBeneficiario, closeModalEdit, setUpdate);
                } else { // Solo cambia los datos de Meta_Beneficiario
                    console.log(dataMetaBeneficiario)
                    // Update META_BENEFICIARIO
                    handleSubmiMetaBeneficiario(dataMetaBeneficiario, closeModalEdit);
                }
            }
        })();
    }

    const handleSubmitBeneficiarie = async (data, closeModalEdit, setUpdate) => {
        let newData = {};
                
        for (let key in data) {
            if (typeof data[key] === 'string') {
                // Convierte cada cadena a minúsculas
                newData[key] = data[key].toUpperCase();
            } else {
                // Mantiene los valores no string tal como están
                newData[key] = data[key];
            }
        }
    
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });
            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
    
            Notiflix.Notify.success(data.message);
            closeModalEdit();
            setUpdate(prevUpdate => !prevUpdate);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleSubmiBeneficiarioMetaBeneficiario = async (dataForm, closeModalEdit, updateData, setUpdateData) => {
        let newDataBeneficiario = {};
                
        for (let key in dataForm.Beneficiario) {
            if (typeof dataForm.Beneficiario[key] === 'string') {
                // Convierte cada cadena a minúsculas
                newDataBeneficiario[key] = dataForm.Beneficiario[key].toUpperCase();
            } else {
                // Mantiene los valores no string tal como están
                newDataBeneficiario[key] = dataForm.Beneficiario[key];
            }
        }

        dataForm.Beneficiario = newDataBeneficiario;

        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-beneficiario`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm),
            });
            console.log(response)
            const data = await response.json();
            
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }

            Notiflix.Notify.success(data.message);
            closeModalEdit();
            setUpdate(prevUpdate => !prevUpdate);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    const handleSubmiMetaBeneficiario = async (newData, closeModalEdit) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });
            const data = await response.json();
            
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }

            Notiflix.Notify.success(data.message);
            closeModalEdit();
            setUpdate(prevUpdate => !prevUpdate);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        if (modalVisible && isDataLoaded) {
            console.log(record)
            fetchMetaForm(record);
        }
    }, [isDataLoaded, modalVisible]);

    useEffect(() => {
        Promise.all([
            fetchData('Genero', setGeneros),
            fetchData('Nacionalidad', setNacionalidades),
            fetchData('Ubicacion', setPaises),
            setFirstEdit(false),
        ]).then(() => setIsDataLoaded(true));
    }, []);
    

    const fetchMetaForm = async (record) => {
        try {
            console.log(record)
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-form/${record.metAno}/${record.metCod}/${record.benAno}/${record.benCod}/${record.ubiAno}/${record.ubiCod}/${record.metBenAnoEjeTec}/${record.metBenMesEjeTec}`, {
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
    
            reset(data);
            setInitialData(data)
            
            // RELLENAMOS EL SELECT
            fetchSelects(data.ubiAno,data.ubiCod);
            
            fetchDataTable(data.benAno,data.benCod);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const fetchDataTable = async (benAno,benCod) => {
        try {
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/beneficiario/${benAno}/${benCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            if(data.length === 1){
                setFieldsDisabled(false);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

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
                await handleCountryChange(JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                const newSelectedValues = data.slice(1).map(location => JSON.stringify({ubiCod:location.ubiCod,ubiAno:location.ubiAno}));
                setSelectedValues(newSelectedValues);
                console.log(newSelectedValues)
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
            initPhoneInput(phoneInputRef, setIsValid, setPhoneNumber, setErrorMessage,'',data[0].ubiNom, setIsTouched);
            initPhoneInput(phoneContactInputRef, setContactIsValid, setPhoneContactNumber, setErrorContactMessage,'',data[0].ubiNom, setContactIsTouched);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }
    

    const handleCountryChange = async (ubicacion, index) => {
        const selectedCountry = JSON.parse(ubicacion);
        console.log(selectedCountry)
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

    // Observar Cambios de campos registrados
    const selectedValue = watch('genCod', '0');
    const selectedValue2 = watch('nacCod', '0');
    const benSex = watch('benSex');
    const benAut = watch('benAut');
    const metBenAnoEjeTec = watch('metBenAnoEjeTec');

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalVisible}
            onRequestClose={closeModalEdit}
            onAfterOpen={afterOpenModal}
            closeTimeoutMS={200}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    width: '50%',
                    height: '90%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column'
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 40
                }
            }}
        >  
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModalEdit}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Editar Meta Beneficiario</h2>
            <div className='flex flex-column gap-1 overflow-auto flex-grow-1'>
                <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75 Large_12">
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
                                name={`select-form${index}`} 
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
                    ))}
                    {
                        cargando &&
                        <div id="loading" className="m_75">Cargando...</div>
                    }
                    <div className="flex">
                        <div className="m_75 Large_6">
                            <label htmlFor="metBenAnoEjeTec" className="">
                                Año de Ejecución
                            </label>
                            <input 
                                type="text" 
                                id="metBenAnoEjeTec"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metBenAnoEjeTec || isSubmitted ? (errors.metBenAnoEjeTec ? 'invalid' : 'valid') : ''}`} 
                                placeholder="2024"
                                autoComplete='off'
                                maxLength={4}
                                onInput={(event) => {
                                    // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                }}
                                {...register('metBenAnoEjeTec', { 
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
                            {errors.metBenAnoEjeTec ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metBenAnoEjeTec.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="m_75 Large_6">
                            <label htmlFor="metBenMesEjeTec" className="">
                                Mes de Ejecución
                            </label>
                            <select 
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metBenMesEjeTec || isSubmitted ? (errors.metBenMesEjeTec ? 'invalid' : 'valid') : ''}`} 
                                {...register('metBenMesEjeTec', { 
                                    validate: {
                                        required: value => value !== '0' || 'El campo es requerido',
                                        greaterOrEqual: value => {
                                            const month = value;
                                            const year = watch('metBenAnoEjeTec');
                                            return (year > metaData.metAnoPlaTec) || (year === metaData.metAnoPlaTec && month >= metaData.metMesPlaTec) || 'El mes y el año deben ser mayores o iguales al mes y al año planificados';
                                        }
                                    }
                                })}
                                id="metBenMesEjeTec" 
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
                            {errors.metBenMesEjeTec ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metBenMesEjeTec.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                    </div>


                    <div className="m_75">
                        <label htmlFor="si" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Autoriza el uso de datos:
                        </label>
                        <div className="flex  jc-space-between">
                            <div className="flex gap-1 ">
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="si"
                                        className="m0"
                                        name="benAut" 
                                        disabled={fieldsDisabled && benAut !== 'S'}
                                        value="S" 
                                        {...register('benAut', { required: 'Por favor, selecciona una opción' })}
                                    />
                                    <label htmlFor="si" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} >Si</label>
                                </div>
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="no" 
                                        className="m0"
                                        name="benAut" 
                                        disabled={fieldsDisabled && benAut !== 'N'}
                                        value="N" 
                                        {...register('benAut', { required: 'Por favor, selecciona una opción' })}
                                    />
                                    <label style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} htmlFor="no">No</label>
                                </div>
                            </div>
                            
                        </div>
                        {errors.benAut ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benAut.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="benNom" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Nombre
                        </label>
                        <input type="text"
                            id="benNom"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNom || isSubmitted ? (errors.benNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Enzo Fabricio"
                            autoComplete='off'
                            disabled={fieldsDisabled}
                            {...register('benNom', { 
                                required: 'El nombre es requerido',
                                minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.benNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benNom.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="benApe" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Apellido
                        </label>
                        <input 
                            type="text" 
                            id="benApe"
                            autoComplete='off'
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benApe || isSubmitted ? (errors.benApe ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Gago Aguirre"
                            disabled={fieldsDisabled}
                            {...register('benApe', { 
                                required: 'El apellido es requerido',
                                    minLength: { value: 3, message: 'El apellido debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.benApe ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benApe.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    
                    <div className="m_75">
                        <label htmlFor="masculino" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Sexo:
                        </label>
                        <div className="flex gap-1">
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="masculino" 
                                    name="benSex" 
                                    disabled={fieldsDisabled && benSex !== 'm'}
                                    value="m" 
                                    {...register('benSex', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label htmlFor="masculino" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} >Masculino</label>
                            </div>
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="femenino" 
                                    name="benSex" 
                                    disabled={fieldsDisabled && benSex !== 'f'}
                                    value="f" 
                                    {...register('benSex', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} htmlFor="femenino">Femenino</label>
                            </div>
                        </div>
                        {errors.benSex ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benSex.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    
                    <div className="m_75">
                        <label htmlFor="genCod" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Género:
                        </label>
                        <select 
                            id="genCod" 
                            disabled={fieldsDisabled}
                            style={{ color: selectedValue == '0' ? '#372e2c60' : '#000000'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.genCod || isSubmitted ? (errors.genCod ? 'invalid' : 'valid') : ''}`}
                            name="genCod"
                            {...register('genCod', { 
                                validate: value => value !== '0' || 'El campo es requerido' 
                            })}
                        >
                            <option value="0">--Seleccione Género--</option>
                            {generos.map(genero => (
                                <option 
                                    key={genero.genCod} 
                                    value={genero.genCod}
                                > 
                                    {genero.genNom}
                                </option>
                            ))}
                        </select>
                        {errors.genCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.genCod.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}}htmlFor="benFecNac" className="">
                            Fecha de nacimiento:
                        </label>
                        <input 
                            type="text" 
                            id="benFecNac"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benFecNac || isSubmitted ? (errors.benFecNac ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Ejm: 17-03-2003 (DD-MM-YYYY)"
                            autoComplete='off'
                            maxLength={10}
                            disabled={fieldsDisabled}
                            onInput={(event) => {
                                // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                event.target.value = event.target.value.replace(/[^0-9]/g, '');
                            }}
                            {...register('benFecNac', { 
                                required: 'La Fecha de nacimiento es requerido',
                                pattern: {
                                    value: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/,
                                    message: 'La fecha debe estar en el formato DD-MM-YYYY',
                                },
                            })} 
                        />
                        {errors.benFecNac ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benFecNac.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="nacCod" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Nacionalidad:
                        </label>
                        <select 
                            id="nacCod" 
                            disabled={fieldsDisabled}
                            style={{ color: selectedValue == '0' ? '#372e2c60' : '#000000'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.nacCod || isSubmitted ? (errors.nacCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('nacCod', { 
                                validate: value => value !== '0' || 'El campo es requerido' 
                            })}
                        >
                            <option value="0">--Seleccione Nacionalidad--</option>
                            {nacionalidades.map(nacionalidad => (
                                <option 
                                    key={nacionalidad.nacCod} 
                                    value={nacionalidad.nacCod}
                                > 
                                    {nacionalidad.nacNom}
                                </option>
                            ))}
                        </select>
                        {errors.nacCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.nacCod.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    
                    <div className="m_75">
                        <label htmlFor="benCorEle" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Email
                        </label>
                        <input 
                            type="text" 
                            id="benCorEle"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benCorEle || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                            placeholder="correo@correo.com"
                            disabled={fieldsDisabled}
                            autoComplete='off'
                            {...register('benCorEle', { 
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Dirección de correo electrónico inválida',
                                },
                            })} 
                        />
                        {errors.benCorEle ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benCorEle.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className='m_75'>
                        <label htmlFor="phone" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="block">
                            Telefono:
                        </label>
                        <div>
                            <input
                                ref={phoneInputRef}
                                type="tel"
                                disabled={fieldsDisabled}
                                className={`Phone_12 PowerMas_Modal_Form_${isTouched ? (!isValid ? 'invalid' : 'valid') : ''}`}
                                style={{
                                    paddingRight: '6px',
                                    padding: '4px 6px 4px 52px',
                                    margin: 0,
                                }}
                            />
                        </div>
                        {!isValid ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errorMessage}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className='m_75'>
                        <label htmlFor="phone" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="block">
                            Telefono Contacto:
                        </label>
                        <div>
                            <input
                                ref={phoneContactInputRef}
                                type="tel"
                                disabled={fieldsDisabled}
                                className={`Phone_12 PowerMas_Modal_Form_${contactIsTouched ? (!contactIsValid ? 'invalid' : 'valid') : ''}`}
                                style={{
                                    paddingRight: '6px',
                                    padding: '4px 6px 4px 52px',
                                    margin: 0,
                                }}
                            />
                        </div>
                        {!contactIsValid ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errorContactMessage}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="benDir" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                            Dirección
                        </label>
                        <input 
                            type="text" 
                            id="benDir"
                            autoComplete='off'
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benDir || isSubmitted ? (errors.benDir ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Dirección del beneficiario"
                            disabled={fieldsDisabled}
                            {...register('benDir', { 
                                    minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.benDir ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benDir.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                </div>
                {
                    esMenorDeEdad && 
                    <>
                        <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                            <h2 className="f1_25">Datos de Autorización</h2>
                            <p className="f_75">Si el beneficiario es menor de edad se deben introducir los datos de la persona que autoriza el uso de su información.</p>
                            <div className="m_75">
                                <label htmlFor="benNomApo" style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} className="">
                                    Nombre Apoderado
                                </label>
                                <input 
                                    id="benNomApo"
                                    type="text"
                                    style={{textTransform: 'capitalize'}}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNomApo || isSubmitted ? (errors.benNomApo ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Enzo Fabricio"
                                    autoComplete='off'
                                    disabled={fieldsDisabled}
                                    {...register('benNomApo', { 
                                        required: 'El nombre del apoderado es requerido',
                                        minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                                    })} 
                                />
                                {errors.benNomApo ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benNomApo.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="m_75">
                                <label htmlFor="benApeApo" style={{color: `${fieldsDisabled ? '#372e2c': '#000'}`}} className="">
                                    Apellido Apoderado
                                </label>
                                <input 
                                    id="benApeApo"
                                    type="text"
                                    style={{textTransform: 'capitalize'}}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benApeApo || isSubmitted ? (errors.benApeApo ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Gago Aguirre"
                                    autoComplete='off'
                                    disabled={fieldsDisabled}
                                    {...register('benApeApo', { 
                                        required: 'El nombre del apoderado es requerido',
                                        minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                                    })} 
                                />
                                {errors.benApeApo ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benApeApo.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                }
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={closeModalEdit} className="Large_3 m_75 PowerMas_Buttom_Secondary">Cerrar</button>
                <button onClick={handleEdit} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar</button>
            </footer>
        </Modal>
    )
}

export default ModalEditBeneficiarie