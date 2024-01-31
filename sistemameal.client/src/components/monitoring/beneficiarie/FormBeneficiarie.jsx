import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";
import DonutChart from "../../reusable/DonutChart";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import { handleSubmit } from "./eventHandlers";

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
    const [ paises, setPaises ] = useState([]);
    const [ metaData, setMetaData] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)

    //
    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        if(id.length === 10){
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

    const Registrar_Beneficiario = () => {
        validateForm((data) => {
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
            console.log(ubiAno, ubiCod);

            console.log(data);
            handleSubmit(data, reset);
        })();
    };
    
    

    return (
        <div className="bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_25">
                <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="">Nuevo Beneficiario</h1>
            </div>
            <div className="PowerMas_Content_Form_Beneficiarie overflow-auto flex-grow-1 flex">
                    <div className="Large_6 m1 overflow-auto">
                        <h2>Datos Personales</h2>
                        <form className="Large-p_75">
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Tipo de documento:
                                </label>
                                <select 
                                    name="docIdeCod" 
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.docIdeCod || isSubmitted ? (errors.docIdeCod ? 'invalid' : 'valid') : ''}`} 
                                    {...register('docIdeCod', { 
                                        validate: value => value !== '0' || 'El documento de identidad es requerido' 
                                    })}
                                >
                                    <option value="0">--SELECCIONE UN DOCUMENTO--</option>
                                    {documentos.map(documento => (
                                        <option 
                                            key={documento.docIdeCod} 
                                            value={documento.docIdeCod}> ({documento.docIdeAbr}) {documento.docIdeNom}
                                        </option>
                                    ))}
                                </select>
                                {errors.docIdeCod ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.docIdeCod.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Numero de documento:
                                </label>
                                <input
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNumDoc || isSubmitted ? (errors.benNumDoc ? 'invalid' : 'valid') : ''}`} 
                                    type="text" 
                                    placeholder="Ejm: 922917351"
                                    {...register('benNumDoc', { required: 'El número de documento es requerido' })} 
                                />
                                {errors.benNumDoc ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benNumDoc.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Nombre
                                </label>
                                <input type="text"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNom || isSubmitted ? (errors.benNom ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: Andres"
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
                                <label htmlFor="" className="">
                                    Apellido
                                </label>
                                <input 
                                    type="text" 
                                    name="benApe"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benApe || isSubmitted ? (errors.benApe ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: Eras"
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
                                <label htmlFor="" className="">
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
                                <label htmlFor="" className="">
                                    Fecha de nacimiento:
                                </label>
                                <input 
                                    type="text" 
                                    name="benFecNac"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benFecNac || isSubmitted ? (errors.benFecNac ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: Eras"
                                    {...register('benFecNac', { 
                                        required: 'La fecha de nacimiento es requerido',
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
                                <label htmlFor="" className="">
                                    Pais:
                                </label>
                                <select 
                                    className="block Phone_12"
                                    name="ubiCod" 
                                    onChange={handleCountryChange}
 
                                >
                                    <option value="0">--SELECCIONE UN PAIS--</option>
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
                                <div className="m_75">
                                    <label htmlFor="" className="">
                                        {options[0].ubiTip}
                                    </label>
                                    <select 
                                        key={index} 
                                        name={`select${index}`} 
                                        onChange={(event) => handleCountryChange(event, index)} 
                                        className="block Phone_12"
                                    >
                                        <option value="0">--SELECCIONE UN {options[0].ubiTip}--</option>
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
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Correo Electronico
                                </label>
                                <input 
                                    type="text" 
                                    name="benCorEle"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benCorEle || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: correo@correo.com"
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
                                <label htmlFor="" className="">
                                    Numero de telefono
                                </label>
                                <input 
                                    type="text" 
                                    name="benNumTel"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNumTel || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: 987654321"
                                    {...register('benNumTel', { 
                                        required: 'El numeor de telefono es requerida',
                                    })} 
                                />
                                {errors.benNumTel ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benNumTel.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                        </form>
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
                                <h3 className="Large-f1_25 m_5">{metaData && metaData.tipInd}</h3>
                                <p className="m_5">{metaData && metaData.indActResNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5"> RESULTADO </h3>
                                <p className="m_5">{metaData && metaData.resNum + ' - ' + metaData.resNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">OBJETIVO ESPECIFICO</h3>
                                <p className="m_5">{metaData && metaData.objEspNum + ' - ' + metaData.objEspNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">OBJETIVO</h3>
                                <p className="m_5">{metaData && metaData.objNum + ' - ' + metaData.objNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5"> SUBPROYECTO </h3>
                                <p className="m_5">{metaData && metaData.subProNom}</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">PROYECTO</h3>
                                <p className="m_5">{metaData && metaData.proNom}</p>
                            </article>
                        </div>
                    </div>
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button className="Large_5 m2" onClick={Registrar_Beneficiario} >Guardar</button>
                <button className="Large_5 m2">Eliminar Todo</button>
            </div>
        </div>
    )
}

export default FormBeneficiarie