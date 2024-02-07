import { useNavigate, useParams } from "react-router-dom";
import Modal from 'react-modal';
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";
import DonutChart from "../../reusable/DonutChart";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';


const FormBeneficiarie = () => {
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
    const [ selectedCountry, setSelectedCountry ] = useState('0');
    const [ paises, setPaises ] = useState([]);
    const [ generos, setGeneros ] = useState([]);
    const [ metaData, setMetaData] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)
    const [ documentosAgregados, setDocumentosAgregados ] = useState([]);
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ esMenorDeEdad, setEsMenorDeEdad ] = useState(false);

    //
    const { register, watch, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset } = 
    useForm({ mode: "onChange"});
    const fechaNacimiento = watch('benFecNac');

    const { register: register2, handleSubmit: validateForm2, formState: { errors: errors2,dirtyFields: dirtyFields2, isSubmitted: isSubmitted2  }, reset: reset2 } = useForm({ mode: "onChange"});

    useEffect(() => {
        if (fechaNacimiento) {
            // Asegúrate de que la fecha de nacimiento tiene el formato correcto
            const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
            if (regex.test(fechaNacimiento)) {
                // Convierte la fecha de nacimiento al formato que JavaScript puede entender
                const fechaFormateada = fechaNacimiento.replace(/\//g, '-');
                const fecha = new Date(fechaFormateada);
                const hoy = new Date();
                let edad = hoy.getFullYear() - fecha.getFullYear();
                const m = hoy.getMonth() - fecha.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
                    edad--;
                }
                console.log(edad)
                setEsMenorDeEdad(edad < 18);
            }
        }
    }, [fechaNacimiento]);
    

    
    const Agregar_Documento = (data) => {
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
            docIdeNom: documentoCompleto.docIdeNom,  // Agrega el nombre del documento
            docIdeAbr: documentoCompleto.docIdeAbr,  // Agrega el nombre del documento
            benNumDoc: data.benNumDoc 
        }]);
    
        Notiflix.Notify.success("Documento de Identidad agregado")
        setModalIsOpen(true)
        // Resetear los campos
        reset2({
            benNumDoc: '',
            docIdeCod: '0',
        });
    };
    
    

    const abrirModal = () => {
        setModalIsOpen(true);
    };
    
    const cerrarModal = () => {
        setModalIsOpen(false);
    };
    
    

    const fetchBeneficiarie = async () => {
        const token = localStorage.getItem('token');
        Notiflix.Loading.pulse('Cargando...');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/${metAno}/${metCod}`, {
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
            setMetaData(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    useEffect(() => {
        if(id.length === 10){
            fetchBeneficiarie();
        };
    }, [id]);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/DocumentoIdentidad`, {
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
                setDocumentos(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
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
        const fetchGneros = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Genero`, {
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
                setGeneros(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        fetchGneros();
        fetchPaises();
        fetchDocumentos();
    }, []);
    


    const handleCountryChange = async (event, index) => {
        const selectedCountry = JSON.parse(event.target.value);
        console.log(selectedCountry.ubiAno, selectedCountry.ubiCod);
        if (event.target.value === '0') {
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
            } else {
                setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
            }
        } catch (error) {
            console.error('Error:', error);
        } finally{
            setCargando(false);
        }
    };

    const Registrar_Beneficiario =  () => {
        validateForm( async (data) => {
            // Verifica que el select de país tenga una opción válida seleccionada
            const paisSelectElement = document.querySelector(`select[name=select0]`);
            if (!paisSelectElement || paisSelectElement.value === '0') {
                console.error('El select de país no tiene una opción válida seleccionada.');
                // paisSelectElement.classList.remove('PowerMas_Modal_Form_valid');
                // paisSelectElement.classList.add('PowerMas_Modal_Form_invalid');
                return;
            } else {
                paisSelectElement.classList.remove('PowerMas_Modal_Form_invalid');
                paisSelectElement.classList.add('PowerMas_Modal_Form_valid');
            }
        
            // Verifica que todos los selects tengan una opción válida seleccionada
            for (let i = 1; i < selects.length; i++) {
                const selectElement = document.querySelector(`select[name=select${i}]`);
                if (selectElement && selectElement.value === '0') {
                    console.error(`El select ${i} no tiene una opción válida seleccionada.`);
                    selectElement.classList.remove('PowerMas_Modal_Form_valid');
                    selectElement.classList.add('PowerMas_Modal_Form_invalid');
                    return;
                } else {
                    selectElement.classList.remove('PowerMas_Modal_Form_invalid');
                    selectElement.classList.add('PowerMas_Modal_Form_valid');
                }
            }
        
            // Obtiene el ubiAno y ubiCod del último select
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = JSON.parse(lastSelectElement.value);
            const ubiAno = lastSelect.ubiAno;
            const ubiCod = lastSelect.ubiCod;


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
            const benCodUni = documentoCodUni.benNumDoc;

            let beneficiarioMonitoreo = {
                Beneficiario: { ...data, benCodUni },
                MetaBeneficiario: {
                    metAno,
                    metCod,
                    ubiAno,
                    ubiCod,
                },
                Documentos: documentosAgregados
            }
            console.log(beneficiarioMonitoreo)
            handleSubmitMetaBeneficiario(beneficiarioMonitoreo);
        })();
    };
    
    
    const handleSubmitMetaBeneficiario = async (data) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo`, {
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
                genCod: '0',
            });
            reset2({
                benNumDoc: '',
                docIdeCod: '0',
            });
            setSelects([]);
            setDocumentosAgregados([])
            setSelectedCountry('0');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };


    return (
        <div className="PowerMas_StatusContainer bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_25">
                <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="">Nuevo Beneficiario</h1>
            </div>
            <div className="PowerMas_Content_Form_Beneficiarie overflow-auto flex-grow-1 flex">
                    <div className="Large_6 m1 overflow-auto">
                        <h2>Datos Personales</h2>
                        <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                            <form onSubmit={validateForm2(Agregar_Documento)}>
                                <div className="m_75">
                                    <label htmlFor="docIdeCod" className="">
                                        Tipo de documento:
                                    </label>
                                    <select 
                                        id="docIdeCod" 
                                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.docIdeCod || isSubmitted2 ? (errors2.docIdeCod ? 'invalid' : 'valid') : ''}`} 
                                        {...register2('docIdeCod', { 
                                            validate: value => value !== '0' || 'El dcoumento de identidad es requerido' 
                                        })}
                                    >
                                        <option value="0">--Seleccione Dcoumento Identidad--</option>
                                        {documentos.map(documento => (
                                            <option 
                                                key={documento.docIdeCod} 
                                                value={documento.docIdeCod}> ({documento.docIdeAbr}) {documento.docIdeNom}
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
                                    <label htmlFor="benNumDoc" className="">
                                        Numero de documento:
                                    </label>
                                    <input
                                        id="benNumDoc"
                                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.benNumDoc || isSubmitted2 ? (errors2.benNumDoc ? 'invalid' : 'valid') : ''}`} 
                                        type="text" 
                                        placeholder="74301932"
                                        autoComplete="disabled"
                                        maxLength={10}
                                        onKeyDown={(event) => {
                                            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                                event.preventDefault();
                                            }
                                        }}
                                        {...register2('benNumDoc', { 
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
                                    {errors2.benNumDoc ? (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.benNumDoc.message}</p>
                                    ) : (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                                </div>
                                <div className="m_75 flex jc-space-between">
                                    <button type="submit">Agregar documento</button>
                                    <button type="button" onClick={abrirModal}>Ver documentos agregados</button>
                                </div>
                            </form>


                            <div className="m_75">
                                <label htmlFor="benNom" className="">
                                    Nombre
                                </label>
                                <input type="text"
                                    id="benNom"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNom || isSubmitted ? (errors.benNom ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Enzo Fabricio"
                                    autoComplete="disabled"
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
                                <label htmlFor="benApe" className="">
                                    Apellido
                                </label>
                                <input 
                                    type="text" 
                                    id="benApe"
                                    autoComplete="disabled"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benApe || isSubmitted ? (errors.benApe ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Gago Aguirre"
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
                                <label htmlFor="masculino" className="">
                                    Sexo:
                                </label>
                                <div className="flex gap-1">
                                    <div className="flex gap_5">
                                        <input 
                                            type="radio" 
                                            id="masculino" 
                                            name="benSex" 
                                            value="M" 
                                            {...register('benSex')}
                                        />
                                        <label htmlFor="masculino">Masculino</label>
                                    </div>
                                    <div className="flex gap_5">
                                        <input 
                                            type="radio" 
                                            id="femenino" 
                                            name="benSex" 
                                            value="F" 
                                            {...register('benSex')}
                                        />
                                        <label htmlFor="femenino">Femenino</label>
                                    </div>
                                </div>
                            </div>
                            <div className="m_75">
                                <label htmlFor="genCod" className="">
                                    Género:
                                </label>
                                <select 
                                    id="genCod" 
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.genCod || isSubmitted ? (errors.genCod ? 'invalid' : 'valid') : ''}`} 
                                    {...register('genCod', { 
                                        validate: value => value !== '0' || 'El género de identidad es requerido' 
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
                                <label htmlFor="benFecNac" className="">
                                    Fecha de nacimiento:
                                </label>
                                <input 
                                    type="text" 
                                    id="benFecNac"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benFecNac || isSubmitted ? (errors.benFecNac ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="2003-03-17"
                                    autoComplete="disabled"
                                    {...register('benFecNac', { 
                                        required: 'La Fecha de nacimiento es requerido',
                                        pattern: {
                                            value: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                                            message: 'La fecha debe estar en el formato YYYY-MM-DD',
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
                                <label htmlFor="benCorEle" className="">
                                    Correo Electronico
                                </label>
                                <input 
                                    type="text" 
                                    id="benCorEle"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benCorEle || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="correo@correo.com"
                                    autoComplete="disabled"
                                    {...register('benCorEle', { 
                                        required: 'El correo es requerida',
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
                            <div className="m_75">
                                <label htmlFor="benTel" className="">
                                    Numero de telefono
                                </label>
                                <input 
                                    type="text" 
                                    id="benTel"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benTel || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="907078329"
                                    autoComplete="disabled"
                                    {...register('benTel', { 
                                        required: 'El número de telefono es requerido',
                                        minLength: { value: 9, message: 'El número debe tener minimo 9 digitos' },
                                        maxLength: { value: 10, message: 'El número debe tener minimo 10 digitos' },
                                    })} 
                                />
                                {errors.benTel ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benTel.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="m_75">
                                <label htmlFor="benTelCon" className="">
                                    Telefono de contacto
                                </label>
                                <input 
                                    type="text" 
                                    id="benTelCon"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benTelCon || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="907078329"
                                    autoComplete="disabled"
                                    {...register('benTelCon', { 
                                        required: 'El número de telefono es requerido',
                                        minLength: { value: 9, message: 'El número debe tener minimo 9 digitos' },
                                        maxLength: { value: 10, message: 'El número debe tener minimo 10 digitos' },
                                    })} 
                                />
                                {errors.benTelCon ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benTelCon.message}</p>
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
                                <h2>Datos de Autorización</h2>
                                <p className="f_75">Si el beneficiario es menor de edad se deben introducir los datos de la persona que autoriza el uso de su información.</p>
                                <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                                    <div className="m_75">
                                        <label htmlFor="benNomApo" className="">
                                            Nombre Apoderado
                                        </label>
                                        <input 
                                            id="benNomApo"
                                            type="text"
                                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNomApo || isSubmitted ? (errors.benNomApo ? 'invalid' : 'valid') : ''}`} 
                                            placeholder="Enzo Fabricio"
                                            autoComplete="disabled"
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
                                        <label htmlFor="benApeApo" className="">
                                            Apellido Apoderado
                                        </label>
                                        <input 
                                            id="benApeApo"
                                            type="text"
                                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benApeApo || isSubmitted ? (errors.benApeApo ? 'invalid' : 'valid') : ''}`} 
                                            placeholder="Gago Aguirre"
                                            autoComplete="disabled"
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
                       
                        <h2>Datos de Ubicación</h2>
                        <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75">
                            <div className="m_75">
                                <label htmlFor="ubiCod" className="">
                                    Pais:
                                </label>
                                <select 
                                    className="block Phone_12"
                                    id="ubiCod" 
                                    value={selectedCountry}
                                    onChange={(event) => {
                                        setSelectedCountry(event.target.value);
                                        handleCountryChange(event);
                                    }}
 
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
                                        onChange={(event) => handleCountryChange(event, index)} 
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
                        </div>
                    </div>
                    <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto">
                        <div className="flex ai-center gap_5">
                            <p className="p_5 Phone_4">Meta: <span>{metaData && metaData.metMetTec}</span></p>
                            <p className="p_5 Phone_4">Ejecucion: <span>{metaData && metaData.metEjeTec}</span></p>
                            <p className="p_5 Phone_4">Saldo: <span>{metaData && (metaData.metMetTec - metaData.metEjeTec)}</span></p>
                        </div>
                        <br />
                        <div className="PowerMas_Info_Form_Beneficiarie_Progress flex ai-center jc-space-around p1">
                            <h2 className="Large-f2 Large_8 Medium_8">Nos encontramos en un Avance de:</h2>
                            <DonutChart percentage={metaData ? metaData.metPorAvaTec : 0} />
                        </div>
                        <br />
                        <div>
                            <article>
                                <h3 className="Large-f1_25 m_5" style={{textTransform: 'capitalize'}}>{metaData && metaData.tipInd.toLowerCase()}</h3>
                                <p className="m_5">{metaData && metaData.indActResNum + ' - ' + metaData.indActResNom.charAt(0).toUpperCase() + metaData.indActResNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5"> Resultado </h3>
                                <p className="m_5">{metaData && metaData.resNum + ' - ' + metaData.resNom.charAt(0).toUpperCase() + metaData.indActResNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Objetivo Específico</h3>
                                <p className="m_5">{metaData && metaData.objEspNum + ' - ' + metaData.objEspNom.charAt(0).toUpperCase() + metaData.objEspNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Objetivo</h3>
                                <p className="m_5">{metaData && metaData.objNum + ' - ' + metaData.objNom.charAt(0).toUpperCase() + metaData.objNom.slice(1).toLowerCase()}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5"> Subproyecto </h3>
                                <p className="m_5">{metaData && metaData.subProNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Proyecto</h3>
                                <p className="m_5">{metaData && metaData.proNom}</p>
                            </article>
                        </div>
                    </div>
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button className="Large_5 m2" onClick={Registrar_Beneficiario} >Guardar</button>
                <button className="Large_5 m2">Eliminar Todo</button>
            </div>
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
                        width: '40%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        padding: '20px'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <h2>Documentos agregados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de documento</th>
                            <th>Número de documento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentosAgregados.map((documento, index) => (
                            <tr key={index}>
                                <td>{documento.docIdeAbr} - {documento.docIdeNom}</td>
                                <td className="center">{documento.benNumDoc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={cerrarModal}>Cerrar</button>
            </Modal>

        </div>
    )
}

export default FormBeneficiarie