import Notiflix from "notiflix";
import { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import avatar from '../../img/avatar.jpeg';
import { AuthContext } from "../../context/AuthContext";
import { FaEdit } from "react-icons/fa";

const FormProfile = () => {
    const navigate = useNavigate();
    // Variables state AuthContext
    const { authInfo, authActions } = useContext(AuthContext);
    const { userLogged } = authInfo;
    const { setUserLogged } = authActions;
    
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
    const [isIconVisible, setIsIconVisible] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);




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
    
            fetchCargos();
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
                <h1 className="flex-grow-1">Perfil</h1>
            </div>
            <div className="flex flex-grow-1 overflow-auto p1_25 gap-1">
                <div className="PowerMas_Info_Profile Phone_6">
                    <div className='p_75 flex flex-column jc-center ai-center gap_5'> 
                        <div className="Phone_12 flex jc-center relative">
                            <div className="PowerMas_ProfilePicture2" onMouseEnter={() => setIsIconVisible(true)} onMouseLeave={() => setIsIconVisible(false)}>
                                <img src={avatar} alt="Descripción de la imagen" />
                                {isIconVisible && (
                                    <div className="overlay" onClick={() => setIsMenuVisible(!isMenuVisible)}>
                                        <FaEdit /> {/* Icono de editar */}
                                    </div>
                                )}
                            </div>
                            {isMenuVisible && (
                                <div className="options-menu flex flex-column" >
                                    <button className="p_5" /*onClick={handleDeletePhoto}*/>Eliminar foto</button>
                                    <button className="p_5" /*onClick={handleViewPhoto}*/>Ver foto</button>
                                    <button className="p_5" /*onClick={handleUploadPhoto}*/>Cargar foto</button>
                                </div>
                            )}
                        </div>
                        <p style={{textTransform: 'capitalize'}} className='color-black'>Hola, {userLogged && userLogged.cargo ? `${userLogged.usuNom.toLowerCase()}` : ''}</p>
                    </div>
                </div>
                <div className="Phone_6">
                    <div className="">
                        <h2>Datos Personales </h2>
                        <br />
                        <div className="PowerMas_Form_Card flex flex-wrap p1">
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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
                        <div className="PowerMas_Form_Card p1 flex flex-wrap">
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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
                            <div className="Large_12 flex flex-column p1">
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

export default FormProfile