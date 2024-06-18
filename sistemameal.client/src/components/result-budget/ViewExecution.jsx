// Importaciones necesarias de React y otros módulos
import { useState, useEffect, useCallback, Fragment } from 'react';
import { fetchData, fetchDataReturn } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Expand from '../../icons/Expand';
import Notiflix from 'notiflix';
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
import { formatterBudget } from '../monitoring/goal/helper';
import { exportToExcel, formatMonthKey, meses } from '../../helpers/budget';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';

const ViewExecution = () => {
    // Estado para controlar la visibilidad del menú desplegable.
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Estado para almacenar la lista de subproyectos obtenidos de alguna fuente de datos.
    const [subproyectos, setSubProyectos] = useState([]);
    // Estado para almacenar la lista de monedas disponibles.
    const [monedas, setMonedas] = useState([]);
    // Estado para almacenar el subproyecto seleccionado por el usuario.
    const [selectedSubProyecto, setSelectedSubProyecto] = useState(null);
    // Estado para almacenar los indicadores asociados con el subproyecto seleccionado.
    const [indicadores, setIndicadores] = useState([]);
    // Estado para controlar qué indicadores están expandidos en la interfaz de usuario.
    const [expandedIndicators, setExpandedIndicators] = useState([]);
    // Estado para almacenar filas adicionales de datos, posiblemente para una tabla o listado.
    const [additionalRows, setAdditionalRows] = useState({});
    // Estado para almacenar la moneda predeterminada para las metas (objetivos).
    const [currencyMeta, setCurrencyMeta] = useState({ monCod: '02', monSim: '€', monAbr: 'EUR' });
    // Estado para almacenar la moneda predeterminada para la ejecución (gastos reales).
    const [currencyEjecucion, setCurrencyEjecucion] = useState({ monCod: '01', monSim: '$', monAbr: 'USD' });
    // Estado para almacenar la moneda seleccionada por el usuario para realizar conversiones.
    const [selectedCurrency, setSelectedCurrency] = useState('0');
    // Estado para almacenar la moneda general que se aplicará a todos los cálculos.
    const [currencyGeneral, setCurrencyGeneral] = useState(null);
    // Estado para almacenar las tasas de cambio para las metas.
    const [exchangeRatesMeta, setExchangeRatesMeta] = useState({});
    // Estado para almacenar las tasas de cambio para la ejecución.
    const [exchangeRatesEjecucion, setExchangeRatesEjecucion] = useState({});
    // Estado para almacenar los valores originales antes de cualquier conversión de moneda.
    const [originalValues, setOriginalValues] = useState(null);


    // Funciones para manejar cambios en las tasas de cambio
    const handleExchangeRateMetaChange = (month, rate) => {
        setExchangeRatesMeta(prevRates => ({
            ...prevRates,
            [month]: rate
        }));
    };
    
    const handleExchangeRateEjecucionChange = (month, rate) => {
        setExchangeRatesEjecucion(prevRates => ({
            ...prevRates,
            [month]: rate
        }));
    };
    
    // Función para aplicar las tasas de cambio
    const applyExchangeRates = () => {
        const selectedMoneda = monedas.find(m => m.monCod === selectedCurrency);
        setCurrencyGeneral(selectedMoneda);
    
        const newRows = { ...additionalRows };
        Object.keys(newRows).forEach(rowKey => {
            meses.forEach((mes, indexMes) => {
                const monthKey = formatMonthKey(indexMes);
                const rateMeta = parseFloat(exchangeRatesMeta[monthKey]);
                const rateEjecucion = parseFloat(exchangeRatesEjecucion[monthKey]);
    
                if (newRows[rowKey].cells[monthKey]) {
                    newRows[rowKey].cells[monthKey].forEach(cell => {
                        const original = newRows[rowKey].originalValues[monthKey];
                        if (selectedMoneda && selectedMoneda.monCod !== currencyMeta.monCod) {
                            cell.metPre = (!isNaN(rateMeta) && rateMeta > 0) ? (original.metPre * rateMeta).toFixed(2) : original.metPre;
                        } else {
                            cell.metPre = original.metPre;
                        }
    
                        if (selectedMoneda && selectedMoneda.monCod !== currencyEjecucion.monCod) {
                            cell.ejePre = (!isNaN(rateEjecucion) && rateEjecucion > 0) ? (original.ejePre * rateEjecucion).toFixed(2) : original.ejePre;
                        } else {
                            cell.ejePre = original.ejePre;
                        }
                    });
                }
            });
        });
    
        setAdditionalRows(newRows);
    };

    // Función para restablecer las tasas de cambio y monedas a los valores originales
    const resetExchangeRates = () => {
        setAdditionalRows(originalValues);
        setCurrencyGeneral(null);
        setExchangeRatesMeta({});
        setExchangeRatesEjecucion({});
        // Restablecer cualquier otro estado relacionado si es necesario
    };

    // Función para procesar las metas y almacenar los valores originales
    const processMetas = (metas) => {
        const rows = {};
        let counter = 0;
    
        metas.forEach(meta => {
            const rowKey = `${meta.finCod}_${meta.impCod}_${JSON.stringify({ ubiAno: meta.ubiAno, ubiCod: meta.ubiCod })}_${meta.indAno}_${meta.indCod}`;
    
            if (!rows[rowKey]) {
                rows[rowKey] = {
                    id: `${meta.indAno}_${meta.indCod}_${counter}`,
                    indAno: meta.indAno,
                    indCod: meta.indCod,
                    indNum: meta.indNum,
                    indNom: meta.indNom,
                    finNom: meta.finNom,
                    impNom: meta.impNom,
                    ubiNom: meta.ubiNom,
                    uniNom: meta.uniNom,
                    cells: {},
                    originalValues: {}
                };
                counter++;
            }
    
            // Asegúrate de que existe un arreglo para el mes actual
            if (!rows[rowKey].cells[meta.metMesPlaTec]) {
                rows[rowKey].cells[meta.metMesPlaTec] = [];
                rows[rowKey].originalValues[meta.metMesPlaTec] = { metPre: meta.metMetPre, ejePre: meta.metEjePre }; // Guarda los valores originales
            }
    
            const inputValues = {
                metPre: meta.metMetPre,
                ejePre: meta.metEjePre,
                meta: { metAno: meta.metAno, metCod: meta.metCod },
            };
    
            // Agrega los valores al arreglo correspondiente al mes
            rows[rowKey].cells[meta.metMesPlaTec].push(inputValues);
        });
    
        setAdditionalRows(rows);
        setOriginalValues(JSON.parse(JSON.stringify(rows)));
    };

    // Hook useForm de react-hook-form para manejar formularios
    const { 
        register, 
        watch,
        getValues,
        formState: { errors, dirtyFields, isSubmitted }, 
        setValue, 
    } = 
    useForm({ mode: "onChange"});

    // Función para manejar la apertura/cierre del dropdown
    const handleToggleDropdown = useCallback(() => {
        setDropdownOpen(prevState => !prevState);
    }, []);

    // Efectos secundarios para cargar datos iniciales
    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos);
        fetchData('Moneda',setMonedas);
    }, []);

    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            const selected = subproyectos.find(item => item.subProAno === subProAno && item.subProCod === subProCod);
            setSelectedSubProyecto(selected);
        } else {
            setIndicadores([]);
            setValue('metAnoPlaTec','0');
            setSelectedSubProyecto(null);
        }
    }, [watch('subproyecto')]);

    useEffect(() => {
        const subproyecto = watch('subproyecto');
        const ano = watch('metAnoPlaTec');

        if (subproyecto && subproyecto !== '0'&& ano && ano !== '0') {
            const { subProAno, subProCod } = JSON.parse(subproyecto);

            // Inicia el bloqueo de Notiflix
            if (document.querySelector('.view-execution-block')) {
                Notiflix.Block.pulse('.view-execution-block', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }

            // Realiza todas las peticiones en paralelo
            Promise.all([
                fetchDataReturn(`Indicador/subproyecto-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Meta/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/financiador-actividad/${subProAno}/${subProCod}`),
            ]).then(([dataIndicadores, dataMetas, dataPorFinanciador]) => {
                // Determina la moneda para las metas
                if (dataPorFinanciador.length > 0) {
                    // Obtén el valor de monCod del primer registro
                    const firstMonCod = dataPorFinanciador[0].monCod;
                
                    // Verifica si todos los registros tienen el mismo valor de monCod
                    const allSameMonCod = dataPorFinanciador.every(record => record.monCod === firstMonCod);
                
                    // Si todos los registros tienen el mismo valor de monCod, establece currencyMeta en ese valor
                    // Si no, establece currencyMeta en { monCod: '02', monSim: '€', monAbr: 'EUR' }
                    setCurrencyMeta(allSameMonCod 
                        ? { monCod: dataPorFinanciador[0].monCod, monSim: dataPorFinanciador[0].monSim, monAbr: dataPorFinanciador[0].monAbr } 
                        : { monCod: '02', monSim: '€', monAbr: 'EUR' });
                }
                
                setIndicadores(dataIndicadores);
                processMetas(dataMetas);

                // Expande todos los indicadores
                const allExpandedIndicators = dataIndicadores.map(ind => `${ind.indAno}_${ind.indCod}`);
                setExpandedIndicators(allExpandedIndicators);
            }).catch(error => {
                // Maneja los errores
                console.error('Error:', error);
                Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
            }).finally(() => {
                // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
                Notiflix.Block.remove('.view-execution-block');
            });
        } else {
            setIndicadores([]);
        }
    }, [watch('metAnoPlaTec')]);

    return (
        <div className='p_75 flex flex-column flex-grow-1 overflow-auto'>
            <h1 className="Large-f1_5"> Reporte de Gasto vs Presupuesto </h1>
            <div className='flex jc-space-between gap_5 p_25'>
                <select 
                    id='subproyecto'
                    style={{textTransform: 'capitalize', margin: '0'}}
                    className={`p_5 Phone_8 PowerMas_Modal_Form_${dirtyFields.subproyecto || isSubmitted ? (errors.subproyecto ? 'invalid' : 'valid') : ''}`} 
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
                <select 
                    id='metAnoPlaTec'
                    style={{margin: '0'}}
                    className={`p_5 Phone_2 PowerMas_Modal_Form_${dirtyFields.metAnoPlaTec || isSubmitted ? (errors.metAnoPlaTec ? 'invalid' : 'valid') : ''}`} 
                    {...register('metAnoPlaTec', { 
                        validate: {
                            required: value => value !== '0' || 'El campo es requerido',
                        }
                    })}
                >
                    <option value="0">--Seleccione un Año--</option>
                    {selectedSubProyecto && Array.from({length: selectedSubProyecto.subProPerAnoFin - selectedSubProyecto.subProPerAnoIni + 1}, (_, i) => i + Number(selectedSubProyecto.subProPerAnoIni)).map(metAnoPlaTec => (
                        <option key={metAnoPlaTec} value={metAnoPlaTec}>{metAnoPlaTec}</option>
                    ))}
                </select>
                
                <div className={`PowerMas_Dropdown_Export Phone_2 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={handleToggleDropdown}>
                        Exportar
                        <span className='flex'>
                            <Expand />
                        </span>
                    </button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        <a onClick={() => {
                            exportToExcel(indicadores, additionalRows, getValues, subproyectos, watch('metAnoPlaTec'));
                            setDropdownOpen(false);
                        }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                    </div>
                </div>
            </div>
            <div className='flex gap-1 p_5'>
                <select 
                    id='monCod'
                    style={{margin: '0'}}
                    className={`p_25 block Phone_2 PowerMas_Modal_Form_${dirtyFields.monCod || isSubmitted ? (errors.monCod ? 'invalid' : 'valid') : ''}`} 
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                    <option value="0"> Seleccione Moneda </option>
                    {monedas.map((item, index) => (
                        <option 
                            key={index} 
                            value={item.monCod}
                        > 
                            {item.monNom}
                        </option>
                    ))}
                </select>
                <button className='PowerMas_Buttom_Primary Large_2' onClick={applyExchangeRates}>Cambiar</button>
                <button className='PowerMas_Buttom_Secondary Large_2' onClick={resetExchangeRates}>Reiniciar</button>
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto result-chain-block flex view-execution-block">
                {
                    indicadores.length > 0 ?
                    <table className="PowerMas_TableStatus">
                        <thead>
                            <tr style={{ zIndex: '2' }}>
                                <th></th>
                                <th style={{ position: 'sticky', left: '0', backgroundColor: '#fff' }}></th>
                                <th colSpan={3}></th>
                                {meses.map((mes, i) => (
                                    <th colSpan={2} className='center' style={{ textTransform: 'capitalize' }} key={i + 1}>{mes.toLowerCase()}</th>
                                ))}
                            </tr>
                            <tr className='center' style={{ position: 'sticky', top: '2rem', backgroundColor: '#fff', zIndex: '3'  }}>
                                <th></th>
                                <th style={{ position: 'sticky', left: '0', backgroundColor: '#fff' }}>Código</th>
                                <th colSpan={2}>Nombre</th>
                                <th>Unidad</th>
                                {meses.map((mes) => (
                                    <Fragment key={mes}>
                                        <th className='center'>Meta</th>
                                        <th className='center'>Ejecución</th>
                                    </Fragment>
                                ))}
                            </tr>
                            <tr className='center' style={{ position: 'sticky', top: '4rem', backgroundColor: '#fff', zIndex: '3' }}>
                                <th></th>
                                <th style={{ position: 'sticky', left: '0', backgroundColor: '#fff' }}></th>
                                <th colSpan={3}></th>
                                {meses.map((mes, indexMes) => {
                                    const monthKey = formatMonthKey(indexMes);
                                    return (
                                        <Fragment key={monthKey}>
                                            <th className='center'>
                                                <input
                                                    style={{
                                                        minWidth: '4rem'
                                                    }}
                                                    type="text"
                                                    className='Large_12 f_75'
                                                    placeholder="Tasa"
                                                    value={exchangeRatesMeta[monthKey] || ''}
                                                    onInput={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || (/^\d*\.?\d*$/.test(value))) {
                                                            e.target.value = value;
                                                        } else {
                                                            e.target.value = value.slice(0, -1);
                                                        }
                                                    }}
                                                    onChange={(e) => handleExchangeRateMetaChange(monthKey, e.target.value)}
                                                />
                                            </th>
                                            <th className='center'>
                                                <input
                                                    style={{
                                                        minWidth: '4rem'
                                                    }}
                                                    type="text"
                                                    className='Large_12 f_75'
                                                    placeholder="Tasa"
                                                    value={exchangeRatesEjecucion[monthKey] || ''}
                                                    onInput={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || (/^\d*\.?\d*$/.test(value))) {
                                                            e.target.value = value;
                                                        } else {
                                                            e.target.value = value.slice(0, -1);
                                                        }
                                                    }}
                                                    onChange={(e) => handleExchangeRateEjecucionChange(monthKey, e.target.value)}
                                                />
                                            </th>
                                        </Fragment>
                                    );
                                })}
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
                                    <Fragment key={index}>
                                        <tr>
                                            <td>
                                                <div 
                                                    className={`pointer bold round p_25 PowerMas_MenuIcon ${expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                                    onClick={() => {
                                                        if (expandedIndicators.includes(`${item.indAno}_${item.indCod}`)) {
                                                            setExpandedIndicators(expandedIndicators.filter(indicator => indicator !== `${item.indAno}_${item.indCod}`));
                                                        } else {
                                                            setExpandedIndicators([...expandedIndicators, `${item.indAno}_${item.indCod}`]);
                                                        }
                                                    }}
                                                > &gt; </div>
                                            </td>
                                            <td style={{position: 'sticky', left: '0', backgroundColor: '#fff',zIndex: '1'}}>{item.indNum}</td>
                                            {
                                                text.length > 30 ?
                                                <td
                                                colSpan={3}
                                                    data-tooltip-id="info-tooltip" 
                                                    data-tooltip-content={text} 
                                                >{shortText}</td>
                                                :
                                                <td colSpan={2}>{text}</td>
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
                                            <td colSpan={24}></td>
                                        </tr>
                                        {Object.values(additionalRows).filter(row => row.indAno === item.indAno && row.indCod === item.indCod)
                                            .map((row, rowIndex) => (
                                                <tr key={`${row.indAno}_${row.indCod}_${row.id}`} style={{visibility: expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'visible' : 'collapse'}}>
                                                    <td></td>
                                                    <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></td>
                                                    <td className='' style={{textTransform: 'capitalize'}}>
                                                        {row.finNom}
                                                    </td>
                                                    <td className='' style={{textTransform: 'capitalize'}}>
                                                        {row.impNom}
                                                    </td>
                                                    <td className='' style={{textTransform: 'capitalize'}}>
                                                        {row.ubiNom}
                                                    </td>
                                                    {meses.map((mes, indexMes) => {
                                                        const monthKey = formatMonthKey(indexMes);
                                                        const valoresMes = row.cells[monthKey];
                                                        return (
                                                            <Fragment key={indexMes}>
                                                                <td className='center' style={{borderLeft: '1px solid #dee2e6'}}>
                                                                    {valoresMes ? `${formatterBudget.format(valoresMes.map(v => v.metPre).join(', '))} (${currencyGeneral ? currencyGeneral.monSim : currencyMeta.monSim})` : ''}
                                                                </td>
                                                                <td className='center' style={{borderRight: '1px solid #dee2e6'}}>
                                                                    {valoresMes ? `${formatterBudget.format(valoresMes.map(v => v.ejePre).join(', '))} (${currencyGeneral ? currencyGeneral.monSim : currencyEjecucion.monSim})` : ''}
                                                                </td>
                                                            </Fragment>
                                                        );
                                                    })}
                                                </tr>
                                        ))}
                                    </Fragment>
                                )
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
        </div>
    );
};

export default ViewExecution;
