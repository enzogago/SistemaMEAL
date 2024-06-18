import React, { Fragment, useEffect, useState } from 'react'
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import { fetchData } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { formatter } from '../monitoring/goal/helper';
import Expand from '../../icons/Expand';
import useEntityActions from '../../hooks/useEntityActions';
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
import { meses } from '../../helpers/simple';
import { exportToExcel } from './export';
import { fetchDataReturn } from '../reusable/fetchs';

const ExecutionBudget = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [subproyectos, setSubProyectos] = useState([]);
    const [selectedSubProyecto, setSelectedSubProyecto] = useState(null);
    const [indicadores, setIndicadores] = useState([]);
    
    const [financiadoresSelect, setFinanciadoresSelect] = useState([]);
    const [additionalRows, setAdditionalRows] = useState([]);
    const [expandedIndicators, setExpandedIndicators] = useState([]);
    
    const [totals, setTotals] = useState({});
    const [prevValues, setPrevValues] = useState({});
    
    const [rowIdCounter, setRowIdCounter] = useState(0);

    const [initialMetas, setInitialMetas] = useState([]);

    const actions = useEntityActions('METAS MENSUALES PRESUPUESTO');

    const [isFormValid, setIsFormValid] = useState(false);

    // Estados relacionados con los datos agrupados
    const [cadenaPeriodoGrouped, setCadenaPeriodoGrouped] = useState(null);
    const [cadenaImplementadorGrouped, setCadenaImplementadorGrouped] = useState(null);
    const [cadenaUbicacionGrouped, setCadenaUbicacionGrouped] = useState(null);
    const [cadenaFinanciadorGrouped, setCadenaFinanciadorGrouped] = useState(null);

    const { 
        register,
        unregister,
        watch, 
        handleSubmit, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        getValues
    } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos);
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
            // Inicia el bloqueo de Notiflix
            if (document.querySelector('.content-block')) {
                Notiflix.Block.pulse('.content-block', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
            
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            // Realiza todas las peticiones en paralelo
            Promise.all([
                fetchDataReturn(`Indicador/subproyecto-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Financiador/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Meta/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/cadena-actividad/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/implementador-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion-actividad/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/financiador-actividad/${subProAno}/${subProCod}`),
            ]).then(([
                indicadorData, 
                financiadorData, 
                metaData, 
                cadenaPeriodoData, 
                cadenaImplementadorData, 
                cadenaUbicacionData,
                cadenaFinanciadorData,
            ]) => {

                setIndicadores(indicadorData);
                setFinanciadoresSelect(financiadorData);

                const fieldNames = Object.keys(getValues());

                // Define los patrones de los campos que deseas desregistrar
                const patterns = ['financiador_', 'implementador_', 'ubicacion_', 'mes_', 'nombreUbicacion_', 'meta_', 'metMetTec_'];

                // Filtra los nombres de los campos que coincidan con alguno de los patrones
                const fieldsToUnregister = fieldNames.filter(fieldName =>
                    patterns.some(pattern => fieldName.startsWith(pattern))
                );

                // Desregistra los campos
                fieldsToUnregister.forEach(fieldName => {
                    unregister(fieldName);
                });

                setInitialMetas(metaData);
                setTotals({});
                const rows = {};
                let counter = rowIdCounter;
                metaData.forEach(meta => {
                    // Usa meta.impCod, la ubicación y el indicador para crear una clave única para cada fila
                    const rowKey = `${meta.finCod}_${meta.impCod}_${JSON.stringify({ ubiAno: meta.ubiAno, ubiCod: meta.ubiCod })}_${meta.indAno}_${meta.indCod}`;

                    if (!rows[rowKey]) {
                        counter++;
                    }
                    // Crea un objeto con los valores que necesitas para tus inputs
                    const inputValues = {
                        mes: meta.metMetPre,
                        financiador: meta.finCod,
                        implementador: meta.impNom,
                        ubicacion: JSON.stringify({ ubiAno: meta.ubiAno, ubiCod: meta.ubiCod }),
                        meta: JSON.stringify({ metAno: meta.metAno, metCod: meta.metCod }),
                    };
                        
                    setValue(`financiador_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.financiador);
                    setValue(`implementador_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.implementador);
                    setValue(`ubicacion_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.ubicacion);
                    setValue(`mes_${meta.metMesPlaTec}_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.mes);
                    setValue(`nombreUbicacion_${meta.indAno}_${meta.indCod}_${counter}`, meta.ubiNom.toLowerCase());
                    setValue(`meta_${meta.metMesPlaTec}_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.meta);
                    setValue(`metMetTec_${meta.metMesPlaTec}_${meta.indAno}_${meta.indCod}_${counter}`, meta.metMetTec);
                    
                    setValue(`implementadorValue_${meta.indAno}_${meta.indCod}_${counter}`, meta.impCod);
                    setValue(`ubiAno_${meta.indAno}_${meta.indCod}_${counter}`, meta.ubiAno);
                    setValue(`ubiCod_${meta.indAno}_${meta.indCod}_${counter}`, meta.ubiCod);
                    setValue(`usuAno_${meta.indAno}_${meta.indCod}_${counter}`, meta.usuAno);
                    setValue(`usuCod_${meta.indAno}_${meta.indCod}_${counter}`, meta.usuCod);

                    // Calcula los totales aquí
                    const key = `${meta.indAno}_${meta.indCod}_${counter}_${meta.metMesPlaTec}`;
                    const totalKey = `${meta.indAno}_${meta.indCod}_${counter}_total`;
                    const newValue = Number(inputValues.mes);
                    setTotals(prevTotals => ({
                        ...prevTotals,
                        [key]: (prevTotals[key] || 0) + newValue,
                        [totalKey]: (prevTotals[totalKey] || 0) + newValue
                    }));
                    setPrevValues(prevValues => ({
                        ...prevValues,
                        [key]: newValue
                    }));

                    if (!rows[rowKey]) {
                        // Si la fila no existe todavía, crea una nueva
                        rows[rowKey] = {
                            id: `${meta.indAno}_${meta.indCod}_${counter}`, // Usa el contador para generar un ID único
                            indAno: meta.indAno,
                            indCod: meta.indCod,
                            indNum: meta.indNum,
                            uniNom: meta.uniNom,
                            cells: [],
                        };
                    }

                    // Agrega la celda a la fila
                    rows[rowKey].cells.push(inputValues);
                });
                const filas = Object.values(rows);
                setAdditionalRows(filas);
                setRowIdCounter(counter+1);

                let groupedImplementadorData = {};
                cadenaImplementadorData.forEach(item => {
                    let key = `${item.indAno}-${item.indCod}`;

                    if (!groupedImplementadorData[key]) {
                        groupedImplementadorData[key] = {};
                    }

                    groupedImplementadorData[key][item.impCod] = { name: item.impNom, value: item.cadResImpMetPre ? item.cadResImpMetPre : 0 }
                });

                let groupedFinanciadorData = {};
                cadenaFinanciadorData.forEach(item => {
                    let key = `${item.indAno}-${item.indCod}`;

                    if (!groupedFinanciadorData[key]) {
                        groupedFinanciadorData[key] = {};
                    }

                    groupedFinanciadorData[key][item.finCod] = { name: item.finNom, value: item.cadResFinMetPre ? item.cadResFinMetPre : 0 }
                });

                let groupedUbicacionData = {};
                cadenaUbicacionData.forEach(item => {
                    let key = `${item.indAno}-${item.indCod}`;
                    if (!groupedUbicacionData[key]) {
                        groupedUbicacionData[key] = [];
                    }
                    groupedUbicacionData[key][`${item.ubiAno}-${item.ubiCod}`] = { name: item.ubiNom, value: item.cadResUbiMetPre ? item.cadResUbiMetPre : 0 }
                });

                let groupedPeriodoData = {};
                cadenaPeriodoData.forEach(item => {
                    console.log(groupedPeriodoData)
                    let key = `${item.indAno}-${item.indCod}`;
                    groupedPeriodoData[key]  = item.cadResPerMetPre ? item.cadResPerMetPre : 0;
                });
                console.log(groupedPeriodoData)
                setCadenaPeriodoGrouped(groupedPeriodoData);
                setCadenaUbicacionGrouped(groupedUbicacionData);
                setCadenaImplementadorGrouped(groupedImplementadorData);
                setCadenaFinanciadorGrouped(groupedFinanciadorData);
            }).catch(error => {
                // Maneja los errores
                console.error('Error:', error);
                Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
            }).finally(() => {
                // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
                Notiflix.Block.remove('.content-block');
            });
        } else {
            setIndicadores([]);
        }
    }, [watch('metAnoPlaTec')]);
    
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const onSubmit = (data) => {
        let metas = [];
        let metasIniciales = [];
        additionalRows.forEach((row, rowIndex) => {
            meses.forEach((mes, mesIndex) => {
                let mesValue = data[`mes_${String(mesIndex+1).padStart(2, '0')}_${row.id}`];
                let financiadorValue = data[`financiador_${row.id}`];
                let meta = data[`meta_${String(mesIndex+1).padStart(2, '0')}_${row.id}`];
                if (meta && meta !== '') {
                    const currentValue = {
                        mes: mesValue,
                        meta: meta,
                        financiador: financiadorValue
                    };
                    
                    if (meta != undefined) {
                        const {metAno,metCod} = JSON.parse(meta);
                        
                        metasIniciales.push({
                            indAno: row.indAno,
                            indCod: row.indCod,
                            metMesPlaTec: (mesIndex + 1).toString().padStart(2, '0'),
                            metMetPre: mesValue,
                            metAnoPlaTec: data.metAnoPlaTec,
                            metAno,
                            metCod,
                            financiador: financiadorValue
                        });
                        
                        // Buscar la meta inicial correspondiente
                        const initialValue = initialMetas.find(initialMeta => 
                            initialMeta.metAno === metAno &&
                            initialMeta.metCod === metCod &&
                            initialMeta.metMesPlaTec === String(mesIndex+1).padStart(2, '0')
                        );
                        if (initialValue && (
                            initialValue.metMetPre !== mesValue || initialValue.finCod !== financiadorValue
                        )) {
                            // Aquí, la meta es nueva o ha cambiado desde su valor inicial
                            metas.push({
                                indAno: row.indAno,
                                indCod: row.indCod,
                                metMesPlaTec: (mesIndex + 1).toString().padStart(2, '0'),
                                metMetPre: mesValue,
                                metAnoPlaTec: data.metAnoPlaTec,
                                metAno,
                                metCod,
                                finCod: financiadorValue
                            });
                        }
                        
                    } 
                } else {
                    if (mesValue && mesValue !== '' ) {
                        let impCod= data[`implementadorValue_${row.id}`];
                        let ubiAno= data[`ubiAno_${row.id}`];
                        let ubiCod= data[`ubiCod_${row.id}`];
                        let usuAno= data[`usuAno_${row.id}`];
                        let usuCod= data[`usuCod_${row.id}`];


                        metas.push({
                            indAno: row.indAno,
                            indCod: row.indCod,
                            metMesPlaTec: (mesIndex + 1).toString().padStart(2, '0'),
                            metMetPre: mesValue,
                            metAnoPlaTec: data.metAnoPlaTec,
                            finCod: financiadorValue,
                            impCod,
                            ubiAno,
                            ubiCod,
                            usuAno,
                            usuCod
                        });
                    }
                }
            });
        });

        handleUpdate(metas);
        
    };

    const handleUpdate = async (metas) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(metas),
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            reset();
            Notiflix.Notify.success(data.message);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const validateInput = (newValue, row, monthIndex) => {
        const financiadorValue = watch(`financiador_${row.id}`);
    
        if (financiadorValue === '0') {
            return true;
        }
    
        // Inicializa los totales acumulados para implementador y ubicación
        let totalPorFinanciador = 0;
        let totalPorPeriodo = 0;
    
        // Itera sobre todas las filas adicionales para acumular los valores
        additionalRows.forEach(currentRow => {
            if (currentRow.indAno === row.indAno && currentRow.indCod === row.indCod) {
                const currentFinanciadorValue = watch(`financiador_${currentRow.id}`);
                if (currentFinanciadorValue === financiadorValue) {
                    for (let i = 0; i < 12; i++) {
                        totalPorFinanciador += Number(watch(`mes_${String(i+1).padStart(2, '0')}_${currentRow.id}`) || 0);
                    }
                }
                for (let i = 0; i < 12; i++) {
                    totalPorPeriodo += Number(watch(`mes_${String(i+1).padStart(2, '0')}_${currentRow.id}`) || 0);
                }
            }
        });
    
        // Resta el valor previo y suma el nuevo valor para obtener los nuevos totales
        const prevValue = prevValues[`${row.id}_${String(monthIndex+1).padStart(2, '0')}`] || 0;
        totalPorFinanciador = totalPorFinanciador - prevValue + Number(newValue);
        totalPorPeriodo = totalPorPeriodo - prevValue + Number(newValue);
    
        // Obtén los límites máximos específicos para implementador y ubicación
        const maxFinanciador = cadenaFinanciadorGrouped[`${row.indAno}-${row.indCod}`][financiadorValue].value;
        const maxPeriodo = cadenaPeriodoGrouped[`${row.indAno}-${row.indCod}`];
        const unidadNom = row.uniNom.charAt(0) + row.uniNom.slice(1).toLowerCase();

        // Valida contra los máximos específicos
        if (totalPorFinanciador > maxFinanciador) {
            const financiador = financiadoresSelect.find(item => item.finCod === financiadorValue);
            const financiadorNom = financiador.finNom.charAt(0) + financiador.finNom.slice(1).toLowerCase();

            Notiflix.Report.warning('Advertencia', `La meta del financiador ${financiadorNom} es ${totalPorFinanciador} ${unidadNom}, pero en la cadena de resultado se estableció en ${maxFinanciador} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
            return false;
        }
        if (totalPorPeriodo > maxPeriodo) {
            const ano = watch('metAnoPlaTec');
            Notiflix.Report.warning('Advertencia', `La meta del periodo ${ano} es ${totalPorPeriodo} ${unidadNom}, pero en la cadena de resultado se estableció en ${maxPeriodo} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
            return false;
        }
    
        // Si pasa todas las validaciones, el valor es aceptado
        return true;
    };
     
    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto content-block relative'>
            <h1 className="Large-f1_5"> Metas Presupuesto </h1>
            <div className='flex jc-space-between gap-1 p_5'>
                <div className="flex-grow-1">
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
                </div>
                <div className='Phone_2'>
                    <select 
                        id='metAnoPlaTec'
                        style={{margin: '0'}}
                        className={`p_5 block Phone_12 PowerMas_Modal_Form_${dirtyFields.metAnoPlaTec || isSubmitted ? (errors.metAnoPlaTec ? 'invalid' : 'valid') : ''}`} 
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
                </div>
                {
                    actions.excel &&
                    <div className={`PowerMas_Dropdown_Export Phone_2 ${dropdownOpen ? 'open' : ''}`}>
                        <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>
                            Exportar
                            <span className="flex">
                                <Expand />
                            </span>
                        </button>
                        <div className="PowerMas_Dropdown_Export_Content Phone_12">
                            <a onClick={() => {
                                exportToExcel(indicadores, totals, additionalRows, getValues, subproyectos, financiadoresSelect, watch('metAnoPlaTec'));
                                setDropdownOpen(false);
                            }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                        </div>
                    </div>
                }
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto flex">
                {
                    indicadores.length > 0 ?
                    <table className="PowerMas_TableStatus ">
                        <thead>
                            <tr style={{zIndex: '1'}}>
                                <th className='center'></th>
                                <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>Código</th>
                                <th colSpan={3}>Nombre</th>
                                {meses.map((mes, i) => (
                                    <th className='center' style={{textTransform: 'capitalize'}} key={i+1}>{mes.toLowerCase()} (€)</th>
                                ))}
                                <th style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>Total (€)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            indicadores.map((item, index) => {
                                const text = item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase();
                                const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                                
                                return (
                                    <Fragment  key={index}>
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
                                        <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>{item.indNum}</td>
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
                                        {meses.map((mes, i) => (
                                            <td key={i+1} className='center'>
                                                {formatter.format(Object.entries(totals)
                                                    .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith(String(i+1).padStart(2, '0')))
                                                    .reduce((sum, [, value]) => sum + value, 0))} €
                                            </td>
                                        ))}
                                        <td className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                            {formatter.format(Object.entries(totals)
                                                .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith('_total'))
                                                .reduce((sum, [, value]) => sum + value, 0))} €
                                        </td>
                                    </tr>
                                    {additionalRows.filter(row => row.indAno === item.indAno && row.indCod === item.indCod).map((row, rowIndex) => (
                                        <tr key={`${row.indAno}_${row.indCod}_${row.id}`} style={{visibility: expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'visible' : 'collapse'}}>
                                            <td ></td>
                                            <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></td>
                                            <td>
                                                <select 
                                                    style={{textTransform: 'capitalize', margin: '0'}}
                                                    id={`financiador_${row.id}`}
                                                    disabled={!actions.add}
                                                    onInput={(e) => {
                                                        // Actualiza el valor del implementador
                                                        const newFinanciadorValue = e.target.value;
                                                        setValue(`financiador_${row.id}`, newFinanciadorValue);
                                                
                                                        // Ejecuta la validación para todos los campos de entrada de este indicador
                                                        meses.forEach((mes, i) => {
                                                            const inputVal = getValues(`mes_${String(i+1).padStart(2, '0')}_${row.id}`);
                                                            const isValid = validateInput(inputVal, row, i);
                                                            setIsFormValid(isValid);
                                                        });
                                                    }}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`financiador_${row.id}`] || isSubmitted ? (errors[`financiador_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`financiador_${row.id}`, {
                                                    })}
                                                >
                                                    {financiadoresSelect.map((item, index) => (
                                                        <option
                                                            className='f_75'
                                                            key={index} 
                                                            value={item.finCod}
                                                        > 
                                                            {item.finIde + ' - ' + item.finNom.toLowerCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='' style={{textTransform: 'capitalize'}}>
                                                {getValues(`implementador_${row.id}`)}
                                            </td>
                                            <td className='' style={{textTransform: 'capitalize'}}>
                                                {getValues(`nombreUbicacion_${row.id}`)}
                                            </td>
                                            {meses.map((mes, i) =>{
                                            return(
                                                <td key={i+1}>
                                                    <input
                                                        data-tooltip-id="info-tooltip" 
                                                        data-tooltip-content={getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && `Meta técnica: ${getValues(`metMetTec_${String(i+1).padStart(2, '0')}_${row.id}`) || 0 }`} 
                                                        className={`
                                                            PowerMas_Input_Cadena Large_12 f_75 
                                                            PowerMas_Cadena_Form_${dirtyFields[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] || isSubmitted ? (errors[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] ? 'invalid' : 'valid') : ''}
                                                            ${getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && 'PowerMas_Tooltip_Active'}
                                                        `} 
                                                        style={{margin: '0'}}
                                                        disabled={!actions.add}
                                                        onInput={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || (/^\d*\.?\d*$/.test(value))) {
                                                                e.target.value = value;
                                                            } else {
                                                                e.target.value = value.slice(0, -1);
                                                            }

                                                            const isValid = validateInput(value, row, i);
                                                            setIsFormValid(isValid);

                                                            if (row.id !== undefined) {
                                                                const key = `${row.id}_${String(i+1).padStart(2, '0')}`;
                                                                const totalKey = `${row.id}_total`;
                                                                const prevValue = prevValues[key] || 0;
                                                                const newValue = Number(e.target.value);
                                                                setTotals(prevTotals => ({
                                                                    ...prevTotals,
                                                                    [key]: (prevTotals[key] || 0) - prevValue + newValue,
                                                                    [totalKey]: (prevTotals[totalKey] || 0) - prevValue + newValue
                                                                }));
                                                                setPrevValues(prevValues => ({
                                                                    ...prevValues,
                                                                    [key]: newValue
                                                                }));
                                                            }
                                                        }}
                                                        maxLength={10}
                                                        {...register(`mes_${String(i+1).padStart(2, '0')}_${row.id}`, { 
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
                                            )})}
                                            <td className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                                {formatter.format(totals[`${row.id}_total`] || 0) } €
                                            </td>
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
            {
                actions.add &&
                <div className='PowerMas_Footer_Box flex flex-column jc-center ai-center p_5 gap_5'>    
                    <button 
                        className='PowerMas_Buttom_Primary Large_3 p_5'
                        onClick={handleSubmit(onSubmit)}
                    >
                        Grabar
                    </button>
                </div>
            }
        </div>
    )
}

export default ExecutionBudget