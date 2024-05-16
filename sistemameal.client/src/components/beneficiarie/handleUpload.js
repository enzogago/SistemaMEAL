import ExcelJS from 'exceljs';
import Notiflix from 'notiflix';

export const expectedHeaders = [
    { display: 'AUTORIZACION_DATOS', dbKey: 'benAutNom', validation: 'descripcion' },
    { display: 'DOCUMENTO DE IDENTIFICACION', dbKey: 'docIdeNom', validation: 'descripcion' },
    { display: 'NUMERO_DOCUMENTO', dbKey: 'benCodUni', validation: 'numeroDocumento' },
    { display: 'NOMBRE', dbKey: 'benNom', validation: 'nombre' },
    { display: 'APELLIDOS', dbKey: 'benApe', validation: 'nombre' },
    { display: 'FECHA_NACIMIENTO', dbKey: 'benFecNac', validation: 'fechaNacimiento' },
    { display: 'SEXO', dbKey: 'benSexNom', validation: 'descripcion' },
    { display: 'GENERO', dbKey: 'genNom', validation: 'descripcion' },
    { display: 'NACIONALIDAD', dbKey: 'nacNom', validation: 'descripcion' },
    { display: 'CORREO', dbKey: 'benCorEle', validation: 'email' },
    { display: 'TELEFONO', dbKey: 'benTel', validation: 'telefono' },
    { display: 'TELEFONO DE CONTACTO', dbKey: 'benTelCon', validation: 'telefono' },
    { display: 'DIRECCION', dbKey: 'benDir', validation: 'direccion' },
    { display: 'NOMBRE_APODERADO', dbKey: 'benNomApo', validation: 'nombreApoderado' },
    { display: 'APELLIDO_APODERADO', dbKey: 'benApeApo', validation: 'nombreApoderado' },
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
    'nombre': {
        required: true,
        maxLength: 100,
        minLength: 3,
        pattern: /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜàèìòùÀÈÌÒÙ\s-_]+$/,
        patternMessage: 'Por favor, introduce solo letras y espacios.',
    },
    'descripcion': {
        required: false,
        maxLength: 100,
        minLength: 0,
        pattern: /^[0-9A-Za-zñÑáéíóúÁÉÍÓÚ()%/.,;üÜ\s-_]+$/,
        patternMessage: 'Por favor, introduce solo letras y espacios.',
    },
    'numeroDocumento': {
        required: true,
        minLength: 6,
        maxLength: 10,
        pattern: /^[0-9]*$/,
        patternMessage: 'Solo se permite números',
    },
    'fechaNacimiento': {
        required: true,
        pattern: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/,
        patternMessage: 'Ingrese la fecha en formato DD-MM-YYYY.',
    },
    'email': {
        required: false,
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        patternMessage: 'Ingrese un email válido.',
    },
    'telefono': {
        required: false,
        pattern: /^[0-9]*$/,
        patternMessage: 'Solo se permite números',
    },
    'direccion': {
        required: false,
        minLength: 3,
        maxLength: 100,
    },
    'nombreApoderado': {
        required: false,
        maxLength: 100,
        minLength: 3,
        pattern: /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ\s-_]+$/,
        patternMessage: 'Por favor, introduce solo letras y espacios.',
    },
};

// Función para comparar dos arreglos
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

export const handleUpload = async (file, setTableData, setIsValid, setErrorCells, navigate)=> {
    // Reinicia los estados cada vez que se carga un archivo
    setTableData([]);
    setIsValid(true);
    setErrorCells([]);

    // const file = fileInput.current.files[0];
    // Comprueba si el archivo es un Excel
    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-excel.sheet.macroEnabled.12'].includes(file.type)) {
        Notiflix.Notify.failure('Por favor, sube un archivo Excel habilitado para macros');
        return;
    }
    
    // Comprueba el nombre del archivo
    const fileName = file.name;
    const expectedFileName = 'Plantilla_Registro_Beneficiarios_Masivo.xlsx'; // Reemplaza esto con el nombre de archivo esperado
    if (fileName.toUpperCase() !== expectedFileName.toUpperCase()) {
        Notiflix.Notify.failure(`El nombre del archivo debe ser "${expectedFileName}"`);
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);

        // Verifica el nombre de la hoja
        const worksheetName = 'BENEFICIARIOS'; // Reemplaza esto con el nombre de tu hoja
        const worksheet = workbook.getWorksheet(worksheetName);
        if (!worksheet) {
            Notiflix.Notify.failure(`No se encontró la hoja "${worksheetName}"`);
            return;
        }

        const tableData = [];
        const newErrorCells = [];

        // Fila inicial para empezar a leer
        let rowNumber = 10;
        while (rowNumber <= worksheet.rowCount) { // Itera sobre todas las filas
            const row = worksheet.getRow(rowNumber);

            // Verifica si todas las celdas en la fila están vacías
            const isEmptyRow = row.values.slice(3, 17).every(cell => {
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

            let rowData = {};
            // Recorremos cada celda de la fila actual
            for (let colNumber = 3; colNumber <= 17; colNumber++) {
                const cellValueForBenAut = row.getCell(18).text.trim();
                const cellValueForDocIdeCod = row.getCell(19).text.trim();
                const cellValueForBenSex = row.getCell(20).text.trim();
                const cellValueForGenCod = row.getCell(21).text.trim();
                const cellValueForNacCod = row.getCell(22).text.trim();

                let cellValue = row.getCell(colNumber).text;
                console.log(cellValue)
                const headerInfo = expectedHeaders[colNumber - 3]
                const validationKey = headerInfo.validation;

                const fieldValidationRules = validationRules[validationKey];
                const validationMessage = validateCell(cellValue, fieldValidationRules);
                console.log(validationMessage)
                if (validationMessage !== true) {
                    newErrorCells.push({ row: rowNumber - 10, column: colNumber - 3,  message: validationMessage});
                    setIsValid(false);
                }

                rowData[headerInfo.dbKey] = cellValue;
                rowData['benAut'] = cellValueForBenAut;
                rowData['docIdeCod'] = cellValueForDocIdeCod;
                rowData['benSex'] = cellValueForBenSex;
                rowData['genCod'] = cellValueForGenCod;
                rowData['nacCod'] = cellValueForNacCod;
            }

            tableData.push(rowData);
            rowNumber++;
        }
        
        console.log(tableData);
        setTableData(tableData);
        setErrorCells(newErrorCells);
        navigate('/validate-beneficiarie');
    };
    reader.readAsArrayBuffer(file);
};