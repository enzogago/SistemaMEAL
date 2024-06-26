import Notiflix from "notiflix";
import { logoBase64 } from "../../img/Powermas_Logo_Ayuda_En_Accion";
import logo from '../../img/PowerMas_LogoAyudaEnAccion.png';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export const handleDeleteMant = async (controller, obj, setRegistros) => {
    Notiflix.Confirm.show(
        'Eliminar Registro',
        '¿Está seguro que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}`;

            try {
                Notiflix.Loading.pulse();
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(obj),
                });
                const data = await response.json();
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                
                // Actualiza los datos después de eliminar un registro
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const updateData = await updateResponse.json();
                setRegistros(updateData);
                Notiflix.Notify.success(data.message);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};

export const handleDelete = async (controller, codigo, setRegistros) => {
    Notiflix.Confirm.show(
        'Eliminar Registro',
        '¿Está seguro que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}/${codigo}`;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    const text = await response.text();
                    const messageType = text.split(":")[0];
                    if (messageType === "1") {
                        Notiflix.Notify.failure("Error durante la ejecución del procedimiento almacenado");
                    } else {
                        Notiflix.Notify.failure(text);
                    }
                    throw new Error(text);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    
                    Notiflix.Notify.failure(data.message);
                    setModalVisible(false); 
                    return;
                }

                const text = await response.text();
                Notiflix.Notify.success(text);
                
                // Actualiza los datos después de eliminar un registro
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await updateResponse.json();
                setRegistros(data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};

export const handleSubmit = async (controller, objetoEditado, objeto, setRegistros, setModalVisible, codeField, closeModalAndReset) => {
    const url = objetoEditado 
                ? `${import.meta.env.VITE_APP_API_URL}/api/${controller}/${objeto[codeField]}` 
                : `${import.meta.env.VITE_APP_API_URL}/api/${controller}`;

    const method = objetoEditado ? 'PUT' : 'POST';
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objeto),
        });
        const data = await response.json();
        if (!response.ok) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        
        Notiflix.Notify.success(data.message);
        setModalVisible(false); // Cierra el modal
        // Actualiza los datos después de insertar o modificar un registro
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const updateData = await updateResponse.json();
        setRegistros(updateData);
        closeModalAndReset();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const handleSubmitMantEspecial = async (controller, objetoEditado, objeto, setRefresh, closeModalAndReset) => {
    const method = objetoEditado ? 'PUT' : 'POST';
    
    try {
        Notiflix.Loading.pulse();
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objeto),
        });
        const data = await response.json();
        if (!response.ok) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        
        setRefresh(prevRefresh => !prevRefresh);
        Notiflix.Notify.success(data.message);
        closeModalAndReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleSubmitMant = async (controller, objetoEditado, objeto, setRegistros, closeModalAndReset) => {
    const method = objetoEditado ? 'PUT' : 'POST';

    let newData = {};
    for (let key in objeto) {
        if (typeof objeto[key] === 'string') {
            // Convierte cada cadena a minúsculas
            newData[key] = objeto[key].toUpperCase();
        } else {
            // Mantiene los valores no string tal como están
            newData[key] = objeto[key];
        }
    }
    
    try {
        Notiflix.Loading.pulse();
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newData),
        });
        const data = await response.json();
        if (!response.ok) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        
        // Actualiza los datos después de insertar o modificar un registro
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const updateData = await updateResponse.json();
        setRegistros(updateData);
        Notiflix.Notify.success(data.message);
        closeModalAndReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};
export const Export_Excel_Basic2 = async (data, headersExcel, active, isPresupuesto) => {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet(`CADENA DE ${isPresupuesto ? 'PRESUPUESTO' : 'RESULTADO'} ${active.toUpperCase()}`);

    // Añadir una imagen (opcional)
    const imageId = workbook.addImage({base64: logoBase64, extension: 'png' });
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 200, height: 50 }
    });
  
    // Añadir filas vacías
    for (let i = 0; i < 5; i++) {
        worksheet.addRow([]);
    }

    // Crear la fila para los encabezados
    let headerRow = worksheet.addRow([]);

    // Añadir los encabezados a la fila
    headersExcel.forEach((header, index) => {
        let cell = headerRow.getCell(index + 1);
        cell.value = typeof header === 'string' ? header.toUpperCase() : header.name.toUpperCase();
        if (index < 4) {
            cell.font = { color: { argb: '000000'}, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCA53' }  // Color original
            };
        } else {
            cell.font = { color: { argb: 'FFFFFF'}, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '25848F' }
            };
        }
        if (index === 0 || index >= 4) {
            cell.alignment = { horizontal: 'center' };
        }
    });


    // Añadir los datos al libro de trabajo
    data.forEach(item => {
        let dataRow = worksheet.addRow([]);
        headersExcel.forEach((header, index) => {
            let cell = dataRow.getCell(index + 1);
            let value = item[typeof header === 'string' ? header : header.code];
            // Si isPresupuesto es true y la columna es la 5 o posterior, formatear como euros
            if (isPresupuesto && index >= 4) {
                // Convertir el valor a un número antes de asignarlo a la celda
                cell.value = typeof value === 'string' ? parseFloat(value) : value;
                cell.numFmt = '#,##0.00 $';
            } else if( index >= 4){
                cell.value = typeof value === 'string' ? parseFloat(value) : value;
            } else {
                cell.value = typeof value === 'string' ? value.toUpperCase() : value;
            }
            if (index === 0 || index >= 4) {
                cell.alignment = { horizontal: 'center' };
            }
        });
    });




    // Personalizar el ancho de las columnas
    worksheet.columns.forEach(column => {
        column.width = 20;  // Ancho por defecto para todas las columnas
    });

    // Insertar una columna vacía al principio
    worksheet.spliceColumns(1, 0, []);

    // Añadir el título en la celda B6 y combinar las celdas hasta la última columna con datos
    const lastColumnLetter = worksheet.lastColumn.letter;  // Obtener la letra de la última columna
    const titleCell = worksheet.getCell('B6');
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.value = `CADENA DE RESULTADO ${active.toUpperCase()}`;
    worksheet.mergeCells(`B6:${lastColumnLetter}6`);

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `CADENA_DE_RESULTADOS_${active.toUpperCase()}_${Date.now()}.xlsx`);
};

export const Export_Excel_Basic = async (data, headersExcel, active, isPresupuesto, selectedSubproject, currency = '') => {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet(`CADENA DE ${isPresupuesto ? 'PRESUPUESTO' : 'RESULTADO'} ${active.toUpperCase()}`);

    // Añadir una imagen (opcional)
    const imageId = workbook.addImage({base64: logoBase64, extension: 'png' });
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 200, height: 50 }
    });
    
    // Añadir un título
    let titleRow = worksheet.addRow([]);
    let titleCell = titleRow.getCell(3);
    titleCell.value = `CADENA DE RESULTADO | METAS ${isPresupuesto ? 'PRESUPUESTO' : 'PROGRAMÁTICAS'}`;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D3:M3');
    
    // Añadir un segundo título
    let secondTitleRow = worksheet.addRow([]);
    let secondTitleCell = secondTitleRow.getCell(3);
    secondTitleCell.value = selectedSubproject || '';
    secondTitleCell.font = { bold: true, size: 14 };
    worksheet.mergeCells('D4:M4');

    // Añadir filas vacías
    for (let i = 0; i < 2; i++) {
        worksheet.addRow([]);
    }
    // Crear la fila para los encabezados
    let headerRow = worksheet.addRow([]);

    // Añadir los encabezados a la fila
    headersExcel.forEach((header, index) => {
        let cell = headerRow.getCell(index + 1);
        cell.value = header.toUpperCase();
        if (index < 5) {
            cell.font = { color: { argb: '000000'}, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCA53' }  // Color original
            };
        } else {
            cell.font = { color: { argb: 'FFFFFF'}, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '25848F' }
            };
        }
        if (index === 0 || index >= 4) {
            cell.alignment = { horizontal: 'center' };
        }
    });

    // Añadir los datos al libro de trabajo
    data.forEach(item => {
        let dataRow = worksheet.addRow([]);
        headersExcel.forEach((header, index) => {
            let cell = dataRow.getCell(index + 1);
            let value = item[header];
            // Si isPresupuesto es true y la columna es la 5 o posterior, formatear como euros
            if (isPresupuesto && index >= 4) {
                // Convertir el valor a un número antes de asignarlo a la celda
                cell.value = typeof value === 'string' ? parseFloat(value) : value;
                cell.numFmt = `#,##0.00 ${currency}`;
            } else if( index >= 5){
                cell.value = typeof value === 'string' ? parseFloat(value) : value;
            } else {
                cell.value = typeof value === 'string' ? value.toUpperCase() : value;
            }
            if (index === 0 || index >= 4) {
                cell.alignment = { horizontal: 'center' };
            }
        });
    });

    // Personalizar el ancho de las columnas
    worksheet.columns.forEach(column => {
        column.width = 15;  // Ancho por defecto para todas las columnas
    });

    // Insertar una columna vacía al principio
    worksheet.spliceColumns(1, 0, []);

    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CADENA_${isPresupuesto ? 'PRESUPUESTO' : 'RESULTADO'} ${active.toUpperCase()}.xlsx`;
    a.click();
};



export const Export_Excel_Helper = async (data, headers, title, properties) => {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');
    
    // Añadir una imagen (opcional)
    const imageId = workbook.addImage({base64: logoBase64, extension: 'png' });
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 200, height: 50 }
    });
  
    // Añadir filas vacías
    for (let i = 0; i < 5; i++) {
        worksheet.addRow([]);
    }

    // Añadir los encabezados
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, number) => {
        if (number > headers.length - 2){ // Cambia el color de fondo de las dos últimas columnas
            cell.font = { color: { argb: 'FFFFFF'}, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '25848F' }  // Puedes cambiar este código de color ARGB según tus necesidades
            };
        } else {
            cell.font = { color: { argb: '000' }, bold: true  }; 
            cell.fill = {  // Esto agregará un color de fondo a la celda
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCA53' }  // Puedes cambiar este código de color ARGB según tus necesidades
            };
        }
    });
    
  
    // Encuentra el índice de 'fecMod' en el array de propiedades
    const fecModIndex = properties.findIndex(prop => prop === 'fecMod');

    // Encuentra el índice de 'metPorAvaTec' en el array de propiedades
    const metPorAvaTecIndex = properties.findIndex(prop => prop === 'metPorAvaTec');

    // Añadir los datos
    data.forEach(item => {
        let fecha = new Date(item.fecMod + 'Z');
        const rowData = properties.map(prop => {
            if (prop === 'fecMod') {
                return fecha;
            } else if (prop === 'metPorAvaTec') {
                // Convierte el número a una fracción decimal antes de escribirlo en la celda
                return item[prop] / 100;
            } else {
                return item[prop];
            }
        });
        const row = worksheet.addRow(rowData);
        row.eachCell(cell => {
            cell.alignment = { 
                vertical: 'middle',
                readingOrder: 'leftToRight',
                textRotation: 'horizontal' 
            };
        });
        // Aplica el formato de fecha a la celda correspondiente
        if (fecModIndex !== -1) {
            row.getCell(fecModIndex + 1).numFmt = 'dd/mm/yy hh:mm';
        }
        // Aplica el formato de porcentaje a la celda correspondiente
        if (metPorAvaTecIndex !== -1) {
            row.getCell(metPorAvaTecIndex + 1).numFmt = '0.00%';
        }
    });


    // Personalizar el ancho de las columnas
    worksheet.columns.forEach(column => {
        column.width = 20;  // Ancho por defecto para todas las columnas
    });

    // Insertar una columna vacía al principio
    worksheet.spliceColumns(1, 0, []);

    // Añadir el título en la celda B6 y combinar las celdas hasta la última columna con datos
    const lastColumnLetter = worksheet.lastColumn.letter;  // Obtener la letra de la última columna
    const titleCell = worksheet.getCell('B6');
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.value = `LISTADO DE ${title}`;
    worksheet.mergeCells(`B6:${lastColumnLetter}6`);
  
    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${title}_${Date.now()}.xlsx`);
};

export const orthographicCorrections = { 
    codigo: 'Código',
};

export const Export_PDF_Helper = async (data, headers, title, properties, format) => {
    const savePdf = async () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format
        });
         // Crear una nueva instancia de jsPDF en orientación horizontal

        // Agregar la imagen
        // Asegúrate de tener la imagen en formato base64 o en un ArrayBuffer
        doc.addImage(logo, 'PNG', 10, 10, 60, 15);  // Ajusta las coordenadas y el tamaño según tus necesidades

        doc.setFontSize(18);  // Ajusta el tamaño de la fuente según tus necesidades
        doc.setFont('Helvetica','bold');
        const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
        doc.text(`LISTADO DE ${title}`, titleX, 30);  // Ajusta la posición vertical según tus necesidades

        // Definir las columnas de la tabla
        const tableColumns = headers.map(header => {
            // Usa el objeto de mapeo para obtener la versión corregida ortográficamente de la palabra
            const correctedHeader = orthographicCorrections[header.toLowerCase()] || header;
            return { title: correctedHeader.toUpperCase(), dataKey: header };
        });
        // Definir los datos de la tabla
        const tableData = data.map(item => {
            let fecha = new Date(item.fecMod + 'Z').toISOString();

            // Formatear la fecha y hora
            let fechaFormateada = fecha.substring(0, 16).replace('T', ' ');

            return properties.map(prop => prop === 'fecMod' ? fechaFormateada : item[prop]);
        });

        // Generar los estilos de las columnas
        let columnStyles = {};
        for (let i = 0; i < headers.length; i++) {
            if (i >= headers.length - 2 || headers[i] === 'CODIGO') {
                // Centrar las dos últimas columnas y la columna "CÓDIGO"
                columnStyles[i] = { halign: 'center' };
            } else {
                // Alinear a la izquierda las demás columnas
                columnStyles[i] = { halign: 'left' };
            }
        }

        doc.autoTable({
            columns: tableColumns,
            body: tableData,
            startY: 40,
            columnStyles: columnStyles,
            didDrawCell: function(data) {
                var col = data.column.index;
                if (data.section === 'head') {
                    if (col === headers.length - 2 || col === headers.length - 1) {
                        doc.setTextColor(255, 255, 255);
                        doc.setFillColor(37, 132, 143);  // Cambia esto a tu color preferido
                    } else {
                        doc.setTextColor(0, 0, 0);
                        doc.setFillColor(255, 202, 83);  // Cambia esto al color que prefieras para las otras columnas
                    }
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    doc.text(data.cell.text, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height - 3, {align: 'center'});  // Ajusta la posición vertical aquí
                }
            }
        });

        

        let pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
            doc.setFontSize(12);
            doc.text('Página ' + String(pageCurrent) + ' de ' + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, {align: 'center'});
        }

        // Guardar el documento PDF
        doc.save(`${title}_${Date.now()}.pdf`);
    };

    savePdf();
};


// Esta es tu nueva función reutilizable
export const fetchDataReturn = async (controller) => {
    try {
        // Valores del storage
        const token = localStorage.getItem('token');
        // Obtenemos los datos
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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
        return (data);
    } catch (error) {
        console.error('Error:', error);
    }
};
export const fetchData = async (controller, setData) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        // Valores del storage
        const token = localStorage.getItem('token');
        // Obtenemos los datos
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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
        setData(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const fetchDataBlock = async (controller, setData, element) => {
    try {
        if (document.querySelector(element)) {
            Notiflix.Block.pulse(element, {
                svgSize: '100px',
                svgColor: '#F87C56',
            });
        }
        // Valores del storage
        const token = localStorage.getItem('token');
        // Obtenemos los datos
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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
        setData(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Block.remove(element);
    }
};


// Función reutilizable para realizar llamadas a la API y manejar la UI
export const fetchDataBlockHome = async (controller, setData, element, signal) => {
    try {
        if (document.querySelector(element)) {
            Notiflix.Block.pulse(element, {
                svgSize: '100px',
                svgColor: '#F87C56',
            });
        }
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: signal // Pasar la señal del AbortController
        });
        if (!response.ok) {
            const data = await response.json();
            Notiflix.Notify.failure(data.message);
            return;
        }
        const data = await response.json();
        if (data.success === false) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        setData(data);
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error:', error);
        }
    } finally {
        if (document.querySelector(element)) {
            Notiflix.Block.remove(element);
        }
    }
};