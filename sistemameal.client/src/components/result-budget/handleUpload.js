import ExcelJS from 'exceljs';

export const expectedHeaders = [
    { display: 'CODIGO', dbKey: 'indNum', entity: 'Indicador', validation: 'numero' },
    { display: 'NOMBRE INDICADOR', dbKey: 'indNom', entity: 'Indicador', validation: 'nombre' },
    { display: 'TIPO', dbKey: 'indTipInd', entity: 'Indicador', validation: 'nombre' },
    { display: 'UNIDAD', dbKey: 'uniCod', entity: 'Indicador', validation: 'nombre' },
    { display: 'TIPO DE DATO', dbKey: 'tipValCod', entity: 'Indicador', validation: 'nombre' },
    { display: 'CODIGO_RE', dbKey: 'resNum', entity: 'Resultado', validation: 'numeroResultado' },
    { display: 'RESULTADO', dbKey: 'resNom', entity: 'Resultado', validation: 'nombreResultado' },
    { display: 'CODIGO_OE', dbKey: 'objEspNum', entity: 'ObjetivoEspecifico', validation: 'numero' },
    { display: 'OBJETIVO ESPECIFICO', dbKey: 'objEspNom', entity: 'ObjetivoEspecifico', validation: 'nombre' },
    { display: 'CODIGO_OB', dbKey: 'objNum', entity: 'Objetivo', validation: 'numero' },
    { display: 'OBJETIVO', dbKey: 'objNom', entity: 'Objetivo', validation: 'nombre' },
    { display: 'CODIGO_SAP', dbKey: 'subProSap', entity: 'Subproyecto', validation: 'numero' },
    { display: 'NOMBRE SUBPROYECTO', dbKey: 'subProNom', entity: 'Subproyecto', validation: 'nombre' },
    { display: 'NOMBRE PROYECTO', dbKey: 'proNom', entity: 'Proyecto', validation: 'nombre' },
    { display: 'DESCRIPCION PROYECTO', dbKey: 'proDes', entity: 'Proyecto', validation: 'descripcion' },
    { display: 'RESPONSABLE-COORDINADOR', dbKey: 'proRes', entity: 'Proyecto', validation: 'nombre' },
    { display: 'MES_INICIO', dbKey: 'proPerMesIni', entity: 'Proyecto', validation: 'nombre' },
    { display: 'AÑO_INICIO', dbKey: 'proPerAnoIni', entity: 'Proyecto', validation: 'año' },
    { display: 'MES_FIN', dbKey: 'proPerMesFin', entity: 'Proyecto', validation: 'nombre' },
    { display: 'AÑO_FIN', dbKey: 'proPerAnoFin', entity: 'Proyecto', validation: 'año' },
    { display: 'INVOLUCRA_SUB_ACTIVIDAD', dbKey: 'proInvSubAct', entity: 'Proyecto', validation: 'descripcion' },
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

export const handleUpload = async (file, setTableData, setSubprojectUpload, setAnoUpload, navigate)=> {
    // Reinicia los estados cada vez que se carga un archivo
    setTableData([]);

    // const file = fileInput.current.files[0];
    // Comprueba si el archivo es un Excel
    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-excel.sheet.macroEnabled.12'].includes(file.type)) {
        alert('Por favor, sube un archivo Excel habilitado para macros');
        return;
    }
    

    // Comprueba el nombre del archivo
    const fileName = file.name;
    const expectedFileName = 'GASTO_MENSUAL.xlsm'; // Reemplaza esto con el nombre de archivo esperado
    if (fileName !== expectedFileName) {
        alert(`El nombre del archivo debe ser "${expectedFileName}"`);
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);

        // Verifica el nombre de la hoja
        const worksheetName = 'Gastos Mensuales'; // Reemplaza esto con el nombre de tu hoja
        const worksheet = workbook.getWorksheet(worksheetName);
        if (!worksheet) {
            alert(`No se encontró la hoja "${worksheetName}"`);
            return;
        }

        const tableData = [];

        // Fila inicial para empezar a leer
        let rowNumber = 14;
        while (rowNumber <= worksheet.rowCount) { // Itera sobre todas las filas
            const row = worksheet.getRow(rowNumber);

            // Verifica si todas las celdas en la fila están vacías
            const isEmptyRow = row.values.slice(3, 19).every(cell => {
                // Si la celda es un objeto, verifica la propiedad 'result'
                if (typeof cell === 'object' && cell !== null) {
                    return !cell.result || cell.result.trim() === '';
                }
                // Si no, verifica la celda como antes
                return !cell || cell.trim() === '';
            });
            // Si la fila está vacía, detiene la iteración
            if (isEmptyRow) {
                break;
            }

            // Recorremos cada celda de la fila actual
            for (let colNumber = 8; colNumber <= 19; colNumber++) {
                const correspondingCellValue = row.getCell(colNumber + 17).text;
                // Solo añadimos el objeto a tableData si correspondingCellValue no está vacío
                if (correspondingCellValue && correspondingCellValue.trim() !== '') {
                    let rowData = {};
                    const cellValue = row.getCell(colNumber).text;
                    rowData['metAno'] = correspondingCellValue.slice(0,4);
                    rowData['metCod'] = correspondingCellValue.slice(4);
                    rowData['metEjePre'] = cellValue;
                    tableData.push(rowData);
                }
            }

            rowNumber++;
        }

        // Obtén los valores de las celdas U12 y V12
        const subprojectUpload = worksheet.getCell('U12').text;
        const anoUpload = worksheet.getCell('V12').text;

        // Actualiza los estados con los valores obtenidos
        setSubprojectUpload(subprojectUpload);
        setAnoUpload(anoUpload);
        
        console.log(tableData);
        console.log(subprojectUpload);
        console.log(anoUpload);
        setTableData(tableData);
        navigate('/save-goal-budget');
    };
    reader.readAsArrayBuffer(file);
};