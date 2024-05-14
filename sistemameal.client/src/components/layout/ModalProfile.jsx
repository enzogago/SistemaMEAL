import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { initPhoneInput } from '../monitoring/beneficiarie/eventHandlers';
import Notiflix from 'notiflix';
import ImageCropper from './ImageCropper';
import imageCompression from 'browser-image-compression';
import Edit from '../../icons/Edit';
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';

const ModalProfile = ({openModal, closeModal}) => {
    const { authInfo, authActions } = useContext(AuthContext);
    const { userLogged } = authInfo;
    const { setUserLogged } = authActions;
    const { usuAno, usuCod } = userLogged;

    const [ documentos, setDocumentos ] = useState([])
    const [ cargos, setCargos ] = useState([])
    const [ isIconVisible, setIsIconVisible ] = useState(false);
    const [ isUpload, setIsUpload ] = useState(false);

    // Estados Numero de Telefono
    const phoneInputRef = useRef();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isTouched, setIsTouched] = useState(false);

     // Estado para almacenar la referencia a Cropper
  const [cropper, setCropper] = useState(null);

    const fetchDataReturn = async (controller) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            // Valores del storage
            const token = localStorage.getItem('token');
            // Obtenemos los datos
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if(response.status === 401 || response.status === 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                }
                return;
            }
            const data = await response.json();
            if (data.success === false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            return (data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        if (openModal) {
    
             // Ejecuta todas las promesas en paralelo
            Promise.all([
                fetchDataReturn('DocumentoIdentidad'),
                fetchDataReturn('Cargo')
            ]).then(([documentos, cargos]) => {
                // Actualiza el estado con los resultados
                setDocumentos(documentos);
                setCargos(cargos); // Asegúrate de tener un estado para 'cargos'

                // Ahora que todas las operaciones anteriores se han completado, ejecuta fetchData('Usuario/${usuAno}/${usuCod}')
                fetchDataReturn(`Usuario/${usuAno}/${usuCod}`).then((data) => {
                    // Desestructura los datos del usuario
                    const { usuAno, usuCod, docIdeCod, usuNumDoc, usuNom, usuApe, usuTel, usuFecNac, carCod } = data;

                    // Resetea el formulario con los datos del usuario
                    reset({ usuAno, usuCod, docIdeCod, usuNumDoc, usuNom, usuApe, usuTel, usuFecNac, carCod });

                    initPhoneInput(phoneInputRef, setIsValid, setPhoneNumber, setErrorMessage, data.usuTel, data.ubiNom, setIsTouched);
                });
            });
        }
    }, [openModal]);
    
    const { 
        register, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
    } = useForm({ 
        mode: "onChange" ,
    });

    const handleNext = () => {
        validateForm((data) => {
            if (!isValid) {
                return;
            }
            data.usuTel=phoneNumber;
            console.log(data)
            handleSubmit(data);
        })();
    }

    const closeModalAndReset = () => {
        closeModal();
        handleReset();
    }

    const handleReset = () => {
        reset({ 
            usuAno: '', 
            usuCod: '', 
            docIdeCod: '0', 
            usuNumDoc: '', 
            usuNom: '', 
            usuApe: '', 
            usuTel: '', 
            usuFecNac: '',
            carCod: '0'
        });
        setPhoneNumber('');
        if (phoneInputRef.current) {
            phoneInputRef.current.value = '';
        }
    };
    

    const handleSubmit = async (data) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            
            const dataResult = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(dataResult.message);
                return;
            }
            
            Notiflix.Notify.success(dataResult.message);
            setUserLogged(dataResult.user);
            closeModalAndReset();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    // Definición de funciones de manejo de archivos
    const [ dragging, setDragging ] = useState(false);
    const [ selectedFile, setSelectedFile ] = useState(null);

    // Definición de referencias
    const dragCounter = useRef(0);
    const dropRef = useRef(null);
    const fileInputRef = useRef();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(dragCounter)
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
            const file = e.dataTransfer.files[0];
            const fileType = file.name.split('.').pop().toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas y minúsculas
            console.log(fileType)
            if (fileType === 'jpg' || fileType === 'jpeg') { // Aceptar jpg y jpeg
                fileInputRef.current.files = e.dataTransfer.files;
                setSelectedFile(e.dataTransfer.files[0]);
            } else {
                Notiflix.Notify.failure("Formato no soportado")
            }
            e.dataTransfer.clearData();
            dragCounter.current = 0;
        }
    };
    
    const handleFileChange = (event) => {
        console.log(event.target.files[0])
        const fileType = event.target.files[0].type;
        if (fileType === "image/jpeg" || fileType === "image/jpg") { // Aceptar jpg y jpeg
            setSelectedFile(event.target.files[0]);
        } else {
            Notiflix.Notify.failure("Formato no soportado")
        }
    };
    
    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmitImage = async () => {
        try {
            Notiflix.Loading.pulse();
    
            // Si hay una imagen seleccionada para recortar
            if (selectedFile && cropper) {
                // Recorta la imagen
                const croppedImageDataURL = cropper.getCroppedCanvas().toDataURL();
    
                // Convierte dataUrl a File
                const response = await fetch(croppedImageDataURL);
                let file = await response.blob();
                file = new File([file], "FileName.jpg", { type: "image/jpeg" });
    
                // Opciones de compresión
                const options = {
                    maxSizeMB: 0.1, // (max file size in MB)
                    maxWidthOrHeight: 200, // compressed file has width or height maximum 1920px
                    useWebWorker: true,
                };
    
                // Comprime la imagen
                const compressedFile = await imageCompression(file, options);
    
                // Lee el archivo comprimido
                const reader = new FileReader();
                reader.onloadend = async () => {
                    // Extrae los datos de la URL de los datos
                    const fileData = reader.result.split(',')[1];
    
                    const dataAvatar = {
                        usuAno,
                        usuCod,
                        usuAva: fileData,
                    };
    
                    console.log(dataAvatar);
    
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/update-avatar`, {
                        method: 'POST',
                        body: JSON.stringify(dataAvatar),
                        headers: { 'Content-Type': 'application/json' },
                    });
    
                    const data = await response.json();
    
                    if (!response.ok) {
                        Notiflix.Notify.failure(data.message);
                        console.log(data)
                        return;
                    }
    
                    Notiflix.Notify.success(data.message);
                    setUserLogged(data.user);
                    setSelectedFile(null);
                    setIsUpload(false);
                };
                reader.readAsDataURL(compressedFile);
            }
    
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    
    

    return (
        <div className={`PowerMas_Modal ${openModal ? 'show' : ''}`}
            style={{zIndex: '999'}}
        >
            <div 
                className="PowerMas_Modal_Content Large_4 Mediium_6 Phone_10"
                style={{
                    height: '90%'
                }}
            >
                <header className='PowerMas_Modal_Header p_5'>
                    <h1 className='Large-f2 Medium-f1_75 Small-f1_25'>Editar Perfil</h1>
                    <span 
                        className=" f2" 
                        onClick={closeModalAndReset}
                    >
                        ×
                    </span>
                </header>
                <section className='Large_12 flex ai-center jc-center flex-column flex-grow-1 Large-p1_5 Small-p1 Large-gap-1 Small-gap_5 overflow-auto'>
                    <div className='relative flex ai-center jc-center Large_12'>
                        {
                            isUpload ?
                            <>
                                {
                                    selectedFile ?
                                        <div className='Large_12'>
                                        
                                        <ImageCropper 
                                            imageSrc={URL.createObjectURL(selectedFile)} 
                                            setCropper={setCropper}
                                        />
                                        <div className='Phone_12 flex ai-center jc-center gap_5 p_25'>
                                            <button className='PowerMas_Buttom_Secondary Large_3 p_25' onClick={() => setSelectedFile(null)}>
                                                Cancelar
                                            </button>
                                            <button className='PowerMas_Buttom_Primary Large_3 p_25' onClick={handleSubmitImage}>
                                                Guardar
                                            </button>
                                        </div>
                                        </div>
                                    :
                                    <>
                                        <div
                                            className="PowerMas_Input_Upload center Large-p2 Small-p1 pointer"
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
                                                accept=".jpg,.jpeg"
                                            />
                                            <img src={masculino}  className="Large_4 Phone_4" />
                                            {
                                                dragging ?
                                                <p className='f_75'>Suelta el archivo aquí</p>
                                                :
                                                <>
                                                    {
                                                        !selectedFile ?
                                                        <p className='f_75'>Arrastra el documento o solo da click para abrir tu escritorio y escoger el documento.</p>
                                                        :
                                                        <p>Archivo seleccionado: {selectedFile.name}</p>
                                                    }
                                                </>
                                            }
                                            
                                        </div>
                                        <span 
                                            className="PowerMas_Buttom_Close Large-f1_5 bold"
                                            style={{color: '#F87C56', zIndex: '2'}}
                                            onClick={() => setIsUpload(false)}
                                        >
                                            x
                                        </span>
                                    </>
                                }
                            </>
                            :
                            <div 
                                className="PowerMas_Image_Profile"
                                style={{
                                    height: '8rem',
                                    width: '8rem'
                                }}
                                onMouseEnter={() => setIsIconVisible(true)} 
                                onMouseLeave={() => setIsIconVisible(false)}
                            >
                                <img src={userLogged && (userLogged.usuAva ? `data:image/jpeg;base64,${userLogged.usuAva}` : (userLogged.usuSex == 'M' ? masculino : femenino ))} alt="Descripción de la imagen" />
                                {isIconVisible && (
                                    <span className="overlay" onClick={() => setIsUpload(true)}>
                                        <Edit />
                                    </span>
                                )}
                            </div>
                        }
                    </div>
                    <div className='PowerMas_Form_Content Phone_12 Medium-p1 Small-p_25 Small-gap_25 flex flex-column flex-grow-1 overflow-auto'>
                        <h2 className="f1_25 Phone_12"> Datos Personales: </h2>
                        <div className="flex flex-column Large_12">
                            <label className='' htmlFor="docIdeCod">Documento de identidad</label>
                            <select 
                                id="docIdeCod" 
                                className={`PowerMas_Modal_Form_${dirtyFields.docIdeCod || isSubmitted ? (errors.docIdeCod ? 'invalid' : 'valid') : ''}`} 
                                {...register('docIdeCod', { 
                                    validate: value => value !== '0' || 'El campo es requerido.' 
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
                                <p className="f_75 PowerMas_Message_Invalid">{errors.docIdeCod.message}</p>
                            ) : (
                                <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="usuNumDoc">Número documento</label>
                            <input
                                id="usuNumDoc"
                                className={`PowerMas_Modal_Form_${dirtyFields.usuNumDoc || isSubmitted ? (errors.usuNumDoc ? 'invalid' : 'valid') : ''}`} 
                                type="text" 
                                placeholder="Ejm: 42644154"
                                autoComplete='off'
                                {...register('usuNumDoc', { required: 'El campo es requerido.' })} 
                            />
                            {errors.usuNumDoc ? (
                                <p className="f_75 PowerMas_Message_Invalid">{errors.usuNumDoc.message}</p>
                            ) : (
                                <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_12 flex flex-column">
                                <label htmlFor="usuNom">Nombre</label>
                                <input type="text"
                                    id="usuNom"
                                    className={`PowerMas_Modal_Form_${dirtyFields.usuNom || isSubmitted ? (errors.usuNom ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: Enzo Fabricio"
                                    autoComplete='off'
                                    {...register('usuNom', { 
                                        required: 'El campo es requerido',
                                        minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                    })} 
                                />
                                {errors.usuNom ? (
                                    <p className="f_75 PowerMas_Message_Invalid">{errors.usuNom.message}</p>
                                ) : (
                                    <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="Large_12 flex flex-column">
                                <label htmlFor="usuApe">Apellido</label>
                                <input 
                                    type="text" 
                                    id="usuApe"
                                    className={`PowerMas_Modal_Form_${dirtyFields.usuApe || isSubmitted ? (errors.usuApe ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: Gago Aguirre"
                                    autoComplete='off'
                                    {...register('usuApe', { 
                                        required: 'El campo es requerido',
                                            minLength: { value: 3, message: 'El apellido debe tener minimo 3 digitos' },
                                    })} 
                                />
                                {errors.usuApe ? (
                                    <p className="f_75 PowerMas_Message_Invalid">{errors.usuApe.message}</p>
                                ) : (
                                    <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className='Large_12 flex flex-column'>
                                <label htmlFor="phone" className="block">
                                    Telefono:
                                </label>
                                <div>
                                    <input
                                        ref={phoneInputRef}
                                        type="tel"
                                        className={`Phone_12 PowerMas_Modal_Form_${isTouched ? (!isValid ? 'invalid' : 'valid') : ''}`}
                                        style={{
                                            paddingRight: '6px',
                                            margin: 0,
                                        }}
                                    />
                                </div>
                                {!isValid ? (
                                    <p className="f_75 PowerMas_Message_Invalid">{errorMessage}</p>
                                ) : (
                                    <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="Large_12 flex flex-column">
                                <label htmlFor="usuFecNac">Fecha de nacimiento</label>
                                    <input 
                                        type="text" 
                                        id="usuFecNac"
                                        className={`PowerMas_Modal_Form_${dirtyFields.usuFecNac || isSubmitted ? (errors.usuFecNac ? 'invalid' : 'valid') : ''}`} 
                                        placeholder="Ejm: 17-03-2003 (DD-MM-YYYY)"
                                        autoComplete='off'
                                        maxLength={10}
                                        onInput={(event) => {
                                            // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                                            event.target.value = event.target.value.replace(/[^0-9]/g, '');

                                            // Remueve cualquier guión existente
                                            let cleanFecha = event.target.value.replace(/-/g, '');

                                            // Inserta los guiones después del día y el mes
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
                                            event.target.value = cleanFecha;
                                        }}
                                        {...register('usuFecNac', { 
                                            required: 'El campo es requerido',
                                            pattern: {
                                                value: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/,
                                                message: 'La fecha debe estar en el formato DD-MM-YYYY',
                                            },
                                        })} 
                                    />
                                    {errors.usuFecNac ? (
                                        <p className="f_75 PowerMas_Message_Invalid">{errors.usuFecNac.message}</p>
                                    ) : (
                                        <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                            </div>
                            <div className="flex flex-column">
                                <label htmlFor="carCod">Cargo</label>
                                <select 
                                    id="carCod" 
                                    className={` PowerMas_Modal_Form_${dirtyFields.carCod || isSubmitted ? (errors.carCod ? 'invalid' : 'valid') : ''}`} 
                                    {...register('carCod', { 
                                        validate: value => value !== '0' || 'El campo es requerido.' 
                                    })}
                                >
                                    <option value="0">--SELECCIONE UN DOCUMENTO--</option>
                                    {cargos.map(item => (
                                        <option 
                                            key={item.carCod} 
                                            value={item.carCod}
                                        > 
                                           {item.carNom}
                                        </option>
                                    ))}
                                </select>
                                {errors.carCod ? (
                                    <p className="f_75 PowerMas_Message_Invalid">{errors.carCod.message}</p>
                                ) : (
                                    <p className="f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                    </div>
                </section>
                <footer className="PowerMas_Buttoms_Form_Beneficiarie Large-p1 Small-p_5 Large-gap-1 Small-gap-1 flex ai-center jc-center">
                    <button onClick={closeModalAndReset} className="Large-p_5 Small-p_5 Large_5 Small_4 PowerMas_Buttom_Secondary">Cerrar</button>
                    <button onClick={handleNext} className="Large-p_5 Small-p_5 Large_5 Small_4 PowerMas_Buttom_Primary">Grabar</button>
                </footer>
            </div>
        </div>
    )
}

export default ModalProfile