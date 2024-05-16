import { useState, useEffect, useCallback, Fragment } from 'react';
import { fetchData, fetchDataReturn } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Expand from '../../icons/Expand';
import Notiflix from 'notiflix';
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
import { formatterBudget } from '../monitoring/goal/helper';

const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

const formatMonthKey = (index) => {
    return (index + 1).toString().padStart(2, '0');
};

const ViewExecution = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [subproyectos, setSubProyectos] = useState([]);
    const [monedas, setMonedas] = useState([]);
    const [selectedSubProyecto, setSelectedSubProyecto] = useState(null);
    const [indicadores, setIndicadores] = useState([]);
    const [expandedIndicators, setExpandedIndicators] = useState([])
    const [additionalRows, setAdditionalRows] = useState({});
    
    const [currencyMeta, setCurrencyMeta] = useState({ monCod: '02', monSim: '€', monAbr: 'EUR' });
    const [currencyEjecucion, setCurrencyEjecucion] = useState({ monCod: '01', monSim: '$', monAbr: 'USD' });

    const [selectedCurrency, setSelectedCurrency] = useState('0'); // Estado para la moneda seleccionada
    const [exchangeRate, setExchangeRate] = useState(1); // Estado para la tasa de cambio


    const [currencyGeneral, setCurrencyGeneral] = useState(null)


    const applyExchangeRate = () => {
        const rate = parseFloat(exchangeRate);
        if (!isNaN(rate) && rate > 0) {
            const newRows = { ...additionalRows };
            const selectedMoneda = monedas.find(m => m.monCod === selectedCurrency);
            setCurrencyGeneral(selectedMoneda)

            Object.keys(newRows).forEach(rowKey => {
                meses.forEach((mes, indexMes) => {
                    const monthKey = formatMonthKey(indexMes);
                    if (newRows[rowKey].cells[monthKey]) {
                        newRows[rowKey].cells[monthKey].forEach((cell, cellIndex) => {
                            // Utiliza los valores originales para la conversión
                            const original = newRows[rowKey].originalValues[monthKey];
                            if (currencyMeta.monCod !== selectedCurrency) {
                                cell.metPre = (original.metPre * exchangeRate).toFixed(2); // Convierte Meta
                            } else {
                                cell.metPre = (original.metPre * 1).toFixed(2); // Convierte Meta
                            }

                            if (selectedCurrency !== '01') {
                                cell.ejePre = (original.ejePre * exchangeRate).toFixed(2); // Convierte Ejecución
                            } else {
                                cell.ejePre = (original.ejePre * 1).toFixed(2); // Convierte Ejecución
                            }
                        });
                    }
                });
            });
            setAdditionalRows(newRows); // Actualiza el estado con los nuevos valores
        } else {
            Notiflix.Notify.failure('Por favor ingresa una tasa de cambio válida.')
        }
    };

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
                    finNom: meta.finNom,
                    impNom: meta.impNom,
                    ubiNom: meta.ubiNom,
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
    };

    const { 
        register, 
        watch, 
        formState: { errors, dirtyFields, isSubmitted }, 
        setValue, 
    } = 
    useForm({ mode: "onChange"});

    const handleToggleDropdown = useCallback(() => {
        setDropdownOpen(prevState => !prevState);
    }, []);

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
            ]).then(([dataIndicadores, dataMetas]) => {
                // Determina la moneda para las metas
                const allMonCod = dataIndicadores.map(ind => ind.monCod);
                const uniqueMonCod = new Set(allMonCod);
                if (uniqueMonCod.size === 1) {
                    // Todos los monCod son iguales, actualiza el estado con el objeto correspondiente
                    const moneda = monedas.find(m => m.monCod === allMonCod[0]);
                    setCurrencyMeta(moneda ? { monCod: moneda.monCod, monSim: moneda.monSim, monAbr: moneda.monAbr } : { monCod: '02', monSim: '€', monAbr: 'EUR'  });
                } else {
                    // Los monCod son diferentes, usa el valor por defecto (Euro)
                    setCurrencyMeta({ monCod: '02', monSim: '€', monAbr: 'EUR' });
                }
                
                console.log(dataIndicadores);
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
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
            <div className='flex jc-space-between gap-1 p_5'>
                <select 
                    id='subproyecto'
                    style={{textTransform: 'capitalize', margin: '0'}}
                    className={`p_5 block Phone_12 PowerMas_Modal_Form_${dirtyFields.subproyecto || isSubmitted ? (errors.subproyecto ? 'invalid' : 'valid') : ''}`} 
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
                <select 
                    id='metAnoPlaTec'
                    style={{margin: '0'}}
                    className={`p_5 block Phone_3 PowerMas_Modal_Form_${dirtyFields.metAnoPlaTec || isSubmitted ? (errors.metAnoPlaTec ? 'invalid' : 'valid') : ''}`} 
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
                
                <div className={`PowerMas_Dropdown_Export Large_3 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={handleToggleDropdown}>
                        Exportar
                        <span className='flex'>
                            <Expand />
                        </span>
                    </button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        <a onClick={() => {
                            exportToExcel(indicadores, totals, additionalRows);
                            setDropdownOpen(false);
                        }} className='flex jc-space-between p_5'>Excel <img className='Large_1' alt="" /> </a>
                    </div>
                </div>
            </div>
            <div className='flex jc-center gap-1 p_5'>
                <select 
                    id='monCod'
                    style={{margin: '0'}}
                    className={`p_5 block Phone_3 PowerMas_Modal_Form_${dirtyFields.monCod || isSubmitted ? (errors.monCod ? 'invalid' : 'valid') : ''}`} 
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                    <option value="0">-- Seleccione Moneda--</option>
                    {monedas.map((item, index) => (
                        <option 
                            key={index} 
                            value={item.monCod}
                        > 
                            {item.monNom}
                        </option>
                    ))}
                </select>
                <input
                    className={`p_5 block Phone_3 PowerMas_Modal_Form_${dirtyFields.tipoCambio || isSubmitted ? (errors.tipoCambio ? 'invalid' : 'valid') : ''}`} 
                    type="text"
                    placeholder='Ejm: 3.14'
                    maxLength={10}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    onInput={(e) => {
                        const value = e.target.value;
                        if (value === '' || (/^\d*\.?\d*$/.test(value))) {
                            e.target.value = value;
                        } else {
                            e.target.value = value.slice(0, -1);
                        }
                        
                    }}
                />
                <button onClick={applyExchangeRate}>Cambiar</button>
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto result-chain-block flex view-execution-block">
                {
                    indicadores.length > 0 ?
                    <table className="PowerMas_TableStatus">
                        <thead>
                            <tr style={{zIndex: '2'}}>
                                <th></th>
                                <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></th>
                                <th colSpan={3}></th>
                                {meses.map((mes, i) => (
                                    <th colSpan={2} className='center' style={{textTransform: 'capitalize'}} key={i+1}>{mes.toLowerCase()} </th>
                                ))}
                            </tr>
                            <tr className='center' style={{position: 'sticky', top: '2rem', backgroundColor: '#fff'}}>
                                <th></th>
                                <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>Código</th>
                                <th>Financiador</th>
                                <th>Implementador</th>
                                <th>Ubicación</th>
                                {meses.map((mes) => (
                                    <Fragment>
                                        <th className='center'>Meta</th>
                                        <th className='center'>Ejecución</th>
                                    </Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        {
                            indicadores.map((item, index) => {
                                const text = item.indNom;
                                const shortText = text.length > 80 ? text.substring(0, 80) + '...' : text;

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
                                                text.length > 60 ?
                                                <td
                                                colSpan={3}
                                                    data-tooltip-id="info-tooltip" 
                                                    data-tooltip-content={text} 
                                                >{shortText}</td>
                                                :
                                                <td colSpan={3}>{text}</td>
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
