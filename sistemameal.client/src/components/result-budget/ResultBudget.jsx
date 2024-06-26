// Importaciones de React y hooks para manejar el estado y el ciclo de vida del componente.
import { useEffect, useRef, useState } from 'react';
// Herramientas y funciones reutilizables para la lógica de negocio y exportación a Excel.
import { Export_Excel_Basic, fetchData, fetchDataReturn } from '../reusable/helper';
// Gestión de formularios y validaciones con react-hook-form.
import { useForm } from 'react-hook-form';
// Notificaciones y bloqueos de UI para mejorar la experiencia del usuario.
import Notiflix from 'notiflix';
// Componentes de UI para tooltips y otros elementos visuales.
import { Tooltip } from 'react-tippy';
// Iconos personalizados utilizados en el componente.
import IconCalendar from '../../icons/IconCalendar';
import IconLocation from '../../icons/IconLocation';
import User from '../../icons/User';
import Expand from '../../icons/Expand';
// Imágenes y estilos específicos del componente.
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
// Hooks personalizados para acciones específicas del componente.
import useEntityActions from '../../hooks/useEntityActions';
import { formatter, formatterBudget } from '../monitoring/goal/helper';

const ResultChain = () => {
    const [currency, setCurrency] = useState('');
    // Estados relacionados con la interfaz de usuario (UI)
    const [dropdownOpen, setDropdownOpen] = useState(false); // Controla la visibilidad del menú desplegable de exportación.
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // Habilita o deshabilita el botón de envío según la validación.
    // Estados para almacenar datos de la aplicación
    const [subproyectos, setSubProyectos] = useState([]); // Almacena la lista de subproyectos disponibles.
    const [indicadores, setIndicadores] = useState([]); // Almacena los indicadores asociados al subproyecto seleccionado.
    // Estados para la gestión de la tabla de resultados
    const [headers, setHeaders] = useState([]); // Encabezados de la tabla de resultados.
    const [renderData, setRenderData] = useState([]); // Datos renderizados en la tabla.
    // Estados para el cálculo de totales
    const [totalsPorAnoAll, setTotalsPorAnoAll] = useState({}); // Totales por año.
    const [totalsPorImplementador, setTotalsPorImplementador] = useState({}); // Totales por implementador.
    const [totalsPorFinanciador, setTotalsPorFinanciador] = useState({}); // Totales por financiador.
    const [totalsPorUbicacion, setTotalsPorUbicacion] = useState({}); // Totales por ubicación.
    // Estados para el control de columnas en la tabla
    const [numeroColumnasAno, setNumeroColumnasAno] = useState(0); // Número de columnas para los totales por año.
    const [numeroColumnasImplementador, setNumeroColumnasImplementador] = useState(0); // Número de columnas para los totales por implementador.
    const [numeroColumnasFinanciador, setNumeroColumnasFinanciador] = useState(0); // Número de columnas para los totales por financiador.
    const [numeroColumnasUbicacion, setNumeroColumnasUbicacion] = useState(0); // Número de columnas para los totales por ubicación.
    // Estados para la validación de totales
    const [unmatchedTotal, setUnmatchedTotal] = useState({ key: '', value: 0, section: '' }); // Controla los totales que no coinciden.
    const [indTotPreState, setIndTotPreState] = useState({}); // Estado previo de los totales de indicadores para comparaciones.
    const [totalIndTotPre, setTotalIndTotPre] = useState(0); // Total acumulado de los indicadores para comparaciones.
    // Acciones disponibles para el usuario según el contexto (por ejemplo, exportar a Excel)
    const actions = useEntityActions('CADENA RESULTADO PRESUPUESTO');
    const [refresh, setRefresh] = useState(false)

    const headerRef1 = useRef();
    const headerRef2 = useRef();
    const headerRef3 = useRef();
    
    const [columnWidths, setColumnWidths] = useState({ width1: 0, width2: 0, width3: 0 });

    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key, target } = event;
            const inputElements = document.getElementsByTagName('input');
            const inputs = Array.from(inputElements);
            const currentIndex = inputs.indexOf(target);
    
            // Calcula el número de columnas en la tabla
            const numColumns = headers.length - 2; // Añade 4 por las columnas de totales
    
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
                const newInput = inputs[newIndex];
                newInput.focus();
                newInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [headers.length]);
    
    // Hook para manejar formularios con validación y registro de campos.
    const { 
        register,
        unregister,
        watch, 
        handleSubmit,
        getValues,
        formState: { errors, dirtyFields, isSubmitted }, 
    } = 
    useForm({ mode: "onChange"});

    // Efecto para cargar los subproyectos al iniciar el componente.
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

            // Inicia el bloqueo de Notiflix
            if (document.querySelector('.result-budget-block')) {
                Notiflix.Block.pulse('.result-budget-block', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }

            Promise.all([
                fetchDataReturn(`Indicador/cadena-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/implementador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/financiador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/subproyecto-actividad/${subProAno}/${subProCod}`)
            ]).then(([dataPorAno, dataPorImplementador, dataPorFinanciador, dataPorUbicacion, dataSubproyecto]) => {
                // Establece los indicadores con los datos de la última petición
                setIndicadores(dataSubproyecto);
        
                // Inicializar indTotPreState y totalIndTotPre
                const initialIndTotPreState = {};
                let initialTotalIndTotPre = 0;
        
                dataSubproyecto.forEach(item => {
                    const key = `total_${item.indAno}_${item.indCod}`;
                    initialIndTotPreState[key] = item.indTotPre;
                    initialTotalIndTotPre += Number(item.indTotPre);
                });
        
                setIndTotPreState(initialIndTotPreState);
                setTotalIndTotPre(initialTotalIndTotPre);

                if (dataPorFinanciador.length > 0) {
                    // Obtén el valor de monSim del primer registro
                    const firstMonSim = dataPorFinanciador[0].monSim;
            
                    // Verifica si todos los registros tienen el mismo valor de monSim
                    const allSameMonSim = dataPorFinanciador.every(record => record.monSim === firstMonSim);
                    // Si todos los registros tienen el mismo valor de monSim, establece currency en ese valor
                    // Si no, establece currency en '€'
                    setCurrency(allSameMonSim ? firstMonSim : '€');
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
            }).catch(error => {
                // Maneja los errores
                console.error('Error:', error);
                Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
            }).finally(() => {
                // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
                Notiflix.Block.remove('.result-budget-block');
            });
        } else {
            setIndicadores([]);
            setRenderData([]);
            setHeaders([]);
        }
    }, [watch('subproyecto'), refresh]);
    
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
        delete data.subproyecto;
        // Crear los arreglos para almacenar los cambios
        let cambiosPorAno = [];
        let cambiosPorImplementador = [];
        let cambiosPorFinanciador = [];
        let cambiosPorUbicacion = [];
        let cambiosPorIndicador = [];

        
        // Iterar sobre los datos del formulario
        for (let key in data) {
            // Obtener el valor inicial y el valor actual de la celda
            let valorInicial;
            if (key.startsWith('total')) {  // Si comienza con 'total', entonces es un 'totalPorIndicador'
                valorInicial = indTotPreState[key] || '';
            } else {
                valorInicial = renderData[key] ? renderData[key].value : '' ;
            }

            let valorActual = data[key];
            // Si el valor ha cambiado, agregar el cambio al arreglo correspondiente
            if (valorInicial !== valorActual) {
                // Obtener la parte de la clave que corresponde al 'ano', 'implementador', 'ubicacion' o 'financiador'
                let keyParts = key.split('_');
                let indAno, indCod, keyType, keyTypeU;
                
                // Si la clave comienza con 'total', entonces es un 'totalPorIndicador'
                if (key.startsWith('total')) {
                    indAno = keyParts[1];
                    indCod = keyParts[2];
                    keyType = keyParts[0];
                } else {
                    indAno = keyParts[0];
                    indCod = keyParts[1];
                    keyType = keyParts[2];
                    keyTypeU = keyParts[3];
                }
                
                let cambio = {
                    indAno,
                    indCod,
                };

                const tecValue = renderData[key] ? renderData[key].tecValue : ''
                
                if (keyType.startsWith('ano')) {  // Si comienza con 'ano', entonces es un 'ano'
                    cambio.cadResPerAno = keyTypeU;
                    cambio.cadResPerMetPre = valorActual;
                    cambio.cadResPerMetTec = tecValue;
                    cambiosPorAno.push(cambio);
                } else if (keyType.startsWith('imp')) {  // Si comienza con 'imp', entonces es un 'implementador'
                    cambio.impCod = keyTypeU;
                    cambio.cadResImpMetPre = valorActual;
                    cambio.cadResImpMetTec = tecValue;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.startsWith('ubi')) {  // Si comienza con 'ubi', entonces es una 'ubicacion'
                    cambio.ubiAno = keyTypeU.slice(0, 4);
                    cambio.ubiCod = keyTypeU.slice(4);
                    cambio.cadResUbiMetPre = valorActual;
                    cambio.cadResUbiMetTec = tecValue;
                    cambiosPorUbicacion.push(cambio);
                } else if (keyType.startsWith('fin')) {  // Si comienza con 'fin', entonces es un 'financiador'
                    cambio.finCod = keyTypeU;
                    cambio.cadResFinMetPre = valorActual;
                    cambiosPorFinanciador.push(cambio);
                } else if (key.startsWith('total')) {  // Si comienza con 'total', entonces es un 'totalPorIndicador'
                    cambio.indTotPre = valorActual;
                    cambiosPorIndicador.push(cambio);
                }
            }
        }

        if (cambiosPorAno.length === 0 && cambiosPorImplementador.length === 0 && cambiosPorFinanciador.length === 0 && cambiosPorUbicacion.length === 0 && cambiosPorIndicador.length === 0) {
            Notiflix.Notify.warning('No se realizaron cambios.');
            return;
        }
    
        const CadenaIndicadorDto = {
            CadenaPeriodos: cambiosPorAno,
            CadenaImplementadores: cambiosPorImplementador,
            CadenaFinanciadores: cambiosPorFinanciador,
            CadenaUbicaciones: cambiosPorUbicacion,
            Indicadores: cambiosPorIndicador
        }

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
            setRefresh(prevRefresh => !prevRefresh)
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
    
    // Función para manejar la exportación a Excel.
    const Export_Excel = () => {
        let data = indicadores.map((item, index) => {
            const rowData = {
                '#': index+1,
                'CÓDIGO': item.indNum,
                'NOMBRE': item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase(),
                'UNIDAD': item.uniNom.charAt(0).toUpperCase() + item.uniNom.slice(1).toLowerCase(),
            };
            let inputLineaBase = document.querySelector(`input[name="total_${item.indAno}_${item.indCod}"]`);
            if (inputLineaBase){
                rowData['TOTAL_PRESUPUESTO'] = inputLineaBase.value !== '' ? inputLineaBase.value : '0';
            }
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
        let headersExcel = ['#', 'CÓDIGO', 'NOMBRE', 'UNIDAD','TOTAL_PRESUPUESTO', ...headers.map(header => header.name)];

        // Obtener el valor seleccionado del subproyecto con getValues
        const selectedSubprojectValue = getValues('subproyecto');
        const selectedSubproject = selectedSubprojectValue !== '0' ? JSON.parse(selectedSubprojectValue) : null;

        // Buscar el subproyecto en el estado para obtener el texto a mostrar
        const subprojectText = selectedSubproject ? subproyectos.find(subproyecto => 
            subproyecto.subProAno === selectedSubproject.subProAno && 
            subproyecto.subProCod === selectedSubproject.subProCod
        ) : null;

        // Construir el título con los datos del subproyecto seleccionado
        const title = subprojectText ? `${subprojectText.subProSap} - ${subprojectText.subProNom} | ${subprojectText.proNom}` : '';
    
        Export_Excel_Basic(data, headersExcel, 'GENERAL', true, title, currency);
    };

    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            const width1 = headerRef1.current.getBoundingClientRect().width;
            const width2 = headerRef2.current.getBoundingClientRect().width;
            const width3 = headerRef3.current.getBoundingClientRect().width;
    
            setColumnWidths({ width1, width2, width3 });
        }
    }, [indicadores]);
      
    
    return (
        <div className='p_75 flex flex-column flex-grow-1 overflow-auto gap_25'>
            <h1 className="Large-f1_5"> Cadena de resultado | Metas Presupuesto </h1>
            <div className='flex jc-space-between gap-1 p_5'>
                <div className="flex-grow-1">
                    <select 
                        id='subproyecto'
                        style={{textTransform: 'capitalize'}}
                        className={`block Phone_12 p_5 PowerMas_Modal_Form_${dirtyFields.subproyecto || isSubmitted ? (errors.subproyecto ? 'invalid' : 'valid') : ''}`} 
                        {...register('subproyecto', { 
                            validate: {
                                required: value => value !== '0' || 'El campo es requerido',
                            }
                        })}
                    >
                        <option value="0">--Seleccione Sub Proyecto--</option>
                        {subproyectos.map((item, index) => {
                            // Limita la longitud del texto a 50 caracteres
                            const maxLength = 100;
                            let displayText = item.subProSap + ' - ' + item.subProNom + ' | ' + item.proNom;
                            if (displayText.length > maxLength) {
                                displayText = displayText.substring(0, maxLength) + '...';
                            }
                            
                            return (
                                <option 
                                    key={index} 
                                    value={JSON.stringify({ subProAno: item.subProAno, subProCod: item.subProCod })}
                                    title={item.subProSap + ' - ' + item.subProNom + ' | ' + item.proNom} 
                                > 
                                    {displayText}
                                </option>
                            )
                        })}
                    </select>
                </div>
                {
                    actions.excel &&
                    <div className={`PowerMas_Dropdown_Export Phone_2 ${dropdownOpen ? 'open' : ''}`}>
                        <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <Expand className='Large_1' /></button>
                        <div className="PowerMas_Dropdown_Export_Content Phone_12">
                            <a onClick={() => {
                                Export_Excel();
                                setDropdownOpen(false);
                            }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                        </div>
                    </div>
                }
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto flex result-budget-block">
                {
                    indicadores.length > 0 ?
                    <table className="PowerMas_TableStatus">
                        <thead>
                            <tr  style={{zIndex: '1'}}>
                                <th 
                                ref={headerRef1} 
                                    className='center' 
                                    style={{position: 'sticky', left: '0', backgroundColor: '#fff'}} 
                                    rowSpan={2}
                                >#</th>
                                <th 
                                    ref={headerRef2} 
                                    className='center' 
                                    style={{position: 'sticky', left: columnWidths.width1, backgroundColor: '#fff'}}
                                    rowSpan={2} 
                                >
                                    Código
                                </th>
                                <th 
                                    ref={headerRef3} 
                                    className='center' 
                                    style={{position: 'sticky', left: (columnWidths.width2 + columnWidths.width1), backgroundColor: '#fff'}}
                                    rowSpan={2} 
                                >
                                    Código Presupuesto
                                </th>
                                <th className='center' rowSpan={2}>Nombre</th>
                                <th className='center' rowSpan={2}>Unidad</th>
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
                                <th className='center PowerMas_Borde_Total Large_12 PowerMas_Borde_Total2 PowerMas_Combine_Header' colSpan={numeroColumnasFinanciador}>
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
                                const text = item.indNom;
                                const shortText = text.length > 30 ? text.substring(0, 30) + '...' : text;

                                const textUnidad = item.uniNom;
                                const shortTextUnidad = textUnidad.length > 15 ? textUnidad.substring(0, 15) + '...' : text;

                                return (
                                    <tr key={index}>
                                        <td 
                                            style={{position: 'sticky', left: '0', backgroundColor: '#fff'}} 
                                        >
                                            {index+1}
                                        </td>
                                        <td
                                            className='center'
                                            style={{position: 'sticky', left: columnWidths.width1, backgroundColor: '#fff'}}
                                        >
                                            {item.indNum}
                                        </td>
                                        <td
                                            className='center'
                                            style={{position: 'sticky', left: (columnWidths.width1 + columnWidths.width2), backgroundColor: '#fff'}}
                                        >
                                            {item.indNumPre}
                                        </td>
                                        {
                                            text.length > 25 ?
                                            <td className='' 
                                            data-tooltip-id="info-tooltip" 
                                            data-tooltip-content={text} 
                                            >{shortText}</td>
                                            :
                                            <td className=''>{text}</td>
                                        }
                                        {
                                            textUnidad.length > 15 ?
                                            <td className='' 
                                            data-tooltip-id="info-tooltip" 
                                            data-tooltip-content={textUnidad} 
                                            >{shortTextUnidad}</td>
                                            :
                                            <td className=''>{textUnidad}</td>
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
                                                disabled={!actions.add}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || (/^\d*\.?\d{0,2}$/.test(value))) {
                                                        e.target.value = value;
                                                    } else {
                                                        e.target.value = value.slice(0, -1);
                                                    }
                                                    
                                                    const newValue = Number(e.target.value);
                                                    const oldValue = Number(indTotPreState[`total_${item.indAno}_${item.indCod}`] || 0);
                                                
                                                    setIndTotPreState(prevState => ({
                                                        ...prevState,
                                                        [`total_${item.indAno}_${item.indCod}`]: newValue
                                                    }));
                                                
                                                    // Aquí es donde actualizas totalIndTotPre
                                                    setTotalIndTotPre(prevTotal => prevTotal - oldValue + newValue);
                                                
                                                    // Validaciones de los totales
                                                    // const newTotalsAll = totalIndTotPre - oldValue + newValue;
                                                    const newTotalPorImplementador = calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador);
                                                    const newTotalPorFinanciador = calculateTotal(item.indAno, item.indCod, 'porFinanciador', totalsPorFinanciador);
                                                    const newTotalPorAno = calculateTotal(item.indAno, item.indCod, 'porAno', totalsPorAnoAll);
                                                
                                                    if (newValue !== newTotalPorImplementador) {
                                                        setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorImplementador, section: 'totalPorImplementador' });
                                                        setIsSubmitDisabled(true);
                                                    } else if (newValue !== newTotalPorFinanciador) {
                                                        setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorFinanciador, section: 'totalPorFinanciador' });
                                                        setIsSubmitDisabled(true);
                                                    } else if (newTotalPorAno <= 0) {
                                                        setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorAno, section: 'totalPorAno' });
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
                                                        value: /^(?:\d+\.?\d*|\.\d+)$/,
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
                                            const tecValue = cellData && cellData.tecValue ? `${formatter.format(cellData.tecValue)} ${textUnidad}` : null;

                                            if (header.key === 'totalPorImplementador') {
                                                return (
                                                    <td className={`center PowerMas_Borde_Total ${`${item.indAno}_${item.indCod}` === unmatchedTotal.key && header.key.startsWith(unmatchedTotal.section) ? 'unmatched' : ''}`} style={{color: '#F87C56'}} key={i}>
                                                        {formatterBudget.format(calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador)) + ' ' + currency} 
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
                                                        {formatterBudget.format(calculateTotal(item.indAno, item.indCod, 'porFinanciador', totalsPorFinanciador)) + ' ' + currency}
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
                                                        {formatterBudget.format(calculateTotal(item.indAno, item.indCod, 'porUbicacion', totalsPorUbicacion)) + ' ' + currency}
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
                                                        data-tooltip-content={tecValue && `META TÉCNICA: ${tecValue}`} 
                                                        className={`
                                                        PowerMas_Input_Cadena Large_12 f_75 
                                                        PowerMas_Cadena_Form_${dirtyFields[`${item.indAno}_${item.indCod}_${header.key}`] || isSubmitted ? (errors[`${item.indAno}_${item.indCod}_${header.key}`] ? 'invalid' : 'valid') : ''}
                                                        ${tecValue && 'PowerMas_Tooltip_Active'}
                                                        `} 
                                                        disabled={!actions.add}
                                                        onInput={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || (/^\d*\.?\d{0,2}$/.test(value))) {
                                                                e.target.value = value;
                                                            } else {
                                                                e.target.value = value.slice(0, -1);
                                                            }
                                                        
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
                                                            } else if (header.key.startsWith('ano')) {
                                                                section = 'porAno';
                                                            }
                                                        
                                                            let newTotalsAll = Number(indTotPreState[`total_${item.indAno}_${item.indCod}`]);

                                                            let newTotalsPorImplementador = { ...totalsPorImplementador };
                                                            let newTotalsPorUbicacion = { ...totalsPorUbicacion };
                                                            let newTotalsPorFinanciador = { ...totalsPorFinanciador };
                                                            let newTotalsPorAno = { ...totalsPorAnoAll };
                                                        
                                                            if (section === 'porImplementador') {
                                                                newTotalsPorImplementador = { ...newTotalsPorImplementador, [`${key}_${header.key}_porImplementador`]: newValue };
                                                                setTotalsPorImplementador(newTotalsPorImplementador);
                                                            } else if (section === 'porUbicacion') {
                                                                newTotalsPorUbicacion = { ...newTotalsPorUbicacion, [`${key}_${header.key}_porUbicacion`]: newValue };
                                                                setTotalsPorUbicacion(newTotalsPorUbicacion);
                                                            } else if (section === 'porFinanciador') {
                                                                newTotalsPorFinanciador = { ...newTotalsPorFinanciador, [`${key}_${header.key}_porFinanciador`]: newValue };
                                                                setTotalsPorFinanciador(newTotalsPorFinanciador);
                                                            } else if (section === 'porAno') {
                                                                newTotalsPorAno = { ...newTotalsPorAno, [`${key}_${header.key}_porAno`]: newValue };
                                                                setTotalsPorAnoAll(newTotalsPorAno);
                                                            }
                                                        
                                                            // Después de actualizar los totales, calcula los nuevos totales para cada sección
                                                            const newTotalPorImplementador = calculateTotal(item.indAno, item.indCod, 'porImplementador', newTotalsPorImplementador);
                                                            const newTotalPorFinanciador = calculateTotal(item.indAno, item.indCod, 'porFinanciador', newTotalsPorFinanciador);
                                                            const newTotalPorAno= calculateTotal(item.indAno, item.indCod, 'porAno', newTotalsPorAno);

                                                            // Comprueba si los totales de las cuatro secciones son iguales
                                                            if (newTotalsAll === newTotalPorImplementador && newTotalsAll === newTotalPorFinanciador && newTotalPorAno <= newTotalsAll) {
                                                                
                                                                // Si los totales de la fila actual son iguales, comprueba si los totales de todas las filas son iguales
                                                                const totalPorImplementadorAll = Object.values(newTotalsPorImplementador).reduce((a, b) => a + Number(b), 0);
                                                                const totalPorFinanciadorAll = Object.values(newTotalsPorFinanciador).reduce((a, b) => a + Number(b), 0);

                                                                if (totalIndTotPre === totalPorImplementadorAll && totalIndTotPre === totalPorFinanciadorAll ) {
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
                                                            } else if (newTotalPorAno < newTotalsAll){
                                                                setUnmatchedTotal({ key: `${item.indAno}_${item.indCod}`, value: newTotalPorAno, section: 'totalPorAno' });
                                                            } else {
                                                                setUnmatchedTotal({ key: '', value: 0, section: '' });
                                                            }
                                                        }}
                                                        maxLength={10}
                                                        autoComplete='off'
                                                        style={{margin: 0, paddingRight: '0.25rem'}}
                                                        type="text" 
                                                        {...register(`${item.indAno}_${item.indCod}_${header.key}`, {
                                                            pattern: {
                                                                value: /^(?:\d+\.?\d*|\.\d+)$/,
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
                    :
                    <div className='Phone_12 flex flex-grow-1 flex-column ai-center jc-center p1'>
                        <img src={TableEmpty} alt="TableEmpty" className='w-auto' style={{height: '100%'}} />
                        <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                    </div>
                }
            </div>
            {
                actions.add &&
                <div className='PowerMas_Footer_Box flex jc-center ai-center p_25'>    
                    <button 
                        className='PowerMas_Buttom_Primary Large_3 p_5'
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitDisabled}
                    >
                        Grabar
                    </button>
                </div>
            }
        </div>
    )
}

export default ResultChain