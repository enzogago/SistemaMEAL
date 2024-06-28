import React, { Fragment, useEffect, useState } from 'react'
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import { fetchData } from '../../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { formatter, formatterBudget, meses } from './helper';
import Expand from '../../../icons/Expand';
import { fetchDataReturn } from '../../reusable/fetchs';
import useEntityActions from '../../../hooks/useEntityActions';
import TableEmpty from '../../../img/PowerMas_TableEmpty.svg';
import { exportToExcel } from '../../../helpers/goals';
import Info from '../../../icons/Info';
import Plus from '../../../icons/Plus';
import TriangleIcon from '../../../icons/TriangleIcon';

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
    const [refresh, setRefresh] = useState(false)

    const [popupInfo, setPopupInfo] = useState({ visible: false, data: null });
    const handleClickInside = (e) => {
        e.stopPropagation();
    };

    const [indicatorsValidity, setIndicatorsValidity] = useState({});

    const { 
        register,
        unregister,
        watch, 
        handleSubmit, 
        formState: { errors, dirtyFields, isSubmitted }, 
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
            setIndicadores([]);
            setAdditionalRows([]);
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            const selected = subproyectos.find(item => item.subProAno === subProAno && item.subProCod === subProCod);
            setSelectedSubProyecto(selected);
        } else {
            setIndicadores([]);
            setSelectedSubProyecto(null);
        }
        setValue('metAnoPlaTec','0');
    }, [watch('subproyecto')]);

    const calculateAverage = (prevTotals, key, newValue) => {
        // Asegúrate de que existingValues sea un array
        const existingValues = Array.isArray(prevTotals[key]) ? prevTotals[key] : [];
        const newValues = [...existingValues, newValue];
        const sum = newValues.reduce((total, value) => total + value, 0);
        return sum / newValues.length;
      };
      
      
    
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
                fetchDataReturn(`Usuario/tecnico/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Implementador/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Ubicacion/subproyecto/${subProAno}/${subProCod}`),
                fetchDataReturn(`Meta/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/cadena/${subProAno}/${subProCod}/${ano}`),
                fetchDataReturn(`Indicador/implementador/${subProAno}/${subProCod}`),
                fetchDataReturn(`Indicador/ubicacion/${subProAno}/${subProCod}`),
            ]).then(([tecnicosData, indicatorData, implementadorData, ubicacionData, metaData, cadenaPeriodoData, cadenaImplementadorData, cadenaUbicacionData]) => {
                let groupedPeriodoData = {};
                cadenaPeriodoData.forEach(item => {
                    let key = `${item.indAno}-${item.indCod}`;
                    groupedPeriodoData[key]  = Number(item.cadResPerMetTec) || 0;
                });

                // Filtra los indicadores que tienen un valor mayor a 0 en groupedPeriodoData
                const filteredIndicatorData = indicatorData.filter(indicator => 
                    groupedPeriodoData[`${indicator.indAno}-${indicator.indCod}`] > 0
                );

                // Establece los indicadores filtrados
                setIndicadores(filteredIndicatorData);

                setUsersTecnicos(tecnicosData);

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
                    // Usa meta.impCod, la ubicación y el indicador para crear una clave única para cada fila
                    const rowKey = `${JSON.stringify({ usuAno: meta.usuAno, usuCod: meta.usuCod })}_${meta.impCod}_${JSON.stringify({ ubiAno: meta.ubiAno, ubiCod: meta.ubiCod })}_${meta.indAno}_${meta.indCod}`;
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
                    console.log(meta)
                    if (meta.tipValCod === '01') {
                        // Suma el nuevo valor al total mensual y al total general
                        setTotals(prevTotals => ({
                            ...prevTotals,
                            [key]: (prevTotals[key] || 0) + newValue,
                            [totalKey]: (prevTotals[totalKey] || 0) + newValue
                        }));
                    } else if (meta.tipValCod === '02') {
                        // Calcula el promedio para el total mensual y el total general
                        // Asumiendo que tienes una función auxiliar para calcular el promedio
                        setTotals(prevTotals => {
                            const updatedMonthTotal = calculateAverage(prevTotals, key, newValue);
                            const updatedGeneralTotal = calculateAverage(prevTotals, totalKey, newValue);
                            return {
                                ...prevTotals,
                                [key]: updatedMonthTotal,
                                [totalKey]: updatedGeneralTotal
                            };
                        });
                    }

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
                            tipValCod: meta.tipValCod,
                            cells: [],
                        };
                    }

                    // Agrega la celda a la fila
                    rows[rowKey].cells.push(inputValues);
                });
                const filas = Object.values(rows);
                setAdditionalRows(filas);
                setRowIdCounter(counter+1);

                // Expande todos los indicadores
                const allExpandedIndicators = indicatorData.map(ind => `${ind.indAno}_${ind.indCod}`);
                setExpandedIndicators(allExpandedIndicators);

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
    }, [watch('metAnoPlaTec'), refresh]);
    
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
        console.log(Metas)
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
            
            setRefresh(prevRefresh => !prevRefresh)
            Notiflix.Notify.success(data.message);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const validateInput = (newValue, row, monthIndex, additionalRows) => {
        let isValid = true;
        // Obtén el valor del implementador y la ubicación para esta fila
        const implementadorValue = watch(`implementador_${row.id}`);
        const ubicacionValue = watch(`ubicacion_${row.id}`);
    
        if (implementadorValue === '0' || ubicacionValue === '0') {
            return;
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
        const unidadNom = row.uniNom.charAt(0) + row.uniNom.slice(1).toLowerCase();
        // Valida contra los máximos específicos
        if (totalPorImplementador > maxImplementador) {
            const implementador = implementadoresSelect.find(imp => imp.impCod === implementadorValue);
            const implementadorNom = implementador.impNom.charAt(0) + implementador.impNom.slice(1).toLowerCase();

            Notiflix.Report.warning('Advertencia', `La meta del implementador ${implementadorNom} es ${formatter.format(totalPorImplementador)} ${unidadNom}, pero en la cadena de resultado se estableció en ${formatter.format(maxImplementador)} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
            isValid = false;
        }
        if (totalPorUbicacion > maxUbicacion) {
            const ubicacion = ubicacionesSelect.find(item => item.ubiAno === ubiAno && item.ubiCod === ubiCod);
            const ubicacionNom = ubicacion.ubiNom.charAt(0) + ubicacion.ubiNom.slice(1).toLowerCase();

            Notiflix.Report.warning('Advertencia', `La meta de la ubicación ${ubicacionNom} es ${formatter.format(totalPorUbicacion)} ${unidadNom}, pero en la cadena de resultado se estableció en ${formatter.format(maxUbicacion)} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
            isValid = false;
        }
        if (totalPorPeriodo > maxPeriodo) {
            const ano = watch('metAnoPlaTec');

            Notiflix.Report.warning('Advertencia', `La meta del periodo ${ano} es ${formatter.format(totalPorPeriodo)} ${unidadNom}, pero en la cadena de resultado se estableció en ${formatter.format(maxPeriodo)} ${unidadNom}. Por favor ajuste la distribución correctamente.`, 'Aceptar');
            isValid = false;
        }
    
        setIndicatorsValidity(prevValidity => ({
            ...prevValidity,
            [`${row.indAno}_${row.indCod}`]: isValid
        }));
    };

    useEffect(() => {
        const allValid = Object.values(indicatorsValidity).every(isValid => isValid);
        setIsFormValid(allValid);
    }, [indicatorsValidity]);

    const calculateNewAverage = (prevTotals, key, value, operation) => {
        const existingValues = Array.isArray(prevTotals[key]) ? prevTotals[key] : [];
        let newValues;
        if (operation === 'subtract') {
            newValues = existingValues.filter(val => val !== value); // Elimina el valor
        } else {
            newValues = [...existingValues, value]; // Agrega el valor
        }
        const sum = newValues.reduce((total, val) => total + val, 0);
        return newValues.length > 0 ? sum / newValues.length : 0;
    };

      
    return (
        <div className='p_75 flex flex-column flex-grow-1 overflow-auto content-block relative'>
            <h1 className="Large-f1_5"> Metas técnicas programáticas </h1>
            <div className='flex jc-space-between gap_5 p_5'>
                <div className="Phone_8 flex-grow-1">
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
                                <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}} className='center' colSpan={3}></th>
                                <th style={{position: 'sticky', left: '4.5rem', backgroundColor: '#fff'}}>Código</th>
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
                                        <td className='p0' style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>
                                            <span
                                                style={{width: '1.5rem'}}
                                                className={`pointer bold flex ai-center f1_25 PowerMas_MenuIcon ${expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                                onClick={() => {
                                                    if (expandedIndicators.includes(`${item.indAno}_${item.indCod}`)) {
                                                        setExpandedIndicators(expandedIndicators.filter(indicator => indicator !== `${item.indAno}_${item.indCod}`));
                                                    } else {
                                                        setExpandedIndicators([...expandedIndicators, `${item.indAno}_${item.indCod}`]);
                                                    }
                                                }}
                                            > 
                                                <TriangleIcon />
                                            </span>
                                        </td>
                                        <td className='p0' style={{position: 'sticky', left: '1.5rem', backgroundColor: '#fff'}}>
                                            {
                                                actions.add &&
                                                <span
                                                    className="bold f1_25 pointer flex"
                                                    style={{width: '1.5rem'}}
                                                    // style={{backgroundColor: 'transparent', border: 'none'}} 
                                                    onClick={() => {
                                                        setRowIdCounter(rowIdCounter + 1);
                                                        setAdditionalRows([...additionalRows, { id: `${item.indAno}_${item.indCod}_${rowIdCounter}`, indAno: item.indAno, indCod: item.indCod, indNum: item.indNum, uniNom: item.uniNom }]);
                                                        if (!expandedIndicators.includes(`${item.indAno}_${item.indCod}`)) {
                                                            setExpandedIndicators([...expandedIndicators, `${item.indAno}_${item.indCod}`]);
                                                        }
                                                    }}
                                                >
                                                    <Plus />
                                                </span>
                                            }
                                        </td>
                                        <td className='p0' style={{position: 'sticky', left: '3rem', backgroundColor: '#fff'}}>
                                            <span 
                                                className="bold f1_25 pointer flex"
                                                style={{width: '1.5rem'}}
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
                                        <td style={{position: 'sticky', left: '4.5rem', backgroundColor: '#fff'}}>{item.indNum}</td>
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
                                        {meses.map((mes, i) => {
                                            // Obtiene todos los valores para el mes actual del indicador específico
                                            const monthValues = Object.entries(totals)
                                                .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith(String(i+1).padStart(2, '0')))
                                                .map(([, value]) => Number(value));

                                            // Calcula el total o promedio basado en tipValCod
                                            const totalOrAverage = item.tipValCod === '01'
                                                ? monthValues.reduce((sum, value) => sum + value, 0) // Suma para tipValCod '01'
                                                : monthValues.length > 0
                                                ? monthValues.reduce((sum, value) => sum + (value || 0), 0) / (monthValues.filter(value => value !== 0).length || 1) // Promedio para tipValCod '02', evita dividir por cero
                                                : 0; // Si no hay valores, el promedio es 0

                                            return (
                                                <td key={i+1} className='center'>
                                                {formatter.format(totalOrAverage)}
                                                </td>
                                            );
                                        })}
                                        <td className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                            {formatter.format(
                                                item.tipValCod === '01'
                                                ? // Si tipValCod es '01', suma todos los valores para obtener el total
                                                    Object.entries(totals)
                                                    .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith('_total'))
                                                    .reduce((sum, [, value]) => sum + value, 0)
                                                : // Si tipValCod es '02', calcula el promedio de los valores no cero para obtener el total
                                                    Object.entries(totals)
                                                    .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith('_total'))
                                                    .reduce((acc, [, value], _, array) => {
                                                        const nonZeroValues = array.filter(([, val]) => val !== 0);
                                                        return nonZeroValues.length > 0
                                                        ? acc + value / nonZeroValues.length
                                                        : acc;
                                                    }, 0)
                                            )}
                                        </td>
                                    </tr>
                                    {additionalRows.filter(row => row.indAno === item.indAno && row.indCod === item.indCod).map((row, rowIndex) => (
                                        <tr key={`${row.indAno}_${row.indCod}_${row.id}`} style={{visibility: expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'visible' : 'collapse'}}>
                                            <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></td>
                                            <td colSpan={2} className='center' style={{position: 'sticky', left: '1.5rem', backgroundColor: '#fff'}}>
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
                                                                
                                                                        setTotals(prevTotals => {
                                                                            // Calcula el nuevo total o promedio después de eliminar el valor
                                                                            const updatedTotal = item.tipValCod === '01'
                                                                                ? (prevTotals[key] || 0) - value
                                                                                : calculateNewAverage(prevTotals, key, value, 'subtract');
                                                                    
                                                                            const updatedGeneralTotal = item.tipValCod === '01'
                                                                                ? (prevTotals[totalKey] || 0) - value
                                                                                : calculateNewAverage(prevTotals, totalKey, value, 'subtract');
                                                                    
                                                                            return {
                                                                                ...prevTotals,
                                                                                [key]: updatedTotal,
                                                                                [totalKey]: updatedGeneralTotal
                                                                            };
                                                                        });
                                                                    });
                                                                    // Ahora sí eliminamos la fila
                                                                    setAdditionalRows(prevRows => {
                                                                        const newRows = prevRows.filter((prevRow) => prevRow.id !== row.id);
                                                                  
                                                                        meses.forEach((mes, i) => {
                                                                            const inputVal = getValues(`mes_${String(i+1).padStart(2, '0')}_${row.id}`);
                                                                            validateInput(inputVal, row, i, newRows);
                                                                        });
                                                                  
                                                                        return newRows; // Retorna el nuevo estado
                                                                    });
                                                                },
                                                                () => {
                                                                    // El usuario ha cancelado la operación de eliminación
                                                                }
                                                            );
                                                        }}
                                                    > - </button>
                                                }
                                            </td>
                                            <td style={{position: 'sticky', left: '4.5rem', backgroundColor: '#fff'}}></td>
                                            <td className='center'>
                                                <select 
                                                    style={{textTransform: 'capitalize', margin: '0'}}
                                                    id={`tecnico_${row.id}`}
                                                    disabled={!actions.add}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`tecnico_${row.id}`] || isSubmitted ? (errors[`tecnico_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`tecnico_${row.id}`, {
                                                        validate: {
                                                            unique: value => {
                                                                const implementadorValue = watch(`implementador_${row.id}`);
                                                                const ubicacionValue = watch(`ubicacion_${row.id}`);

                                                                if (value === '0' || implementadorValue === '0' || ubicacionValue === '0' ) {
                                                                    return true;
                                                                }
                                                                const duplicate = additionalRows.find(r => 
                                                                    r.indAno === row.indAno && 
                                                                    r.indCod === row.indCod && 
                                                                    r.id !== row.id && 
                                                                    watch(`tecnico_${r.id}`) === value && 
                                                                    watch(`implementador_${r.id}`) === implementadorValue &&
                                                                    watch(`ubicacion_${r.id}`) === ubicacionValue

                                                                );
                                                                if (duplicate) {
                                                                    Notiflix.Report.warning(
                                                                        'Error de Validación',
                                                                        `Verifica que no se repita técnico, implementador y ubicación para el indicador ${row.indNum}`,
                                                                        'Aceptar',
                                                                    );
                                                                    return false;
                                                                }
                                                                return true;
                                                            },
                                                            notZero: value => value !== '0' || 'El cargo es requerido'
                                                        }
                                                    })}
                                                >
                                                    <option className='f_75' value="0">--Responsable--</option>
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
                                                            validateInput(inputVal, row, i, additionalRows);
                                                        });
                                                    }}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`implementador_${row.id}`] || isSubmitted ? (errors[`implementador_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`implementador_${row.id}`, {
                                                        validate: {
                                                            unique: value => {
                                                                const ubicacionValue = watch(`ubicacion_${row.id}`);
                                                                const tecnicoValue = watch(`tecnico_${row.id}`);
                                                                if (value === '0' || ubicacionValue === '0' || tecnicoValue === '0') {
                                                                    return true;
                                                                }
                                                                const duplicate = additionalRows.find(r => 
                                                                    r.indAno === row.indAno && 
                                                                    r.indCod === row.indCod && 
                                                                    r.id !== row.id && 
                                                                    watch(`implementador_${r.id}`) === value && 
                                                                    watch(`ubicacion_${r.id}`) === ubicacionValue &&
                                                                    watch(`tecnico_${r.id}`) === tecnicoValue

                                                                );
                                                                if (duplicate) {
                                                                    Notiflix.Report.warning(
                                                                        'Error de Validación',
                                                                        `Verifica que no se repita técnico, implementador y ubicación para el indicador ${row.indNum}`,
                                                                        'Aceptar',
                                                                    );
                                                                    return false;
                                                                }
                                                                return true;
                                                            },
                                                            notZero: value => value !== '0' || 'El campo es requerido'
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
                                                    style={{textTransform: 'capitalize', margin: '0', paddingRight: '0'}}
                                                    id={`ubicacion_${row.id}`}
                                                    disabled={!actions.add}
                                                    onInput={(e) => {
                                                        // Actualiza el valor de la ubicación
                                                        const newUbicacionValue = e.target.value;
                                                        setValue(`ubicacion_${row.id}`, newUbicacionValue);
                                                
                                                        // Ejecuta la validación para todos los campos de entrada de este indicador
                                                        meses.forEach((mes, i) => {
                                                            const inputVal = getValues(`mes_${String(i+1).padStart(2, '0')}_${row.id}`);
                                                            validateInput(inputVal, row, i, additionalRows);
                                                        });
                                                    }}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`ubicacion_${row.id}`] || isSubmitted ? (errors[`ubicacion_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    {...register(`ubicacion_${row.id}`, {
                                                        validate: {
                                                            unique: value => {
                                                                const implementadorValue = watch(`implementador_${row.id}`);
                                                                const tecnicoValue = watch(`tecnico_${row.id}`);
                                                                if (value === '0' || implementadorValue === '0' || tecnicoValue === '0' ) {
                                                                    return true;
                                                                }
                                                                const duplicate = additionalRows.find(r => 
                                                                    r.indAno === row.indAno && 
                                                                    r.indCod === row.indCod && 
                                                                    r.id !== row.id && 
                                                                    watch(`ubicacion_${r.id}`) === value && 
                                                                    watch(`implementador_${r.id}`) === implementadorValue &&
                                                                    watch(`tecnico_${r.id}`) === tecnicoValue

                                                                );
                                                                if (duplicate) {
                                                                    Notiflix.Report.warning(
                                                                        'Error de Validación',
                                                                        `Verifica que no se repita técnico, implementador y ubicación para el indicador ${row.indNum}`,
                                                                        'Aceptar',
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
                                                    {ubicacionesSelect.map((item, index) => {
                                                        // Limita la longitud del texto a 50 caracteres
                                                        const maxLength = 15;
                                                        let displayText = item.ubiNom.toLowerCase();
                                                        if (displayText.length > maxLength) {
                                                            displayText = displayText.substring(0, maxLength) + '...';
                                                        }
                            
                                                        return (
                                                            <option
                                                                className='f_75'
                                                                key={index} 
                                                                value={JSON.stringify({ ubiAno: item.ubiAno, ubiCod: item.ubiCod })}
                                                                title={item.ubiNom}
                                                            > 
                                                                {displayText}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </td>
                                            {meses.map((mes, i) => (
                                                <td key={i+1}>
                                                    <input
                                                        autoComplete='off'
                                                        className={`
                                                            PowerMas_Input_Cadena Large_12 f_75 
                                                            PowerMas_Cadena_Form_${dirtyFields[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] || isSubmitted ? (errors[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] ? 'invalid' : 'valid') : ''}
                                                            ${getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && 'PowerMas_Tooltip_Active'}
                                                        `} 
                                                        data-tooltip-id="info-tooltip" 
                                                        data-tooltip-content={getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && `META PRESUPUESTO: ${formatterBudget.format(getValues(`metMetPre_${String(i+1).padStart(2, '0')}_${row.id}`) || 0)} $`} 
                                                        disabled={!actions.add}
                                                        maxLength={10}
                                                        onInput={(e) => {
                                                            let value = e.target.value;
                                                            if (item.tipValCod === '02') {
                                                                // Permite hasta dos decimales
                                                                value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                                                                if (value.split('.').length > 2) {
                                                                    value = value.replace(/\.+$/, '');
                                                                }
                                                                if (value.includes('.')) {
                                                                    const parts = value.split('.');
                                                                    if (parts[1].length > 2) {
                                                                        parts[1] = parts[1].substring(0, 2);
                                                                        value = parts.join('.');
                                                                    }
                                                                }
                                                            } else {
                                                                // Solo permite números enteros
                                                                value = value.replace(/[^0-9]/g, '');
                                                            }
                                                            
                                                            const inputVal = Number(value);

                                                            validateInput(inputVal, row, i, additionalRows);
                                                            
                                                            // Actualiza los totales y los valores previos
                                                            const key = `${row.id}_${String(i+1).padStart(2, '0')}`;
                                                            const totalKey = `${row.id}_total`;
                                                            const prevValue = prevValues[key] || 0;
                                                            setTotals(prevTotals => ({
                                                                ...prevTotals,
                                                                [key]: (prevTotals[key] || 0) - prevValue + inputVal,
                                                                [totalKey]: item.tipValCod === '01'
                                                                    ? (prevTotals[totalKey] || 0) - prevValue + inputVal
                                                                    : calculateNewAverage(prevTotals, totalKey, inputVal, 'add')
                                                            }));
                                                            setPrevValues(prevValues => ({
                                                                ...prevValues,
                                                                [key]: inputVal
                                                            }));
                                                        }}
                                                        style={{margin: '0'}}
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
                <div className='PowerMas_Footer_Box flex flex-column jc-center ai-center p_25'>    
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
                    className="PowerMas_BubbleChain flex flex-column gap_25 p1"
                    onClick={handleClickInside}
                >
                    <span 
                        className="bold f1_5 pointer"
                        style={{
                            color: '#FFFFFF',
                            position: 'absolute',
                            top: 0,
                            right: '0.5rem',
                            zIndex: '4'
                        }}
                        onClick={() => setPopupInfo({ visible: false, data: null })}
                    >
                        ×
                    </span>
                    <div className='m_25' style={{color: '#FFFFFF'}}>
                        <h5 className='center'>Cadena de Resultado</h5>
                        <h5 className='center'>{popupInfo.data.indNum}</h5>
                    </div>
                    <div className='flex flex-column'>
                        <h4 className='f_75' style={{color: '#FFC658'}}>IMPLEMENTADORES:</h4>
                        {Object.values(popupInfo.data.implementador).map((item, index) => (
                            <span key={index}>
                                <span className='f_75' style={{color: '#FFFFFF'}} >{item.name}: </span> <span className='f_75' style={{color: '#FFC658'}}>{item.value}</span>
                            </span>
                        ))}
                    </div>
                    <div className='flex flex-column'>
                        <h4 className='f_75' style={{color: '#FFC658'}}>UBICACIONES:</h4>
                        {Object.values(popupInfo.data.ubicacion).map((item, index) => (
                            <span key={index}>
                                <span className='f_75' style={{color: '#FFFFFF'}}>{item.name}: </span> <span className='f_75' style={{color: '#FFC658'}}>{item.value}</span>
                            </span>
                        ))}
                    </div>
                    <div className=''>
                        <h4 className='f_75' style={{color: '#FFC658'}}>PERIODO:</h4>
                        <span className='f_75' style={{color: '#FFFFFF'}}>{watch('metAnoPlaTec')} : </span> <span className='f_75' style={{color: '#FFC658'}}> {popupInfo.data.periodo} </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResultGoal