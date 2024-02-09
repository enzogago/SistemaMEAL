import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import { handleSubmit } from './eventHandlers';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import Bar from "./Bar";

const FormUser = () => {
    const navigate = useNavigate();
    
    const { id: safeCiphertext } = useParams();
    let id = '';
    if (safeCiphertext) {
        const ciphertext = atob(safeCiphertext);
        // Desencripta el ID
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        id = bytes.toString(CryptoJS.enc.Utf8);
    }
    const isEditing = id && id.length >= 5;

    var usuAno;
    var usuCod;
    if (isEditing) {
        usuAno = id.slice(0, 4);
        usuCod = id.slice(4);
    }

    const [ documentos, setDocumentos ] = useState([]);
    const [ roles, setRoles ] = useState([]);
    const [ cargos, setCargos ] = useState([]);
    const [initialValues, setInitialValues] = useState(null);


    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue } = 
    useForm({ mode: "onChange", defaultValues: {
        usuSex: 'M',
        usuEst: 'A',
    } });

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
            const fetchCargos = async () => {
                try {
                    Notiflix.Loading.pulse('Cargando...');
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Cargo`, {
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
                    setCargos(data);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    Notiflix.Loading.remove();
                }
            };
    
            const fetchRoles = async () => {
                try {
                    Notiflix.Loading.pulse('Cargando...');
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Rol`, {
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
                    setRoles(data);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    Notiflix.Loading.remove();
                }
            };
    
            fetchCargos();
            fetchRoles();
            fetchDocumentos();
        }

        const fetchUsuarios = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario/${usuAno}/${usuCod}`, {
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
                fetchUsuarios();
            }
        });
        
    }, []);
    
    const handleNext = () => {
        validateForm((data) => {
            const hasChanged = Object.keys(data).some(key => data[key] !== initialValues[key]);
            if (hasChanged) {
                handleSubmit(data, isEditing, navigate, safeCiphertext);
            } else {
                Notiflix.Notify.info("No se realizaron cambios");
                navigate(`/menu-user/${safeCiphertext}`);
            }
        })();
    }
    
    return (
        <div className="bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p2">
                {/* <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/user')} /> */}
                <h1 className="flex-grow-1">{isEditing ? 'Editar' : 'Nuevo'} Usuario</h1>
                <Bar isEditing={isEditing} currentStep={1} />
            </div>
            <div className="flex-grow-1 overflow-auto p1_25">
                <div className="">
                    <h2>Datos Personales </h2>
                    <br />
                    <div className="PowerMas_Form_User_Card flex flex-wrap p1">
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="docIdeCod">Documento Identidad</label>
                            <select 
                                id="docIdeCod" 
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.docIdeCod || isSubmitted ? (errors.docIdeCod ? 'invalid' : 'valid') : ''}`} 
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
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="usuNumDoc">Número documento</label>
                            <input
                                id="usuNumDoc"
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.usuNumDoc || isSubmitted ? (errors.usuNumDoc ? 'invalid' : 'valid') : ''}`} 
                                type="text" 
                                placeholder="Ejm: 922917351"
                                {...register('usuNumDoc', { required: 'El número de documento es requerido' })} 
                            />
                            {errors.usuNumDoc ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuNumDoc.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="usuNom">Nombre</label>
                            <input type="text"
                                id="usuNom"
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.usuNom || isSubmitted ? (errors.usuNom ? 'invalid' : 'valid') : ''}`} 
                                placeholder="Ejm: Andres"
                                {...register('usuNom', { 
                                    required: 'El nombre es requerido',
                                    minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                                })} 
                            />
                             {errors.usuNom ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuNom.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="usuApe">Apellido</label>
                            <input 
                                type="text" 
                                id="usuApe"
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.usuApe || isSubmitted ? (errors.usuApe ? 'invalid' : 'valid') : ''}`} 
                                placeholder="Ejm: Eras"
                                {...register('usuApe', { 
                                    required: 'El apellido es requerido',
                                        minLength: { value: 3, message: 'El apellido debe tener minimo 3 digitos' },
                                })} 
                            />
                             {errors.usuApe ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuApe.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="usuTel">Teléfono</label>
                            <input 
                                type="text" 
                                id="usuTel" 
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.usuTel || isSubmitted ? (errors.usuTel ? 'invalid' : 'valid') : ''}`} 
                                placeholder="Ejm: 922917351"
                                {...register('usuTel', { 
                                    required: 'El número de telefono es requerido',
                                    minLength: { value: 9, message: 'El número de telefono debe tener minimo 9 digitos' },
                                })} 
                            />
                            {errors.usuTel ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuTel.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="usuFecNac">Fecha de nacimiento</label>
                                <input 
                                    type="text" 
                                    id="usuFecNac" 
                                    className={`p1 PowerMas_Modal_Form_${dirtyFields.usuFecNac || isSubmitted ? (errors.usuFecNac ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: 2023-03-17"
                                    {...register('usuFecNac', { 
                                        required: 'La Fecha de nacimiento es requerido',
                                        pattern: {
                                            value: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                                            message: 'La fecha debe estar en el formato YYYY-MM-DD',
                                        },
                                    })} 
                                />
                                {errors.usuFecNac ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuFecNac.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
                <hr className="PowerMas_Hr" />
                <div className="">
                    <h2>Datos Profesionales </h2>
                    <br />
                    <div className="PowerMas_Form_User_Card p1 flex flex-wrap">
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="usuCorEle">Email</label>
                            <input 
                                type="text" 
                                id="usuCorEle" 
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.usuCorEle || isSubmitted ? (errors.usuCorEle ? 'invalid' : 'valid') : ''}`} 
                                placeholder="Ejm: correo@correo.es"
                                {...register('usuCorEle', { 
                                    required: 'El Email es requerido',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'Dirección de correo electrónico inválida',
                                    },
                                })} 
                            />
                             {errors.usuCorEle ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuCorEle.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        {
                            !isEditing &&
                            (
                                <div className="Large_6 flex flex-column p1">
                                    <label htmlFor="usuPas">Contraseña</label>
                                    <input 
                                        type="password" 
                                        id="usuPas" 
                                        className={`p1 PowerMas_Modal_Form_${dirtyFields.usuPas || isSubmitted ? (errors.usuPas ? 'invalid' : 'valid') : ''}`} 
                                        placeholder="Ejm: 12345678"
                                        {...register('usuPas', { 
                                            required: 'La contraseña es requerido',
                                            minLength: { value: 8, message: 'La contraseña debe tener minimo 8 digitos' },
                                        })} 
                                    />
                                     {errors.usuPas ? (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.usuPas.message}</p>
                                    ) : (
                                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                        </p>
                                    )}
                                </div>
                            )
                        }
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="rolCod">Rol</label>
                            <select 
                                id="rolCod"
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.rolCod || isSubmitted ? (errors.rolCod ? 'invalid' : 'valid') : ''}`}
                                {...register('rolCod', { 
                                    validate: value => value !== '0' || 'El rol es requerido' 
                                })}
                            >
                                <option value="0">--SELECCIONE UN ROL--</option>
                                {roles.map(rol => (
                                    <option key={rol.rolCod} value={rol.rolCod}>{rol.rolNom}</option>
                                ))}
                            </select>
                            {errors.rolCod ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.rolCod.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="carCod">Cargo</label>
                            <select 
                                id="carCod" 
                                className={`p1 PowerMas_Modal_Form_${dirtyFields.carCod || isSubmitted ? (errors.carCod ? 'invalid' : 'valid') : ''}`}
                                {...register('carCod', { 
                                    validate: value => value !== '0' || 'El cargo es requerido' 
                                })}
                            >
                                <option value="0">--SELECCIONE UN CARGO--</option>
                                {cargos.map(cargo => (
                                    <option key={cargo.carCod} value={cargo.carCod}>{cargo.carNom}</option>
                                ))}
                            </select>
                            {errors.carCod ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.carCod.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="">Sexo</label>
                            <div className="flex gap-1">
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="masculino" 
                                        name="usuSex" 
                                        value="M" 
                                        {...register('usuSex')}
                                    />
                                    <label htmlFor="masculino">Masculino</label>
                                </div>
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="femenino" 
                                        name="usuSex" 
                                        value="F" 
                                        {...register('usuSex')}
                                    />
                                    <label htmlFor="femenino">Femenino</label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="Large_6 flex flex-column p1">
                            <label htmlFor="">Estado</label>
                            <div className="flex gap-1">
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="activo" 
                                        name="usuEst" 
                                        value="A"
                                        {...register('usuEst')}
                                    />
                                    <label htmlFor="activo">Activo</label>
                                </div>
                                <div className="flex gap_5">
                                    <input 
                                        type="radio" 
                                        id="inactivo" 
                                        name="usuEst" 
                                        value="I"
                                        {...register('usuEst')}
                                    />
                                    <label htmlFor="inactivo">Inactivo</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/user')} className="Large_5 m2">Atras</button>
                <button onClick={handleNext} className="Large_5 m2">Siguiente</button>
            </div>
        </div>
  )
}

export default FormUser