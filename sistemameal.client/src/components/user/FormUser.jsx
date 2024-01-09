import Notiflix from "notiflix";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { handleSubmit } from './eventHandlers';
import { useForm } from 'react-hook-form';

const FormUser = () => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo, authActions } = useContext(AuthContext);
    const { userMaint } = authInfo;
    const { setUsers, setIsLoggedIn, setUserMaint } = authActions;

    
   
    const isEditing = userMaint && Object.keys(userMaint).length > 0;

    const initialFormValues = {
        usuAno: '',
        usuCod: '',
        docIdeCod: '0',
        usuNumDoc: '',
        usuCorEle: '',
        usuNom: '',
        usuApe: '',
        usuTel: '',
        rolCod: '0',
        carCod: '0',
        usuEst: 'A',
        usuFecNac: '',
        usuSex: 'M',
        usuFecInc: '',
        usuNomUsu: '',
        usuPas: ''
    };
    

    const [ documentos, setDocumentos ] = useState([]);
    const [ roles, setRoles ] = useState([]);
    const [ cargos, setCargos ] = useState([]);

    const { register, handleSubmit: validateForm, formState: {errors}, reset, setValue, trigger, watch   } = useForm();
    const formValues = watch();
    
    useEffect(() => {
        if (isEditing) {
            reset(userMaint);
        } else {
            reset(initialFormValues);
        }
    }, [isEditing, userMaint, reset]);
    

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
    }, []);

    

    const handleChange = (event) => {
        setValue(event.target.name, event.target.value);
    };

    const handleNext = async (event) => {
        event.preventDefault();
    
        // Activa la validación del formulario
        const result = await trigger();
    
        // Verifica si el formulario es válido
        if (!result) {
            // Muestra un mensaje de error y detiene la ejecución de la función
            Notiflix.Notify.failure('Por favor, corrige los errores en el formulario.');
            return;
        }
    
        // Si el formulario es válido, procede con el envío del formulario
        await handleSubmit(event, userMaint, watch(), setUsers, setIsLoggedIn, setUserMaint);
        
        navigate('/menu-user');
    };
    
    

  return (
    <div className="PowerMas_FormUserContainer h-100 bg-white Large-p2_5">
        <h1 className="Large-f1_5">
            {isEditing ? 'Editar': 'Nuevo'} Usuario
        </h1>
        <form>
            {
                isEditing &&
                (
                    <>
                        <label>
                            Año:
                            <input type="text" name="usuAno" value={formValues.usuAno} onChange={handleChange} disabled={isEditing} />
                        </label>
                        <label>
                            Código:
                            <input type="text" name="usuCod" value={formValues.usuCod} onChange={handleChange} disabled={isEditing} />
                        </label>
                    </>
                )
            }
            <label>
                Documento de identidad:
                <select 
                    name="docIdeCod" 
                    value={formValues.docIdeCod} 
                    onChange={handleChange}
                    {...register('docIdeCod', { 
                        validate: value => value !== '0' || 'El documento de identidad es requerido' 
                    })}
                >
                    <option value="0">--SELECCIONE UN DOCUMENTO--</option>
                    {documentos.map(documento => (
                        <option 
                        key={documento.docIdeCod} 
                        value={documento.docIdeCod}> ({documento.docIdeAbr}) {documento.docIdeNom}</option>
                    ))}
                </select>
                {errors.docIdeCod && <p className='errorInput Large-p_5'>{errors.docIdeCod.message}</p>}
            </label>
            <label>
                Número de documento:
                <input 
                type="text" 
                name="usuNumDoc" 
                value={formValues.usuNumDoc} 
                onChange={handleChange}
                placeholder="Ejm: 922917351"
                {...register('usuNumDoc', { required: 'El número de documento es requerido' })} />
                {errors.usuNumDoc && <p className='errorInput Large-p_5'>{errors.usuNumDoc.message}</p>}
            </label>
            <label>
                Correo electrónico:
                <input 
                type="text" 
                name="usuCorEle" 
                value={formValues.usuCorEle} 
                onChange={handleChange} 
                placeholder="Ejm: correo@correo.es"
                {...register('usuCorEle', { 
                    required: 'El correo electronico es requerido',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Dirección de correo electrónico inválida',
                    },
                })} 
                />
                {errors.usuCorEle && <p className='errorInput Large-p_5'>{errors.usuCorEle.message}</p>}
            </label>
            {
                !isEditing &&
                (
                    <label>
                        Contraseña:
                        <input 
                        type="password" 
                        name="usuPas" 
                        value={formValues.usuPas} 
                        onChange={handleChange} 
                        placeholder="Ejm: 12345678"
                        {...register('usuPas', { 
                            required: 'La contraseña es requerido',
                            minLength: { value: 8, message: 'La contraseña debe tener minimo 8 digitos' },
                        })} 
                        />
                        {errors.usuPas && <p className='errorInput Large-p_5'>{errors.usuPas.message}</p>}
                    </label>
                )
            }
            <label>
                Nombres:
                <input type="text" 
                    name="usuNom" 
                    value={formValues.usuNom} 
                    onChange={handleChange}
                    placeholder="Ejm: Andres"
                    {...register('usuNom', { 
                        required: 'El nombre es requerido',
                        minLength: { value: 3, message: 'El nombre debe tener minimo 3 digitos' },
                    })} 
                />
                {errors.usuNom && <p className='errorInput Large-p_5'>{errors.usuNom.message}</p>}
            </label>
            <label>
                Apellidos:
                <input 
                    type="text" 
                    name="usuApe" 
                    value={formValues.usuApe} 
                    onChange={handleChange}
                    placeholder="Ejm: Eras"
                    {...register('usuApe', { 
                        required: 'El apellido es requerido',
                            minLength: { value: 3, message: 'El apellido debe tener minimo 3 digitos' },
                    })} 
                />
                {errors.usuApe && <p className='errorInput Large-p_5'>{errors.usuApe.message}</p>}
            </label>
            <label>
                Telefono:
                <input 
                    type="text" 
                    name="usuTel" 
                    value={formValues.usuTel} 
                    onChange={handleChange}
                    placeholder="Ejm: 922917351"
                    {...register('usuTel', { 
                        required: 'El número de telefono es requerido',
                        minLength: { value: 9, message: 'El número de telefono debe tener minimo 9 digitos' },
                    })} 
                />
                {errors.usuTel && <p className='errorInput Large-p_5'>{errors.usuTel.message}</p>}
            </label>
            <label>
                Rol:
                <select 
                    name="rolCod" 
                    value={formValues.rolCod} 
                    onChange={handleChange}
                    {...register('rolCod', { 
                        validate: value => value !== '0' || 'El rol es requerido' 
                    })}
                >
                    <option value="0">--SELECCIONE UN ROL--</option>
                    {roles.map(rol => (
                        <option key={rol.rolCod} value={rol.rolCod}>{rol.rolNom}</option>
                    ))}
                </select>
                {errors.rolCod && <p className='errorInput Large-p_5'>{errors.rolCod.message}</p>}
            </label>
            <label>
                Cargo:
                <select 
                    name="carCod" 
                    value={formValues.carCod} 
                    onChange={handleChange}
                    {...register('carCod', { 
                        validate: value => value !== '0' || 'El cargo es requerido' 
                    })}
                >
                    <option value="0">--SELECCIONE UN CARGO--</option>
                    {cargos.map(cargo => (
                        <option key={cargo.carCod} value={cargo.carCod}>{cargo.carNom}</option>
                    ))}
                </select>
                {errors.carCod && <p className='errorInput Large-p_5'>{errors.carCod.message}</p>}
            </label>
            <label>
                Fecha de nacimiento:
                <input 
                    type="text" 
                    name="usuFecNac" 
                    value={formValues.usuFecNac} 
                    onChange={handleChange}
                    placeholder="Ejm: 2023-03-17"
                    {...register('usuFecNac', { 
                        required: 'La Fecha de nacimiento es requerido',
                        pattern: {
                            value: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                            message: 'La fecha debe estar en el formato YYYY-MM-DD',
                          },
                    })} 
                />
                {errors.usuFecNac && <p className='errorInput Large-p_5'>{errors.usuFecNac.message}</p>}
            </label>
            <div className="PowerMasInputSex">
                Sexo:
                <div >
                    <div>
                        <input type="radio" id="masculino" name="usuSex" value="M" checked={formValues.usuSex === "M"} onChange={handleChange} />
                        <label htmlFor="masculino">Masculino</label>
                    </div>
                    <div>
                        <input type="radio" id="femenino" name="usuSex" value="F" checked={formValues.usuSex === "F"} onChange={handleChange} />
                        <label htmlFor="femenino">Femenino</label>
                    </div>
                </div>
            </div>
            <div className="PowerMasInputSex">
                Estado:
                <div >
                    <div>
                        <input 
                            type="radio" 
                            id="activo" 
                            name="usuEst" 
                            value="A" 
                            checked={formValues.usuEst === "A"} 
                            onChange={handleChange} 
                        />
                        <label htmlFor="activo">Activo</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            id="inactivo" 
                            name="usuEst" 
                            value="I" 
                            checked={formValues.usuEst === "I"} 
                            onChange={handleChange} 
                        />
                        <label htmlFor="inactivo">Inactivo</label>
                    </div>
                </div>
            </div>
        </form>
        <button onClick={handleNext}> Siguiente </button>
    </div>
  )
}

export default FormUser