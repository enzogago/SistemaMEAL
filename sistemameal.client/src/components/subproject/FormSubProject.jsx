import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import { GrFormPreviousLink } from "react-icons/gr";
import { fetchData } from "../reusable/helper";

const FormSubProject = () => {
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

    // Estados locales
    const [ implementadoresEdit, setImplementadoresEdit ] = useState([])
    const [ ubicacionesEdit, setUbicacionesEdit ] = useState([])
    const [ implementadores, setImplementadores ] = useState([])
    const [ selectCount, setSelectCount ] = useState(1);
    const [ locationSelects, setLocationSelects ] = useState([{ count: 1, selects: [] }]);
    const [ paises, setPaises ] = useState([]);
    const [ proyectos, setProyectos ] = useState([]);

    const [selectedLocationValues, setSelectedLocationValues] = useState([]);
    const [selectedCountryValues, setSelectedCountryValues] = useState([]);

    const [initialSubProject, setInitialSubProject] = useState({});
    
    const handleSelectChange = async (ubicacion, countryIndex, selectIndex) => {
        const selectedCountry = JSON.parse(ubicacion);
        
        if (ubicacion === '0') {
            setLocationSelects(prevSelects => {
                const newSelects = [...prevSelects];
                newSelects[countryIndex].selects = newSelects[countryIndex].selects.slice(0, selectIndex + 1);
                return newSelects;
            });
        
            // Actualiza selectedCountryValues a '0' solo si estás cambiando un país
            if (selectIndex === -1) {
                setSelectedCountryValues(prevValues => {
                    const newValues = {...prevValues};
                    newValues[countryIndex] = '0';
                    return newValues;
                });
            }
        
            // Actualiza selectedLocationValues a '0' si estás cambiando una ubicación de nivel después del país
            if (selectIndex !== -1) {
                setSelectedLocationValues(prevValues => {
                    const newValues = {...prevValues};
                    newValues[`${countryIndex}-${selectIndex}`] = '0';
                    return newValues;
                });
            }
        
            return;
        }
        
        try {
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

            // Actualiza selectedCountryValues solo si estás cambiando un país
            if (selectIndex === -1) {
                setSelectedCountryValues(prevValues => {
                    const newValues = {...prevValues};
                    newValues[countryIndex] = ubicacion;
                    return newValues;
                });

                // Reinicia todos los selectores de niveles inferiores a '0'
                setSelectedLocationValues(prevValues => {
                    const newValues = {...prevValues};
                    Object.keys(newValues).forEach(key => {
                        if (key.startsWith(`${countryIndex}-`)) {
                            newValues[key] = '0';
                        }
                    });
                    return newValues;
                });
            }

            // Actualiza selectedLocationValues solo si estás cambiando una ubicación de nivel después del país
            if (selectIndex !== -1) {
                setSelectedLocationValues(prevValues => {
                    const newValues = {...prevValues};
                    newValues[`${countryIndex}-${selectIndex}`] = ubicacion;
                    return newValues;
                });
            }

            
            if (data.length > 0) {
                setLocationSelects(prevSelects => {
                    const newSelects = [...prevSelects];
                    newSelects[countryIndex].selects = newSelects[countryIndex].selects.slice(0, selectIndex + 1).concat([data]);
                    return newSelects;
                });
            } else {
                setLocationSelects(prevSelects => {
                    const newSelects = [...prevSelects];
                    newSelects[countryIndex].selects = newSelects[countryIndex].selects.slice(0, selectIndex + 1);
                    return newSelects;
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    const handleLocationChange = async (ubicacion, countryIndex, selectIndex) => {
        const selectedCountry = JSON.parse(ubicacion);
        
        if (ubicacion === '0') {
            setLocationSelects(prevSelects => {
                const newSelects = [...prevSelects];
                newSelects[countryIndex].selects = newSelects[countryIndex].selects.slice(0, selectIndex + 1);
                return newSelects;
            });
    
            return;
        }
    
        try {
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
                setLocationSelects(prevSelects => {
                    const newSelects = [...prevSelects];
                    newSelects[countryIndex].selects = newSelects[countryIndex].selects.slice(0, selectIndex + 1).concat([data]);
                    return newSelects;
                });
            } else {
                setLocationSelects(prevSelects => {
                    const newSelects = [...prevSelects];
                    newSelects[countryIndex].selects = newSelects[countryIndex].selects.slice(0, selectIndex + 1);
                    return newSelects;
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const { 
        register, 
        watch,
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue 
    } = useForm({ mode: "onChange"});
    
    useEffect(() => {
        const fetchOptions = async () => {
            await Promise.all([
                fetchData('Implementador',setImplementadores),
                fetchData('Ubicacion', setPaises),
                fetchData('Proyecto', setProyectos),
            ]);
        };
    
        fetchOptions().then(() => {
            if (isEditing) {
                const ano = id.slice(0, 4);
                const cod = id.slice(4,10);
                // Ejecuta la función para traer los datos del registro a modificar
                const fetchEdit = async () => {
                    try {
                        const token = localStorage.getItem('token');
                        Notiflix.Loading.pulse('Cargando...');
                        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/SubProyecto/${ano}/${cod}`, {
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
                        console.log(data)
                        let newData = {};
                        for (let key in data) {
                            if (typeof data[key] === 'string') {
                                // Convierte cada cadena a minúsculas
                                newData[key] = data[key].trim().toLowerCase();
                            } else {
                                // Mantiene los valores no string tal como están
                                newData[key] = data[key];
                            }
                        }
                        setInitialSubProject({...newData, proyecto: JSON.stringify({ proAno: data.proAno, proCod: data.proCod })})
                        reset(newData);
                        // Establece el valor inicial del select de proyecto
                        setValue('proyecto', JSON.stringify({ proAno: data.proAno, proCod: data.proCod }));
                    } catch (error) {
                        console.error('Error:', error);
                    } finally {
                        Notiflix.Loading.remove();
                    }
                }
                fetchEdit();
                fetchData(`Implementador/subproyecto/${ano}/${cod}`,(data) => {
                    setImplementadoresEdit(data);
                });
                fetchData(`Ubicacion/subproyecto/${ano}/${cod}`,setUbicacionesEdit);
            }
        });
    }, [isEditing]);

    useEffect(() => {
        if (implementadoresEdit.length > 0) {
            // Establecer la cantidad de selects
            setSelectCount(implementadoresEdit.length);
            
            // Establecer el valor de cada select
            implementadoresEdit.forEach((implementador, index) => {
                setValue(`impCod${index}`, implementador.impCod);
            });
        }
    }, [implementadoresEdit]);

    useEffect(() => {
        if (ubicacionesEdit.length > 0) {
            setLocationSelects(ubicacionesEdit.map(() => ({ count: 1, selects: [] })));
            let newSelectedCountryValues = {...selectedCountryValues}; // Crea una copia del estado actual
            let newSelectedLocationValues = {...selectedLocationValues}; // Crea una copia del estado actual
    
            ubicacionesEdit.map(async (ubicacion, countryIndex) => {
                const data = await fetchSelect(ubicacion.ubiAno, ubicacion.ubiCod);
    
                // Actualiza el valor del país correspondiente en newSelectedCountryValues
                newSelectedCountryValues[countryIndex] = JSON.stringify({ubiCod: data[0].ubiCod, ubiAno: data[0].ubiAno});
    
                for (const [locationIndex, location] of data.entries()) {
                    await handleLocationChange(JSON.stringify({ubiAno: location.ubiAno, ubiCod: location.ubiCod}), countryIndex, locationIndex + 1);
                }

                // Excluye el primer elemento de data
                const remainingData = data.slice(1);

                for (const [locationIndex, location] of remainingData.entries()) {
                    // Actualiza selectedLocationValues con el nuevo valor seleccionado
                    newSelectedLocationValues[`${countryIndex}-${locationIndex}`] = JSON.stringify({ubiCod: location.ubiCod, ubiAno: location.ubiAno});
                }
            });
    
            setSelectedCountryValues(newSelectedCountryValues); // Actualiza el estado con los nuevos valores
            setSelectedLocationValues(newSelectedLocationValues); // Actualiza el estado con los nuevos valores
        }
    }, [ubicacionesEdit]);
    


    const fetchSelect = async (ubiAno,ubiCod) => {
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
            
            return data;
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const validarUbicaciones = () => {
        let nivel = -1;
        for (let i = 0; i < locationSelects.length; i++) {
            const paisSelectElement = document.querySelector(`select[name=select${i}]`);
            if (paisSelectElement.value === '0') {
                Notiflix.Notify.failure('Debe seleccionar un país.');
                return false;
            }
            const nivelActual = locationSelects[i].selects.length;
            if (nivel === -1) {
                nivel = nivelActual;
            } else if (nivel !== nivelActual) {
                Notiflix.Notify.failure('Las ubicaciones deben tener el mismo nivel.');
                return false;
            }
        }
        return true;
    }

    const Guardar_Proyecto = () => {
        if (!validarUbicaciones()) {
            return;
        }
        validateForm((data) => {
            // Crear un array para almacenar los valores de los selects
            const selectValues = [];
    
            // Iterar sobre los campos del formulario
            for (let key in data) {
                // Si el campo es uno de los selects
                if (key.startsWith('impCod')) {
                    // Verificar si el valor ya existe en selectValues
                    const exists = selectValues.some(item => item.impCod === data[key]);
                    // Si no existe, añadir el valor al array como un objeto
                    if (!exists && data[key] !== '0') {
                        let implementador = { impCod: data[key] };
                        if (data.subProAno && data.subProCod) {
                            implementador.subProAno = data.subProAno;
                            implementador.subProCod = data.subProCod;
                        }
                        selectValues.push(implementador);
                    }
                }
            }
            
            // Crear un array para almacenar los valores de los selects de ubicación
            let ubicaciones = [];
            locationSelects.forEach((country, countryIndex) => {
                // Obtener el último select del grupo
                const lastSelectElement = document.querySelector(`select[name=select${countryIndex}${country.selects.length - 1}]`);
                const lastSelect = lastSelectElement.value;
                
                let ubiAno, ubiCod;
                
                if (lastSelect === '0') {
                    // Si el último select tiene un valor de '0', obtén el ubiAno y ubiCod del penúltimo select
                    if (country.selects.length > 1) {
                        const penultimateSelectElement = document.querySelector(`select[name=select${countryIndex}${country.selects.length - 2}]`);
                        const penultimateSelect = JSON.parse(penultimateSelectElement.value);
                        ubiAno = penultimateSelect.ubiAno;
                        ubiCod = penultimateSelect.ubiCod;
                    } else {
                        // Si solo hay un select (el de país) y su valor es '0', obtén el ubiAno y ubiCod del país
                        const paisSelectElement = document.querySelector(`select[name=select${countryIndex}]`);
                        console.log(countryIndex)
                        console.log(paisSelectElement)
                        const paisSelect = JSON.parse(paisSelectElement.value);
                        ubiAno = paisSelect.ubiAno;
                        ubiCod = paisSelect.ubiCod;
                    }
                    let ubicacion = { ubiAno, ubiCod };
                    if (data.subProAno && data.subProCod) {
                        ubicacion.subProAno = data.subProAno;
                        ubicacion.subProCod = data.subProCod;
                    }
                    ubicaciones.push(ubicacion);
                } else {
                    // Si el último select tiene un valor distinto de '0', usa ese
                    const ultimo = JSON.parse(lastSelect);
                    ubiAno = ultimo.ubiAno;
                    ubiCod = ultimo.ubiCod;
                    let ubicacion = { ubiAno, ubiCod };
                    if (data.subProAno && data.subProCod) {
                        ubicacion.subProAno = data.subProAno;
                        ubicacion.subProCod = data.subProCod;
                    }
                    ubicaciones.push(ubicacion);
                }
            });


           // Crea una copia de data
            let subProjectData = {...data};

            // Elimina las propiedades de los implementadores
            for (let key in subProjectData) {
                if (key.startsWith('impCod')) {
                    delete subProjectData[key];
                }
                if (key.startsWith('select')) {
                    delete subProjectData[key];
                }
            }
        
            console.log(initialSubProject)
            console.log(subProjectData)
            const hasSubProjectChanged = JSON.stringify(initialSubProject) !== JSON.stringify(subProjectData);
            console.log(hasSubProjectChanged);

            const {proAno, proCod} = JSON.parse(data.proyecto)
            const SubProyectoImplementadorDto = {
                SubProyecto: hasSubProjectChanged ? {
                    ...data,
                    proAno,
                    proCod
                } : null,
                SubProyectoImplementadores: selectValues,
                SubProyectoUbicaciones: ubicaciones
            }
            console.log(SubProyectoImplementadorDto)
            handleSubmit(SubProyectoImplementadorDto, isEditing, navigate);
        })();
    }

    const handleSubmit = async (data, isEditing, navigate) => {
        const method = isEditing ? 'PUT' : 'POST';
        let newData = {...data}; // Crea una copia de data
        if (newData.SubProyecto) {
            for (let key in newData.SubProyecto) {
                if (typeof newData.SubProyecto[key] === 'string') {
                    // Convierte cada cadena a mayúsculas
                    newData.SubProyecto[key] = newData.SubProyecto[key].toUpperCase();
                }
            }
        }

        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/SubProyecto`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });
            console.log(response)
            const dataResult = await response.json();
            if (!response.ok) {
                console.log(dataResult)
                Notiflix.Notify.failure(dataResult.message)
                return;
            }
    
            Notiflix.Notify.success(dataResult.message)
            navigate('/subproject');
        } catch (error) {
            console.error('Error:', error);
            console.error('Error message:', error.message);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleRemoveImplementador = (index) => {
        if (selectCount > 1) {
            // Recorre todos los selectores que vienen después del que estás eliminando
            for (let i = index + 1; i < selectCount; i++) {
                // Obtiene el valor del selector actual
                const value = watch(`impCod${i}`);
                // Asigna el valor al selector anterior
                setValue(`impCod${i - 1}`, value);
            }
            // Elimina el último selector
            setValue(`impCod${selectCount - 1}`, '0');
            setSelectCount(prevCount => prevCount - 1);
        }
    };
    
    
    const handleRemoveUbicacion = (index) => {
        if (locationSelects.length > 1) {
            setValue(`select${index}`, '0');
            const newLocationSelects = locationSelects.filter((_, i) => i !== index);
            setLocationSelects(newLocationSelects);
        }
    }
    
    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <GrFormPreviousLink className="w-auto Large-f2_5 pointer" onClick={() => navigate('/subproject')} />
                <h1 className="f1_75"> {isEditing ? 'Editar' : 'Nuevo'} Sub Proyecto</h1>
            </div>

            <div className="overflow-auto flex-grow-1 flex">
                <div className="PowerMas_Content_Form_Beneficiarie_Card Large_6 overflow-auto m1 p1">
                    <div className="m_75">
                        <label htmlFor='proyecto' className="">
                            Proyecto
                        </label>
                        <select 
                            id='proyecto'
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proyecto || isSubmitted ? (errors.proyecto ? 'invalid' : 'valid') : ''}`} 
                            {...register('proyecto', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Proyecto--</option>
                            {proyectos.map((item, index) => (
                                <option 
                                    key={index} 
                                    value={JSON.stringify({ proAno: item.proAno, proCod: item.proCod })}
                                > 
                                    {item.proNom.toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {errors.proyecto ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proyecto.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label className="">
                            Codigo de financiación
                        </label>
                        <input 
                            id="subProSap"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.subProSap || isSubmitted ? (errors.subProSap ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='123456' 
                            maxLength={10} 
                            name="subProSap" 
                            autoComplete='disabled'
                            onKeyDown={(event) => {
                                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                    event.preventDefault();
                                }
                            }}
                            {...register('subProSap', { 
                                required: 'El campo es requerido',
                                minLength: {
                                    value: 6,
                                    message: 'El campo debe tener al menos 6 dígitos'
                                },
                                maxLength: {
                                    value: 10,
                                    message: 'El campo no debe tener más de 10 dígitos'
                                },
                                pattern: {
                                    value: /^[0-9]*$/,
                                    message: 'El campo solo debe contener números'
                                }
                            })}
                        />
                        {errors.subProSap ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.subProSap.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="m_75">
                        <label htmlFor="subProNom" className="">
                            Nombre del Sub proyecto
                        </label>
                        <input type="text"
                            id="subProNom"
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.subProNom || isSubmitted ? (errors.subProNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Sub proyecto Movilidad Humana"
                            autoComplete="disabled"
                            {...register('subProNom', { 
                                required: 'El campo es requerido',
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.subProNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.subProNom.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    
                </div>
                <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto flex flex-column gap-1">
                    <div className="flex flex-column gap_5 p1_75" style={{backgroundColor: '#fff', border: '1px solid #372e2c3d'}}>
                        <div className="flex ai-center jc-space-between">
                            <h3 className="f1_25">Implementadores</h3>
                            <FaPlus className='w-auto f1 pointer' onClick={() => setSelectCount(count => count + 1)} /> 
                        </div>
                        {Array.from({ length: selectCount }, (_, index) => (
                            <div key={index} className="flex gap_5">
                                <select 
                                    id={`impCod${index}`} 
                                    style={{textTransform: 'capitalize'}}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields[`impCod${index}`] || isSubmitted ? (errors[`impCod${index}`] ? 'invalid' : 'valid') : ''}`} 
                                    {...register(`impCod${index}`, { 
                                        validate: value => value !== '0' || 'El campo es requerido' 
                                    })}
                                >
                                    <option value="0">--Seleccione Implementador--</option>
                                    {implementadores.map(item => (
                                        <option 
                                            key={item.impCod} 
                                            value={item.impCod}
                                            style={{textTransform: 'capitalize'}}
                                        > 
                                            {item.impNom.toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                                <div className='PowerMas_IconsTable flex jc-center ai-center'>
                                    <FaRegTrashAlt 
                                        data-tooltip-id="delete-tooltip" 
                                        data-tooltip-content="Eliminar" 
                                        className='Large-p_25' 
                                        onClick={() => handleRemoveImplementador(index)} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p1" style={{backgroundColor: '#fff', border: '1px solid #372e2c3d'}}>
                        <div className="flex ai-center jc-space-between">
                            <h3 className="f1_25 m1">Datos de Ubicación</h3>
                            <FaPlus 
                                className='w-auto f1 pointer' 
                                onClick={() => setLocationSelects(prevSelects => [...prevSelects, { count: 1, selects: [] }])} 
                            />
                        </div>
                        {locationSelects.map((country, countryIndex) => {
                            return(
                            <div className="m_75" key={countryIndex}>
                                <div className="flex ai-center jc-space-between">
                                    <label htmlFor="pais" className="">
                                        Pais:
                                    </label>
                                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                                        <FaRegTrashAlt 
                                            data-tooltip-id="delete-tooltip" 
                                            data-tooltip-content="Eliminar" 
                                            className='Large-p_25' 
                                            onClick={() => handleRemoveUbicacion(countryIndex)} 
                                        />
                                    </div>
                                </div>
                                <select 
                                    id={`pais${countryIndex}`}
                                    style={{textTransform: 'capitalize'}}
                                    value={selectedCountryValues[countryIndex]}
                                    name={`select${countryIndex}`}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields[`pais${countryIndex}`] || isSubmitted ? (errors[`pais${countryIndex}`] ? 'invalid' : 'valid') : ''}`} 
                                    onChange={(event) => handleSelectChange(event.target.value, countryIndex, -1)}
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
                                {country.selects.map((select, selectIndex) => (
                                    <select
                                        key={selectIndex}
                                        name={`select${countryIndex}${selectIndex}`}
                                        value={selectedLocationValues[`${countryIndex}-${selectIndex}`]}
                                        onChange={(event) => handleSelectChange(event.target.value, countryIndex, selectIndex)}
                                        style={{textTransform: 'capitalize'}}
                                        className="block Phone_12"
                                    >
                                        <option style={{textTransform: 'capitalize'}} value="0">--Seleccione {select[0].ubiTip.toLowerCase()}--</option>
                                        {select.map(option => (
                                            <option key={option.ubiCod} value={JSON.stringify({ ubiCod: option.ubiCod, ubiAno: option.ubiAno })}>
                                                {option.ubiNom.toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                ))}
                            </div>
                        )})}
                    </div>
                </div>
            </div>

            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/subproject')} className="PowerMas_Buttom_Secondary Large_3 m_75">Atras</button>
                <button onClick={Guardar_Proyecto} className="PowerMas_Buttom_Primary Large_3 m_75">Grabar</button>
            </div>

        </>
    )
}

export default FormSubProject