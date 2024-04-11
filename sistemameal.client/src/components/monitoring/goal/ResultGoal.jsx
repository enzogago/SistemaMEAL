import React, { Fragment, useEffect, useState } from 'react'
import { FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import { fetchData } from '../../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import Modal from 'react-modal';
import { formatter } from './helper';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logoBase64 } from "../../../img/Powermas_Logo_Ayuda_En_Accion";

const ResultGoal = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [subproyectos, setSubProyectos] = useState([]);
    const [selectedSubProyecto, setSelectedSubProyecto] = useState(null);
    const [indicadores, setIndicadores] = useState([]);
    const [usersTecnicos, setUsersTecnicos] = useState([]);
    
    const [implementadoresSelect, setImplementadoresSelect] = useState([]);
    const [additionalRows, setAdditionalRows] = useState([]);
    const [expandedIndicators, setExpandedIndicators] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    
    const [totals, setTotals] = useState({});
    const [prevValues, setPrevValues] = useState({});
    
    const [ubicacionesSelect, setUbicacionesSelect] = useState([]); // Options de paises
    const [selects, setSelects] = useState([]); // Slects dinamicos
    const [loadginSelect, setLoadingSelect] = useState(false)

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
        trigger,
        getValues
    } = 
    useForm({ mode: "onChange"});

    // Configuracion del formulario 2
    const { 
        register: register2, 
        watch: watch2, 
        handleSubmit: handleSubmit2, 
        formState: { errors: errors2, dirtyFields:dirtyFields2, isSubmitted:isSubmitted2 }, 
        setValue:setValue2,
    } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        const pais = watch2('pais');

        if (pais) {
            if (pais === '0') {
                setSelects([]);
                return;
            }

            handleCountryChange(pais);
        }
    }, [watch2('pais')]);

    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos);
        fetchUsuariosTecnico();
    }, []);

    const fetchUsuariosTecnico = async () => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            // Valores del storage
            const token = localStorage.getItem('token');
            
            // Obtenemos los datos
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario/tecnico`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response)
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
            setUsersTecnicos(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    
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
            const fetchDataInOrder = async () => {
                await fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`,setIndicadores)
                await fetchData(`Implementador/subproyecto/${subProAno}/${subProCod}`,setImplementadoresSelect)
                fetchData(`Ubicacion/subproyecto/${subProAno}/${subProCod}`, (data) => {
                    setUbicacionesSelect([]);
                    data.map(ubi => {
                        fetchSelect(ubi.ubiAno, ubi.ubiCod);
                    })
                })
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
                        setValue(`nombreUbicacion_${meta.indAno}_${meta.indCod}_${counter}`, meta.ubiNom.toLowerCase());
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
        console.log(data);
        console.log(additionalRows);
        console.log(Metas);
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
    
    const getUbicacionName = (ubiAno, ubiCod) => {
        for (const options of selects) {
            const option = options.find(o => o.ubiAno === ubiAno && o.ubiCod === ubiCod);
            if (option) {
                return option.ubiNom;
            }
        }
        const ubicacion = ubicacionesSelect.find(u => u.ubiAno === ubiAno && u.ubiCod === ubiCod);
        return ubicacion ? ubicacion.ubiNom.toLowerCase() : '';
    };

    const onSubmit2 = (data) => {
        let ubiAno, ubiCod;
        let nombreUbicacion = '';
        // Si los selects dinamicos son mayor a 1
        if (selects.length > 1) {
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;
            if (lastSelect === '0') {
                const penultimateSelectElement = document.querySelector(`select[name=select${selects.length - 2}]`);
                const penultimateSelect = JSON.parse(penultimateSelectElement.value);
                ubiAno = penultimateSelect.ubiAno;
                ubiCod = penultimateSelect.ubiCod;
            } else {
                const ultimo = JSON.parse(lastSelect);
                ubiAno = ultimo.ubiAno;
                ubiCod = ultimo.ubiCod;
            }
        } else {
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;
            if(lastSelect === '0'){
                const { ubiAno: paisUbiAno, ubiCod: paisUbiCod } = JSON.parse(data.pais);
                ubiAno = paisUbiAno;
                ubiCod = paisUbiCod;
                // Buscar en ubicacionesSelect
                const selectedOption = ubicacionesSelect.find(option => option.ubiAno === ubiAno && option.ubiCod === ubiCod);
                nombreUbicacion = selectedOption.ubiNom;
            } else{
                const ultimo = JSON.parse(lastSelect);
                ubiAno = ultimo.ubiAno;
                ubiCod = ultimo.ubiCod;
            }
        }

        // Si el usuario seleccionó más que solo el país, construir la cadena de ubicación
        if (selects.length > 1 || (selects.length === 1 && selects[0].length > 1)) {
            let currentUbiAno = ubiAno;
            let currentUbiCod = ubiCod;
            while (currentUbiAno && currentUbiCod) {
                const ubicacionName = getUbicacionName(currentUbiAno, currentUbiCod);
                if (nombreUbicacion) {
                    nombreUbicacion = ubicacionName + ', ' + nombreUbicacion;
                } else {
                    nombreUbicacion = ubicacionName;
                }
                const ubicacion = selects.flat().find(u => u.ubiAno === currentUbiAno && u.ubiCod === currentUbiCod);
                if (ubicacion) {
                    currentUbiAno = ubicacion.ubiAnoPad;
                    currentUbiCod = ubicacion.ubiCodPad;
                } else {
                    break;
                }
            }
        }
        
        setValue(`ubicacion_${editingRow}`, JSON.stringify({ ubiAno, ubiCod }));
        trigger(`ubicacion_${editingRow}`);
        setValue(`nombreUbicacion_${editingRow}`, nombreUbicacion.toLocaleLowerCase());
        closeModal();
    };

    const fetchSelect = async (ubiAno,ubiCod) => {
        try {
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/select/${ubiAno}/${ubiCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            console.log(data)
            setUbicacionesSelect(prevUbicaciones => [...prevUbicaciones, data[0]]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleCountryChange = async (ubicacion, index) => {
        const selectedCountry = JSON.parse(ubicacion);
        if (ubicacion === '0') {
            setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual

            return;
        }

        try {
            setLoadingSelect(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/${selectedCountry.ubiAno}/${selectedCountry.ubiCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if(response.status == 401 || response.status == 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                }
                return;
            }
            const data = await response.json();
            if (data.success == false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            if (data.length > 0) {
                setSelects(prevSelects => prevSelects.slice(0, index + 1).concat([data]));  // Reinicia los selects por debajo del nivel actual
            } else {
                setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingSelect(false);
        }
    };

    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    const closeModal = () => {
        setIsModalOpen(false);
        setValue2('pais','0');
    }

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
                        .reduce((sum, [, value]) => sum + value, 0);
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
                    cell.numFmt = '#,##0';
                }
            });
    
            // Combinar las celdas horizontalmente para el nombre del indicador principal
            worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);

            // Agregar las filas adicionales para este indicador
            additionalRows.filter(row => row.indAno === indicador.indAno && row.indCod === indicador.indCod).forEach(additionalRow => {
                const { usuAno, usuCod } = JSON.parse(getValues(`tecnico_${additionalRow.id}`));
                const userTecnico = usersTecnicos.find(user => user.usuAno === usuAno && user.usuCod === usuCod);

                const impCod = getValues(`implementador_${additionalRow.id}`);
                const implementador = implementadoresSelect.find(imp => imp.impCod === impCod);

                const additionalRowData = {
                    'CODIGO': '',
                    'NOMBRE': userTecnico ? (userTecnico.usuNom + ' ' + userTecnico.usuApe) : '',
                    'NOMBRE2': implementador ? implementador.impNom : '',
                    'NOMBRE3': getValues(`nombreUbicacion_${additionalRow.id}`)?.toUpperCase(),
                    ...meses.reduce((obj, mes, i) => {
                        const fieldValue = getValues(`mes_${String(i+1).padStart(2, '0')}_${additionalRow.id}`);
                        obj[mes] = Number(fieldValue) || 0;
                        return obj;
                    }, {}),
                    'TOTAL': Object.entries(totals)
                        .filter(([key]) => key.startsWith(`${additionalRow.id}`) && key.endsWith('_total'))
                        .reduce((sum, [, value]) => sum + value, 0)
                };
                const additionalRowExcel = worksheet.addRow(additionalRowData);

                // Aplicar el formato de número a las celdas numéricas (columna 3 en adelante)
                additionalRowExcel.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (colNumber >= 3) {
                        cell.numFmt = '#,##0';
                    }
                });
            });
        });
    
        // Crear el archivo de Excel y descargarlo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `METAS_PROGRAMATICAS_${Date.now()}.xlsx`);
    };
     
    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
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
                            <th className='center' colSpan={2}></th>
                            <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>Código</th>
                            <th colSpan={3}>Nombre</th>
                            {meses.map((mes, i) => (
                                <th className='center' style={{textTransform: 'capitalize'}} key={i+1}>{mes.toLowerCase()}</th>
                            ))}
                            <th style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>Total</th>
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
                                    <td>
                                        <button 
                                            className='p_25' 
                                            style={{backgroundColor: 'transparent', border: 'none'}} 
                                            onClick={() => {
                                                setRowIdCounter(rowIdCounter + 1);
                                                setAdditionalRows([...additionalRows, { id: `${item.indAno}_${item.indCod}_${rowIdCounter}`, indAno: item.indAno, indCod: item.indCod, indNum: item.indNum }]);
                                                if (!expandedIndicators.includes(`${item.indAno}_${item.indCod}`)) {
                                                    setExpandedIndicators([...expandedIndicators, `${item.indAno}_${item.indCod}`]);
                                                }
                                            }}
                                        > + </button>
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
                                        <td ></td>
                                        <td>
                                            <button 
                                                style={{backgroundColor: 'transparent', border: 'none'}} 
                                                onClick={() => {
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
                                                }}
                                            > - </button>
                                        </td>
                                        <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></td>
                                        <td>
                                            <select 
                                                style={{textTransform: 'capitalize', margin: '0'}}
                                                id={`tecnico_${row.id}`}
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
                                        <td>
                                            <select 
                                                style={{textTransform: 'capitalize', margin: '0'}}
                                                id={`implementador_${row.id}`}
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
                                                <option value="0">--Implementador--</option>
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
                                        <td>
                                            <div className='flex gap_3'>
                                                <input
                                                    style={{margin: '0', textTransform: 'capitalize'}}
                                                    className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`ubicacion_${row.id}`] || isSubmitted ? (errors[`ubicacion_${row.id}`] ? 'invalid' : 'valid') : ''}`} 
                                                    placeholder='Sin ubicación'
                                                    disabled
                                                    {...register(`nombreUbicacion_${row.id}`, {
                                                        required: 'El campo es requerido',
                                                    })}
                                                />
                                                <input
                                                    type="hidden"
                                                    {...register(`ubicacion_${row.id}`, { 
                                                        required: 'El campo es requerido',
                                                        validate: {
                                                            unique: value => {
                                                                const implementadorValue = watch(`implementador_${row.id}`);
                                                                const duplicate = additionalRows.find(r => 
                                                                    r.indAno === row.indAno && 
                                                                    r.indCod === row.indCod && 
                                                                    r.id !== row.id && 
                                                                    watch(`implementador_${r.id}`) === implementadorValue && 
                                                                    watch(`ubicacion_${r.id}`) === value
                                                                );
                                                                
                                                                if (duplicate) {
                                                                    Notiflix.Report.failure(
                                                                        'Error de Validación',
                                                                        '"Verifica que no se repita el implementador y ubicación en más de una fila." <br/><br/><br/><br/>- Indicador '+ row.indNum,
                                                                        'Vale',
                                                                    );
                                                                    return false;
                                                                }
                                                                return true;
                                                            }
                                                        }
                                                    })}
                                                />
                                                <button className='p0' style={{backgroundColor: 'transparent', border: 'none'}} onClick={() => {
                                                    setIsModalOpen(true);
                                                    setEditingRow(`${row.id}`);
                                                }}>+</button>
                                            </div>
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
                                                        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    maxLength={10}
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
            </div>
            <div className='PowerMas_Footer_Box flex flex-column jc-center ai-center p_5 gap_5'>    
                <button 
                    className='PowerMas_Buttom_Primary Large_3 p_5'
                    onClick={handleSubmit(onSubmit)}
                >
                    Grabar
                </button>
            </div>
            <Modal
                ariaHideApp={false}
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                closeTimeoutMS={200}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        minWidth: '40%',
                        minHeight: '80%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            > 
            {isModalOpen && 
                <div className='Large_12 flex flex-column ai-center jc-center flex-grow-1'>
                    <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
                    <h2 className='Large_12 PowerMas_Title_Modal f1_5 center'>Selecciona una ubicación</h2>
                    <div className='Phone_12 flex-grow-1'>
                        <div className="m_75">
                            <label htmlFor="pais" className="">
                                Pais:
                            </label>
                            <select 
                                id="pais"
                                style={{textTransform: 'capitalize'}}
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.pais || isSubmitted2 ? (errors2.pais ? 'invalid' : 'valid') : ''}`} 
                                {...register2('pais', { 
                                    validate: {
                                        required: value => value !== '0' || 'El campo es requerido',
                                    }
                                })}
                            >
                                <option value="0">--Seleccione País--</option>
                                {ubicacionesSelect.map(pais => (
                                    <option 
                                        key={pais.ubiCod} 
                                        value={JSON.stringify({ ubiCod: pais.ubiCod, ubiAno: pais.ubiAno })}
                                    > 
                                        {pais.ubiNom.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors2.pais ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.pais.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        {selects.map((options, index) => (
                            <div className="m_75" key={index}>
                                <label style={{textTransform: 'capitalize'}} htmlFor={index} className="">
                                    {options[0].ubiTip.toLowerCase()}
                                </label>
                                <select
                                    id={index}
                                    key={index} 
                                    name={`select${index}`} 
                                    onChange={(event) => {
                                        handleCountryChange(event.target.value, index);
                                    }} 
                                    style={{textTransform: 'capitalize'}}
                                    className="block Phone_12"
                                >
                                    <option style={{textTransform: 'capitalize'}} value="0">--Seleccione {options[0].ubiTip.toLowerCase()}--</option>
                                    {options.map(option => (
                                        <option key={option.ubiCod} value={JSON.stringify({ ubiCod: option.ubiCod, ubiAno: option.ubiAno })}>
                                            {option.ubiNom.toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        {
                            loadginSelect &&
                            <div id="loading" className="m_75">Cargando...</div>
                        }
                    </div>
                    <br />
                    <button 
                        className='PowerMas_Buttom_Primary Large_6'
                        onClick={handleSubmit2(onSubmit2)}
                    >
                        Guardar
                    </button>
                </div>
            }
            </Modal>
        </div>
    )
}

export default ResultGoal