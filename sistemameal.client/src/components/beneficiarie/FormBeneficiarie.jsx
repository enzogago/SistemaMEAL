import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import { handleSubmit } from './eventHandlers';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";
import { fetchData } from "../reusable/helper";

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
    const isEditing = id && id.length === 10;
    var benAno;
    var benCod;
    if (isEditing) {
        benAno = id.slice(0, 4);
        benCod = id.slice(4);
    }

    const [ documentos, setDocumentos ] = useState([]);
    const [ generos, setGeneros ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ esMenorDeEdad, setEsMenorDeEdad ] = useState(false);

    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = useForm({ mode: "onChange", defaultValues: { benNomApo: '', benApeApo: ''}});

    useEffect(() => {
        const fetchOptions = async () => {
            fetchData('DocumentoIdentidad',setDocumentos);
            fetchData('Genero',setGeneros);
            fetchData('Nacionalidad',setNacionalidades);
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

    // Efecto para la concatenación automatica en la separacion de día mes y año
    useEffect(() => {
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
    }, [fechaNacimiento]);

    // Efecto para la verificación si el beneficiario es menor de edad y así habilitar
    // Los campos de "Datos de Autorización"
    useEffect(() => {
        if (fechaNacimiento) {
            const generarContrasena = async () => {
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
            generarContrasena();
        }
    }, [fechaNacimiento]);
    
    const handleNext = () => {
        validateForm((data) => {
            const { docIdeCod, docIdeBenNum } = data;
            const benCodUni = data.docIdeBenNum;
            let payload = {
                Beneficiario: { ...data, benCodUni: docIdeBenNum },
                DocumentoBeneficiario: {
                    docIdeCod,
                    docIdeBenNum
                }
            }

            if (isEditing) {
                handleSubmit(isEditing ,data);
            } else {
                handleSubmit(isEditing ,payload);
            }
        })();
    }

    const handleSubmit = async (isEditing ,data) => {
        console.log(isEditing);
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const method = isEditing ? 'PUT' : 'POST';
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(responseData.message);
                return;
            }

            Notiflix.Notify.success(responseData.message);
            reset();
            navigate('/beneficiarie');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/beneficiarie')} />
                <h1 className="flex-grow-1 f1_75">{isEditing ? 'Editar' : 'Nuevo'} Beneficiario</h1>
            </div>
            <div className="flex flex-grow-1 overflow-auto p1 gap-1">
                <div className="Large_6">
                    <div className="PowerMas_Form_Card ">
                        <h2 className="f1_25">Datos Personales </h2>
                        <div className="p1">
                            {
                                !isEditing &&
                                <>
                                    <label htmlFor="docIdeCod" className="">
                                        Tipo de documento:
                                    </label>
                                    <select 
                                        id="docIdeCod" 
                                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.docIdeCod || isSubmitted ? (errors.docIdeCod ? 'invalid' : 'valid') : ''}`} 
                                        {...register('docIdeCod', { 
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
                                    {errors.docIdeCod ? (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.docIdeCod.message}</p>
                                    ) : (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                                    <label htmlFor="docIdeBenNum" className="">
                                        Numero de documento:
                                    </label>
                                    <input
                                        id="docIdeBenNum"
                                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.docIdeBenNum || isSubmitted ? (errors.docIdeBenNum ? 'invalid' : 'valid') : ''}`} 
                                        type="text" 
                                        placeholder="74301932"
                                        autoComplete="disabled"
                                        maxLength={10}
                                        onKeyDown={(event) => {
                                            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                                event.preventDefault();
                                            }
                                        }}
                                        {...register('docIdeBenNum', { 
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
                                    {errors.docIdeBenNum ? (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.docIdeBenNum.message}</p>
                                    ) : (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                                </>
                            }
                            
                            <label htmlFor="benNom" className="">
                                Nombre
                            </label>
                            <input type="text"
                                id="benNom"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNom || isSubmitted ? (errors.benNom ? 'invalid' : 'valid') : ''}`} 
                                placeholder="Enzo Fabricio"
                                autoComplete="disabled"
                                maxLength={50}
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
                    </div>
                </div>
                <div className="Large_6">
                    <div className="PowerMas_Form_Card">
                        <label htmlFor="nacCod" className="">
                            Nacionalidad:
                        </label>
                        <select 
                            id="nacCod" 
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.nacCod || isSubmitted ? (errors.nacCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('nacCod', { 
                                validate: value => value !== '0' || 'El género de identidad es requerido' 
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
                        <label htmlFor="benFecNac" className="">
                            Fecha de nacimiento:
                        </label>
                        <input 
                            type="text" 
                            id="benFecNac"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benFecNac || isSubmitted ? (errors.benFecNac ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Ejm: 17-03-2003 (DD-MM-YYYY)"
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
                        {
                            esMenorDeEdad &&
                            <>
                                <h2 className="f1_25">Datos de Autorización</h2>
                                <p className="f_75 m_5 p_25" style={{border: '2px dashed black'}}>Si el beneficiario es menor de edad se deben introducir los datos de la persona que autoriza el uso de su información.</p>
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
                            </>
                        }
                    </div>
                </div>
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/beneficiarie')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={handleNext} className="Large_3 m_75 PowerMas_Buttom_Primary">Siguiente</button>
            </footer>
        </>
    )
}

export default FormBeneficiarie