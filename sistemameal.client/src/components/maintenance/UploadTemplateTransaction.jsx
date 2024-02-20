import React, { useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Notiflix from 'notiflix';

const UploadTemplateTransaction = ({ expectedHeaders, controller }) => {
    const fileInput = useRef();
    const [tableData, setTableData] = useState([]); // Datos para la tabla
    const [postData, setPostData] = useState([]); // Datos para enviar al servidor
    const [isValid, setIsValid] = useState(true);
    const [errorCells, setErrorCells] = useState([]);

    const validateCell = (value, validationRules) => {
        if (validationRules.maxLength && value.length > validationRules.maxLength) {
            return `El campo no puede tener más de ${validationRules.maxLength} caracteres`;
        }
        if (validationRules.minLength && value.length < validationRules.minLength) {
            return `El campo no puede tener menos de ${validationRules.minLength} caracteres`;
        }
        if (validationRules.pattern && !validationRules.pattern.test(value)) {
            return validationRules.patternMessage;
        }
        if (validationRules.noLeadingSpaces && value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };

    const validationRules = {
        'nombre': {
            maxLength: 50,
            minLength: 5,
            pattern: /^[A-Za-zñÑ\s]+$/,
            patternMessage: 'Por favor, introduce solo letras y espacios',
        },
        'descripcion': {
            maxLength: 50,
            minLength: 5,
            pattern: /^[A-Za-zñÑ\s]+$/,
            patternMessage: 'Por favor, introduce solo letras y espacios',
        },
        'color': {
            minLength: 7,
            maxLength: 7,
            pattern: /^#([0-9A-Fa-f]{6})$/,
            patternMessage: 'Por favor, introduce un color en formato hexadecimal',
        },
        'indicador': {
            pattern: /^[IA]$/,
            patternMessage: 'Por favor, introduce solo I o A',
        },
        'numero': {
            minLength: 5,
            maxLength: 50,
            pattern: /^[A-Za-z0-9ñÑ\s\.]+$/,
            patternMessage: 'Por favor, introduce solo letras, números, puntos y espacios',
        },
        'año': {
            pattern: /^\d{4}$/,
            patternMessage: 'Por favor, introduce un año válido con 4 dígitos',
        },
        'mes': {
            pattern: /^(0[1-9]|1[0-2])$/,
            patternMessage: 'Por favor, introduce un mes válido del 01 al 12',
        },
    };
    

    const handleUpload = async () => {
        // Reinicia los estados cada vez que se carga un archivo
        setTableData([]);
        setPostData([]);
        setIsValid(true);
        setErrorCells([]);

        const file = fileInput.current.files[0];
        // Comprueba si el archivo es un Excel
        if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
            alert('Por favor, sube un archivo Excel');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(data);

            const worksheet = workbook.worksheets[0];
            const tableData = [];
            const postData = [];
            const newErrorCells = []; // Mueve la declaración de newErrorCells aquí
            const projects = {};

            // Extrae los encabezados legibles por humanos de expectedHeaders
            const expectedHeaderDisplays = expectedHeaders.map(header => header.display.toUpperCase());
            
            // Verifica que los encabezados son correctos
            const headers = worksheet.getRow(1).values.slice(1, worksheet.getRow(1).values.length);
            if (!arraysEqual(headers, expectedHeaderDisplays)) {
                alert('Los encabezados no son válidos');
                setIsValid(false);
                return;
            }

            let currentProjectKey = null;
            let currentColor = 'lightgray';

            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) { // Itera sobre todas las filas
                const row = worksheet.getRow(rowNumber);
                const tableRowData = new Array(expectedHeaders.length).fill(''); // Inicializa la fila con valores vacíos
                const postRowData = {};
                const projectData = {}; // Inicializa los datos del proyecto
                const subprojectData = {}; // Inicializa los datos del subproyecto
                const objectiveData = {}; // Inicializa los datos del subproyecto
                const specificObjectiveData  = {}; // Inicializa los datos del subproyecto
                const resultData  = {}; // Inicializa los datos del subproyecto
                const ActivityIndicatorData  = {}; // Inicializa los datos del subproyecto

                row.eachCell((cell, colNumber) => {
                    if (colNumber <= expectedHeaders.length) { // Solo lee las celdas dentro del rango de los encabezados
                        const cellValue = cell.text.trim();
                        const headerInfo = expectedHeaders[colNumber - 1];
                        const databaseKey = headerInfo.dbKey; // Obtiene la clave de la base de datos correspondiente
                        const entity = headerInfo.entity; // Obtiene la entidad correspondiente
                        const validationKey = headerInfo.validation; // Obtiene la clave de validación correspondiente

                        // Dependiendo de la entidad, agrega los datos al objeto correspondiente
                        if (entity === 'Proyecto') {
                            projectData[databaseKey] = cellValue;
                        } else if (entity === 'Subproyecto') {
                            subprojectData[databaseKey] = cellValue;
                        } else if (entity === 'Objetivo') {
                            objectiveData[databaseKey] = cellValue; // Agrega los datos del objetivo
                        } else if (entity === 'ObjetivoEspecifico') {
                            specificObjectiveData[databaseKey] = cellValue; // Agrega los datos del objetivo específico
                        } else if (entity === 'Resultado') {
                            resultData[databaseKey] = cellValue; // Agrega los datos del objetivo específico
                        }else if (entity === 'IndicadorActividad') {
                            ActivityIndicatorData[databaseKey] = cellValue; // Agrega los datos del objetivo específico
                        }

                        // Agrega los datos a tableRowData y postRowData
                        tableRowData[colNumber - 1] = cellValue;
                        postRowData[databaseKey] = cellValue;

                        // Obtiene las reglas de validación para este campo
                        const fieldValidationRules = validationRules[validationKey];

                        // Valida la celda
                        const validationMessage = validateCell(cellValue, fieldValidationRules);
                        if (validationMessage !== true) {
                            newErrorCells.push({ row: rowNumber - 2, column: colNumber - 1,  message: validationMessage});
                            setIsValid(false);
                        }
                    }
                });
                // Genera una clave única para cada proyecto utilizando todas sus propiedades
                const projectKey = JSON.stringify(projectData);
                // Genera una clave única para cada subproyecto utilizando solo los campos que definen un subproyecto único
                const subprojectKey = JSON.stringify(subprojectData);
                // Genera una clave única para cada objetivo utilizando solo los campos que definen un objetivo único
                const objectiveKey = JSON.stringify(objectiveData);
                // Genera una clave única para cada objetivo especifico utilizando solo los campos que definen un objetivo único
                const specificObjectiveKey = JSON.stringify(specificObjectiveData);
                // Genera una clave única para cada objetivo especifico utilizando solo los campos que definen un objetivo único
                const resultKey = JSON.stringify(resultData);

                // Si el proyecto no existe en el objeto projects, lo agrega
                if (!projects[projectKey]) {
                    projects[projectKey] = {
                        ...projectData,
                        subProyectos: {}
                    };
                }

                // Si el subproyecto no existe en el proyecto, lo agrega
                if (!projects[projectKey].subProyectos[subprojectKey]) {
                    projects[projectKey].subProyectos[subprojectKey] = {
                        ...subprojectData,
                        objetivos: {}
                    };
                }

                // Si el subproyecto no existe en el proyecto, lo agrega
                if (!projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey]) {
                    projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey] = {
                        ...objectiveData,
                        objetivosEspecificos: {}
                    };
                }

                if (!projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey].objetivosEspecificos[specificObjectiveKey]) {
                    projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey].objetivosEspecificos[specificObjectiveKey] = {
                        ...specificObjectiveData,
                        resultados: {} 
                    };
                }

                if (!projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey].objetivosEspecificos[specificObjectiveKey].resultados[resultKey]) {
                    projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey].objetivosEspecificos[specificObjectiveKey].resultados[resultKey] = {
                        ...resultData,
                        indicadoresActividades: [ActivityIndicatorData]
                    };
                } else {
                    // Si el objetivo ya existe, solo agrega el objetivo específico
                    projects[projectKey].subProyectos[subprojectKey].objetivos[objectiveKey].objetivosEspecificos[specificObjectiveKey].resultados[resultKey].indicadoresActividades.push(ActivityIndicatorData);
                }

                // Si el proyecto ha cambiado, cambia el color
                if (projectKey !== currentProjectKey) {
                    currentProjectKey = projectKey;
                    currentColor = currentColor === 'lightgray' ? 'white' : 'lightgray';
                }

                // Agrega el color a tableRowData
                tableRowData.color = currentColor;

                tableData.push(tableRowData);
                postData.push(postRowData);
                // Verifica si alguna celda en la fila está vacía
                for (let i = 0; i < tableRowData.length; i++) {
                    if (!tableRowData[i]) {
                        newErrorCells.push({ row: rowNumber - 2, column: i, message: "El campo es requerido" });
                        setIsValid(false);
                    }
                }
            }
            
            // Convierte el objeto projects en un arreglo
            const projectsArray = Object.values(projects).map(project => ({
                ...project,
                subProyectos: Object.values(project.subProyectos).map(subproject => ({
                    ...subproject,
                    objetivos: Object.values(subproject.objetivos).map(objective => ({
                        ...objective,
                        objetivosEspecificos: Object.values(objective.objetivosEspecificos).map(specificObjective => ({
                            ...specificObjective,
                            resultados: Object.values(specificObjective.resultados).map(result => ({
                                ...result,
                                indicadoresActividades: result.indicadoresActividades 
                            }))
                        }))
                    }))
                }))
            }));
            setTableData(tableData);
            setPostData(projectsArray);
            setErrorCells(newErrorCells);
            console.log(errorCells)
        };
        reader.readAsArrayBuffer(file);
    };
    
    // Función para comparar dos arreglos
    function arraysEqual(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }

    const exportTemplate = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Plantilla");
    
        worksheet.columns = expectedHeaders.map(header => ({ header: header.display.toUpperCase(), key: header.display, width: 15 }));
        workbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(new Blob([buffer]), `PLANTILLA_${controller.toUpperCase()}.xlsx`);
        });
    };

    const processValidData = async() => {
        // Verifica que los datos sean válidos y que no estén vacíos
        if (!isValid || postData.length === 0) {
            alert('Los datos son inválidos o no hay datos para procesar');
            return;
        }
    
        // Aquí puedes procesar los datos y enviarlos al servidor
        console.log('Procesando datos...');
        console.log(postData);
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}/Masivo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData),
            });
            console.log("desde response: ",response)
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message)
                return;
            }
            console.log(data)
            Notiflix.Notify.success(data.message)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }
    
    return (
        <div className='flex flex-column flex-grow-1 Large-p1'>
            <div className="flex Large_12 gap_3">
                <h3 className='flex-grow-1'>Upload {controller}</h3>
                <input className='PowerMas_Hover_Grey' style={{border: '1px solid transparent', margin: 0, cursor: 'pointer', transition: 'background-color 0.2s ease-in'}} type="file" ref={fileInput} accept=".xlsx, .xls" />
                <button className='PowerMas_Buttom_Primary' onClick={handleUpload}>Cargar archivo</button>
                <button className='PowerMas_Buttom_Secondary' onClick={exportTemplate}>Descargar plantilla</button>
            </div>
            <div className="flex-grow-1 overflow-auto">
                <table className="Phone_12 ">
                    <thead>
                        <tr>
                            {expectedHeaders.map((header, index) => (
                                <th key={index}>{header.display.toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className=''>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{height: '2rem', backgroundColor: row.color}}>
                            {row.map((cell, columnIndex) => (
                                <td
                                    key={columnIndex}
                                    style={{
                                        backgroundColor: errorCells.some(errorCell => errorCell.row === rowIndex && errorCell.column === columnIndex) ? 'red' : 'transparent',
                                        border: '1px solid black'
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <p>{isValid && postData.length !== 0 ? 'Datos válidos' : 'Datos inválidos o no hay datos'}</p>
            <button className='PowerMas_Buttom_Primary' onClick={processValidData} disabled={!isValid || postData.length === 0}>Procesar datos</button>
        </div>
    )
}

export default UploadTemplateTransaction;
