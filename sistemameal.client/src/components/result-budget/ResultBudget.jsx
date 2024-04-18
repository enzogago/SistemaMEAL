import { useEffect, useState } from 'react'
import { FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import { Export_Excel_Basic, fetchData } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';

const ResultChain = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [subproyectos, setSubProyectos] = useState([]);
    const [indicadores, setIndicadores] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const [headers, setHeaders] = useState([]);
    const [renderData, setRenderData] = useState([]);
    
    const [totalsPorAnoAll, setTotalsPorAnoAll] = useState({});
    const [totalsPorImplementador, setTotalsPorImplementador] = useState({});
    const [totalsPorFinanciador, setTotalsPorFinanciador] = useState({});
    const [totalsPorUbicacion, setTotalsPorUbicacion] = useState({});

    const [numeroColumnasAno, setNumeroColumnasAno] = useState(0)
    const [numeroColumnasImplementador, setNumeroColumnasImplementador] = useState(0)
    const [numeroColumnasFinanciador, setNumeroColumnasFinanciador] = useState(0)
    const [numeroColumnasUbicacion, setNumeroColumnasUbicacion] = useState(0)

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

    function calculateTotalsAll(data, headerKeyProp, valueProp, totalType, headerKeyProp2 = null) {
        const totals = {};
    
        data.forEach(item => {
            const rowKey = `${item.indAno}_${item.indCod}`;
            const cellKey = headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp];
             
            // Aseguramos que la propiedad del total esté inicializada a 0
            if (!totals[`${rowKey}_${cellKey}_${totalType}`]) {
                totals[`${rowKey}_${cellKey}_${totalType}`] = 0;
            }
    
            // Sumamos al total utilizando la estructura de clave correcta
            totals[`${rowKey}_${cellKey}_${totalType}`] += Number(item[valueProp]);
        });
    
        return totals;
    }

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
            setIsSubmitDisabled(false);
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`,setIndicadores)
            
            Promise.all([
                fetchDataReturn(`Indicador/cadena-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/implementador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/financiador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion-actividad/${subProAno}/${subProCod}`)
            ]).then(([dataPorAno, dataPorImplementador, dataPorFinanciador, dataPorUbicacion]) => {

                const totalsPorAno = calculateTotalsAll(dataPorAno, 'cadResPerAno', 'cadResPerMetPre', 'porAno');
                const totalsPorImplementador = calculateTotalsAll(dataPorImplementador, 'impCod', 'cadResImpMetPre', 'porImplementador');
                const totalsPorFinanciador = calculateTotalsAll(dataPorFinanciador, 'finCod', 'cadResFinMetPre', 'porFinanciador');
                const totalsPorUbicacion = calculateTotalsAll(dataPorUbicacion, 'ubiAno', 'cadResUbiMetPre', 'porUbicacion', 'ubiCod');

                setTotalsPorAnoAll(totalsPorAno)
                setTotalsPorImplementador(totalsPorImplementador)
                setTotalsPorFinanciador(totalsPorFinanciador)
                setTotalsPorUbicacion(totalsPorUbicacion)

                const headersPorAno = generateHeaders(dataPorAno,'cadResPerAno','cadResPerAno');
                const headersPorImplementador = generateHeaders(dataPorImplementador,'impNom','impCod');
                const headersPorFinanciador = generateHeaders(dataPorFinanciador,'finSap','finCod');
                const headersPorUbicacion = generateHeaders(dataPorUbicacion,'ubiNom','ubiAno', 'ubiCod');
                
                setHeaders([
                    ...headersPorAno, 
                    { name: "Total", key: "totalPorAno" },
                    ...headersPorImplementador, 
                    { name: "Total", key: "totalPorImplementador" },
                    ...headersPorFinanciador, 
                    { name: "Total", key: "totalPorFinanciador" },
                    ...headersPorUbicacion, 
                    { name: "Total", key: "totalPorUbicacion" }
                ]);

                setNumeroColumnasAno(headersPorAno.length+1)
                setNumeroColumnasImplementador(headersPorImplementador.length+1)
                setNumeroColumnasFinanciador(headersPorFinanciador.length+1)
                setNumeroColumnasUbicacion(headersPorUbicacion.length+1)
                                            
                const renderDataPorAno = generateRenderData(dataPorAno, 'cadResPerAno', 'cadResPerMetPre');
                const renderDataPorImplementador = generateRenderData(dataPorImplementador, 'impCod', 'cadResImpMetPre');
                const renderDataPorFinanciador = generateRenderData(dataPorFinanciador, 'finCod', 'cadResFinMetPre');
                const renderDataPorUbicacion = generateRenderData(dataPorUbicacion, 'ubiAno', 'cadResUbiMetPre', 'ubiCod');
                const combinedRenderData = combineRenderData(renderDataPorAno, renderDataPorImplementador, renderDataPorUbicacion);

                setRenderData(combinedRenderData);
            });
        } else {
            setIndicadores([]);
            setRenderData([]);
            setHeaders([]);
        }
    }, [watch('subproyecto')]);
    
    function combineRenderData(renderDataPorAno, renderDataPorImplementador, renderDataPorFinanciador, renderDataPorUbicacion) {
        const combinedRenderData = {};
    
        // Combinar renderDataPorAno
        Object.keys(renderDataPorAno).forEach(key => {
            combinedRenderData[key] = renderDataPorAno[key];
        });

        // Combinar renderDataPorImplementador
        Object.keys(renderDataPorImplementador).forEach(key => {
            combinedRenderData[key] = renderDataPorImplementador[key];
        });

        // Combinar renderDataPorImplementador
        Object.keys(renderDataPorFinanciador).forEach(key => {
            combinedRenderData[key] = renderDataPorFinanciador[key];
        });
    
        // Combinar renderDataPorUbicacion
        Object.keys(renderDataPorUbicacion).forEach(key => {
            combinedRenderData[key] = renderDataPorUbicacion[key];
        });
    
        console.log(combinedRenderData)
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
                    cambio.cadResPerMetPre = valorActual;
                    cambiosPorAno.push(cambio);
                } else if (keyType.length === 2) {  // Si la longitud es 2, entonces es un 'implementador'
                    cambio.impCod = keyType;
                    cambio.cadResImpMetPre = valorActual;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.length === 10) {  // Si la longitud es 10, entonces es una 'ubicacion'
                    cambio.ubiAno = keyType.substring(0, 4);
                    cambio.ubiCod = keyType.substring(4);
                    cambio.cadResUbiMetPre = valorActual;
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
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Indicador/cadena-indicador-presupuesto`, {
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

    const calculateTotal = (indAno, indCod, activeButton, totals) => {
        return Object.entries(totals)
            .filter(([key]) => key.startsWith(`${indAno}_${indCod}_`) && key.endsWith(`_${activeButton}`))
            .reduce((total, [key, value]) => total + Number(value), 0);
    }
    
    const Export_Excel = () => {
        let data = indicadores.map((item, index) => {
            const rowData = {
                '#': index+1,
                'SUB_PROYECTO': item.subProNom.toLowerCase(),
                'CÓDIGO': item.indNum,
                'NOMBRE': item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase(),
            };
            headers.forEach(header => {
                let inputValue;
                if (header.key === 'totalPorAno') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porAno', totalsPorAnoAll);
                } else if (header.key === 'totalPorImplementador') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador);
                } else if (header.key === 'totalPorUbicacion') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porUbicacion', totalsPorUbicacion);
                } else {
                    inputValue = document.querySelector(`input[name="${item.indAno}_${item.indCod}_${header.key}"]`);
                    if (inputValue){
                        inputValue = inputValue.value;
                    }
                }
                rowData[header.name] = inputValue !== '' ? inputValue : '0';
            });
            return rowData;
        });
    
        // Definir los encabezados
        let headersExcel = ['#', 'SUB_PROYECTO', 'CÓDIGO', 'NOMBRE', ...headers.map(header => header.name)];
    
        Export_Excel_Basic(data, headersExcel, 'GENERAL', false);
    };
    
    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
            <h1 className="Large-f1_5"> Cadena de resultado | Metas Presupuesto </h1>
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
            <div className="PowerMas_TableContainer flex-column overflow-auto">
                <table className="PowerMas_TableStatus">
                    <thead>
                        <tr>
                            <th className='center' rowSpan={2}>Código</th>
                            <th className='center' rowSpan={2}>#</th>
                            <th className='center PowerMas_Borde_Total' rowSpan={2}>Nombre</th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2' colSpan={numeroColumnasAno}>Por Año</th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2' colSpan={numeroColumnasImplementador}>Por Implementador</th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2' colSpan={numeroColumnasFinanciador}>Por Financiador</th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2' colSpan={numeroColumnasUbicacion}>Por Ubicación</th>
                        </tr>
                        <tr style={{position: 'sticky', top: '32px', backgroundColor: '#fff'}}>
                            {/* Encabezados */}
                            {headers.map((header, index) => (
                                <th 
                                    style={{color: `${header.key.startsWith('total')? '#F87C56': '#000'}`}}
                                    className={`${header.key.startsWith('total') ? 'PowerMas_Borde_Total' : ''} PowerMas_Borde_Total2`}
                                    key={index}
                                >
                                    {header.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                        indicadores.map((item, index) => {
                            const rowKey = `${item.indAno}_${item.indCod}`;
                            const text = item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase();
                            const shortText = text.length > 30 ? text.substring(0, 30) + '...' : text;

                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.indNum}</td>
                                    {
                                        text.length > 30 ?
                                        <td className='PowerMas_Borde_Total' 
                                            data-tooltip-id="info-tooltip" 
                                            data-tooltip-content={text} 
                                        >{shortText}</td>
                                        :
                                        <td className='PowerMas_Borde_Total'>{text}</td>
                                    }
                                    {/* Data dinamica */}
                                    {headers.map((header, i) => {
                                        if (header.key === 'totalPorAno') {
                                            return (
                                                <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porAno', totalsPorAnoAll)}
                                                </td>
                                            );
                                        } else if (header.key === 'totalPorImplementador') {
                                            return (
                                                <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador)}
                                                </td>
                                            );
                                        } else if (header.key === 'totalPorFinanciador') {
                                            return (
                                                <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porFinanciador', totalsPorFinanciador)}
                                                </td>
                                            );
                                        } else if (header.key === 'totalPorUbicacion') {
                                            return (
                                                <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porUbicacion', totalsPorUbicacion)}
                                                </td>
                                            );
                                        } else {
                                            return (
                                            <td key={i}>
                                                <input
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');

                                                        const newValue = e.target.value;
                                                        
                                                        const key = `${item.indAno}_${item.indCod}`;
                                                        // Determinar la sección basándose en la longitud de header.key
                                                        let section;
                                                        if (header.key.length === 4) {
                                                            section = 'porAno';
                                                        } else if (header.key.length === 2) {
                                                            section = 'porImplementador';
                                                        } else if (header.key.length === 10) {
                                                            section = 'porUbicacion';
                                                        }

                                                        let newTotalsPorAnoAll = { ...totalsPorAnoAll };
                                                        let newTotalsPorImplementador = { ...totalsPorImplementador };
                                                        let newTotalsPorUbicacion = { ...totalsPorUbicacion };

                                                        if (section === 'porAno') {
                                                            newTotalsPorAnoAll = { ...newTotalsPorAnoAll, [`${key}_${header.key}_porAno`]: newValue };
                                                            setTotalsPorAnoAll(newTotalsPorAnoAll);
                                                        } else if (section === 'porImplementador') {
                                                            newTotalsPorImplementador = { ...newTotalsPorImplementador, [`${key}_${header.key}_porImplementador`]: newValue };
                                                            setTotalsPorImplementador(newTotalsPorImplementador);
                                                        } else if (section === 'porUbicacion') {
                                                            newTotalsPorUbicacion = { ...newTotalsPorUbicacion, [`${key}_${header.key}_porUbicacion`]: newValue };
                                                            setTotalsPorUbicacion(newTotalsPorUbicacion);
                                                        }

                                                        // Después de actualizar los totales, calcula los nuevos totales para cada sección
                                                        const newTotalPorAno = calculateTotal(item.indAno, item.indCod, 'porAno', newTotalsPorAnoAll);
                                                        const newTotalPorImplementador = calculateTotal(item.indAno, item.indCod, 'porImplementador', newTotalsPorImplementador);
                                                        const newTotalPorUbicacion = calculateTotal(item.indAno, item.indCod, 'porUbicacion', newTotalsPorUbicacion);
                                                        
                                                        // Comprueba si los totales de las tres secciones son iguales
                                                        if (newTotalPorAno === newTotalPorImplementador && newTotalPorAno === newTotalPorUbicacion) {
                                                            setIsSubmitDisabled(false);
                                                        } else {
                                                            setIsSubmitDisabled(true);
                                                        }
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
                                        );
                                        }
                                    })}
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