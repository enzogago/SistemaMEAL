import React, { Fragment, useEffect, useState } from 'react'
import { FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import { fetchData } from '../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logoBase64 } from "../../img/Powermas_Logo_Ayuda_En_Accion";
import { formatter } from '../monitoring/goal/helper';

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
            console.log(selected)
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
            const fetchDataInOrder = async () => {
                await fetchData(`Indicador/subproyecto-actividad/${subProAno}/${subProCod}`,setIndicadores)
                await fetchData(`Financiador`,setFinanciadoresSelect)
                fetchData(`Meta/${subProAno}/${subProCod}/${ano}`, (data) => {
                    // Obtén todos los nombres de los campos registrados
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

                    setInitialMetas(data);
                    setTotals({});
                    const rows = {};
                    let counter = rowIdCounter;
                    data.forEach(meta => {
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
                                cells: [],
                            };
                        }

                        // Agrega la celda a la fila
                        rows[rowKey].cells.push(inputValues);
                    });
                    const filas = Object.values(rows);
                    setAdditionalRows(filas);
                    setRowIdCounter(counter+1);
                });
            }
            fetchDataInOrder();
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

    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    const exportToExcel = async (indicadores, totales, additionalRows) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('METAS');

        // Añadir una imagen (opcional)
        const imageId = workbook.addImage({base64: logoBase64, extension: 'png' });
        worksheet.addImage(imageId, {
            tl: { col: 0, row: 1 },
            ext: { width: 200, height: 50 }
        });

        // Agregar 5 filas vacías al inicio
        for (let i = 0; i < 4; i++) {
            worksheet.addRow([]);
        }
    
        // Definir los encabezados
        const headers = ['CODIGO', 'NOMBRE', 'NOMBRE2', 'NOMBRE3', ...meses, 'TOTAL'];
        worksheet.columns = headers.map(header => ({ key: header, width: 10 }));

        // Insertar una columna vacía al principio
        worksheet.spliceColumns(1, 0, []);
        // Agregar los encabezados en la sexta fila
        const headerRow = worksheet.getRow(6);
        headers.forEach((header, index) => {
            const cell = headerRow.getCell(index + 2);
            cell.value = header;
        
            // Establecer el color de fondo y el color del texto para los dos primeros encabezados
            if (index < 2) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFCA53' }
                };
                cell.font = {
                    color: { argb: '000000' },
                    bold: true
                };
            } else {
                // Establecer otro color de fondo y de texto para los demás encabezados
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '25848F' }
                };
                cell.font = {
                    color: { argb: 'FFFFFF' },
                    bold: true
                };
            }
        });
    
        // Combinar las celdas de los encabezados
        worksheet.mergeCells('C6:E6');
        
    
        indicadores.forEach(indicador => {
            const row = {
                'CODIGO': indicador.indNum,
                'NOMBRE': indicador.indNom,
                ...meses.reduce((obj, mes, i) => {
                    obj[mes] = Object.entries(totales)
                        .filter(([key]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}`) && key.endsWith(String(i+1).padStart(2, '0')))
                        .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
                    return obj;
                }, {}),
                'TOTAL': Object.entries(totales)
                    .filter(([key]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}`) && key.endsWith('_total'))
                    .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
            };
            const rowIndex = worksheet.addRow(row).number;

            // Aplicar el formato de número a las celdas numéricas (columna 3 en adelante)
            const rowExcel = worksheet.getRow(rowIndex);
            rowExcel.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber >= 3) {
                    cell.numFmt = '#,##0.00 $';
                }
            });
    
            // Combinar las celdas horizontalmente para el nombre del indicador principal
            worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);

            // Agregar las filas adicionales para este indicador
            additionalRows.filter(row => row.indAno === indicador.indAno && row.indCod === indicador.indCod).forEach(additionalRow => {
                const finCod = getValues(`financiador_${additionalRow.id}`);
                const financiador = financiadoresSelect.find(fin => fin.finCod === finCod);


                const additionalRowData = {
                    'CODIGO': indicador.indNum,
                    'NOMBRE': financiador ? financiador.finNom : '',
                    'NOMBRE2': getValues(`implementador_${additionalRow.id}`)?.toUpperCase(),
                    'NOMBRE3': getValues(`nombreUbicacion_${additionalRow.id}`)?.toUpperCase(),
                    ...meses.reduce((obj, mes, i) => {
                        const fieldValue = getValues(`mes_${String(i+1).padStart(2, '0')}_${additionalRow.id}`);
                        const metaValue = getValues(`meta_${String(i+1).padStart(2, '0')}_${additionalRow.id}`);
                        // Solo agregar el valor a la celda si está asociado a una meta
                        if (metaValue) {
                            obj[mes] = Number(fieldValue) || 0;
                        } else {
                            obj[mes] = '';
                        }
                        return obj;
                    }, {}),
                    'TOTAL': Object.entries(totals)
                        .filter(([key]) => key.startsWith(`${additionalRow.id}`) && key.endsWith('_total'))
                        .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
                };
                const additionalRowExcel = worksheet.addRow(additionalRowData);

                // Aplicar el formato de número a las celdas numéricas (columna 3 en adelante)
                additionalRowExcel.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (colNumber >= 3) {
                        cell.numFmt = '#,##0.00 $';
                    }
                });
            });
        });
    
        // Crear el archivo de Excel y descargarlo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `METAS_PRESUPUESTO_${Date.now()}.xlsx`);
    };
     
    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
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
                <div>
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
                <div className={`PowerMas_Dropdown_Export Large_3 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        <a onClick={() => {
                            exportToExcel(indicadores, totals, additionalRows);
                            setDropdownOpen(false);
                        }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto">
                <table className="PowerMas_TableStatus ">
                    <thead>
                        <tr style={{zIndex: '1'}}>
                            <th className='center'></th>
                            <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>Código</th>
                            <th colSpan={3}>Nombre</th>
                            {meses.map((mes, i) => (
                                <th className='center' style={{textTransform: 'capitalize'}} key={i+1}>{mes.toLowerCase()} ($)</th>
                            ))}
                            <th style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>Total ($)</th>
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
                                                .reduce((sum, [, value]) => sum + value, 0))} $
                                        </td>
                                    ))}
                                    <td className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                        {formatter.format(Object.entries(totals)
                                            .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith('_total'))
                                            .reduce((sum, [, value]) => sum + value, 0))} $
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
                                                    data-tooltip-content={getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && `Meta técnica: ${getValues(`metMetTec_${String(i+1).padStart(2, '0')}_${row.id}`)}`} 
                                                    className={`
                                                        PowerMas_Input_Cadena Large_12 f_75 
                                                        PowerMas_Cadena_Form_${dirtyFields[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] || isSubmitted ? (errors[`mes_${String(i+1).padStart(2, '0')}_${row.id}`] ? 'invalid' : 'valid') : ''}
                                                        ${getValues(`meta_${String(i+1).padStart(2, '0')}_${row.id}`) && 'PowerMas_Tooltip_Active'}
                                                    `} 
                                                    style={{margin: '0'}}
                                                    onInput={(e) => {
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
                                                    onKeyDown={(event) => {
                                                        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter' && event.key !== '.') {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    maxLength={10}
                                                    {...register(`mes_${String(i+1).padStart(2, '0')}_${row.id}`, { 
                                                        pattern: {
                                                            value: /^(?:[1-9]\d*(\.\d+)?|0\.\d*[1-9]\d*)$/,
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
                                            {formatter.format(totals[`${row.id}_total`] || 0) } $
                                        </td>
                                    </tr>
                                ))}
                            </Fragment>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='PowerMas_Footer_Box flex flex-column jc-center ai-center p_5 gap_5'>    
                <button 
                    className='PowerMas_Buttom_Primary Large_3 p_5'
                    onClick={handleSubmit(onSubmit)}
                >
                    Grabar
                </button>
            </div>
        </div>
    )
}

export default ExecutionBudget