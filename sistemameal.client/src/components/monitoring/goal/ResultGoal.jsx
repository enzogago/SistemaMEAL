import React, { Fragment, useEffect, useState } from 'react'
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import { fetchData } from '../../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { formatter, meses } from './helper';
import Expand from '../../../icons/Expand';
import { fetchDataReturn } from '../../reusable/fetchs';
import useEntityActions from '../../../hooks/useEntityActions';
import TableEmpty from '../../../img/PowerMas_TableEmpty.svg';
import { exportToExcel } from '../../../helpers/goals';
import Info from '../../../icons/Info';

const ResultGoal = () => {
    // Estados relacionados con la interfaz de usuario
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Estados relacionados con los datos de la aplicación
    const [subproyectos, setSubProyectos] = useState([]);
    const [selectedSubProyecto, setSelectedSubProyecto] = useState(null);
    const [indicadores, setIndicadores] = useState([]);
    const [usersTecnicos, setUsersTecnicos] = useState([]);
    const [implementadoresSelect, setImplementadoresSelect] = useState([]);
    const [ubicacionesSelect, setUbicacionesSelect] = useState([]); // Options de paises
    const [initialMetas, setInitialMetas] = useState([]);

    // Estados relacionados con las filas de la tabla
    const [additionalRows, setAdditionalRows] = useState([]);
    const [expandedIndicators, setExpandedIndicators] = useState([]);
    const [rowIdCounter, setRowIdCounter] = useState(0);

    // Estados relacionados con los totales y valores previos
    const [totals, setTotals] = useState({});
    const [prevValues, setPrevValues] = useState({});

    // Estados relacionados con los datos agrupados
    const [cadenaPeriodoGrouped, setCadenaPeriodoGrouped] = useState(null);
    const [cadenaImplementadorGrouped, setCadenaImplementadorGrouped] = useState(null);
    const [cadenaUbicacionGrouped, setCadenaUbicacionGrouped] = useState(null);

    const [isFormValid, setIsFormValid] = useState(false);

    const actions = useEntityActions('METAS MENSUALES');

    const [popupInfo, setPopupInfo] = useState({ visible: false, data: null });
    const handleClickInside = (e) => {
        e.stopPropagation();
    };

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
        fetchData('Usuario/tecnico',setUsersTecnicos);
    }, []);
    
    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            setIndicadores([]);
            setAdditionalRows([]);
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
        setPopupInfo({ visible: false, data: null })

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
                fetchDataReturn(`Indicador/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Implementador/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Ubicacion/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Meta/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/cadena/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/implementador/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion/${subProAno}/${subProCod}`),
            ]).then(([indicatorData, implementadorData, ubicacionData, metaData, cadenaPeriodoData, cadenaImplementadorData, cadenaUbicacionData]) => {
                setIndicadores(indicatorData);

                setImplementadoresSelect(implementadorData);

                setUbicacionesSelect(ubicacionData);

                // Obtén todos los nombres de los campos registrados
                const fieldNames = Object.keys(getValues());

                // Define los patrones de los campos que deseas desregistrar
                const patterns = ['financiador_', 'implementador_', 'ubicacion_', 'mes_', 'meta_', 'metMetTec_'];

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
                    console.log(meta)
                    // Usa meta.impCod, la ubicación y el indicador para crear una clave única para cada fila
                    const rowKey = `${meta.impCod}_${JSON.stringify({ ubiAno: meta.ubiAno, ubiCod: meta.ubiCod })}_${meta.indAno}_${meta.indCod}`;
                    if (!rows[rowKey]) {
                        counter++;
                    }
                    // Crea un objeto con los valores que necesitas para tus inputs
                    const inputValues = {
                        tecnico: JSON.stringify({ usuAno: meta.usuAno, usuCod: meta.usuCod }),
                        mes: meta.metMetTec,
                        implementador: meta.impCod,
                        ubicacion: JSON.stringify({ ubiAno: meta.ubiAno, ubiCod: meta.ubiCod }),
                        meta: JSON.stringify({ metAno: meta.metAno, metCod: meta.metCod }),
                    };
                        
                    setValue(`tecnico_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.tecnico);
                    setValue(`implementador_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.implementador);
                    setValue(`ubicacion_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.ubicacion);
                    setValue(`mes_${meta.metMesPlaTec}_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.mes);
                    setValue(`meta_${meta.metMesPlaTec}_${meta.indAno}_${meta.indCod}_${counter}`, inputValues.meta);
                    setValue(`metMetPre_${meta.metMesPlaTec}_${meta.indAno}_${meta.indCod}_${counter}`, meta.metMetPre);
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

                    groupedImplementadorData[key][item.impCod] = { name: item.impNom, value: item.cadResImpMetTec ? item.cadResImpMetTec : 0 }
                });

                let groupedUbicacionData = {};
                cadenaUbicacionData.forEach(item => {
                    let key = `${item.indAno}-${item.indCod}`;
                    if (!groupedUbicacionData[key]) {
                        groupedUbicacionData[key] = [];
                    }
                    groupedUbicacionData[key][`${item.ubiAno}-${item.ubiCod}`] = { name: item.ubiNom, value: item.cadResUbiMetTec ? item.cadResUbiMetTec : 0 }
                });

                let groupedPeriodoData = {};
                cadenaPeriodoData.forEach(item => {
                    let key = `${item.indAno}-${item.indCod}`;
                    groupedPeriodoData[key]  = item.cadResPerMetTec ? item.cadResPerMetTec : 0;
                });

                setCadenaPeriodoGrouped(groupedPeriodoData);
                setCadenaUbicacionGrouped(groupedUbicacionData);
                setCadenaImplementadorGrouped(groupedImplementadorData);
            }).catch(error => {
                // Maneja los errores
                console.error('Error:', error);
                Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
            }).finally(() => {
                // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
                Notiflix.Block.remove('.content-block');
            });
        } else {
            setIndicadores([])
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
                let implementadorValue = data[`implementador_${row.id}`];
                let tecnicoValue = data[`tecnico_${row.id}`];
                let ubicacionValue = data[`ubicacion_${row.id}`];
                let meta = data[`meta_${String(mesIndex+1).padStart(2, '0')}_${row.id}`];
                if (mesValue && mesValue !== '' && implementadorValue && implementadorValue !== '0' && tecnicoValue && tecnicoValue !== '0' && ubicacionValue && ubicacionValue !== '') {
                    const currentValue = {
                        mes: mesValue,
                        implementador: implementadorValue,
                        ubicacion: ubicacionValue,
                        meta: meta,
                    };
                    const {ubiAno,ubiCod} = JSON.parse(ubicacionValue);
                    const {usuAno,usuCod} = JSON.parse(tecnicoValue);
                    if (meta != undefined) {
                        const {metAno,metCod} = JSON.parse(meta);

                        metasIniciales.push({
                            indAno: row.indAno,
                            indCod: row.indCod,
                            metMesPlaTec: (mesIndex + 1).toString().padStart(2, '0'),
                            metMetTec: mesValue,
                            implementador: implementadorValue,
                            usuAno,
                            usuCod,
                            ubiAno,
                            ubiCod,
                            metAnoPlaTec: data.metAnoPlaTec,
                            metAno,
                            metCod
                        });

                        // Buscar la meta inicial correspondiente
                        const initialValue = initialMetas.find(initialMeta => 
                            initialMeta.metAno === metAno &&
                            initialMeta.metCod === metCod &&
                            initialMeta.metMesPlaTec === String(mesIndex+1).padStart(2, '0')
                        );
                        if (initialValue && (
                            JSON.stringify({usuAno:initialValue.usuAno,usuCod:initialValue.usuCod}) !== tecnicoValue ||
                            initialValue.impCod !== implementadorValue ||
                            JSON.stringify({ubiAno:initialValue.ubiAno,ubiCod:initialValue.ubiCod}) !== ubicacionValue ||
                            initialValue.metMetTec !== mesValue
                        )) {
                            // Aquí, la meta es nueva o ha cambiado desde su valor inicial
                            metas.push({
                                indAno: row.indAno,
                                indCod: row.indCod,
                                metMesPlaTec: (mesIndex + 1).toString().padStart(2, '0'),
                                metMetTec: mesValue,
                                impCod: implementadorValue,
                                usuAno,
                                usuCod,
                                ubiAno,
                                ubiCod,
                                metAnoPlaTec: data.metAnoPlaTec,
                                metAno,
                                metCod
                            });
                        }
                        
                    }
                    if (meta === undefined) {
                        // Aquí, la meta es nueva o ha cambiado desde su valor inicial
                        metas.push({
                            indAno: row.indAno,
                            indCod: row.indCod,
                            metMesPlaTec: (mesIndex + 1).toString().padStart(2, '0'),
                            metMetTec: mesValue,
                            impCod: implementadorValue,
                            usuAno,
                            usuCod,
                            ubiAno,
                            ubiCod,
                            metAnoPlaTec: data.metAnoPlaTec,
                        });
                    }
                }
            });
        });
        
        const metasInicialesObject = {};
        metasIniciales.forEach(meta => {
            const key = `${meta.metAno}_${meta.metCod}`;
            metasInicialesObject[key] = meta;
        });
        
        // Crear un nuevo arreglo para las metas a eliminar
        let metasEliminar = [];
        
        // Recorrer cada meta en initialMetas
        initialMetas.forEach(initialMeta => {
            const key = `${initialMeta.metAno}_${initialMeta.metCod}`;
            
            // Si la meta inicial no está en metasIniciales, agregarla a metasAEliminar
            if (!metasInicialesObject[key]) {
                metasEliminar.push(initialMeta);
            }
        });
        
        const Metas = {
            metas,
            metasEliminar
        }
        handleUpdate(Metas);
        
    };

    const handleUpdate = async (cadena) => {
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta`, {
                method: 'POST',
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
            reset();
            Notiflix.Notify.success(data.message);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const validateInput = (newValue, row, monthIndex) => {
        // Obtén el valor del implementador y la ubicación para esta fila
        const implementadorValue = watch(`implementador_${row.id}`);
        const ubicacionValue = watch(`ubicacion_${row.id}`);
    
        if (implementadorValue === '0' || ubicacionValue === '0') {
            return true;
        }
    
        const { ubiAno, ubiCod } = JSON.parse(ubicacionValue);
    
        // Inicializa los totales acumulados para implementador y ubicación
        let totalPorImplementador = 0;
        let totalPorUbicacion = 0;
        let totalPorPeriodo = 0;
    
        // Itera sobre todas las filas adicionales para acumular los valores
        additionalRows.forEach(currentRow => {
            if (currentRow.indAno === row.indAno && currentRow.indCod === row.indCod) {
                const currentImplementadorValue = watch(`implementador_${currentRow.id}`);
                const currentUbicacionValue = watch(`ubicacion_${currentRow.id}`);
                if (currentImplementadorValue === implementadorValue) {
                    for (let i = 0; i < 12; i++) {
                        totalPorImplementador += Number(watch(`mes_${String(i+1).padStart(2, '0')}_${currentRow.id}`) || 0);
                    }
                }
                if (currentUbicacionValue === ubicacionValue) {
                    for (let i = 0; i < 12; i++) {
                        totalPorUbicacion += Number(watch(`mes_${String(i+1).padStart(2, '0')}_${currentRow.id}`) || 0);
                    }
                }
                for (let i = 0; i < 12; i++) {
                    totalPorPeriodo += Number(watch(`mes_${String(i+1).padStart(2, '0')}_${currentRow.id}`) || 0);
                }
            }
        });
    
        // Resta el valor previo y suma el nuevo valor para obtener los nuevos totales
        const prevValue = prevValues[`${row.id}_${String(monthIndex+1).padStart(2, '0')}`] || 0;
        totalPorImplementador = totalPorImplementador - prevValue + Number(newValue);
        totalPorUbicacion = totalPorUbicacion - prevValue + Number(newValue);
        totalPorPeriodo = totalPorPeriodo - prevValue + Number(newValue);
    
        // Obtén los límites máximos específicos para implementador y ubicación
        const maxImplementador = cadenaImplementadorGrouped[`${row.indAno}-${row.indCod}`][implementadorValue].value;
        const maxUbicacion = cadenaUbicacionGrouped[`${row.indAno}-${row.indCod}`][`${ubiAno}-${ubiCod}`].value;
        const maxPeriodo = cadenaPeriodoGrouped[`${row.indAno}-${row.indCod}`];
        console.log(row)
        // Valida contra los máximos específicos
        if (totalPorImplementador > maxImplementador) {
            const implementador = implementadoresSelect.find(imp => imp.impCod === implementadorValue);
            const implementadorNom = implementador.impNom.charAt(0) + implementador.impNom.slice(1).toLowerCase();
            const unidadNom = row.uniNom.charAt(0) + row.uniNom.slice(1).toLowerCase();

            Notiflix.Report.warning('Advertencia', `La meta del implementador ${implementadorNom} es ${totalPorImplementador} ${unidadNom}, pero en la cadena de resultado se estableció en ${maxImplementador} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
            return false;
        }
        if (totalPorUbicacion > maxUbicacion) {
            const ubicacion = ubicacionesSelect.find(item => item.ubiAno === ubiAno && item.ubiCod === ubiCod);
            const ubicacionNom = ubicacion.ubiNom.charAt(0) + ubicacion.ubiNom.slice(1).toLowerCase();

            Notiflix.Report.warning('Advertencia', `La meta de la ubicación ${ubicacionNom} es ${totalPorUbicacion} ${unidadNom}, pero en la cadena de resultado se estableció en ${maxUbicacion} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
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
            <h1 className="Large-f1_5"> Metas técnicas programáticas </h1>
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
                                exportToExcel(indicadores, totals, additionalRows, getValues, subproyectos, usersTecnicos, ubicacionesSelect, implementadoresSelect, meses, watch('metAnoPlaTec'));
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
                                <th className='center' colSpan={3}></th>
                                <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>Código</th>
                                <th>Nombre</th>
                                <th>Unidad</th>
                                <th>Tipo Valor</th>
                                {meses.map((mes, i) => (
                                    <th className='center' style={{textTransform: 'capitalize'}} key={i+1}>{mes.toLowerCase()}</th>
                                ))}
                                <th style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            indicadores.map((item, index) => {
                                const text = item.indNom;
                                const shortText = text.length > 30 ? text.substring(0, 30) + '...' : text;

                                const textUnidad = item.uniNom;
                                const shortTextUnidad = textUnidad.length > 15 ? textUnidad.substring(0, 15) + '...' : textUnidad;
                                
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
                                        <td>
                                            {
                                                actions.add &&
                                                <button 
                                                    className='p_25' 
                                                    style={{backgroundColor: 'transparent', border: 'none'}} 
                                                    onClick={() => {
                                                        setRowIdCounter(rowIdCounter + 1);
                                                        setAdditionalRows([...additionalRows, { id: `${item.indAno}_${item.indCod}_${rowIdCounter}`, indAno: item.indAno, indCod: item.indCod, indNum: item.indNum, uniNom: item.uniNom }]);
                                                        if (!expandedIndicators.includes(`${item.indAno}_${item.indCod}`)) {
                                                            setExpandedIndicators([...expandedIndicators, `${item.indAno}_${item.indCod}`]);
                                                        }
                                                    }}
                                                > + </button>
                                            }
                                        </td>
                                        <td>
                                            <span 
                                                className="f1_25 pointer flex"
                                                style={{minWidth: '20px'}}
                                                onClick={() => {
                                                    const data = {
                                                        periodo: cadenaPeriodoGrouped[`${item.indAno}-${item.indCod}`],
                                                        implementador: cadenaImplementadorGrouped[`${item.indAno}-${item.indCod}`],
                                                        ubicacion: cadenaUbicacionGrouped[`${item.indAno}-${item.indCod}`],
                                                        indNum: item.indNum,
                                                    };
                                                    setPopupInfo({ visible: true, data });
                                                }}
                                            >
                                                <Info />
                                            </span>
                                        </td>
                                        <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>{item.indNum}</td>
                                        {
                                            text.length > 30 ?
                                            <td
                                                data-tooltip-id="info-tooltip" 
                                                data-tooltip-content={text} 
                                            >{shortText}</td>
                                            :
                                            <td>{text}</td>
                                        }
                                        {
                                            textUnidad.length > 15 ?
                                            <td
                                                data-tooltip-id="info-tooltip" 
                                                data-tooltip-content={textUnidad} 
                                            >{shortTextUnidad}</td>
                                            :
                                            <td >{textUnidad}</td>
                                        }
                                        <td>{item.tipValNom}</td>
                                        {meses.map((mes, i) => (
                                            <td key={i+1} className='center'>
                                                {formatter.format(Object.entries(totals)
                                                    .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith(String(i+1).padStart(2, '0')))
                                                    .reduce((sum, [, value]) => sum + value, 0))}
                                            </td>
                                        ))}
                                        <td  className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                            {formatter.format(Object.entries(totals)
                                                .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith('_total'))
                                                .reduce((sum, [, value]) => sum + value, 0))}
                                        </td>
                                    </tr>
                                    {additionalRows.filter(row => row.indAno === item.indAno && row.indCod === item.indCod).map((row, rowIndex) => (
                                        <tr key={`${row.indAno}_${row.indCod}_${row.id}`} style={{visibility: expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'visible' : 'collapse'}}>
                                            <td></td>
                                            <td colSpan={2} className='center'>
                                                {
                                                    actions.add &&
                                                    <button 
                                                        style={{backgroundColor: 'transparent', border: 'none'}} 
                                                        onClick={() => {
                                                            Notiflix.Confirm.show(
                                                                'Eliminar Fila',
                                                                '¿Está seguro que quieres eliminar esta fila?',
                                                                'Sí',
                                                                'No',
                                                                async () => {
                                                                    // Antes de eliminar la fila, actualizamos los totales
                                                                    meses.forEach((mes, i) => {
                                                                        const key = `${row.id}_${String(i+1).padStart(2, '0')}`;
                                                                        const totalKey = `${row.id}_total`;
                                                                        const value = Number(watch(`mes_${String(i+1).padStart(2, '0')}_${row.id}`));
                                                                        setTotals(prevTotals => ({
                                                                            ...prevTotals,
                                                                            [key]: (prevTotals[key] || 0) - value,
                                                                            [totalKey]: (prevTotals[totalKey] || 0) - value
                                                                        }));
                                                                    });
                                                                    // Ahora sí eliminamos la fila
                                                                    setAdditionalRows(prevRows => prevRows.filter((prevRow) => prevRow.id !== row.id));
                                                                },
                                                                () => {
                                                                    // El usuario ha cancelado la operación de eliminación
                                                                }
                                                            );
                                                        }}
                                                    > - </button>
                                                }
                                            </td>
                                            <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></td>
                                            <td className='center'>
                                                <select 
                                                    style={{textTransform: 'capitalize', margin: '0'}}
                                                    id={`tecnico_${row.id}`}
                                                    disabled={!actions.add}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`tecnico_${row.id}`] || isSubmitted ? (errors[`tecnico_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`tecnico_${row.id}`, {
                                                        validate: value => value !== '0' || 'El campo es requerido'
                                                    })}
                                                >
                                                    <option className='f_75' value="0">--Técnico--</option>
                                                    {usersTecnicos.map((tecnico, index) => (
                                                        <option
                                                            className='f_75'
                                                            key={index} 
                                                            value={JSON.stringify({ usuAno: tecnico.usuAno, usuCod: tecnico.usuCod })}
                                                        > 
                                                            {tecnico.usuNom.toLowerCase() + ' ' + tecnico.usuApe.toLowerCase() }
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='center'>
                                                <select 
                                                    style={{textTransform: 'capitalize', margin: '0'}}
                                                    id={`implementador_${row.id}`}
                                                    disabled={!actions.add}
                                                    onInput={(e) => {
                                                        // Actualiza el valor del implementador
                                                        const newImplementadorValue = e.target.value;
                                                        setValue(`implementador_${row.id}`, newImplementadorValue);
                                                
                                                        // Ejecuta la validación para todos los campos de entrada de este indicador
                                                        meses.forEach((mes, i) => {
                                                            const inputVal = getValues(`mes_${String(i+1).padStart(2, '0')}_${row.id}`);
                                                            const isValid = validateInput(inputVal, row, i);
                                                            setIsFormValid(isValid);
                                                        });
                                                    }}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`implementador_${row.id}`] || isSubmitted ? (errors[`implementador_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`implementador_${row.id}`, {
                                                        validate: {
                                                            unique: value => {
                                                                const ubicacionValue = watch(`ubicacion_${row.id}`);
                                                                if (value === '0' || ubicacionValue === '') {
                                                                    return true;
                                                                }
                                                                const duplicate = additionalRows.find(r => 
                                                                    r.indAno === row.indAno && 
                                                                    r.indCod === row.indCod && 
                                                                    r.id !== row.id && 
                                                                    watch(`implementador_${r.id}`) === value && 
                                                                    watch(`ubicacion_${r.id}`) === ubicacionValue
                                                                );
                                                                if (duplicate) {
                                                                    Notiflix.Report.failure(
                                                                        'Error de Validación',
                                                                        `Verifica que no se repita implementador y ubicación para el indicador ${row.indNum}`,
                                                                        'Vale',
                                                                    );
                                                                    return false;
                                                                }
                                                                return true;
                                                            },
                                                            notZero: value => value !== '0' || 'El cargo es requerido'
                                                        }
                                                    })}
                                                >
                                                    <option value="0" className='f_75'>--Implementador--</option>
                                                    {implementadoresSelect.map((imp, index) => (
                                                        <option
                                                            className='f_75'
                                                            key={index} 
                                                            value={imp.impCod}
                                                        > 
                                                            {imp.impNom.toLowerCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='center'>
                                                <select 
                                                    style={{textTransform: 'capitalize', margin: '0'}}
                                                    id={`ubicacion_${row.id}`}
                                                    disabled={!actions.add}
                                                    onInput={(e) => {
                                                        // Actualiza el valor de la ubicación
                                                        const newUbicacionValue = e.target.value;
                                                        setValue(`ubicacion_${row.id}`, newUbicacionValue);
                                                
                                                        // Ejecuta la validación para todos los campos de entrada de este indicador
                                                        meses.forEach((mes, i) => {
                                                            const inputVal = getValues(`mes_${String(i+1).padStart(2, '0')}_${row.id}`);
                                                            const isValid = validateInput(inputVal, row, i);
                                                            setIsFormValid(isValid);
                                                        });
                                                    }}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`ubicacion_${row.id}`] || isSubmitted ? (errors[`ubicacion_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`ubicacion_${row.id}`, {
                                                        validate: {
                                                            unique: value => {
                                                                const implementadorValue = watch(`implementador_${row.id}`);
                                                                if (value === '0' || implementadorValue === '') {
                                                                    return true;
                                                                }
                                                                const duplicate = additionalRows.find(r => 
                                                                    r.indAno === row.indAno && 
                                                                    r.indCod === row.indCod && 
                                                                    r.id !== row.id && 
                                                                    watch(`ubicacion_${r.id}`) === value && 
                                                                    watch(`implementador_${r.id}`) === implementadorValue
                                                                );
                                                                if (duplicate) {
                                                                    Notiflix.Report.failure(
                                                                        'Error de Validación',
                                                                        `Verifica que no se repita implementador y ubicación para el indicador ${row.indNum}`,
                                                                        'Vale',
                                                                    );
                                                                    return false;
                                                                }
                                                                return true;
                                                            },
                                                            notZero: value => value !== '0' || 'El cargo es requerido'
                                                        }
                                                    })}
                                                >
                                                    <option value="0" className='f_75'>--Ubicación--</option>
                                                    {ubicacionesSelect.map((item, index) => (
                                                        <option
                                                            className='f_75'
                                                            key={index} 
                                                            value={JSON.stringify({ ubiAno: item.ubiAno, ubiCod: item.ubiCod })}
                                                        > 
                                                            {item.ubiNom.toLowerCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            {meses.map((mes, i) => (
                                                <td key={i+1}>
                                                    <input
                                                        data-tooltip-id="info-tooltip" 
                                                        data-tooltip-content={getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && `Meta presupuesto: ${getValues(`metMetPre_${String(i+1).padStart(2, '0')}_${row.id}`)? getValues(`metMetPre_${String(i+1).padStart(2, '0')}_${row.id}`): '0'} $`} 
                                                        className={`
                                                            PowerMas_Input_Cadena Large_12 f_75 
                                                            PowerMas_Cadena_Form_${dirtyFields[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] || isSubmitted ? (errors[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] ? 'invalid' : 'valid') : ''}
                                                            ${getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && 'PowerMas_Tooltip_Active'}
                                                        `} 
                                                        style={{margin: '0'}}
                                                        disabled={!actions.add}
                                                        onInput={(e) => {
                                                            const inputVal = e.target.value.replace(/[^0-9]/g, '');
                                                            e.target.value = inputVal;
                                                            const isValid = validateInput(inputVal, row, i);
                                                            setIsFormValid(isValid);
                                                            
                                                            // Si el nuevo valor es válido, actualiza los totales y los valores previos
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
                                                        }}
                                                        maxLength={10}
                                                        autoComplete='off'
                                                        {...register(`mes_${String(i+1).padStart(2, '0')}_${row.id}`, { 
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
                                            ))}
                                            <td className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                                {formatter.format(totals[`${row.id}_total`] || 0) }
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
                        disabled={!isFormValid}
                        className='PowerMas_Buttom_Primary Large_3 p_5'
                        onClick={handleSubmit(onSubmit)}
                    >
                        Grabar
                    </button>
                </div>
            }
            {popupInfo.visible && popupInfo.data && (
                <div
                    className='PowerMas_Popup_Cadena p1_25 flex flex-column gap_25' 
                    onClick={handleClickInside}
                >
                    <span 
                        className="bold f1_5 pointer"
                        style={{
                            color: '#AAAAAA',
                            position: 'absolute',
                            top: 0,
                            right: '0.5rem',
                        }}
                        onClick={() => setPopupInfo({ visible: false, data: null })}
                    >
                        ×
                    </span>
                    <div>
                        <h5 className='center' style={{textDecoration: 'underline'}}>CADENA DE RESULTADO PARA</h5>
                        <h5 className='center' style={{textDecoration: 'underline'}}>EL INDICADOR: {popupInfo.data.indNum}</h5>
                    </div>
                    <div>
                        <h4 className='f1'>IMPLEMENTADORES:</h4>
                        {Object.values(popupInfo.data.implementador).map((item, index) => (
                            <p className='f1' key={index}>{item.name}: {item.value}</p>
                        ))}
                    </div>
                    <div>
                        <h4 className='f1'>UBICACIONES:</h4>
                        {Object.values(popupInfo.data.ubicacion).map((item, index) => (
                            <p className='f1' key={index}>{item.name}: {item.value}</p>
                        ))}
                    </div>
                    <div>
                        <h4 className='f1'>PERIODO:</h4>
                        <p className='f1'>{watch('metAnoPlaTec')} : {popupInfo.data.periodo}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResultGoal