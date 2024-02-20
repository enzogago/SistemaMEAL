import React, { useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Notiflix from 'notiflix';

const UploadTemplate = ({ expectedHeaders, controller }) => {
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
        'color': {
            minLength: 7,
            maxLength: 7,
            pattern: /^#([0-9A-Fa-f]{6})$/,
            patternMessage: 'Por favor, introduce un color en formato hexadecimal',
        },
        // Agrega aquí las reglas para otros campos...
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
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) { // Itera sobre todas las filas
                const row = worksheet.getRow(rowNumber);
                const tableRowData = new Array(expectedHeaders.length).fill(''); // Inicializa la fila con valores vacíos
                const postRowData = {};
                row.eachCell((cell, colNumber) => {
                    if (colNumber <= expectedHeaders.length) { // Solo lee las celdas dentro del rango de los encabezados
                        const cellValue = cell.text.trim();
                        tableRowData[colNumber - 1] = cellValue; // Llena la fila con los datos del archivo Excel
                        const databaseKey = expectedHeaders[colNumber - 1].dbKey; // Obtiene la clave de la base de datos correspondiente
                        postRowData[databaseKey] = cellValue; // Llena la fila con los datos del archivo Excel
                
                        // Obtiene las reglas de validación para este campo
                        const fieldValidationRules = validationRules[expectedHeaders[colNumber - 1].display.toLowerCase()];
                
                        // Valida la celda
                        const validationMessage = validateCell(cellValue, fieldValidationRules);
                        if (validationMessage !== true) {
                            newErrorCells.push({ row: rowNumber - 2, column: colNumber - 1,  message: validationMessage});
                            setIsValid(false);
                        }
                    }
                });
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
            // Extrae los encabezados legibles por humanos de expectedHeaders
            const expectedHeaderDisplays = expectedHeaders.map(header => header.display.toUpperCase());

            // Verifica que los encabezados son correctos
            const headers = worksheet.getRow(1).values.slice(1, worksheet.getRow(1).values.length);
            if (!arraysEqual(headers, expectedHeaderDisplays)) {
                alert('Los encabezados no son válidos');
                setIsValid(false);
                return;
            }

            setTableData(tableData);
            setPostData(postData);
            console.log(postData);
            setErrorCells(newErrorCells);
            console.log(newErrorCells)
            // Aquí puedes procesar los datos y enviarlos al servidor
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
            Notiflix.Notify.success(data.message)
        } catch (error) {
            console.error('Error:', error);
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
                        <tr key={rowIndex} style={{height: '2rem'}}>
                            {row.map((cell, columnIndex) => (
                                <td
                                    key={columnIndex}
                                    style={{
                                        backgroundColor: errorCells.some(errorCell => errorCell.row === rowIndex && errorCell.column === columnIndex) ? 'red' : 'white',
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

export default UploadTemplate;
