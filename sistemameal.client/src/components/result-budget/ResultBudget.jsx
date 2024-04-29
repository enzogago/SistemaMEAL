import { useEffect, useState } from 'react'
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import { Export_Excel_Basic, fetchData } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { Tooltip } from 'react-tippy';

import IconCalendar from '../../icons/IconCalendar';
import IconLocation from '../../icons/IconLocation';
import User from '../../icons/User';

const ResultChain = () => {
    const [currency, setCurrency] = useState('');

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [subproyectos, setSubProyectos] = useState([]);
    const [indicadores, setIndicadores] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

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

    const [unmatchedTotal, setUnmatchedTotal] = useState({ key: '', value: 0, section: '' });

    const [indTotPreState, setIndTotPreState] = useState({});
    const [totalIndTotPre, setTotalIndTotPre] = useState(0);


    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key, target } = event;
            const inputElements = document.getElementsByTagName('input');
            const inputs = Array.from(inputElements);
            const currentIndex = inputs.indexOf(target);
    
            // Calcula el número de columnas en la tabla
            const numColumns = headers.length - 4; // Añade 4 por las columnas de totales
    
            // Calcula el índice de la fila y de la columna del input actual
            const currentRow = Math.floor(currentIndex / numColumns);
            const currentColumn = currentIndex % numColumns;
    
            let newIndex;
    
            switch (key) {
                case 'ArrowUp':
                    if (currentRow > 0) {
                        newIndex = (currentRow - 1) * numColumns + currentColumn;
                    }
                    break;
                case 'ArrowDown':
                    if (currentRow < Math.floor(inputs.length / numColumns) - 1) {
                        newIndex = (currentRow + 1) * numColumns + currentColumn;
                    }
                    break;
                case 'ArrowLeft':
                    if (currentIndex > 0) {
                        newIndex = currentIndex - 1;
                    }
                    break;
                case 'ArrowRight':
                    if (currentIndex < inputs.length - 1) {
                        newIndex = currentIndex + 1;
                    }
                    break;
                default:
                    break;
            }
    
            // Si se ha enfocado un nuevo input, haz scroll hasta él
            if (newIndex !== undefined) {
                inputs[newIndex].focus();
                inputs[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [headers.length]);
    
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

    function calculateTotalsAll(data, headerKeyProp, valueProp, totalType, headerKeyProp2 = null, prefix = '') {
        const totals = {};
    
        data.forEach(item => {
            const rowKey = `${item.indAno}_${item.indCod}`;
            const cellKey = prefix + (headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp]);
    
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
            setIsSubmitDisabled(true);
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            fetchData(`Indicador/subproyecto-actividad/${subProAno}/${subProCod}`, (data) => {
                setIndicadores(data);
        
                // Inicializar indTotPreState y totalIndTotPre
                const initialIndTotPreState = {};
                let initialTotalIndTotPre = 0;
        
                data.forEach(item => {
                    const key = `total_${item.indAno}_${item.indCod}`;
                    initialIndTotPreState[key] = item.indTotPre;
                    initialTotalIndTotPre += Number(item.indTotPre);
                });
        
                setIndTotPreState(initialIndTotPreState);
                setTotalIndTotPre(initialTotalIndTotPre);
            });
            
            Promise.all([
                fetchDataReturn(`Indicador/cadena-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/implementador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/financiador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion-actividad/${subProAno}/${subProCod}`)
            ]).then(([dataPorAno, dataPorImplementador, dataPorFinanciador, dataPorUbicacion]) => {
                if (dataPorFinanciador.length > 0) {
                    setCurrency(dataPorFinanciador[0].monSim);
                }

                const totalsPorAno = calculateTotalsAll(dataPorAno, 'cadResPerAno', 'cadResPerMetPre', 'porAno', null, 'ano_');
                const totalsPorImplementador = calculateTotalsAll(dataPorImplementador, 'impCod', 'cadResImpMetPre', 'porImplementador', null, 'imp_');
                const totalsPorUbicacion = calculateTotalsAll(dataPorUbicacion, 'ubiAno', 'cadResUbiMetPre', 'porUbicacion', 'ubiCod', 'ubi_');
                const totalsPorFinanciador = calculateTotalsAll(dataPorFinanciador, 'finCod', 'cadResFinMetPre', 'porFinanciador', null, 'fin_');


                setTotalsPorAnoAll(totalsPorAno)
                setTotalsPorImplementador(totalsPorImplementador)
                setTotalsPorFinanciador(totalsPorFinanciador)
                setTotalsPorUbicacion(totalsPorUbicacion)

                const headersPorAno = generateHeaders(dataPorAno,'cadResPerAno','cadResPerAno', null, 'ano_');
                const headersPorImplementador = generateHeaders(dataPorImplementador,'impNom','impCod', null, 'imp_');
                const headersPorUbicacion = generateHeaders(dataPorUbicacion,'ubiNom','ubiAno', 'ubiCod', 'ubi_');
                const headersPorFinanciador = generateHeaders(dataPorFinanciador,'finSap','finCod', null, 'fin_');

                setHeaders([
                    ...headersPorAno, 
                    // { name: "Total", key: "totalPorAno" },
                    ...headersPorImplementador, 
                    { name: "Total", key: "totalPorImplementador" },
                    ...headersPorUbicacion, 
                    { name: "Total", key: "totalPorUbicacion" },
                    ...headersPorFinanciador, 
                    { name: "Total", key: "totalPorFinanciador" },
                ]);

                setNumeroColumnasAno(headersPorAno.length+1)
                setNumeroColumnasImplementador(headersPorImplementador.length+1)
                setNumeroColumnasUbicacion(headersPorUbicacion.length+1)
                setNumeroColumnasFinanciador(headersPorFinanciador.length+1)
                                            
                const renderDataPorAno = generateRenderData(dataPorAno, 'cadResPerAno', 'cadResPerMetPre', 'cadResPerMetTec', null, 'ano_');
                const renderDataPorImplementador = generateRenderData(dataPorImplementador, 'impCod', 'cadResImpMetPre', 'cadResImpMetTec', null, 'imp_');
                const renderDataPorUbicacion = generateRenderData(dataPorUbicacion, 'ubiAno', 'cadResUbiMetPre', 'cadResUbiMetTec', 'ubiCod', 'ubi_');
                const renderDataPorFinanciador = generateRenderData(dataPorFinanciador, 'finCod', 'cadResFinMetPre', null, null, 'fin_');

                const combinedRenderData = combineRenderData(renderDataPorAno, renderDataPorImplementador, renderDataPorFinanciador, renderDataPorUbicacion);

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
        
        // Combinar renderDataPorUbicacion
        Object.keys(renderDataPorUbicacion).forEach(key => {
            combinedRenderData[key] = renderDataPorUbicacion[key];
        });

        // Combinar renderDataPorImplementador
        Object.keys(renderDataPorFinanciador).forEach(key => {
            combinedRenderData[key] = renderDataPorFinanciador[key];
        });
    
        console.log(combinedRenderData)
        return combinedRenderData;
    }
    
    
    function generateHeaders(data, headerNameProp, headerKeyProp, headerKeyProp2 = null, prefix = '') {
        const headers = data.reduce((acc, item) => {
            const headerName = item[headerNameProp];
            const headerKey = prefix + (headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp]);
            if (!acc.some(header => header.key === headerKey)) {
                acc.push({ name: headerName, key: headerKey });
            }
            return acc;
        }, []);
        return headers;
    }
    
    function generateRenderData(data, headerKeyProp, valueProp, tecProp = null, headerKeyProp2 = null, prefix = '') {
        const renderData = data.reduce((acc, item) => {
            const rowKey = `${item.indAno}_${item.indCod}`;
            const headerKey = prefix + (headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp]);
            acc[`${rowKey}_${headerKey}`] = {
                value: item[valueProp],
                tecValue: tecProp ? item[tecProp] : null
            };
            return acc;
        }, {});
        return renderData;
    }
    
    const toggleDropdown = () => {  
        setDropdownOpen(!dropdownOpen);
    }

    const onSubmit = (data) => {
        // if (isSubmitDisabled) return;
        console.log(data)
        delete data.subproyecto;
        // Crear los arreglos para almacenar los cambios
        let cambiosPorAno = [];
        let cambiosPorImplementador = [];
        let cambiosPorFinanciador = [];
        let cambiosPorUbicacion = [];
        
        // Iterar sobre los datos del formulario
        for (let key in data) {
            // Obtener el valor inicial y el valor actual de la celda
            let valorInicial = renderData[key] || '';
            let valorActual = data[key];
            console.log(renderData)
            // Si el valor ha cambiado, agregar el cambio al arreglo correspondiente
            if (valorInicial !== valorActual) {
                // Obtener la parte de la clave que corresponde al 'ano', 'implementador', 'ubicacion' o 'financiador'
                let keyParts = key.split('_');
                let indAno = keyParts[0];
                let indCod = keyParts[1];
                let keyType = keyParts[2];
                let keyTypeU = keyParts[3];

                let cambio = {
                    indAno: indAno,
                    indCod: indCod,
                };
                console.log(keyTypeU)
                if (keyType.startsWith('ano')) {  // Si comienza con 'ano', entonces es un 'ano'
                    cambio.cadResPerAno = keyTypeU;
                    cambio.cadResPerMetPre = valorActual;
                    cambiosPorAno.push(cambio);
                } else if (keyType.startsWith('imp')) {  // Si comienza con 'imp', entonces es un 'implementador'
                    cambio.impCod = keyTypeU;
                    cambio.cadResImpMetPre = valorActual;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.startsWith('ubi')) {  // Si comienza con 'ubi', entonces es una 'ubicacion'
                    cambio.ubiAno = keyTypeU.slice(0, 4);
                    cambio.ubiCod = keyTypeU.slice(4);
                    cambio.cadResUbiMetPre = valorActual;
                    cambiosPorUbicacion.push(cambio);
                } else if (keyType.startsWith('fin')) {  // Si comienza con 'fin', entonces es un 'financiador'
                    cambio.finCod = keyTypeU;
                    cambio.cadResFinMetPre = valorActual;
                    cambiosPorFinanciador.push(cambio);
                }
            }

        }

        if (cambiosPorAno.length === 0 && cambiosPorImplementador.length === 0 && cambiosPorFinanciador.length === 0 && cambiosPorUbicacion.length === 0) {
            Notiflix.Notify.warning('No se realizaron cambios.');
            return;
        }
    
        const CadenaIndicadorDto = {
            CadenaPeriodos: cambiosPorAno,
            CadenaImplementadores: cambiosPorImplementador,
            CadenaFinanciadores: cambiosPorFinanciador,
            CadenaUbicaciones: cambiosPorUbicacion
        }
        console.log(CadenaIndicadorDto)
        
        // handleInsert(CadenaIndicadorDto);
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
                } else if (header.key === 'totalPorFinanciador') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porFinanciador', totalsPorFinanciador);
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
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <IconCalendar className='Large_1' /></button>
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
                        <tr className=''>
                            <th className='center' rowSpan={2}>Código</th>
                            <th className='center' rowSpan={2}>#</th>
                            <th className='center' rowSpan={2}>Nombre</th>
                            <th className='center PowerMas_Borde_Total' style={{color: '#F87C56', whiteSpace: 'normal'}} rowSpan={2}>Total Presupuesto</th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2 PowerMas_Combine_Header' colSpan={numeroColumnasAno-1}>
                                <span className='flex ai-center jc-center gap-1'>
                                    Por Año
                                    <IconCalendar />
                                </span>
                            </th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2 PowerMas_Combine_Header' colSpan={numeroColumnasImplementador}>
                                <span className='flex ai-center jc-center gap-1'>
                                    Por Implementador
                                    <User />
                                </span>
                            </th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2 PowerMas_Combine_Header' colSpan={numeroColumnasUbicacion}>
                                <span className='flex ai-center jc-center gap-1'>
                                    Por Ubicación
                                    <IconLocation />
                                </span>
                            </th>
                            <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2 PowerMas_Combine_Header' colSpan={numeroColumnasFinanciador}>
                                <span className='flex ai-center jc-center gap-1'>
                                    Por Financiador
                                    <User />
                                </span>
                            </th>
                        </tr>
                        <tr style={{position: 'sticky', top: '32px', backgroundColor: '#fff'}}>
                            {/* Encabezados */}
                            {headers.map((header, index) => (
                                <th 
                                    style={{color: `${header.key.startsWith('total')? '#F87C56': '#000'}`}}
                                    className={`${header.key.startsWith('total') ? 'PowerMas_Borde_Total' : ''} PowerMas_Borde_Total2`}
                                    key={index}
                                >
                                    {`${header.name} (${currency})`} 
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
                                        <td className='' 
                                        data-tooltip-id="info-tooltip" 
                                        data-tooltip-content={text} 
                                        >{shortText}</td>
                                        :
                                        <td className=''>{text}</td>
                                    }
                                    <td className='PowerMas_Borde_Total'>
                                        <Tooltip
                                            title="Los totales no coinciden."
                                            open={`total_${item.indAno}_${item.indCod}` === unmatchedTotal.key && unmatchedTotal.section === 'totalPorIndicador'}
                                            arrow={true}
                                            position="bottom"
                                        />
                                        <input
                                            className={`
                                            PowerMas_Input_Cadena Large_12 f_75 
                                            PowerMas_Cadena_Form_${dirtyFields[`total_${item.indAno}_${item.indCod}`] || isSubmitted ? (errors[`total_${item.indAno}_${item.indCod}`] ? 'invalid' : 'valid') : ''}
                                            ${false && 'PowerMas_Tooltip_Active'}
                                            `} 
                                            type="text"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                
                                                const newValue = Number(e.target.value);
                                                const oldValue = Number(indTotPreState[`total_${item.indAno}_${item.indCod}`] || 0);
                                            
                                                setIndTotPreState(prevState => ({
                                                    ...prevState,
                                                    [`total_${item.indAno}_${item.indCod}`]: newValue
                                                }));
                                            
                                                // Aquí es donde actualizas totalIndTotPre
                                                setTotalIndTotPre(prevTotal => prevTotal - oldValue + newValue);
                                            
                                                // Validaciones de los totales
                                                const newTotalsAll = totalIndTotPre - oldValue + newValue;
                                                const newTotalPorImplementador = calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador);
                                                const newTotalPorFinanciador = calculateTotal(item.indAno, item.indCod, 'porFinanciador', totalsPorFinanciador);
                                            
                                                if (newTotalsAll !== newTotalPorImplementador) {
                                                    setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorImplementador, section: 'totalPorImplementador' });
                                                    setIsSubmitDisabled(true);
                                                } else if (newTotalsAll !== newTotalPorFinanciador) {
                                                    setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorFinanciador, section: 'totalPorFinanciador' });
                                                    setIsSubmitDisabled(true);
                                                } else {
                                                    setUnmatchedTotal({ key: '', value: 0, section: '' });
                                                    setIsSubmitDisabled(false);
                                                }
                                            
                                                // Validación de campo vacío
                                                if (e.target.value === '') {
                                                    setUnmatchedTotal({ key: `total_${item.indAno}_${item.indCod}`, value: 0, section: 'totalPorIndicador' });
                                                    setIsSubmitDisabled(true);
                                                }
                                            }}
                                            
                                            defaultValue={indTotPreState[`total_${item.indAno}_${item.indCod}`]} 
                                            {...register(`total_${item.indAno}_${item.indCod}`, {
                                                pattern: {
                                                    value: /^(?:[1-9]\d*|)$/,
                                                    message: 'Valor no válido',
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: ''
                                                }
                                            })}
                                        />
                                        
                                    </td>
                                    {/* Data dinamica */}
                                    {headers.map((header, i) => {
                                        const cellData = renderData[`${item.indAno}_${item.indCod}_${header.key}`];
                                        const defaultValue = cellData ? cellData.value : '';
                                        const tecValue = cellData ? cellData.tecValue : null;

                                        // if (header.key === 'totalPorAno') {
                                        //     return (
                                        //         <td 
                                        //             className={`center PowerMas_Borde_Total ${`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section) ? 'unmatched' : ''}`} 
                                        //             style={{color: '#F87C56'}} 
                                        //             key={i}
                                        //         >
                                        //             {calculateTotal(item.indAno, item.indCod, 'porAno', totalsPorAnoAll) + ' ' + currency}
                                        //             <Tooltip
                                        //                 title="Los totales no coinciden."
                                        //                 open={`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section)}
                                        //                 arrow={true}
                                        //                 position="bottom"
                                        //                 key={i}
                                        //             />
                                        //         </td>
                                        //     );
                                        // } else 
                                        if (header.key === 'totalPorImplementador') {
                                            return (
                                                <td className={`center PowerMas_Borde_Total ${`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section) ? 'unmatched' : ''}`} style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador) + ' ' + currency} 
                                                    <Tooltip
                                                        title="Los totales no coinciden."
                                                        open={`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section)}
                                                        arrow={true}
                                                        position="bottom"
                                                        key={i}
                                                    />
                                                </td>
                                            );
                                        } else if (header.key === 'totalPorFinanciador') {
                                            return (
                                                <td className={`center PowerMas_Borde_Total ${`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section) ? 'unmatched' : ''}`} style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porFinanciador', totalsPorFinanciador) + ' ' + currency}
                                                    <Tooltip
                                                        title="Los totales no coinciden."
                                                        open={`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section)}
                                                        arrow={true}
                                                        position="bottom"
                                                        key={i}
                                                    />
                                                </td>
                                            );
                                        } else if (header.key === 'totalPorUbicacion') {
                                            return (
                                                <td className={`center PowerMas_Borde_Total ${`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section) ? 'unmatched' : ''}`} style={{color: '#F87C56'}} key={i}>
                                                    {calculateTotal(item.indAno, item.indCod, 'porUbicacion', totalsPorUbicacion) + ' ' + currency}
                                                    <Tooltip
                                                        title="Los totales no coinciden."
                                                        open={`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section)}
                                                        arrow={true}
                                                        position="bottom"
                                                        key={i}
                                                        />
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td key={i}>
                                                <input
                                                    data-tooltip-id="info-tooltip" 
                                                    data-tooltip-content={tecValue && `Meta: ${tecValue}`} 
                                                    className={`
                                                    PowerMas_Input_Cadena Large_12 f_75 
                                                    PowerMas_Cadena_Form_${dirtyFields[`${item.indAno}_${item.indCod}_${header.key}`] || isSubmitted ? (errors[`${item.indAno}_${item.indCod}_${header.key}`] ? 'invalid' : 'valid') : ''}
                                                    ${tecValue && 'PowerMas_Tooltip_Active'}
                                                    `} 
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                                    
                                                        const newValue = e.target.value;
                                                    
                                                        const key = `${item.indAno}_${item.indCod}`;
                                                    
                                                        // Determinar la sección basándose en la longitud de header.key
                                                        let section;
                                                        if (header.key.startsWith('imp')) {
                                                            section = 'porImplementador';
                                                        } else if (header.key.startsWith('ubi')) {
                                                            section = 'porUbicacion';
                                                        } else if (header.key.startsWith('fin')) {
                                                            section = 'porFinanciador';
                                                        }
                                                    
                                                        let newTotalsAll = Number(indTotPreState[`total_${item.indAno}_${item.indCod}`]);

                                                        let newTotalsPorImplementador = { ...totalsPorImplementador };
                                                        let newTotalsPorUbicacion = { ...totalsPorUbicacion };
                                                        let newTotalsPorFinanciador = { ...totalsPorFinanciador };
                                                    
                                                        if (section === 'porImplementador') {
                                                            newTotalsPorImplementador = { ...newTotalsPorImplementador, [`${key}_${header.key}_porImplementador`]: newValue };
                                                            setTotalsPorImplementador(newTotalsPorImplementador);
                                                        } else if (section === 'porUbicacion') {
                                                            newTotalsPorUbicacion = { ...newTotalsPorUbicacion, [`${key}_${header.key}_porUbicacion`]: newValue };
                                                            setTotalsPorUbicacion(newTotalsPorUbicacion);
                                                        } else if (section === 'porFinanciador') {
                                                            newTotalsPorFinanciador = { ...newTotalsPorFinanciador, [`${key}_${header.key}_porFinanciador`]: newValue };
                                                            setTotalsPorFinanciador(newTotalsPorFinanciador);
                                                        }
                                                    
                                                        // Después de actualizar los totales, calcula los nuevos totales para cada sección
                                                        const newTotalPorImplementador = calculateTotal(item.indAno, item.indCod, 'porImplementador', newTotalsPorImplementador);
                                                        const newTotalPorFinanciador = calculateTotal(item.indAno, item.indCod, 'porFinanciador', newTotalsPorFinanciador);
                                                        console.log(newTotalsAll)
                                                        console.log(newTotalPorImplementador)
                                                        console.log(newTotalPorFinanciador)
                                                        // Comprueba si los totales de las cuatro secciones son iguales
                                                        if (newTotalsAll === newTotalPorImplementador && newTotalsAll === newTotalPorFinanciador) {

                                                            // Si los totales de la fila actual son iguales, comprueba si los totales de todas las filas son iguales
                                                            const totalPorImplementadorAll = Object.values(newTotalsPorImplementador).reduce((a, b) => a + Number(b), 0);
                                                            const totalPorFinanciadorAll = Object.values(newTotalsPorFinanciador).reduce((a, b) => a + Number(b), 0);


                                                            if (totalIndTotPre === totalPorImplementadorAll && totalIndTotPre === totalPorFinanciadorAll) {
                                                                setIsSubmitDisabled(false);
                                                            } else {
                                                                setIsSubmitDisabled(true);
                                                            }
                                                        } else {
                                                            setIsSubmitDisabled(true);
                                                        }

                                                        if (newTotalsAll !== newTotalPorImplementador) {
                                                            setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorImplementador, section: 'totalPorImplementador' });
                                                        } else if (newTotalsAll !== newTotalPorFinanciador) {
                                                            setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorFinanciador, section: 'totalPorFinanciador' });
                                                        } else {
                                                            setUnmatchedTotal({ key: '', value: 0, section: '' });
                                                        }
                                                    }}
                                                    maxLength={10}
                                                    autoComplete='off'
                                                    style={{margin: 0}}
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
                                                    defaultValue={defaultValue}
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