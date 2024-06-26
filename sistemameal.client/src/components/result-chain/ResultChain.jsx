// React y hooks para el estado y el ciclo de vida del componente.
import { useEffect, useState } from 'react';
// Herramientas y funciones reutilizables para la lógica de negocio.
import { Export_Excel_Basic, fetchData, fetchDataReturn } from '../reusable/helper';
// Gestión de formularios y validaciones.
import { useForm } from 'react-hook-form';
// Notificaciones y bloqueos de UI para mejorar la experiencia del usuario.
import Notiflix from 'notiflix';
// Iconos personalizados utilizados en el componente.
import IconCalendar from '../../icons/IconCalendar';
import User from '../../icons/User';
import IconLocation from '../../icons/IconLocation';
import Expand from '../../icons/Expand';
// Componentes de UI para tooltips y otros elementos visuales.
import { Tooltip } from 'react-tippy';
// Imágenes y estilos específicos del componente.
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
// Hooks personalizados para acciones específicas del componente.
import useEntityActions from '../../hooks/useEntityActions';
import { formatter, formatterBudget } from '../monitoring/goal/helper';

const ResultChain = () => {
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
    const [totalsPorUbicacion, setTotalsPorUbicacion] = useState({}); // Totales por ubicación.
    // Estados para el control de columnas en la tabla
    const [numeroColumnasAno, setNumeroColumnasAno] = useState(0); // Número de columnas para los totales por año.
    const [numeroColumnasImplementador, setNumeroColumnasImplementador] = useState(0); // Número de columnas para los totales por implementador.
    const [numeroColumnasUbicacion, setNumeroColumnasUbicacion] = useState(0); // Número de columnas para los totales por ubicación.
    // Estados para la validación de totales
    const [unmatchedTotals, setUnmatchedTotals] = useState([]);
    const [unmatchedTotal, setUnmatchedTotal] = useState({ key: '', value: 0, section: '' }); // Controla los totales que no coinciden.
    const [indTotPreState, setIndTotPreState] = useState({}); // Estado previo de los totales de indicadores para comparaciones.
    // Acciones disponibles para el usuario según el contexto (por ejemplo, exportar a Excel)
    const actions = useEntityActions('CADENA RESULTADO');

    const [refresh, setRefresh] = useState(false);
    const [currency, setCurrency] = useState('');

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
                inputs[newIndex].focus();
                inputs[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        reset,
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
        // Observa el valor del subproyecto seleccionado
        const subproyecto = watch('subproyecto');
    
        if (subproyecto && subproyecto !== '0') {
            // Desregistra los campos que no son 'subproyecto'
            Object.keys(getValues())
                .filter(fieldName => !fieldName.startsWith('subproyecto'))
                .forEach(unregister);
    
            // Reinicia los estados antes de realizar las peticiones
            setHeaders([]);
            setIndicadores([]);
            setRenderData([]);
            setHeaders([]);
    
            // Parsea el valor seleccionado para obtener el año y código del subproyecto
            const { subProAno, subProCod } = JSON.parse(subproyecto);
    
            // Inicia el bloqueo de Notiflix
            if (document.querySelector('.result-chain-block')) {
                Notiflix.Block.pulse('.result-chain-block', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
    
            // Realiza todas las peticiones en paralelo
            Promise.all([
                fetchDataReturn(`Financiador/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/cadena/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/implementador/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/subproyecto/${subProAno}/${subProCod}`)
            ]).then(([dataPorFinanciador, dataPorAno, dataPorImplementador, dataPorUbicacion, dataSubproyecto]) => {
                if (dataPorFinanciador.length > 0) {
                    // Obtén el valor de monSim del primer registro
                    const firstMonSim = dataPorFinanciador[0].monSim;
            
                    // Verifica si todos los registros tienen el mismo valor de monSim
                    const allSameMonSim = dataPorFinanciador.every(record => record.monSim === firstMonSim);
                    // Si todos los registros tienen el mismo valor de monSim, establece currency en ese valor
                    // Si no, establece currency en '€'
                    setCurrency(allSameMonSim ? firstMonSim : '€');
                }
                // Establece los indicadores con los datos de la última petición
                setIndicadores(dataSubproyecto);
    
                // Inicializa el estado de la línea base y el total
                const initialIndTotPreState = {};
                let initialTotalIndTotPre = 0;
    
                dataSubproyecto.forEach(item => {
                    const key = `total_${item.indAno}_${item.indCod}`;
                    initialIndTotPreState[key] = item.indLinBas;
                    initialTotalIndTotPre += Number(item.indLinBas);
                });

                setIndTotPreState(initialIndTotPreState);
    
                // Calcula los totales por año, implementador y ubicación
                const totalsPorAno = calculateTotalsAll(dataPorAno, 'cadResPerAno', 'cadResPerMetTec', 'porAno');
                const totalsPorImplementador = calculateTotalsAll(dataPorImplementador, 'impCod', 'cadResImpMetTec', 'porImplementador');
                const totalsPorUbicacion = calculateTotalsAll(dataPorUbicacion, 'ubiAno', 'cadResUbiMetTec', 'porUbicacion', 'ubiCod');

                setTotalsPorAnoAll(totalsPorAno)
                setTotalsPorImplementador(totalsPorImplementador)
                setTotalsPorUbicacion(totalsPorUbicacion)

                // Genera los encabezados y datos para renderizar en la tabla
                const headersPorAno = generateHeaders(dataPorAno,'cadResPerAno','cadResPerAno');
                const headersPorImplementador = generateHeaders(dataPorImplementador,'impNom','impCod');
                const headersPorUbicacion = generateHeaders(dataPorUbicacion,'ubiNom','ubiAno', 'ubiCod');
                
                setHeaders([
                    ...headersPorAno, 
                    { name: "Total", key: "totalPorAno" },
                    ...headersPorImplementador, 
                    { name: "Total", key: "totalPorImplementador" },
                    ...headersPorUbicacion, 
                    { name: "Total", key: "totalPorUbicacion" }
                ]);

                setNumeroColumnasAno(headersPorAno.length+1)
                setNumeroColumnasImplementador(headersPorImplementador.length+1)
                setNumeroColumnasUbicacion(headersPorUbicacion.length+1)
                                            
                const renderDataPorAno = generateRenderData(dataPorAno, 'cadResPerAno', 'cadResPerMetTec','cadResPerMetPre', null);
                const renderDataPorImplementador = generateRenderData(dataPorImplementador, 'impCod', 'cadResImpMetTec', 'cadResImpMetPre', null);
                const renderDataPorUbicacion = generateRenderData(dataPorUbicacion, 'ubiAno', 'cadResUbiMetTec', 'cadResUbiMetPre', 'ubiCod');
                const combinedRenderData = combineRenderData(renderDataPorAno, renderDataPorImplementador, renderDataPorUbicacion);

                setRenderData(combinedRenderData);
            }).catch(error => {
                // Maneja los errores
                console.error('Error:', error);
                Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
            }).finally(() => {
                // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
                Notiflix.Block.remove('.result-chain-block');
            });
        } else {
            // Si no hay un subproyecto seleccionado, limpia los estados
            setIndicadores([]);
            setRenderData([]);
            setHeaders([]);
        }
    }, [watch('subproyecto'), refresh]);
    
    
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
    
    function generateRenderData(data, headerKeyProp, valueProp, preProp = null, headerKeyProp2 = null, prefix = '') {
        const renderData = data.reduce((acc, item) => {
            const rowKey = `${item.indAno}_${item.indCod}`;
            const headerKey = prefix + (headerKeyProp2 ? item[headerKeyProp] + item[headerKeyProp2] : item[headerKeyProp]);
            acc[`${rowKey}_${headerKey}`] = {
                value: item[valueProp],
                preValue: preProp ? item[preProp] : null
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
                // Obtener la parte de la clave que corresponde al 'ano', 'implementador' o 'ubicacion'
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

                const preValue = renderData[key] ? renderData[key].preValue : '' ;

                if (keyType.length === 4) {  // Si la longitud es 4, entonces es un 'ano'
                    cambio.cadResPerAno = keyType;
                    cambio.cadResPerMetTec = valorActual;
                    cambio.cadResPerMetPre = preValue;
                    cambiosPorAno.push(cambio);
                } else if (keyType.length === 2) {  // Si la longitud es 2, entonces es un 'implementador'
                    cambio.impCod = keyType;
                    cambio.cadResImpMetTec = valorActual;
                    cambio.cadResImpMetPre = preValue;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.length === 10) {  // Si la longitud es 10, entonces es una 'ubicacion'
                    cambio.ubiAno = keyType.substring(0, 4);
                    cambio.ubiCod = keyType.substring(4);
                    cambio.cadResUbiMetTec = valorActual;
                    cambio.cadResUbiMetPre = preValue;
                    cambiosPorUbicacion.push(cambio);
                } else if (key.startsWith('total')) {  // Si comienza con 'total', entonces es un 'totalPorIndicador'
                    cambio.indLinBas = valorActual;
                    cambiosPorIndicador.push(cambio);
                }
            }
        }

        if (cambiosPorAno.length === 0 && cambiosPorImplementador.length === 0 && cambiosPorUbicacion.length === 0 && cambiosPorIndicador.length === 0 ) {
            Notiflix.Notify.warning('No se realizaron cambios.');
            return;
        }
    
        const CadenaIndicadorDto = {
            CadenaPeriodos: cambiosPorAno,
            CadenaImplementadores: cambiosPorImplementador,
            CadenaUbicaciones: cambiosPorUbicacion,
            Indicadores: cambiosPorIndicador
        }
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
            setRefresh(prevRefresh => !prevRefresh)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const calculateTotal = (indAno, indCod, section, totals, tipValCod) => {
        const values = Object.entries(totals)
            .filter(([key]) => key.startsWith(`${indAno}_${indCod}_`) && key.endsWith(`_${section}`))
            .map(([, value]) => Number(value));
    
        if (tipValCod === '01') {
            // Si el código es '01', calcula la suma de los valores
            return values.reduce((total, value) => total + value, 0);
        } else if (tipValCod === '02') {
            // Si el código es '02', calcula el promedio de los valores que no son cero
            const nonZeroValues = values.filter(value => value !== 0);
            const sum = nonZeroValues.reduce((total, value) => total + value, 0);
            return nonZeroValues.length > 0 ? sum / nonZeroValues.length : 0;
        }
    }
    
    // Función para manejar la exportación a Excel.
    const Export_Excel = () => {
        let data = indicadores.map((item, index) => {
            const rowData = {
                '#': index+1,
                'CÓDIGO': item.indNum,
                'NOMBRE': item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase(),
                'UNIDAD': item.uniNom.charAt(0).toUpperCase() + item.uniNom.slice(1).toLowerCase(),
                'TIPO_VALOR': item.tipValNom.charAt(0).toUpperCase() + item.tipValNom.slice(1).toLowerCase(),
            };
            let inputLineaBase = document.querySelector(`input[name="total_${item.indAno}_${item.indCod}"]`);
            if (inputLineaBase){
                rowData['LINEA_BASE'] = inputLineaBase.value !== '' ? inputLineaBase.value : '0';
            }

            headers.forEach(header => {
                let inputValue;
                if (header.key === 'totalPorAno') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porAno', totalsPorAnoAll, item.tipValCod);
                } else if (header.key === 'totalPorImplementador') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador, item.tipValCod);
                } else if (header.key === 'totalPorUbicacion') {
                    inputValue = calculateTotal(item.indAno, item.indCod, 'porUbicacion', totalsPorUbicacion, item.tipValCod);
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
        let headersExcel = ['#', 'CÓDIGO', 'NOMBRE', 'UNIDAD', 'TIPO_VALOR','LINEA_BASE', ...headers.map(header => header.name)];

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

    
        Export_Excel_Basic(data, headersExcel, 'GENERAL', false, title);
    };

    function calcularTotalIndicador(valores, tipValCod) {
        if (tipValCod === '02') {
            // Calcular el promedio para el indicador, solo con valores no cero
            const sumaValores = valores.reduce((a, b) => a + b, 0);
            const cantidadValores = valores.length;
            return cantidadValores > 0 ? sumaValores / cantidadValores : 0;
        } else {
            // Sumar los valores para el indicador
            return valores.reduce((a, b) => a + b, 0);
        }
    }

    const updateUnmatchedTotals = (indAno, indCod, value, section, shouldAdd = false) => {
        setUnmatchedTotals(currentUnmatchedTotals => {
            // Filtrar cualquier total previo que coincida con el indicador actual
            const filteredTotals = currentUnmatchedTotals.filter(unmatched => unmatched.indAno !== indAno || unmatched.indCod !== indCod);
            
            // Si el valor no es 0, agregar el nuevo total no coincidente a la lista filtrada
            if (shouldAdd || value !== 0) {
                const newUnmatchedTotal = { indAno, indCod, value, section };
                return [...filteredTotals, newUnmatchedTotal];
            }
            
            // Si el valor es 0, simplemente retornar la lista filtrada
            return filteredTotals;
        });
    };

    const isTotalUnmatched = (indAno, indCod, section) => {
        return unmatchedTotals.some(unmatched => unmatched.indAno === indAno && unmatched.indCod === indCod && unmatched.section === section);
    };
    
    
    
    return (
        <div className='p_75 flex flex-column flex-grow-1 overflow-auto gap_25'>
            <h1 className="Large-f1_5"> Cadena de resultado | Metas técnicas programáticas </h1>
            <div className='flex ai-center jc-space-between p_25 gap-1'>
                <div className="flex-grow-1">
                    <select 
                        id='subproyecto'
                        style={{textTransform: 'capitalize'}}
                        className={`p_5 block Phone_12 PowerMas_Modal_Form_${dirtyFields.subproyecto || isSubmitted ? (errors.subproyecto ? 'invalid' : 'valid') : ''}`} 
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
                        <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <Expand /></button>
                        <div className="PowerMas_Dropdown_Export_Content Phone_12">
                            <a onClick={() => {
                                Export_Excel();
                                setDropdownOpen(false);
                            }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                        </div>
                    </div>
                }
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto result-chain-block flex">
                {
                    indicadores.length > 0 ?
                    <table className="PowerMas_TableStatus">
                        <thead>
                            <tr style={{zIndex: '1'}}>
                                <th className='center' rowSpan={2}>#</th>
                                <th 
                                    style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}
                                    className='center' 
                                    rowSpan={2}
                                >
                                    Código
                                </th>
                                <th className='center' rowSpan={2}>Nombre</th>
                                <th className='center' rowSpan={2}>Unidad</th>
                                <th className='center PowerMas_Borde_Total' rowSpan={2}>Tipo Valor</th>
                                <th className='center PowerMas_Borde_Total' style={{color: '#F87C56', whiteSpace: 'normal'}} rowSpan={2}>Linea Base</th>
                                <th className='center PowerMas_Borde_Total PowerMas_Borde_Total2 PowerMas_Combine_Header' colSpan={numeroColumnasAno}>
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
                            </tr>
                            <tr style={{position: 'sticky', top: '32px', backgroundColor: '#fff'}}>
                                {/* Encabezados */}
                                {headers.map((header, index) => (
                                    <th 
                                        style={{color: `${header.key.startsWith('total')? '#F87C56': '#000'}`}}
                                        className={`center ${header.key.startsWith('total') ? 'PowerMas_Borde_Total' : ''} PowerMas_Borde_Total2`}
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
                                const text = item.indNom;
                                const shortText = text.length > 25 ? text.substring(0, 25) + '...' : text;
                                
                                const textUnidad = item.uniNom;
                                const shortTextUnidad = textUnidad.length > 15 ? textUnidad.substring(0, 15) + '...' : text;

                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td
                                            style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}
                                        >{item.indNum}</td>
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
                                        <td
                                            className='PowerMas_Borde_Total'
                                        >
                                            {item.tipValNom}
                                        </td>
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
                                                `} 
                                                type="text"
                                                disabled={!actions.add}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                }}
                                                
                                                {...register(`total_${item.indAno}_${item.indCod}`, {
                                                    pattern: {
                                                        value: /^(?:[0-9]\d*|)$/,
                                                        message: 'Valor no válido',
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: ''
                                                    }
                                                })}
                                                defaultValue={indTotPreState[`total_${item.indAno}_${item.indCod}`]} 
                                            />
                                        </td>
                                        {/* Data dinamica */}
                                        {headers.map((header, i) => {
                                            const cellData = renderData[`${item.indAno}_${item.indCod}_${header.key}`];
                                            const defaultValue = cellData ? cellData.value : '';
                                            const preValue = cellData && cellData.preValue ? `${formatterBudget.format(cellData.preValue)} ${currency}` : null;

                                            if (header.key === 'totalPorAno') {
                                                return (
                                                    <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                        {formatter.format(calculateTotal(item.indAno, item.indCod, 'porAno', totalsPorAnoAll, item.tipValCod))}
                                                        <Tooltip
                                                            title="Los totales no coinciden."
                                                            open={isTotalUnmatched(item.indAno, item.indCod, 'totalPorAno')}
                                                            arrow={true}
                                                            position="bottom"
                                                            key={i}
                                                        />
                                                    </td>
                                                );
                                            } else if (header.key === 'totalPorImplementador') {
                                                return (
                                                    <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                        {formatter.format(calculateTotal(item.indAno, item.indCod, 'porImplementador', totalsPorImplementador, item.tipValCod))}
                                                        <Tooltip
                                                            title="Los totales no coinciden."
                                                            open={isTotalUnmatched(item.indAno, item.indCod, 'totalPorImplementador')}
                                                            arrow={true}
                                                            position="bottom"
                                                            key={i}
                                                        />
                                                    </td>
                                                );
                                            } else if (header.key === 'totalPorUbicacion') {
                                                return (
                                                    <td className='center PowerMas_Borde_Total' style={{color: '#F87C56'}} key={i}>
                                                        {formatter.format(calculateTotal(item.indAno, item.indCod, 'porUbicacion', totalsPorUbicacion, item.tipValCod))}
                                                        <Tooltip
                                                            title="Los totales no coinciden."
                                                            open={isTotalUnmatched(item.indAno, item.indCod, 'totalPorUbicacion')}
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
                                                        data-tooltip-content={preValue && `PRESUPUESTO: ${preValue}`} 
                                                        className={`
                                                            PowerMas_Input_Cadena Large_12 f_75 
                                                            PowerMas_Cadena_Form_${dirtyFields[`${item.indAno}_${item.indCod}_${header.key}`] || isSubmitted ? (errors[`${item.indAno}_${item.indCod}_${header.key}`] ? 'invalid' : 'valid') : ''}
                                                            ${preValue && 'PowerMas_Tooltip_Active'}
                                                        `}
                                                        disabled={!actions.add}
                                                        onInput={(e) => {
                                                            if (item.tipValCod === '02') {
                                                                const value = e.target.value;
                                                                if (value === '' || (/^\d*\.?\d*$/.test(value))) {
                                                                    e.target.value = value;
                                                                } else {
                                                                    e.target.value = value.slice(0, -1);
                                                                }
                                                            } else {
                                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                            }

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
                                                            const newTotalPorAno = calculateTotal(item.indAno, item.indCod, 'porAno', newTotalsPorAnoAll, item.tipValCod);
                                                            const newTotalPorImplementador = calculateTotal(item.indAno, item.indCod, 'porImplementador', newTotalsPorImplementador, item.tipValCod);
                                                            const newTotalPorUbicacion = calculateTotal(item.indAno, item.indCod, 'porUbicacion', newTotalsPorUbicacion, item.tipValCod);
                                                            
                                                            // Comprueba si los totales de las cuatro secciones son iguales
                                                            if (newTotalPorAno === newTotalPorImplementador && newTotalPorAno === newTotalPorUbicacion) {
                                                                let totalPorAnoAll = 0;
                                                                let totalPorImplementadorAll = 0;
                                                                let totalPorUbicacionAll = 0;

                                                                indicadores.forEach(indicador => {
                                                                    // Procesar los totales por año
                                                                    const valoresAno = Object.entries(newTotalsPorAnoAll)
                                                                        .filter(([key, _]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}_`))
                                                                        .map(([_, value]) => Number(value))
                                                                        .filter(value => value !== 0);
                                                                    totalPorAnoAll += calcularTotalIndicador(valoresAno, indicador.tipValCod);
                                                                
                                                                    // Procesar los totales por implementador
                                                                    const valoresImplementador = Object.entries(newTotalsPorImplementador)
                                                                        .filter(([key, _]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}_`))
                                                                        .map(([_, value]) => Number(value))
                                                                        .filter(value => value !== 0);
                                                                    totalPorImplementadorAll += calcularTotalIndicador(valoresImplementador, indicador.tipValCod);
                                                                
                                                                    // Procesar los totales por ubicación
                                                                    const valoresUbicacion = Object.entries(newTotalsPorUbicacion)
                                                                        .filter(([key, _]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}_`))
                                                                        .map(([_, value]) => Number(value))
                                                                        .filter(value => value !== 0);
                                                                    totalPorUbicacionAll += calcularTotalIndicador(valoresUbicacion, indicador.tipValCod);
                                                                });

                                                                if (totalPorAnoAll === totalPorImplementadorAll && totalPorAnoAll === totalPorUbicacionAll) {
                                                                    setIsSubmitDisabled(false);
                                                                } else {
                                                                    setIsSubmitDisabled(true);
                                                                }
                                                            } else {
                                                                setIsSubmitDisabled(true);
                                                            }

                                                            if (newTotalPorAno === 0 && (newTotalPorImplementador > 0 || newTotalPorUbicacion > 0)) {
                                                                updateUnmatchedTotals(item.indAno, item.indCod, newTotalPorAno, 'totalPorAno', true);
                                                            } else if (newTotalPorAno !== newTotalPorImplementador) {
                                                                updateUnmatchedTotals(item.indAno, item.indCod, newTotalPorImplementador, 'totalPorImplementador', true);
                                                            } else if (newTotalPorAno !== newTotalPorUbicacion) {
                                                                updateUnmatchedTotals(item.indAno, item.indCod, newTotalPorUbicacion, 'totalPorUbicacion', true);
                                                            } else {
                                                                // Si no hay errores, asegúrate de eliminar cualquier error previo para este indicador
                                                                updateUnmatchedTotals(item.indAno, item.indCod, 0, 'totalPorAno');
                                                                updateUnmatchedTotals(item.indAno, item.indCod, 0, 'totalPorImplementador');
                                                                updateUnmatchedTotals(item.indAno, item.indCod, 0, 'totalPorUbicacion');
                                                            }
                                                            
                                                        }}
                                                        
                                                        maxLength={10}
                                                        style={{margin: 0}}
                                                        type="text" 
                                                        autoComplete='off'
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