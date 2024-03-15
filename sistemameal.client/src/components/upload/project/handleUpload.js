import ExcelJS from 'exceljs';

export const expectedHeaders = [
    { display: 'CODIGO', dbKey: 'indActResNum', entity: 'IndicadorActividad', validation: 'numero' },
    { display: 'DESCRIPCION', dbKey: 'indActResNom', entity: 'IndicadorActividad', validation: 'nombre' },
    { display: 'TIPO', dbKey: 'indActResTip', entity: 'IndicadorActividad', validation: 'indicador' },
    { display: 'CODIGO', dbKey: 'resNum', entity: 'Resultado', validation: 'numeroResultado' },
    { display: 'RESULTADO', dbKey: 'resNom', entity: 'Resultado', validation: 'nombreResultado' },
    { display: 'CODIGO', dbKey: 'objEspNum', entity: 'ObjetivoEspecifico', validation: 'numero' },
    { display: 'OBJETIVO ESPECIFICO', dbKey: 'objEspNom', entity: 'ObjetivoEspecifico', validation: 'nombre' },
    { display: 'CODIGO', dbKey: 'objNum', entity: 'Objetivo', validation: 'numero' },
    { display: 'OBJETIVO', dbKey: 'objNom', entity: 'Objetivo', validation: 'nombre' },
    { display: 'CODIGO_SAP', dbKey: 'subProSap', entity: 'Subproyecto', validation: 'numero' },
    { display: 'NOMBRE', dbKey: 'subProNom', entity: 'Subproyecto', validation: 'nombre' },
    { display: 'NOMBRE', dbKey: 'proNom', entity: 'Proyecto', validation: 'nombre' },
    { display: 'DESCRIPCION', dbKey: 'proDes', entity: 'Proyecto', validation: 'descripcion' },
    { display: 'RESPONSABLE-COORDINADOR', dbKey: 'proRes', entity: 'Proyecto', validation: 'nombre' },
    { display: 'MES_INICIO', dbKey: 'proPerMesIni', entity: 'Proyecto', validation: 'mes' },
    { display: 'AÑO_INICIO', dbKey: 'proPerAnoIni', entity: 'Proyecto', validation: 'año' },
    { display: 'MES_FIN', dbKey: 'proPerMesFin', entity: 'Proyecto', validation: 'mes' },
    { display: 'AÑO_FIN', dbKey: 'proPerAnoFin', entity: 'Proyecto', validation: 'año' },
];

const validateCell = (value, validationRules) => {
    if (validationRules.required && !value) {
        return 'El campo es requerido';
    }
    if (value) { // Solo aplica las otras reglas de validación si value no está vacío
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
    }
    return true;
};


const validationRules = {
    'nombreResultado': {
        required: false,
        maxLength: 300,
        minLength: 5,
        pattern: /^[0-9A-Za-zñÑáéíóúÁÉÍÓÚ()%/.,;üÜ\s-_]+$/,
        patternMessage: 'Por favor, introduce solo letras y espacios',
    },
    'nombre': {
        required: true,
        maxLength: 300,
        minLength: 5,
        pattern: /^[0-9A-Za-zñÑáéíóúÁÉÍÓÚ():%/.,;üÜ\s-_]+$/,
        patternMessage: 'Por favor, introduce solo letras y espacios',
    },
    'descripcion': {
        required: false,
        maxLength: 300,
        minLength: 0,
        pattern: /^[0-9A-Za-zñÑáéíóúÁÉÍÓÚ()%/.,;üÜ\s-_]+$/,
        patternMessage: 'Por favor, introduce solo letras y espacios',
    },
    'color': {
        required: true,
        minLength: 7,
        maxLength: 7,
        pattern: /^#([0-9A-Fa-f]{6})$/,
        patternMessage: 'Por favor, introduce un color en formato hexadecimal',
    },
    'indicador': {
        required: true,
        pattern: /^(IAC|IRE|IOB|ISA)$/, // Acepta solo estos tipos
        patternMessage: 'Por favor, introduce solo IAC,IRE,IOB O ISA',
    },
    'numero': {
        required: true,
        minLength: 2,
        maxLength: 300,
        pattern: /^[A-Za-z0-9ñÑ\s\.]+$/,
        patternMessage: 'Por favor, introduce solo letras, números, puntos y espacios',
    },
    'numeroResultado': {
        required: false,
        minLength: 2,
        maxLength: 300,
        pattern: /^[A-Za-z0-9ñÑ\s\.]+$/,
        patternMessage: 'Por favor, introduce solo letras, números, puntos y espacios',
    },
    'año': {
        required: true,
        pattern: /^\d{4}$/,
        patternMessage: 'Por favor, introduce un año válido con 4 dígitos',
    },
    'mes': {
        required: true,
        pattern: /^(0[1-9]|1[0-2])$/,
        patternMessage: 'Por favor, introduce un mes válido del 01 al 12',
    },
};


// Función para comparar dos arreglos
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

export const handleUpload = async (file, setTableData, setPostData, setIsValid, setErrorCells, navigate)=> {
    // Reinicia los estados cada vez que se carga un archivo
    setTableData([]);
    setPostData([]);
    setIsValid(true);
    setErrorCells([]);

    // const file = fileInput.current.files[0];
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

        // Verifica el nombre de la hoja
        const worksheetName = 'MARCO_LOGICO'; // Reemplaza esto con el nombre de tu hoja
        const worksheet = workbook.getWorksheet(worksheetName);
        if (!worksheet) {
            alert(`No se encontró la hoja "${worksheetName}"`);
            return;
        }

        const tableData = [];
        const postData = [];
        const newErrorCells = []; // Mueve la declaración de newErrorCells aquí
        const projects = {};

        // Extrae los encabezados legibles por humanos de expectedHeaders
        const expectedHeaderDisplays = expectedHeaders.map(header => header.display.toUpperCase());
        
        // Verifica que los encabezados son correctos
        const headers = worksheet.getRow(8).values.slice(2, 20); // Tomando en cuenta los encabezados estan en la fila 4 a partir de la columna 2
        if (!arraysEqual(headers, expectedHeaderDisplays)) {
            alert('Los encabezados no son válidos');
            setIsValid(false);
            return;
        }

        let currentProjectKey = null;
        let currentColor = 'lightgray';

        // Comienza a leer desde la fila 5
        let rowNumber = 9; // Cambia 4 a 5
        while (rowNumber <= worksheet.rowCount) { // Itera sobre todas las filas
            const row = worksheet.getRow(rowNumber);
            const tableRowData = new Array(expectedHeaders.length).fill(''); // Inicializa la fila con valores vacíos
            const postRowData = {};
            const projectData = {}; // Inicializa los datos del proyecto
            const subprojectData = {}; // Inicializa los datos del subproyecto
            const objectiveData = {}; // Inicializa los datos del subproyecto
            const specificObjectiveData  = {}; // Inicializa los datos del subproyecto
            const resultData  = {}; // Inicializa los datos del subproyecto
            const ActivityIndicatorData  = {}; // Inicializa los datos del subproyecto

            for (let colNumber = 2; colNumber <= 19; colNumber++) { // Itera desde la columna B (2) hasta la F (6)
                const cell = row.getCell(colNumber);
                const cellValue = cell.text.trim();
                const headerInfo = expectedHeaders[colNumber - 2]; // Ajusta el índice para que coincida con el rango de columnas B-F
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
                tableRowData[colNumber - 2] = cellValue; // Ajusta el índice para que coincida con el rango de columnas B-F
                postRowData[databaseKey] = cellValue;
                
                // Obtiene las reglas de validación para este campo
                const fieldValidationRules = validationRules[validationKey];

                // Valida la celda
                const validationMessage = validateCell(cellValue, fieldValidationRules);
                if (validationMessage !== true) {
                    newErrorCells.push({ row: rowNumber - 9, column: colNumber - 2,  message: validationMessage}); // Ajusta los índices para que coincidan con el rango de filas y columnas
                    setIsValid(false);
                }
            }

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
            rowNumber++;
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
        console.log(tableData)
        navigate('/guardar-proyecto');
    };
    reader.readAsArrayBuffer(file);
};