import Bar from '../../user/Bar';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { useForm } from 'react-hook-form';
import { fetchData } from '../../reusable/helper';
import Plus from '../../../icons/Plus';
import Delete from '../../../icons/Delete';

const RegisterProject = () => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { id: safeCiphertext } = useParams();
    let id = '';
    if (safeCiphertext) {
        const ciphertext = atob(safeCiphertext);
        // Desencripta el ID
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        id = bytes.toString(CryptoJS.enc.Utf8);
    }

    
    // Estados locales
    const [ implementadoresEdit, setImplementadoresEdit ] = useState([])
    const [ ubicacionesEdit, setUbicacionesEdit ] = useState([])
    const [ implementadores, setImplementadores ] = useState([])
    const [ selectCount, setSelectCount ] = useState(1);
    const [ locationSelects, setLocationSelects ] = useState([{ count: 1, selects: [] }]);
    const [ paises, setPaises ] = useState([]);
    
    const [ subproyecto, setSubproyecto ] = useState({})

    const [selectedLocationValues, setSelectedLocationValues] = useState([]);
    const [selectedCountryValues, setSelectedCountryValues] = useState([]);


    useEffect(() => {
        Promise.all([
            fetchData('Implementador',setImplementadores),
            fetchData('Ubicacion', setPaises)
        ]).then(() => {
            if (id.length === 10) {
                const ano = id.slice(0, 4);
                const cod = id.slice(4,10);
                fetchData(`SubProyecto/${ano}/${cod}`,setSubproyecto)
                fetchData(`Implementador/subproyecto/${ano}/${cod}`,setImplementadoresEdit);
                fetchData(`Ubicacion/subproyecto/${ano}/${cod}`,setUbicacionesEdit);
            }
        });
    }, [id]);
    
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

            const SubProyectoImplementadorDto = {
                SubProyecto: subproyecto,
                SubProyectoImplementadores: selectValues,
                SubProyectoUbicaciones: ubicaciones
            }
            handleSubmit(SubProyectoImplementadorDto, navigate);
        })();
    }

    const handleSubmit = async (data, navigate) => {
        let newData = {};
        for (let key in data) {
            if (typeof data[key] === 'string') {
                // Convierte cada cadena a minúsculas
                newData[key] = data[key].toUpperCase();
            } else {
                // Mantiene los valores no string tal como están
                newData[key] = data[key];
            }
        }
    
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/SubProyecto/masivo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });
            
            const dataResult = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(dataResult.message)
                return;
            }
    
            Notiflix.Notify.success(dataResult.message)
            navigate('/upload-project');
        } catch (error) {
            console.error('Error:', error);
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
            <Bar currentStep={3} type='upload' />
            <div className='flex flex-grow-1 overflow-auto'>
                <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto flex flex-column gap-1">
                    <div className="flex flex-column gap_5 p1_75" style={{backgroundColor: '#fff', border: '1px solid #372e2c3d'}}>
                        <div className="flex ai-center jc-space-between">
                            <h3 className="f1_25">Implementadores</h3>
                            <span 
                                className='pointer flex f1_5 PowerMas_IconsTable'
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Agregar" 
                                onClick={() => setSelectCount(count => count + 1)}
                            >
                                <Plus />
                            </span>
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
                                <span 
                                    className='flex jc-center ai-center pointer f1_5 PowerMas_IconsTable'
                                    data-tooltip-id="delete-tooltip" 
                                    data-tooltip-content="Eliminar" 
                                    onClick={() => handleRemoveImplementador(index)} 
                                >
                                    <Delete />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto flex flex-column gap-1">
                <div className="p1" style={{backgroundColor: '#fff', border: '1px solid #372e2c3d'}}>
                        <div className="flex ai-center jc-space-between">
                            <h3 className="f1_25 m1">Datos de Ubicación</h3>
                            <span 
                                className='pointer flex f1_5 PowerMas_IconsTable'
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Agregar" 
                                onClick={() => setLocationSelects(prevSelects => [...prevSelects, { count: 1, selects: [] }])} 
                            >
                                <Plus />
                            </span>
                        </div>
                        {locationSelects.map((country, countryIndex) => {
                            return(
                            <div className="m_75" key={countryIndex}>
                                <div className="flex ai-center jc-space-between">
                                    <label htmlFor="pais" className="">
                                        Pais:
                                    </label>
                                    <span 
                                        className='flex jc-center ai-center pointer f1_5 PowerMas_IconsTable'
                                        data-tooltip-id="delete-tooltip" 
                                        data-tooltip-content="Eliminar" 
                                        onClick={() => handleRemoveUbicacion(countryIndex)} 
                                    >
                                        <Delete />
                                    </span>
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
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/guardar-proyecto')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={Guardar_Proyecto} className="Large_3 m_75 PowerMas_Buttom_Primary">Guardar</button>
            </footer>
        </>
    )
}

export default RegisterProject