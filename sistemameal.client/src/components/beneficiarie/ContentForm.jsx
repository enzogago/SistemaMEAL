import React, { useEffect, useState } from 'react'
import { fetchData } from '../reusable/helper';
import Notiflix from 'notiflix';

const ContentForm = ({register, dirtyFields, isSubmitted, errors, reset, watch, trigger, setValue, isEditing, benAno, benCod}) => {

    const [ generos, setGeneros ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ esMenorDeEdad, setEsMenorDeEdad ] = useState(false);
    const [ edadView, setEdadView ] = useState('');

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
                    setEdadView(edad);
                } else{
                    setEsMenorDeEdad(false);
                    setValue('benNomApo', '');
                    setValue('benApeApo', '');
                    setEdadView('');
                }
            };
            generarCamposApoderado();
        }
    }, [fechaNacimiento]);

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
            reset(newData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    useEffect(() => {
        if (isDataLoaded) {
            fetchBeneficiario();
        }
    }, [isDataLoaded]);
    useEffect(() => {
        Promise.all([
            fetchData('Genero', setGeneros),
            fetchData('Nacionalidad', setNacionalidades),
        ]).then(() => setIsDataLoaded(true));
    }, []);

    return (
        <div className="flex flex-grow-1 overflow-auto p1 gap-1">
            <div className="Large_6">
                <div className="PowerMas_Form_Card ">
                    <h2 className="f1_25">Datos Personales </h2>
                    <div className="p1">
                        <label htmlFor="si" className="">
                            Autoriza el uso de datos:
                        </label>
                        <div className="flex gap-1">
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="si" 
                                    name="benAut" 
                                    value="s" 
                                    {...register('benAut', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label htmlFor="si">Si</label>
                            </div>
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="no" 
                                    name="benAut" 
                                    value="n" 
                                    {...register('benAut', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                        {errors.benAut ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.benAut.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                        <label htmlFor="benNom" className="">
                            Nombre
                        </label>
                        <input type="text"
                            id="benNom"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benNom || isSubmitted ? (errors.benNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Enzo Fabricio"
                            autoComplete='off'
                            maxLength={50}
                            style={{textTransform: 'capitalize'}}
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
                            style={{textTransform: 'capitalize'}}
                            autoComplete='off'
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
                                    value="m" 
                                    {...register('benSex', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label htmlFor="masculino">Masculino</label>
                            </div>
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="femenino" 
                                    name="benSex" 
                                    value="f" 
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
                            style={{textTransform: 'capitalize'}}
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
                        <div className='flex gap-1'>
                            <div className='Large_6'>
                                <label htmlFor="benFecNac" className="">
                                    Fecha de nacimiento:
                                </label>
                                <input 
                                    type="text" 
                                    id="benFecNac"
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benFecNac || isSubmitted ? (errors.benFecNac ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Ejm: 17-03-2003 (DD-MM-YYYY)"
                                    autoComplete='off'
                                    maxLength={10}
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
                            <div className='Large_6'>
                                <label htmlFor='edad' className="">
                                    Edad:
                                </label>
                                <input 
                                    type="text" 
                                    id="edad"
                                    className='block Phone_12'
                                    placeholder="Edad"
                                    autoComplete='off'
                                    disabled={true}
                                    value={edadView}
                                />
                            </div>
                        </div>
                        <label htmlFor="benDir" className="">
                                Dirección
                        </label>
                        <input 
                            type="text" 
                            id="benDir"
                            style={{textTransform: 'capitalize'}}
                            autoComplete='off'
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benDir || isSubmitted ? (errors.benDir ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Dirección del beneficiario"
                            {...register('benDir', { 
                                required: 'El apellido es requerido',
                                    minLength: { value: 3, message: 'El apellido debe tener minimo 3 digitos' },
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
            </div>
            <div className="Large_6">
                <div className="PowerMas_Form_Card">
                    <label htmlFor="nacCod" className="">
                        Nacionalidad:
                    </label>
                    <select 
                        id="nacCod" 
                        style={{textTransform: 'capitalize'}}
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
                    <label htmlFor="benCorEle" className="">
                        Email
                    </label>
                    <input 
                        type="text" 
                        id="benCorEle"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benCorEle || isSubmitted ? (errors.benCorEle ? 'invalid' : 'valid') : ''}`} 
                        placeholder="correo@correo.com"
                        autoComplete='off'
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
                        autoComplete='off'
                        maxLength={10}
                        onInput={(event) => {
                            // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
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
                    <label htmlFor="benTelCon" className="">
                        Telefono de contacto
                    </label>
                    <input 
                        type="text" 
                        id="benTelCon"
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.benTelCon || isSubmitted ? (errors.benTelCon ? 'invalid' : 'valid') : ''}`} 
                        placeholder="907078329"
                        autoComplete='off'
                        maxLength={10}
                        onInput={(event) => {
                            // Reemplaza cualquier carácter que no sea un número por una cadena vacía
                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
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
                                autoComplete='off'
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
                                autoComplete='off'
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
    )
}

export default ContentForm