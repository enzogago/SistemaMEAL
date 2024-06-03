import { useNavigate, useParams } from "react-router-dom";
import Bar from "../user/Bar";
import { useContext, useEffect, useRef, useState } from "react";
import Notiflix from "notiflix";
import CryptoJS from 'crypto-js';
import template from '../../templates/PLANTILLA_REGISTRO_BENEFICIARIOS_MASIVO.xlsx';
import { handleUpload } from "./handleUpload";
import { StatusContext } from "../../context/StatusContext";
import InfoGoal from "../monitoring/beneficiarie/InfoGoal";
import { useForm } from "react-hook-form";
import { fetchData } from "../reusable/helper";
import ModalBeneficiariesAssociated from "../monitoring/beneficiarie/ModalBeneficiariesAssociated";
import Download from "../../icons/Download";
import FileExcel from "../../icons/FileExcel";

const UploadBeneficiarie = () => {
    // Obtención de parámetros de la URL
    const { id: safeCiphertext } = useParams();

    // Reemplaza los caracteres a su representación original en base64 y decodifica la cadena
    const ciphertext = atob(safeCiphertext);
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const metAno = id.slice(0, 4);
    const metCod = id.slice(4);

    // Definición de estados locales
    const [ initialSelectCount, setInitialSelectCount ] = useState(0);
    const [ dragging, setDragging ] = useState(false);
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ paises, setPaises ] = useState([]);
    const [ metaData, setMetaData] = useState(null);
    const [ selects, setSelects ] = useState([]);
    const [ cargando, setCargando ] = useState(false)
    const [ verificarPais, setVerificarPais ] = useState(null);
    const [ isDataLoaded, setIsDataLoaded ] = useState(false);
    const [ selectedValues, setSelectedValues ] = useState([]);
    const [ firstEdit, setFirstEdit ] = useState(false);
    const [ openModalGoalExecuting, setOpenModalGoalExecuting] = useState(false);
    const [update, setUpdate] = useState(false)

    // Definición de referencias
    const dragCounter = useRef(0);
    const dropRef = useRef(null);
    const fileInputRef = useRef();

    // Definición de funciones de navegación y contexto
    const navigate = useNavigate();
    const { statusActions } = useContext(StatusContext);
    const { setTableData, setIsValid, setErrorCells, setMetaBeneficiario } = statusActions;

    // Definición de funciones de manejo de archivos
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    };
    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragging(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Verificar si el archivo es un Excel
            const file = e.dataTransfer.files[0];
            const fileType = file.name.split('.').pop();
            if (fileType === 'xlsx') {
                fileInputRef.current.files = e.dataTransfer.files;
                setSelectedFile(e.dataTransfer.files[0]); // Aquí se actualiza el estado selectedFile
            } else {
                Notiflix.Notify.failure("Formato no soportado")
            }
            e.dataTransfer.clearData();
            dragCounter.current = 0;
        }
    };
    const handleDivClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        if (event.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            setSelectedFile(event.target.files[0]);
        } else {
            Notiflix.Notify.failure("Formato no soportado")
        }
    };
    const handleDownload = () => {
        fetch(template)
            .then(response => response.blob())
            .then(blob => {
                saveAs(blob, 'PLANTILLA_REGISTRO_BENEFICIARIOS_MASIVO.xlsx');
            });
    }

    useEffect(() => {
        if (id.length !== 10) {
            navigate('/monitoring');
        }
    }, [id]);

    // Carga de datos de la meta
    const fetchMetaDetails = async () => {
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
            fetchMetaDetails();
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
            if (data.length > 1) {
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                await handleCountryChange(JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                const newSelectedValues = data.slice(1).map(location => JSON.stringify({ubiCod:location.ubiCod,ubiAno:location.ubiAno}));
                setSelectedValues(newSelectedValues);   
                setInitialSelectCount(data.length);
                for (const [index, location] of data.slice(1).entries()) {
                    // Espera a que handleCountryChange termine antes de continuar con la siguiente iteración
                    await handleCountryChange(JSON.stringify({ubiCod: location.ubiCod,ubiAno: location.ubiAno}), index);
                }
                setFirstEdit(true)
            } else {
                setValue('pais', JSON.stringify({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno }));
                setFirstEdit(true)
            }
            setVerificarPais({ ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    // Observar Cambios de campos registrados
    const metBenAnoEjeTec = watch('metBenAnoEjeTec');

    // Manejo de apertura y cierre de modal
    const openModalExecuting = () => {
        setOpenModalGoalExecuting(true);
    };
    const closeModalExecuting = () => {
        setOpenModalGoalExecuting(false);
    };

    const handleFileUpload = () => {
        validateForm( (data) => {
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

            const { metEjeVal, metBenMesEjeTec, metBenAnoEjeTec } = data;

            setMetaBeneficiario({
                metAno,
                metCod,
                ubiAno,
                ubiCod,
                metBenMesEjeTec,
                metBenAnoEjeTec,
            })
            handleUpload(selectedFile, setTableData, setIsValid, setErrorCells, navigate);
        })();
    };
    
    return (
        <>
            <Bar currentStep={1} type='uploadBeneficiarie' />
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
                        <div className="flex-grow-1 flex jc-center ai-center overflow-auto">
                            <div className="Large_8">
                                <div className="flex jc-center p_5">
                                    <button className="PowerMas_Buttom_Secondary flex ai-center jc-space-between p_5 gap-1" onClick={handleDownload}> 
                                        Descargar formato
                                        <span className="flex Large-f1_5">
                                            <Download /> 
                                        </span>
                                    </button>
                                </div>
                                <article className="PowerMas_Article_Upload center">
                                    <p style={{color: '#878280'}}>Solo se puede subir documentos en formato Excel</p>
                                    <h3>Subir Archivo</h3>
                                </article>
                                <br />
                                <div
                                    className="PowerMas_Input_Upload center p2 pointer"
                                    ref={dropRef}
                                    onClick={handleDivClick}
                                    onDragEnter={handleDragIn}
                                    onDragLeave={handleDragOut}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{display: 'none'}} 
                                        onChange={handleFileChange} 
                                        accept=".xlsx"
                                    />
                                    <span className="Large-f5 flex ai-center jc-center" >
                                        <FileExcel />
                                    </span>
                                    {
                                        dragging ?
                                        <p>Suelta el archivo aquí</p>
                                        :
                                        <>
                                            {
                                                !selectedFile ?
                                                <p>Arrastra el documento o solo da click para abrir tu escritorio y escoger el documento.</p>
                                                :
                                                <p>Archivo seleccionado: {selectedFile.name}</p>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <InfoGoal 
                    metaData={metaData}
                    openModal={openModalExecuting}
                    is={false}
                />
            </div>
            
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/monitoring')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button 
                    onClick={handleFileUpload} 
                    className="Large_3 m_75 PowerMas_Buttom_Primary"
                    disabled={!selectedFile}
                >
                    Siguiente
                </button>
            </footer>
            <ModalBeneficiariesAssociated
                openModal={openModalGoalExecuting}
                closeModal={closeModalExecuting}
                metaData={metaData}
                update={update}
                setUpdate={setUpdate}
            />
        </>
    )
}

export default UploadBeneficiarie