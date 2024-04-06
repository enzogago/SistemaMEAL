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

const ResultChain = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [subproyectos, setSubProyectos] = useState([]);
    const [indicadores, setIndicadores] = useState([]);
    const [transformedData, setTransformedData] = useState({});
    const [activeButton, setActiveButton] = useState('porAno');
    const [initialValues, setInitialValues] = useState({});
    const [viewTotals, setViewTotals] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const [dataPorAno, setDataPorAno] = useState([]);
    const [dataPorImplementador, setDataPorImplementador] = useState([]);
    const [dataPorUbicacion, setDataPorUbicacion] = useState([]);

    const [headers, setHeaders] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [totals, setTotals] = useState({});


    const { 
        register, 
        watch, 
        handleSubmit, 
        formState: { errors, dirtyFields, isSubmitted }, 
    } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos)
    }, []);
    
    useEffect(() => {
        setActiveButton('porAno')
    }, [watch('subproyecto')])
    
    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            setHeaders([]);
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`,setIndicadores)

            switch (activeButton) {
                case 'porAno':
                    fetchData(`Indicador/cadena/${subProAno}/${subProCod}`, (data) => {
                        setHeaders(generateHeaders(data,'cadResPerAno','cadResPerAno'));
                        setRenderData(generateRenderData(data, 'cadResPerAno', 'cadResPerMetTec'));
                    });
                    break;
                case 'porImplementador':
                    fetchData(`Indicador/implementador/${subProAno}/${subProCod}`, (data) => {
                        setHeaders(generateHeaders(data,'impNom','impCod'));
                        setRenderData(generateRenderData(data, 'impCod', 'cadResImpMetTec'));
                    });
                    break;
                case 'porUbicacion':
                    fetchData(`Indicador/ubicacion/${subProAno}/${subProCod}`, (data) => {
                        setHeaders(generateHeaders(data,'ubiNom','ubiAno', 'ubiCod'));
                        setRenderData(generateRenderData(data, 'ubiAno', 'cadResUbiMetTec', 'ubiCod'));
                    });
                    break;
                    case 'todos':
                        fetchData(`Indicador/cadena/${subProAno}/${subProCod}`, (dataPorAno) => {
                            setDataPorAno(dataPorAno);
                            fetchData(`Indicador/implementador/${subProAno}/${subProCod}`, (dataPorImplementador) => {
                                setDataPorImplementador(dataPorImplementador);
                                fetchData(`Indicador/ubicacion/${subProAno}/${subProCod}`, (dataPorUbicacion) => {
                                    setDataPorUbicacion(dataPorUbicacion);
                                    const headersPorAno = generateHeaders(dataPorAno,'cadResPerAno','cadResPerAno');
                                    const headersPorImplementador = generateHeaders(dataPorImplementador,'impNom','impCod');
                                    const headersPorUbicacion = generateHeaders(dataPorUbicacion,'ubiNom','ubiAno', 'ubiCod');
                                    setHeaders([...headersPorAno, ...headersPorImplementador, ...headersPorUbicacion]);
                                    const renderDataPorAno = generateRenderData(dataPorAno, 'cadResPerAno', 'cadResPerMetTec');
                                    const renderDataPorImplementador = generateRenderData(dataPorImplementador, 'impCod', 'cadResImpMetTec');
                                    const renderDataPorUbicacion = generateRenderData(dataPorUbicacion, 'ubiAno', 'cadResUbiMetTec', 'ubiCod');
                                    setRenderData({ ...renderDataPorAno, ...renderDataPorImplementador, ...renderDataPorUbicacion });
                                });
                            });
                        });
                        break;
                    default:
                        return;
            }
        }
    }, [watch('subproyecto'), activeButton]);
    
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
            acc[rowKey] = { ...acc[rowKey], [headerKey]: { value: item[valueProp], defaultValue: item[valueProp] } };
            return acc;
        }, {});
        console.log(renderData)
        return renderData;
    }
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const onSubmit = (data) => {
        console.log(data)
        return;
        if (isSubmitDisabled) return;
        delete data.subproyecto;
        // Crear los arreglos para almacenar los cambios
        let cambiosPorAno = [];
        let cambiosPorImplementador = [];
        let cambiosPorUbicacion = [];
        
        // Iterar sobre los datos del formulario
        for (let key in data) {
            // Obtener el valor inicial y el valor actual de la celda
            let valorInicial = initialValues[key]?.metTec || '';
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
                    cambio.cadResPerMetPre = initialValues[key].metPre;
                    cambiosPorAno.push(cambio);
                } else if (keyType.length === 2) {  // Si la longitud es 2, entonces es un 'implementador'
                    cambio.impCod = keyType;
                    cambio.cadResImpMetTec = valorActual;
                    cambio.cadResImpMetPre = initialValues[key].metPre;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.length === 10) {  // Si la longitud es 10, entonces es una 'ubicacion'
                    cambio.ubiAno = keyType.substring(0, 4);
                    cambio.ubiCod = keyType.substring(4);
                    cambio.cadResUbiMetTec = valorActual;
                    cambio.cadResUbiMetPre = initialValues[key].metPre;
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
    
        handleInsert(CadenaIndicadorDto);
    };

    
    const handleInsert = async (cadena) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Indicador/cadena-indicador`, {
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
            // Aquí es donde actualizamos los datos
            const subproyecto = watch('subproyecto');
            if (subproyecto && subproyecto !== '0') {
                const { subProAno, subProCod } = JSON.parse(subproyecto);
                let endpoints = {
                    'Por Año': cadena.CadenaPeriodos.length > 0 ? `Indicador/cadena/${subProAno}/${subProCod}` : null,
                    'Por Implementador': cadena.CadenaImplementadores.length > 0 ? `Indicador/implementador/${subProAno}/${subProCod}` : null,
                    'Por Ubicación': cadena.CadenaUbicaciones.length > 0 ? `Indicador/ubicacion/${subProAno}/${subProCod}` : null
                };
                
                let newInitialValues = {...initialValues};  // Inicializamos un nuevo objeto para los valores iniciales
                for (let button in endpoints) {
                    if (endpoints[button] !== null) {
                        fetchData(endpoints[button], (data) => {
                            const transformedData = transformData(data, button);
                            // Guardar los valores iniciales
                            for (let key in transformedData) {
                                for (let subKey in transformedData[key]) {
                                    newInitialValues[`${key}_${subKey}`] = {
                                        metTec: transformedData[key][subKey].metTec,
                                        metPre: transformedData[key][subKey].metPre
                                    };
                                }
                            }
                        });
                    }
                }
                setInitialValues(newInitialValues);  // Guarda los nuevos valores iniciales
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const calculateTotal = (indAno, indCod, activeButton) => {
        return Object.entries(totals)
            .filter(([key]) => key.startsWith(`${indAno}_${indCod}_`) && key.endsWith(`_${activeButton}`))
            .reduce((total, [key, value]) => total + Number(value), 0);
    }
    
    const Export_Excel = () => {
        let data = indicadores.map((item, index) => {
            const indicatorData = transformedData[`${item.indAno}_${item.indCod}`] || {};
            let rowData = {
                '#': index+1,
                'Proyecto': item.proNom.toLowerCase(),
                'Código': item.indNum,
                'Nombre': item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase(),
            };
            headers.forEach(key => {
                const inputValue = document.querySelector(`input[name="${item.indAno}_${item.indCod}_${key}"]`).value;
                rowData[key] = inputValue !== '' ? inputValue : '0';
            });
            rowData['Total'] = calculateTotal(item.indAno, item.indCod, activeButton, viewTotals);
            return rowData;
        });
    
        // Definir los encabezados
        let headersExcel = ['#', 'Proyecto', 'Código', 'Nombre', ...headersNew.map(header => ({name: header.name, code: header.code})), 'Total'];
    
        Export_Excel_Basic(data,headersExcel, activeButton, false);
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
                        className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'todos' ? 'Active' : ''} flex ai-center gap-1`} 
                        onClick={() => setActiveButton('todos')}
                    >
                        <span>
                            Todos
                        </span>
                        {
                            activeButton === 'todos'
                            ? <img className='w-auto' src={locationIconActive} alt="" />
                            : <img className='w-auto' src={locationIcon} alt="" />
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
                                    {headers.map((header, i) => (
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
                                                    setTotals(prevTotals => ({ ...prevTotals, [key]: newValue }));
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
                                                defaultValue={rowData[header.key]?.defaultValue}
                                            />
                                        </td>
                                    ))}
                                <td>
                                    {calculateTotal(item.indAno, item.indCod, activeButton)}
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