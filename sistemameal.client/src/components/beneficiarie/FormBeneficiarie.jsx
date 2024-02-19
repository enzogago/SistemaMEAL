import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import { handleSubmit } from './eventHandlers';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";

const FormBeneficiarie = () => {
    const navigate = useNavigate();
    
    const { id: safeCiphertext } = useParams();
    let id = '';
    if (safeCiphertext) {
        const ciphertext = atob(safeCiphertext);
        // Desencripta el ID
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        id = bytes.toString(CryptoJS.enc.Utf8);
    }
    const isEditing = id && id.length >= 10;

    var benAno;
    var benCod;
    if (isEditing) {
        benAno = id.slice(0, 4);
        benCod = id.slice(4);
    }

    const [ documentos, setDocumentos ] = useState([]);
    const [ generos, setGeneros ] = useState([]);
    const [ esMenorDeEdad, setEsMenorDeEdad ] = useState(false);
    const [ mostrarAgregarDocumento, setMostrarAgregarDocumento ] = useState(false);
    const [ initialValues, setInitialValues] = useState(null);


    const { register, watch, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue } = 
    useForm({ mode: "onChange"});

    const { register: register2, watch: watch2, handleSubmit: validateForm2, formState: { errors: errors2,dirtyFields: dirtyFields2, isSubmitted: isSubmitted2  }, reset: reset2, trigger: trigger2 } = useForm({ mode: "onChange"});

    // Actualiza la acción actual antes de enviar el formulario
    const buscarBeneficiarioDocumento = async(data) => {
        const token = localStorage.getItem('token');
        Notiflix.Loading.pulse('Cargando...');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/documento/${data.docIdeCod}/${data.docIdeBenNum}`, {
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
        } catch (error) {
            console.error('Error:', error);
            setMostrarAgregarDocumento(true);
            setAccionActual('agregar')
        } finally {
            Notiflix.Loading.remove();
        }
    };


    useEffect(() => {
        const fetchOptions = async () => {
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
            fetchDocumentos();
        }

        const fetchBeneficiario = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/${benAno}/${benCod}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                reset(data);
                setInitialValues(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        fetchOptions().then(() => {
            if(isEditing){
                fetchBeneficiario();
            }
        });
        
    }, []);

    // Observa los cambios en el campo 'benFecNac'
    const fechaNacimiento = watch('benFecNac');

    useEffect(() => {
        if (fechaNacimiento) {
            // Remueve cualquier guión existente
            let cleanFecha = fechaNacimiento.replace(/-/g, '');
            
            // Inserta los guiones después del año y el mes
            if (cleanFecha.length >= 4) {
                cleanFecha = cleanFecha.slice(0, 4) + '-' + cleanFecha.slice(4);
            }
            if (cleanFecha.length >= 7) {
                cleanFecha = cleanFecha.slice(0, 7) + '-' + cleanFecha.slice(7);
            }
            
            // Si el usuario borra los dígitos de la fecha, también borra los guiones
            if (cleanFecha.length <= 5) {
                cleanFecha = cleanFecha.slice(0, 4);
            }
            if (cleanFecha.length <= 8) {
                cleanFecha = cleanFecha.slice(0, 7);
            }
            
            // Actualiza el valor del campo con los guiones insertados
            setValue('benFecNac', cleanFecha);
        }
    }, [fechaNacimiento]);

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

    const abrirModal = () => {
        setModalIsOpen(true);
    };
    
    const cerrarModal = () => {
        setModalIsOpen(false);
    };
    
    const handleNext = () => {
        validateForm((data) => {
            console.log(data)
            // Submit
        })();
    }

    return (
        <div className="bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center">
                <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/beneficiarie')} />
                <h1 className="flex-grow-1">{isEditing ? 'Editar' : 'Nuevo'} Beneficiario</h1>
            </div>
            <div className="flex-grow-1 overflow-auto p1_25">
                <div className="">
                    <h2>Datos Personales </h2>
                    <br />
                    <div className="PowerMas_Form_User_Card flex flex-wrap p1">
                        <form onSubmit={validateForm2()} className="Large_12 flex flex-wrap">
                            <div className="Large_6 flex flex-column p1">
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
                            <div className="Large_6 flex flex-column p1">
                                <label htmlFor="docIdeBenNum" className="">
                                    Numero de documento:
                                </label>
                                <input
                                    id="docIdeBenNum"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.docIdeBenNum || isSubmitted2 ? (errors2.docIdeBenNum ? 'invalid' : 'valid') : ''}`} 
                                    type="text" 
                                    placeholder="74301932"
                                    autoComplete="disabled"
                                    maxLength={10}
                                    onKeyDown={(event) => {
                                        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                            event.preventDefault();
                                        }
                                    }}
                                    {...register2('docIdeBenNum', { 
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
                                {errors2.docIdeBenNum ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.docIdeBenNum.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="m_75 flex jc-space-between">
                            {
                                mostrarAgregarDocumento ? 
                                    <>
                                        <button type="submit">Agregar documento</button>
                                        <button type="button" onClick={abrirModal}>Ver documentos agregados</button>
                                    </>
                                    :
                                    <button type="submit">Buscar</button>
                            }
                            </div>
                        </form>
                        <div className="Large_6 flex flex-column p1">
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
                        <div className="Large_6 flex flex-column p1">
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
                        <div className="Large_6 flex flex-column p1">
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
                                        {...register('benSex', { required: 'Por favor, selecciona una opción' })}
                                    />
                                    <label htmlFor="masculino">Masculino</label>
                                </div>
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="femenino" 
                                        name="benSex" 
                                        value="F" 
                                        {...register('benSex', { required: 'Por favor, selecciona una opción' })}
                                    />
                                    <label htmlFor="femenino">Femenino</label>
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
                        <div className="Large_6 flex flex-column p1">
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
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="benFecNac" className="">
                                Fecha de nacimiento:
                            </label>
                            <input 
                                type="text" 
                                id="benFecNac"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benFecNac || isSubmitted ? (errors.benFecNac ? 'invalid' : 'valid') : ''}`} 
                                placeholder="2003-03-17"
                                autoComplete="disabled"
                                maxLength={10}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('benFecNac', { 
                                    required: 'La Fecha de nacimiento es requerido',
                                    pattern: {
                                        value: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                                        message: 'Ingrese una fecha valida y en formato YYYY-MM-DD',
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
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="benCorEle" className="">
                                Email
                            </label>
                            <input 
                                type="text" 
                                id="benCorEle"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benCorEle || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                                placeholder="correo@correo.com"
                                autoComplete="disabled"
                                {...register('benCorEle', { 
                                    required: 'El correo es requerida',
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
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="benTel" className="">
                                Numero de telefono
                            </label>
                            <input 
                                type="text" 
                                id="benTel"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benTel || isSubmitted ? (errors.benTel ? 'invalid' : 'valid') : ''}`} 
                                placeholder="907078329"
                                autoComplete="disabled"
                                maxLength={10}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('benTel', { 
                                    required: 'El número de telefono es requerido',
                                    minLength: { value: 9, message: 'El número debe tener minimo 9 digitos' },
                                    maxLength: { value: 10, message: 'El número debe tener minimo 10 digitos' },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'Solo se aceptan numeros'
                                    }
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
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="benTelCon" className="">
                                Telefono de contacto
                            </label>
                            <input 
                                type="text" 
                                id="benTelCon"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benTelCon || isSubmitted ? (errors.benTelCon ? 'invalid' : 'valid') : ''}`} 
                                placeholder="907078329"
                                autoComplete="disabled"
                                maxLength={10}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('benTelCon', { 
                                    required: 'El número de telefono es requerido',
                                    minLength: { value: 9, message: 'El número debe tener minimo 9 digitos' },
                                    maxLength: { value: 10, message: 'El número debe tener minimo 10 digitos' },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'Solo se aceptan numeros'
                                    }
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
                </div>
                    {
                        esMenorDeEdad && 
                        <div className="PowerMas_Form_User_Card p1">
                            <h2>Datos de Autorización</h2>
                            <p className="f_75">Si el beneficiario es menor de edad se deben introducir los datos de la persona que autoriza el uso de su información.</p>
                            <div className="PowerMas_Content_Form_Beneficiarie_Card Large-p_75 flex flex-wrap">
                                <div className="Large_6 flex flex-column p1">
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
                                <div className="Large_6 flex flex-column p1">
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
                        </div>
                    }
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/beneficiarie')} className="PowerMas_Buttom_Secondary Large_3 m_75">Atras</button>
                <button onClick={handleNext} className="PowerMas_Buttom_Primary Large_3 m_75">Siguiente</button>
            </div>
        </div>
    )
}

export default FormBeneficiarie