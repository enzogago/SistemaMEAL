import { useNavigate, useParams } from "react-router-dom";
import Modal from 'react-modal';
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import TableForm from "./TableForm";
import { fetchData } from "../../reusable/helper";
import { handleSubmitMetaBeneficiario, handleSubmitMetaBeneficiarioExiste, initPhoneInput } from "./eventHandlers";
import ModalGoalBeneficiarie from "./ModalGoalBeneficiarie";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import logo from '../../../img/PowerMas_LogoAyudaEnAccion.svg';
import InfoGoal from "./InfoGoal";
import ModalBeneficiariesName from "./ModalBeneficiariesName";
import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';
import { useRef } from "react";

const FormGoalBeneficiarie = () => {
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
    const [ documentos, setDocumentos ] = useState([]);
    const [ paises, setPaises ] = useState([]);
    const [ generos, setGeneros ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ metaData, setMetaData] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)
    const [ documentosAgregados, setDocumentosAgregados ] = useState([]);
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ modalFormIsOpen, setModalFormIsOpen ] = useState(false);
    const [ esMenorDeEdad, setEsMenorDeEdad ] = useState(false);
    const [ mostrarAgregarDocumento, setMostrarAgregarDocumento ] = useState(false);
    const [ accionActual, setAccionActual] = useState('buscar');
    const [ updateData, setUpdateData] = useState(false);
    
    const [ fieldsDisabled, setFieldsDisabled ] = useState(true);
    const [ existeBeneficiario, setExisteBeneficiario ] = useState(false);
    const [ isOptionOneSelected, setIsOptionOneSelected] = useState(true);

    const [ modalGoalBeneficiarie, setModalGoalBeneficiarie ] = useState(false);
    const [ dataGoalBeneficiarie, setDataGoalBeneficiarie ] = useState({});
    const [ dataBeneficiariesName, setDataBeneficiariesName ] = useState([]);
    
    const [ verificarPais, setVerificarPais ] = useState(null);
    
    const [ dataGoals, setDataGoals ] = useState([])

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [ modalInfoOpen, setModalInfoOpen ] = useState(false);
    const [ modalBeneficiariesName, setModalBeneficiariesName ] = useState(false);

    const [selectedValues, setSelectedValues] = useState([]);
    const [firstEdit, setFirstEdit] = useState(false);

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
            setValue('metBenMesEjeTec', data.metMesPlaTec)
            setValue('metBenAnoEjeTec', data.metAnoPlaTec)
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
            fetchData('Genero', setGeneros),
            fetchData('Nacionalidad', setNacionalidades),
            fetchData('Ubicacion', setPaises),
            fetchData('DocumentoIdentidad', setDocumentos)
        ]).then(() => setIsDataLoaded(true));
    }, []);

    // Propiedades Form Principal
    const { 
        register, 
        watch, 
        handleSubmit: 
        validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger,
        setFocus
    } = useForm({ mode: "onChange", defaultValues: {benNom: '', benNomApo: '', benApeApo: '', genCod: '0', nacCod: '0'}});

    const pais = watch('pais');
    useEffect(() => {
        if (pais) {
            if (pais == '0') {
                console.log("te reinicio pq puedo")
                setSelects([]);
                return;
            } 
            console.log(pais)
            handleCountryChange(pais);
            console.log("ok bravo")
        }
    }, [pais]);

    // Formulario Secundario buscar Beneficiario
    const { 
        register: register2, 
        watch: watch2, 
        handleSubmit: validateForm2, 
        formState: { errors: errors2,dirtyFields: dirtyFields2, isSubmitted: isSubmitted2  }, 
        reset: reset2,
        setValue: setValue2
    } 
    = useForm({ mode: "onChange"});

    const buscarDataMetas = (data) => {
        console.log(data)
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

        setDataGoalBeneficiarie(data)
        reset(newData);
        setExisteBeneficiario(true);
        fetchDataTable(data.benAno, data.benCod)
        setModalGoalBeneficiarie(true);
        setValue('metBenMesEjeTec', metaData.metMesPlaTec)
        setValue('metBenAnoEjeTec', metaData.metAnoPlaTec)
        setValue('pais', JSON.stringify(verificarPais));
    }
    
    // Actualiza la acción actual antes de enviar el formulario
    const buscarBeneficiarioDocumento = async (info) => {
        if (isOptionOneSelected) {
            // Buscamos por Documento
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/documento/${info.docIdeCod}/${info.docIdeBenNum}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(response.status === 204){
                    setMostrarAgregarDocumento(true);
                    setAccionActual('agregar')
                    setFieldsDisabled(false);
                    setEsMenorDeEdad(false);
                    reset({
                        benApe: '',
                        benApeApo: '',
                        benCorEle: '',
                        benFecNac: '',
                        benNom: '',
                        benNomApo: '',
                        benSex: '',
                        benAut: '',
                        benDir: '',
                        benTel: '0',
                        benTelCon: '0',
                        genCod: '0',
                        nacCod: '0',
                    });
                    setDocumentosAgregados([]);
                    setIsOptionOneSelected(true);
                    setExisteBeneficiario(false);
                    // Encuentra el documento completo en el array 'documentos'
                    const documentoCompleto = documentos.find(doc => doc.docIdeCod === info.docIdeCod);
                
                    // Si el documento no existe, agregarlo a la lista
                    setDocumentosAgregados([...documentosAgregados, { 
                        docIdeCod: info.docIdeCod, 
                        docIdeNom: documentoCompleto.docIdeNom,
                        docIdeAbr: documentoCompleto.docIdeAbr,
                        docIdeBenNum: info.docIdeBenNum 
                    }]);
                    Notiflix.Notify.success("Documento de Identidad agregado")
                    setModalIsOpen(true)
                    // Resetear los campos
                    reset2({
                        docIdeBenNum: '',
                        docIdeCod: '0',
                    });
                    setValue('benAut','s');
                    setFocus('benNom');
                    return;
                }
                const data = await response.json();
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                
                buscarDataMetas(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setValue('metBenMesEjeTec', metaData.metMesPlaTec)
                setValue('metBenAnoEjeTec', metaData.metAnoPlaTec)
                setValue('pais', JSON.stringify(verificarPais));
                Notiflix.Loading.remove();
            }
        } else {
            // Buscar por nombres y apellidos
            let benNom = info.benNom.trim(); // Eliminar espacios al principio y al final
            benNom = benNom.replace(/\s+/g, ' '); // Reemplazar secuencias de espacios en blanco por un solo espacio

            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/nombres/${benNom}`, {
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
                    setMostrarAgregarDocumento(true);
                    setAccionActual('agregar')
                    setFieldsDisabled(false);
                    setEsMenorDeEdad(false);
                    reset({
                        benApe: '',
                        benApeApo: '',
                        benCorEle: '',
                        benFecNac: '',
                        benNom: '',
                        benNomApo: '',
                        benSex: '',
                        benAut: '',
                        benDir: '',
                        benTel: '0',
                        benTelCon: '0',
                        genCod: '0',
                        nacCod: '0',
                    });
                    setDocumentosAgregados([]);
                    setIsOptionOneSelected(true);
                    setExisteBeneficiario(false);
                    setValue2('docIdeCod','0')
                    setValue2('docIdeBenNum','')
                    return;
                }

                console.log(data)
                setDataBeneficiariesName(data)
                setModalBeneficiariesName(true);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setValue('metBenMesEjeTec', metaData.metMesPlaTec)
                setValue('metBenAnoEjeTec', metaData.metAnoPlaTec)
                setValue('pais', JSON.stringify(verificarPais));
                Notiflix.Loading.remove();
            }
        }
    };
    
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
            setDataGoals(data);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const onSubmit = async(data) => {
        if (accionActual === 'buscar') {
            buscarBeneficiarioDocumento(data)
        } else if (accionActual === 'agregar') {
            // Verificar si el documento ya existe en la lista
            const documentoExistente = documentosAgregados.find(doc => doc.docIdeCod === data.docIdeCod);
            if (documentoExistente) {
                // Si el documento ya existe, mostrar un mensaje y no agregarlo
                Notiflix.Notify.failure(`Este tipo de documento ya ha sido agregado.`);
                return;
            }
        
            // Encuentra el documento completo en el array 'documentos'
            const documentoCompleto = documentos.find(doc => doc.docIdeCod === data.docIdeCod);
        
            // Si el documento no existe, agregarlo a la lista
            setDocumentosAgregados([...documentosAgregados, { 
                docIdeCod: data.docIdeCod, 
                docIdeNom: documentoCompleto.docIdeNom,
                docIdeAbr: documentoCompleto.docIdeAbr,
                docIdeBenNum: data.docIdeBenNum 
            }]);
        
            Notiflix.Notify.success("Documento de Identidad agregado")
            setModalIsOpen(true)
            // Resetear los campos
            reset2({
                docIdeBenNum: '',
                docIdeCod: '0',
            });
        }
    };
    
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
    
    const abrirModal = () => {
        setModalIsOpen(true);
    };
    const cerrarModal = () => {
        setModalIsOpen(false);
    };
    const openModal = () => {
        setModalFormIsOpen(true);
    }
    const closeModal = () => {
        setModalFormIsOpen(false);
    }
    const closeGoalBeneficiarie = () => {
        setModalGoalBeneficiarie(false);
    }
    const closeModalInfo = () => {
        setModalInfoOpen(false);
    }
    const closeBeneficiariesName = () => {
        setModalBeneficiariesName(false);
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
                    console.log("cuantas")
                    await handleCountryChange(JSON.stringify({ubiCod: location.ubiCod,ubiAno: location.ubiAno}), index);
                    setFirstEdit(true);  // Indica que estás estableciendo el valor del select de país
                }
            } else {
                setFirstEdit(true);
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
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

    const Registrar_Beneficiario =  () => {
        validateForm( (data) => {
            console.log(data)
            const {metBenAnoEjeTec,metBenMesEjeTec} = data;
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

            if (!isValid || !contactIsValid) {
                console.log(isValid)
                console.log(contactIsValid)
                return;
            }
            
            if(!existeBeneficiario) {
                // Verifica que el array documentosAgregados tenga al menos un registro
                if (documentosAgregados.length === 0) {
                    Notiflix.Notify.failure('Debe agregar al menos un documento.');
                    return;
                }
                // Encuentra el primer documento con código 01
                let documentoCodUni = documentosAgregados.find(doc => doc.docIdeCod === '01');
                // Si no se encontró un documento con código 01, busca uno con código 03
                if (!documentoCodUni) {
                    documentoCodUni = documentosAgregados.find(doc => doc.docIdeCod === '03');
                }
                // Si aún no se encontró un documento, usa el primer documento en el array
                if (!documentoCodUni) {
                    documentoCodUni = documentosAgregados[0];
                }
                // Usa el benNumDoc del documento encontrado como benCodUni
                const benCodUni = documentoCodUni.docIdeBenNum;

                let beneficiarioMonitoreo = {
                    Beneficiario: { ...data, benCodUni },
                    MetaBeneficiario: {
                        metAno,
                        metCod,
                        ubiAno,
                        ubiCod,
                        metBenMesEjeTec,
                        metBenAnoEjeTec
                    },
                    DocumentoBeneficiario: documentosAgregados
                }

                beneficiarioMonitoreo.Beneficiario.benTel=phoneNumber;
                beneficiarioMonitoreo.Beneficiario.benTelCon=phoneContactNumber;

                console.log(beneficiarioMonitoreo)
                handleSubmitMetaBeneficiario(beneficiarioMonitoreo, handleReset, updateData, setUpdateData, fetchBeneficiarie);
            } else { // Si existe el beneficairio solo insertar MetaBeneficiario
                const { benAno, benCod } = data;
                const MetaBeneficiario = {
                    metAno,
                    metCod,
                    benAno,
                    benCod,
                    ubiAno,
                    ubiCod,
                    metBenMesEjeTec,
                    metBenAnoEjeTec
                }
                console.log(MetaBeneficiario)
                handleSubmitMetaBeneficiarioExiste(MetaBeneficiario, handleReset, updateData, setUpdateData, fetchBeneficiarie);
            }
        })();
    };

    const handleReset = () => {
        reset({
            benApe: '',
            benApeApo: '',
            benCorEle: '',
            benFecNac: '',
            benNom: '',
            benNomApo: '',
            benSex: '',
            benAut: '',
            benDir: '',
            genCod: '0',
            nacCod: '0',
            benTel: '0',
            pais: '0',
            benTelCon: '0',
        });
        reset2({
            docIdeBenNum: '',
            docIdeCod: '0',
        });
        setDocumentosAgregados([]);
        setFieldsDisabled(true);
        setMostrarAgregarDocumento(false);
        setAccionActual('buscar');
        setValue('metBenMesEjeTec', metaData.metMesPlaTec)
        setValue('metBenAnoEjeTec', metaData.metAnoPlaTec)
        setValue('pais', JSON.stringify(verificarPais));

        // Resetear campos del telefono
        setPhoneNumber('');
        phoneInputRef.current.value = '';
        setIsTouched(false);
        setPhoneContactNumber('');
        phoneContactInputRef.current.value = '';
        setContactIsTouched(false);
    };

    // Observar Cambios de campos registrados
    const selectedValue = watch('genCod', '0');
    const selectedValue2 = watch('nacCod', '0');
    const benSex = watch('benSex');
    const benAut = watch('benAut');
    const metBenAnoEjeTec = watch('metBenAnoEjeTec');
    const selectedDocumentValue = watch2('docIdeCod', '0');

    const eliminarDocumento = (index) => {
        const nuevosDocumentos = [...documentosAgregados];
        nuevosDocumentos.splice(index, 1);
        setDocumentosAgregados(nuevosDocumentos);
    }

    

    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="f1_75">Nuevo Beneficiario</h1>
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
                                                    const year = metBenAnoEjeTec;
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
                        </div>
                        <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                            <h2 className="f1_25 Large_12"> Datos Personales </h2>
                            <form onSubmit={validateForm2(onSubmit)}>
                                {
                                    !mostrarAgregarDocumento &&
                                    <div className="m_75 flex jc-center">
                                        <label className="Large_6 flex gap_5 ai-center">
                                            <input
                                                className="m0"
                                                type="radio"
                                                checked={isOptionOneSelected}
                                                onChange={() => setIsOptionOneSelected(true)}
                                            />
                                            Buscar por Documento
                                        </label>
                                        <label className="Large_6 flex gap_5 ai-center">
                                            <input
                                            className="m0"
                                                type="radio"
                                                checked={!isOptionOneSelected}
                                                onChange={() => setIsOptionOneSelected(false)}
                                            />
                                            Buscar por Nombres
                                        </label>
                                    </div>
                                }
                                {
                                    isOptionOneSelected ?
                                    <>
                                        <div className="m_75">
                                            <label htmlFor="docIdeCod" className="">
                                                Tipo de documento:
                                            </label>
                                            <select 
                                                id="docIdeCod" 
                                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.docIdeCod || isSubmitted2 ? (errors2.docIdeCod ? 'invalid' : 'valid') : ''}`} 
                                                style={{ color: selectedDocumentValue === '0' ? '#372e2c60' : '#000', textTransform: 'capitalize'}}
                                                {...register2('docIdeCod', { 
                                                    validate: value => value !== '0' || 'El campo es requerido' 
                                                })}
                                            >
                                                <option value="0">--Seleccione Documento Identidad--</option>
                                                {documentos.map(documento => (
                                                    <option
                                                        key={documento.docIdeCod} 
                                                        value={documento.docIdeCod}> ({documento.docIdeAbr}) {documento.docIdeNom.toLowerCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors2.docIdeCod ? (
                                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.docIdeCod.message}</p>
                                            ) : (
                                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                                Espacio reservado para el mensaje de error
                                                </p>
                                            )}
                                        </div>
                                        <div className="m_75">
                                            <label htmlFor="docIdeBenNum" className="">
                                                Numero de documento:
                                            </label>
                                            <input
                                                id="docIdeBenNum"
                                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.docIdeBenNum || isSubmitted2 ? (errors2.docIdeBenNum ? 'invalid' : 'valid') : ''}`} 
                                                type="text" 
                                                placeholder="74301932"
                                                autoComplete='off'
                                                maxLength={10}
                                                onInput={(event) => {
                                                    // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                                }}
                                                {...register2('docIdeBenNum', { 
                                                    required: 'El campo es requerido',
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
                                            {errors2.docIdeBenNum ? (
                                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.docIdeBenNum.message}</p>
                                            ) : (
                                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                                Espacio reservado para el mensaje de error
                                                </p>
                                            )}
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="m_75">
                                            <label htmlFor="benNom" className="">
                                                Nombre
                                            </label>
                                            <input
                                                id="benNom"
                                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.benNom || isSubmitted2 ? (errors2.benNom ? 'invalid' : 'valid') : ''}`} 
                                                type="text" 
                                                placeholder="Buscar por nombres"
                                                autoComplete='off'
                                                {...register2('benNom', { 
                                                    required: 'El campo es requerido',
                                                    minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                                })}
                                            />
                                            {errors2.benNom ? (
                                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.benNom.message}</p>
                                            ) : (
                                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                                Espacio reservado para el mensaje de error
                                                </p>
                                            )}
                                        </div>
                                    </>
                                }
                                <div className="m_75 flex jc-center">
                                {
                                    mostrarAgregarDocumento ? 
                                        <div className="flex gap-1 Large_12" >
                                            <button className="PowerMas_Buttom_Primary Large_6" type="submit">Agregar Documento</button>
                                            <button className="PowerMas_Buttom_Secondary Large_6" type="button" onClick={abrirModal}>Ver Documentos</button>
                                        </div>
                                        :
                                        <button className="PowerMas_Buttom_Primary Large_5" type="submit">Buscar</button>
                                }
                                </div>
                            </form>
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
                                                disabled={fieldsDisabled && benAut !== 's'}
                                                value="s" 
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
                                                disabled={fieldsDisabled && benAut !== 'n'}
                                                value="n" 
                                                {...register('benAut', { required: 'Por favor, selecciona una opción' })}
                                            />
                                            <label style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} htmlFor="no">No</label>
                                        </div>
                                    </div>
                                    <div className="flex ai-center gap_3 PowerMas_Permission_Beneficiarie" onClick={() => setModalInfoOpen(true)}>
                                        <span className="f_75 pointer">
                                            Ver Autorización
                                        </span>
                                        <IoIosInformationCircleOutline  className="Large-f1_25 bold pointer w-auto" />
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
                                    style={{textTransform: 'capitalize'}}
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
                                    style={{textTransform: 'capitalize'}}
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
                                    style={{ color: selectedValue == '0' ? '#372e2c60' : '#000000', textTransform: 'capitalize'}}
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
                                            {genero.genNom.toLowerCase()}
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
                                <label style={{color: `${fieldsDisabled ? '#372e2c60': '#000'}`}} htmlFor="benFecNac" className="">
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
                                    style={{ color: selectedValue2 == '0' ? '#372e2c60' : '#000000', textTransform: 'capitalize'}}
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
                                            {nacionalidad.nacNom.toLowerCase()}
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
                                    style={{textTransform: 'capitalize'}}
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
                    <InfoGoal 
                        metaData={metaData} 
                        openModal={openModal} 
                    />
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button className="PowerMas_Buttom_Primary Large_3 m_75" onClick={Registrar_Beneficiario} >Guardar</button>
                <button className="PowerMas_Buttom_Secondary Large_3 m_75" onClick={handleReset}>Limpiar</button>
            </div>

            {/* Modal ver documentos agregados */}
            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={cerrarModal}
                contentLabel="Documentos agregados"
                closeTimeoutMS={200}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        width: '50%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        padding: '20px'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            >
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={cerrarModal}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Documentos Agregados</h2>
                <table className="PowerMas_Modal_Documentos">
                    <thead className="">
                        <tr>
                            <th>Tipo de documento</th>
                            <th>Número de documento</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentosAgregados.map((documento, index) => (
                            <tr key={index}>
                                <td style={{textTransform: 'capitalize', textWrap: 'nowrap'}}>{documento.docIdeAbr} - {documento.docIdeNom.toLowerCase()}</td>
                                <td className="center">{documento.docIdeBenNum}</td>
                                <td className="PowerMas_IconsTable"> 
                                    <FaRegTrashAlt 
                                        data-tooltip-id="delete-tooltip" 
                                        data-tooltip-content="Eliminar"
                                        onClick={() => eliminarDocumento(index)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {
                            documentosAgregados.length == 0 &&
                            <tr className="center">
                                <td colSpan={3} className="p1"> No se registraron documentos</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <div className=" center">
                    <button className="PowerMas_Buttom_Primary center p_5 m_25" onClick={cerrarModal}>Cerrar</button>
                </div>
            </Modal>

            {/* Modal Beneficarios asociados a la meta */}
            <Modal
                ariaHideApp={false}
                isOpen={modalFormIsOpen}
                onRequestClose={closeModal}
                closeTimeoutMS={200}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        width: '90%',
                        height: '90%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        display: 'flex',
                        flexDirection: 'column',
                        
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            >   
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Beneficiarios asociados a la meta</h2>
                <TableForm
                    modalFormIsOpen={modalFormIsOpen}
                    metaData={metaData}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                    fetchBeneficiarie={fetchBeneficiarie}
                />
            </Modal>

            {/* Intervenciones del beneficiario */}
            <ModalGoalBeneficiarie 
                modalGoalBeneficiarie={modalGoalBeneficiarie} 
                closeModal={closeGoalBeneficiarie}
                dataGoalBeneficiarie={dataGoalBeneficiarie}
                dataGoals={dataGoals}
            />

            {/* Resultados de beneficiarios con coincidencia de nombre y/o apellido */}
            <ModalBeneficiariesName 
                data={dataBeneficiariesName}
                modalBeneficiariesName={modalBeneficiariesName}
                closeBeneficiariesName={closeBeneficiariesName}
                buscarDataMetas={buscarDataMetas}
            />

            {/* Modal Información Autorización  */}
            <Modal
                ariaHideApp={false}
                isOpen={modalInfoOpen}
                onRequestClose={closeModalInfo}
                closeTimeoutMS={200}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        width: '50%',
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
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModalInfo}>×</span>
                <div className="PowerMas_SidebarHeader flex flex-row ai-center p_5">
                    <img className='Large_4 Medium_10 Phone_6' height="auto"  title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                    <h2 className="Large_9 center f1_5"> Autorización del uso de Información </h2>
                </div>
                <br />
                
                <p className="bold">
                    Verificar que la persona beneficiaria disponga la autorización tras ser leída la autorización por la persona que entrevista. En caso de que sea NNA la 
                    autorización debe ser leída por el/la cuidador/ra, padre o madre.
                </p>
                <br />
                <p style={{fontStyle: 'italic'}}>
                    Los datos e información sensible que usted nos comparta serán ingresadas en nuestros sistemas de registro, con el objetivo de facilitar el estudio o 
                    atención de su caso de manera individual o grupal según corresponda, estos datos también pueden ser usados como datos estadísticos que no comprometan 
                    datos personales. En otros casos, podremos hacer uso de los mismos con fines relacionados a la organización, por cuanto, es importante que usted sepa 
                    que la Fundación Ayuda en Acción tiene políticas de protección de datos y seguridad de la información y serán tratados con la respectiva confidencialidad.
                </p>

                <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                    <button className='' value="Cerrar"onClick={closeModalInfo} > Cerrar </button>
                </div>
            </Modal>    
        </>
    )
}

export default FormGoalBeneficiarie