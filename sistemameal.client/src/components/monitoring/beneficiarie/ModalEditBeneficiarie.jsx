import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import ContentForm from '../../beneficiarie/ContentForm';
import Notiflix from 'notiflix';
import { handleSubmit } from '../../beneficiarie/eventHandlers';
import { useEffect, useRef, useState } from 'react';
import { fetchData } from '../../reusable/helper';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

const ModalEditBeneficiarie = ({modalVisible, closeModalEdit, record, updateData, setUpdateData, metaData}) => {

    const [ paises, setPaises ] = useState([]);
    const [ generos, setGeneros ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ selects, setSelects ] = useState([]);
    const [ isDataLoaded, setIsDataLoaded ] = useState(false);
    const [ cargando, setCargando ] = useState(false);


    // Estados Numero de Telefono
    const phoneInputRef = useRef();
    const [phoneNumberInput, setPhoneNumberInput] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [phoneInputInstance, setPhoneInputInstance] = useState(null);
    // Estados Telefono de contacto
    const phoneContactInputRef = useRef();
    const [phoneContactNumberInput, setPhoneContactNumberInput] = useState('');
    const [phoneContactNumber, setPhoneContactNumber] = useState('');
    const [contactIsValid, setContactIsValid] = useState(false);
    const [errorContactMessage, setErrorContactMessage] = useState('');
    const [phoneContactInputInstance, setPhoneContactInputInstance] = useState(null);

    
    // Función para inicializar un input de teléfono
    const initPhoneInput = (inputRef, setPhoneNumberInput, setIsValid, setPhoneNumber, setErrorMessage) => {
        setPhoneNumberInput('');
        setIsValid(false);
        const phoneInput = intlTelInput(inputRef.current, {
            initialCountry: "auto",
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback("us"));
            },
            utilsScript: "../node_modules/intl-tel-input/build/js/utils.js"
        });

        inputRef.current.addEventListener('countrychange', function() {
            setPhoneNumberInput('')
            setIsValid(false)
            const countryData = phoneInput.getSelectedCountryData();
            let maxLength;
            switch (countryData.iso2) {
                case 'pe':  // Perú
                    maxLength = 11;  
                    break;
                case 'ec':  // Ecuador
                    maxLength = 9;  
                    break;
                case 'co':  // Colombia
                    maxLength = 11;
                    break;
                default:
                    maxLength = 15;  // Valor por defecto
            }
            inputRef.current.setAttribute('maxLength', maxLength);
        });

        inputRef.current.addEventListener('input', function() {
            setPhoneNumber(phoneInput.getNumber());
            setPhoneNumberInput(this.value);
            setIsValid(phoneInput.isValidNumberPrecise())

            let errorMessage = '';
            switch (phoneInput.getValidationError()) {
                case 1:
                    errorMessage = 'El código del país es inválido';
                    break;
                case 2:
                    errorMessage = 'El número de teléfono es demasiado corto';
                    break;
                case 3:
                    errorMessage = 'El número de teléfono es demasiado largo';
                    break;
                case 4:
                    errorMessage = 'Por favor, ingresa un número de teléfono válido';
                    break;
                default:
                    errorMessage = 'Por favor, ingresa un número de teléfono válido';
            }
            setErrorMessage(errorMessage);
        });
    };

    // Luego puedes llamar a esta función para cada input de teléfono en tu función afterOpenModal
    const afterOpenModal = () => {
        initPhoneInput(phoneInputRef, setPhoneNumberInput, setIsValid, setPhoneNumber, setErrorMessage);
        initPhoneInput(phoneContactInputRef, setPhoneContactNumberInput, setContactIsValid, setPhoneContactNumber, setErrorContactMessage);
    };


    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = useForm({ mode: "onChange", defaultValues: { benNomApo: '', benApeApo: ''}});

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

            if (!isValid) {
                return;
            }
            console.log(phoneNumber)
            // handleSubmit(true, data, closeModalEdit, updateData, setUpdateData);
        })();
    }

    useEffect(() => {
        if (modalVisible && isDataLoaded) {
            fetchMetaForm(record);
        }
    }, [isDataLoaded, modalVisible]);
    useEffect(() => {
        Promise.all([
            fetchData('Genero', setGeneros),
            fetchData('Nacionalidad', setNacionalidades),
            fetchData('Ubicacion', setPaises),
        ]).then(() => setIsDataLoaded(true));
    }, []);
    

    const fetchMetaForm = async (record) => {
        try {
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-form/${record.metAno}/${record.metCod}/${record.benAno}/${record.benCod}/${record.ubiAno}/${record.ubiCod}/${record.metBenAnoEjeTec}/${record.metBenMesEjeTec}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
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
            setValue('pais', JSON.stringify({ ubiCod: metaData.ubiCod, ubiAno: metaData.ubiAno }));
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

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalVisible}
            onRequestClose={closeModalEdit}
            onAfterOpen={afterOpenModal}
            contentLabel="Table Form"
            closeTimeoutMS={200}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    width: '80%',
                    height: '90%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column'
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
        >  
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModalEdit}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Editar datos del beneficiario</h2>
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
                                equal: value => metaData && JSON.stringify({ ubiCod: metaData.ubiCod, ubiAno: metaData.ubiAno }) === value || 'El país debe ser el planificado'
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
                            name={`select-form${index}`} 
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
                            autoComplete="disabled"
                            maxLength={4}
                            onKeyDown={(event) => {
                                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                    event.preventDefault();
                                }
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
                        {errors.metBenMesEjeTec ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metBenMesEjeTec.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                </div>
                <div className='m_75'>
                    <label htmlFor="phone" className="block">
                        Telefono:
                    </label>
                    <div>
                        <input
                            ref={phoneInputRef}
                            type="tel"
                            value={phoneNumberInput}
                            onChange={(event) => setPhoneNumberInput(event.target.value)}
                            className={isValid ? `PowerMas_Modal_Form_valid` : 'PowerMas_Modal_Form_invalid'}
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
                    <label htmlFor="phone" className="block">
                        Telefono Contacto:
                    </label>
                    <div>
                        <input
                            ref={phoneContactInputRef}
                            type="tel"
                            value={phoneContactNumberInput}
                            onChange={(event) => setPhoneContactNumberInput(event.target.value)}
                            className={contactIsValid ? `PowerMas_Modal_Form_valid` : 'PowerMas_Modal_Form_invalid'}
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
            </div>
    
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={closeModalEdit} className="Large_3 m_75 PowerMas_Buttom_Secondary">Cerrar</button>
                <button onClick={handleEdit} className="Large_3 m_75 PowerMas_Buttom_Primary">Siguiente</button>
            </footer>
        </Modal>
    )
}

export default ModalEditBeneficiarie