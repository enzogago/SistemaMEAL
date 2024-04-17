import React, { useEffect, useState } from 'react'
import { FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import { Export_Excel_Basic, fetchData } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix, { Notify } from 'notiflix';
import userIcon from '../../icons/user.svg';
import userIconActive from '../../icons/user-active.svg';
import calendarIcon from '../../icons/calendar.svg';
import calendarIconActive from '../../icons/calendar-active.svg';
import locationIcon from '../../icons/location.svg';
import locationIconActive from '../../icons/location-active.svg';
import todosIcon from '../../icons/todos.svg';
import todosIconActive from '../../icons/todos-active.svg';

const ResultChain = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [subproyectos, setSubProyectos] = useState([]);
    const [indicadores, setIndicadores] = useState([]);
    const [activeButton, setActiveButton] = useState('porAno');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const [headers, setHeaders] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [totals, setTotals] = useState({});
    
    const [totalsPorAno, setTotalsPorAno] = useState({});

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

    const { 
        register,
        unregister,
        reset,
        watch, 
        handleSubmit,
        getValues,
        formState: { errors, dirtyFields, isSubmitted }, 
    } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos)
    }, []);
    
    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            // Obtén todos los nombres de los campos registrados
            const fieldNames = Object.keys(getValues());

            // Filtra los nombres de los campos que no comienzan con 'subproyecto'
            const fieldsToUnregister = fieldNames.filter(fieldName => !fieldName.startsWith('subproyecto'));

            // Desregistra los campos
            fieldsToUnregister.forEach(fieldName => {
                unregister(fieldName);
            });

            setHeaders([]);
            setTotals([]);
            setIsSubmitDisabled(false);
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`,setIndicadores)
            // Realiza la llamada a fetchData una sola vez y usa los datos en los lugares necesarios
            fetchData(`Indicador/cadena/${subProAno}/${subProCod}`, (data) => {
                setTotalsPorAno(generateRenderData(data, 'cadResPerAno', 'cadResPerMetTec'));

                if (activeButton === 'porAno') {
                    setHeaders(generateHeaders(data, 'cadResPerAno', 'cadResPerAno'));
                    setRenderData(generateRenderData(data, 'cadResPerAno', 'cadResPerMetTec'));
                    setTotals(calculateTotals(data, 'cadResPerAno', 'cadResPerMetTec'));
                }
            });

            switch (activeButton) {

                case 'porImplementador':
                    fetchData(`Indicador/implementador/${subProAno}/${subProCod}`, (data) => {
                        setHeaders(generateHeaders(data,'impNom','impCod'));
                        setRenderData(generateRenderData(data, 'impCod', 'cadResImpMetTec'));
                        setTotals(calculateTotals(data, 'impCod', 'cadResImpMetTec'));
                    });
                    break;
                case 'porUbicacion':
                    fetchData(`Indicador/ubicacion/${subProAno}/${subProCod}`, (data) => {
                        setHeaders(generateHeaders(data,'ubiNom','ubiAno', 'ubiCod'));
                        setRenderData(generateRenderData(data, 'ubiAno', 'cadResUbiMetTec', 'ubiCod'));
                        setTotals(calculateTotals(data, 'ubiAno', 'cadResUbiMetTec', 'ubiCod'));
                    });
                    break;
                    case 'todos':
                        Promise.all([
                            fetchDataReturn(`Indicador/cadena/${subProAno}/${subProCod}`),
                            fetchDataReturn(`Indicador/implementador/${subProAno}/${subProCod}`),
                            fetchDataReturn(`Indicador/ubicacion/${subProAno}/${subProCod}`)
                        ]).then(([dataPorAno, dataPorImplementador, dataPorUbicacion]) => {
                            const headersPorAno = generateHeaders(dataPorAno,'cadResPerAno','cadResPerAno');
                            const headersPorImplementador = generateHeaders(dataPorImplementador,'impNom','impCod');
                            const headersPorUbicacion = generateHeaders(dataPorUbicacion,'ubiNom','ubiAno', 'ubiCod');
                            setHeaders([...headersPorAno, ...headersPorImplementador, ...headersPorUbicacion]);

                            const renderDataPorAno = generateRenderData(dataPorAno, 'cadResPerAno', 'cadResPerMetTec');
                            const renderDataPorImplementador = generateRenderData(dataPorImplementador, 'impCod', 'cadResImpMetTec');
                            const renderDataPorUbicacion = generateRenderData(dataPorUbicacion, 'ubiAno', 'cadResUbiMetTec', 'ubiCod');

                            const combinedRenderData = combineRenderData(renderDataPorAno, renderDataPorImplementador, renderDataPorUbicacion);
                            console.log(combinedRenderData);
                            setRenderData(combinedRenderData);

                            const generalTotals = calculateGeneralTotals(dataPorAno, dataPorImplementador, dataPorUbicacion);
                            setTotals(generalTotals);
                        });
                        break;
                    default:
                        return;
            }
        }
    }, [watch('subproyecto'), activeButton]);
    
    function combineRenderData(renderDataPorAno, renderDataPorImplementador, renderDataPorUbicacion) {
        const combinedRenderData = {};
    
        // Combinar renderDataPorAno
        Object.keys(renderDataPorAno).forEach(key => {
            combinedRenderData[key] = renderDataPorAno[key];
        });
    
        // Combinar renderDataPorImplementador
        Object.keys(renderDataPorImplementador).forEach(key => {
            combinedRenderData[key] = renderDataPorImplementador[key];
        });
    
        // Combinar renderDataPorUbicacion
        Object.keys(renderDataPorUbicacion).forEach(key => {
            combinedRenderData[key] = renderDataPorUbicacion[key];
        });
    
        return combinedRenderData;
    }
    
    
    function generateHeaders(data, headerNameProp, headerKeyProp, headerKeyProp2 = null) {
        const headers = data.reduce((acc, item) => {
            const headerName = item[headerNameProp];
            const headerKey = headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp];
            if (!acc.some(header => header.key === headerKey)) {
                acc.push({ name: headerName, key: headerKey });
            }
            return acc;
        }, []);
        return headers;
    }
    
    function generateRenderData(data, headerKeyProp, valueProp, headerKeyProp2 = null) {
        const renderData = data.reduce((acc, item) => {
            const rowKey = `${item.indAno}_${item.indCod}`;
            const headerKey = headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp];
            acc[`${rowKey}_${headerKey}`] = item[valueProp];
            return acc;
        }, {});
        return renderData;
    }
    
    function calculateTotals(data, headerKeyProp, valueProp, headerKeyProp2 = null) {
        const totals = {};
    
        data.forEach(item => {
            const rowKey = `${item.indAno}_${item.indCod}`;
            const headerKey = headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp];
            // Aseguramos que la propiedad del total esté inicializada a 0
            if (!totals[`${rowKey}_${headerKey}_${activeButton}`]) {
                totals[`${rowKey}_${headerKey}_${activeButton}`] = 0;
            }
    
            // Sumamos al total utilizando la estructura de clave correcta
            totals[`${rowKey}_${headerKey}_${activeButton}`] += Number(item[valueProp]);
        });
    
        return totals;
    }
    
    
    const toggleDropdown = () => {  
        setDropdownOpen(!dropdownOpen);
    }

    const onSubmit = (data) => {
        // if (isSubmitDisabled) return;
        delete data.subproyecto;
        // Crear los arreglos para almacenar los cambios
        let cambiosPorAno = [];
        let cambiosPorImplementador = [];
        let cambiosPorUbicacion = [];
        
        // Iterar sobre los datos del formulario
        for (let key in data) {
            // Obtener el valor inicial y el valor actual de la celda
            let valorInicial = renderData[key] || '';
            let valorActual = data[key];

            // Si el valor ha cambiado, agregar el cambio al arreglo correspondiente
            if (valorInicial !== valorActual) {
                // Obtener la parte de la clave que corresponde al 'ano', 'implementador' o 'ubicacion'
                let keyParts = key.split('_');
                let indAno = keyParts[0];
                let indCod = keyParts[1];
                let keyType = keyParts[2];

                let cambio = {
                    indAno: indAno,
                    indCod: indCod,
                };

                if (keyType.length === 4) {  // Si la longitud es 4, entonces es un 'ano'
                    cambio.cadResPerAno = keyType;
                    cambio.cadResPerMetTec = valorActual;
                    cambiosPorAno.push(cambio);
                } else if (keyType.length === 2) {  // Si la longitud es 2, entonces es un 'implementador'
                    cambio.impCod = keyType;
                    cambio.cadResImpMetTec = valorActual;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.length === 10) {  // Si la longitud es 10, entonces es una 'ubicacion'
                    cambio.ubiAno = keyType.substring(0, 4);
                    cambio.ubiCod = keyType.substring(4);
                    cambio.cadResUbiMetTec = valorActual;
                    cambiosPorUbicacion.push(cambio);
                }
            }
        }

        if (cambiosPorAno.length === 0 && cambiosPorImplementador.length === 0 && cambiosPorUbicacion.length === 0) {
            Notiflix.Notify.warning('No se realizaron cambios.');
            return;
        }
    
        const CadenaIndicadorDto = {
            CadenaPeriodos: cambiosPorAno,
            CadenaImplementadores: cambiosPorImplementador,
            CadenaUbicaciones: cambiosPorUbicacion
        }
        console.log(CadenaIndicadorDto)
        
        handleInsert(CadenaIndicadorDto);
    };

    const handleInsert = async (cadena) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Indicador/cadena-indicador-programatico`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cadena),
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            Notiflix.Notify.success(data.message);
            reset();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    function calculateGeneralTotals(dataPorAno, dataPorImplementador, dataPorUbicacion) {
        const totals = {};
    
        // Sumar los valores de dataPorAno
        dataPorAno.forEach(item => {
            const key = `${item.indAno}_${item.indCod}_${item.cadResPerAno}_todos`;
            totals[key] = (totals[key] || 0) + Number(item.cadResPerMetTec);
        });
    
        // Sumar los valores de dataPorImplementador
        dataPorImplementador.forEach(item => {
            const key = `${item.indAno}_${item.indCod}_${item.impCod}_todos`;
            totals[key] = (totals[key] || 0) + Number(item.cadResImpMetTec);
        });
    
        // Sumar los valores de dataPorUbicacion
        dataPorUbicacion.forEach(item => {
            const key = `${item.indAno}_${item.indCod}_${item.ubiAno+item.ubiCod}_todos`;
            totals[key] = (totals[key] || 0) + Number(item.cadResUbiMetTec);
        });
    
        return totals;
    }
    

    const calculateTotal = (indAno, indCod, activeButton, totals) => {
        return Object.entries(totals)
            .filter(([key]) => key.startsWith(`${indAno}_${indCod}_`) && key.endsWith(`_${activeButton}`))
            .reduce((total, [key, value]) => total + Number(value), 0);
    }

    const calculateTotalAno = (indAno, indCod, totals) => {
        return Object.entries(totals)
            .filter(([key]) => key.startsWith(`${indAno}_${indCod}`))
            .reduce((total, [key, value]) => total + Number(value), 0);
    }
    
    const Export_Excel = () => {
        let data = indicadores.map((item, index) => {
            const rowData = {
                '#': index+1,
                'Proyecto': item.proNom.toLowerCase(),
                'Código': item.indNum,
                'Nombre': item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase(),
            };
            headers.forEach(header => {
                const inputValue = document.querySelector(`input[name="${item.indAno}_${item.indCod}_${header.key}"]`).value;
                rowData[header.name] = inputValue !== '' ? inputValue : '0';
            });
            rowData['Total'] = calculateTotal(item.indAno, item.indCod, activeButton, totals);
            return rowData;
        });
    
        // Definir los encabezados
        let headersExcel = ['#', 'Proyecto', 'Código', 'Nombre', ...headers.map(header => header.name), 'Total'];
    
        Export_Excel_Basic(data, headersExcel, activeButton, false);
    };
    
    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
            <h1 className="Large-f1_5"> Cadena de resultado | Metas técnicas programáticas </h1>
            <div className='flex jc-space-between'>
                <div className="m_25 flex-grow-1">
                    <select 
                        id='subproyecto'
                        style={{textTransform: 'capitalize'}}
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.subproyecto || isSubmitted ? (errors.subproyecto ? 'invalid' : 'valid') : ''}`} 
                        {...register('subproyecto', { 
                            validate: {
                                required: value => value !== '0' || 'El campo es requerido',
                            }
                        })}
                    >
                        <option value="0">--Seleccione Sub Proyecto--</option>
                        {subproyectos.map((item, index) => (
                            <option 
                                key={index} 
                                value={JSON.stringify({ subProAno: item.subProAno, subProCod: item.subProCod })}
                            > 
                                {item.subProSap + ' - ' + item.subProNom.toLowerCase() + ' | ' + item.proNom.toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.subproyecto ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.subproyecto.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                </div>
                <div className={`PowerMas_Dropdown_Export Large_3 Large-m_25 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        <a onClick={() => {
                            Export_Excel();
                            setDropdownOpen(false);
                        }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                    </div>
                </div>
            </div>
            <div className='flex jc-space-between'>
                <div className='flex gap_5'>
                    <button 
                        className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'porAno' ? 'Active' : ''} flex ai-center gap-1`} 
                        onClick={() => setActiveButton('porAno')}
                    >
                        <span>
                            Por Año
                        </span>
                        {
                            activeButton === 'porAno'
                            ? <img className='w-auto' src={calendarIconActive} alt="" />
                            : <img className='w-auto' src={calendarIcon} alt="" />
                        }
                    </button>
                    <button 
                        className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'porImplementador' ? 'Active' : ''} flex ai-center gap-1`} 
                        onClick={() => setActiveButton('porImplementador')}
                    >
                        <span>
                            Por Implementador
                        </span>
                        {
                            activeButton === 'porImplementador'
                            ? <img className='w-auto' src={userIconActive} alt="" />
                            : <img className='w-auto' src={userIcon} alt="" />
                        }
                    </button>
                    <button 
                        className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'porUbicacion' ? 'Active' : ''} flex ai-center gap-1`} 
                        onClick={() => setActiveButton('porUbicacion')}
                    >
                        <span>
                            Por Ubicación
                        </span>
                        {
                            activeButton === 'porUbicacion'
                            ? <img className='w-auto' src={locationIconActive} alt="" />
                            : <img className='w-auto' src={locationIcon} alt="" />
                        }
                    </button>
                    <button 
                        className={`PowerMas_Buttom_All_Tab PowerMas_Buttom_All_Tab_${activeButton === 'todos' ? 'Active' : ''} flex ai-center gap-1`} 
                        onClick={() => setActiveButton('todos')}
                    >
                        <span>
                            Todos
                        </span>
                        {
                            activeButton === 'todos'
                            ? <img className='w-auto' src={todosIconActive} alt="" />
                            : <img className='w-auto' src={todosIcon} alt="" />
                        }
                    </button>
                </div>
                
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto borde-ayuda">
                <table className="PowerMas_TableStatus ">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Proyecto</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            {/* Encabezados */}
                            {headers.map((header, index) => <th key={index}>{header.name}</th>)}
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        indicadores.map((item, index) => {
                            const rowKey = `${item.indAno}_${item.indCod}`;
                            const rowData = renderData[rowKey] || {};
                            const text = item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase();
                            const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;

                            const totalPorAno = calculateTotalAno(item.indAno, item.indCod, totalsPorAno);

                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td style={{textTransform: 'capitalize'}}>{item.proNom.toLowerCase()}</td>
                                    <td>{item.indNum}</td>
                                    {
                                        text.length > 60 ?
                                        <td 
                                            data-tooltip-id="info-tooltip" 
                                            data-tooltip-content={text} 
                                        >{shortText}</td>
                                        :
                                        <td>{text}</td>
                                    }
                                    {/* Data dinamica */}
                                    {headers.map((header, i) => {
                                    return(
                                        <td key={i}>
                                            <input
                                                onKeyDown={(event) => {
                                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onInput={e => {
                                                    const newValue = e.target.value;
                                                    const key = `${item.indAno}_${item.indCod}_${header.key}_${activeButton}`;
                                                    
                                                    setTotals(prevTotals => {
                                                        // Primero, actualiza los totales
                                                        const newTotals = { ...prevTotals, [key]: newValue };

                                                        if (activeButton !== 'porAno') {
                                                            // Calcular el nuevo total para esta fila
                                                            const nuevoTotal = calculateTotal(item.indAno, item.indCod, activeButton, newTotals);
                                                            // Si el nuevo total es mayor que el total "Por Año", mostrar un error
                                                            if (nuevoTotal > totalPorAno) {
                                                                setIsSubmitDisabled(true);
                                                            } else {
                                                                setIsSubmitDisabled(false);
                                                            }
                                                        } 
                                                        console.log(newTotals)
                                                        // Finalmente, devuelve los nuevos totales
                                                        return newTotals;
                                                    });
                                                }}
                                                
                                                maxLength={10}
                                                style={{margin: 0}}
                                                className={`PowerMas_Input_Cadena Large_12 f_75 PowerMas_Cadena_Form_${dirtyFields[`${item.indAno}_${item.indCod}_${header.key}`] || isSubmitted ? (errors[`${item.indAno}_${item.indCod}_${header.key}`] ? 'invalid' : 'valid') : ''}`} 
                                                type="text" 
                                                {...register(`${item.indAno}_${item.indCod}_${header.key}`, {
                                                    pattern: {
                                                        value: /^(?:[1-9]\d*|)$/,
                                                        message: 'Valor no válido',
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: ''
                                                    }
                                                })}
                                                defaultValue={renderData[`${item.indAno}_${item.indCod}_${header.key}`]}
                                            />
                                        </td>
                                    )})}
                                <td className={`center bold ${(calculateTotal(item.indAno, item.indCod, activeButton, totals) > totalPorAno) && isSubmitDisabled ? 'invalid' : ''}`}>
                                    {calculateTotal(item.indAno, item.indCod, activeButton, totals)}
                                </td>
                            </tr>)
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='PowerMas_Footer_Box flex flex-column jc-center ai-center p_5 gap_5'>    
                <button 
                    className='PowerMas_Buttom_Primary Large_3 p_5'
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitDisabled}
                >
                    Grabar
                </button>
            </div>
        </div>
    )
}

export default ResultChain