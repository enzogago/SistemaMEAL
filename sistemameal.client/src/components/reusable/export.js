import { logoBase64 } from "../../img/Powermas_Logo_Ayuda_En_Accion";
import logo from '../../img/PowerMas_LogoAyudaEnAccion.png';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Función para exportar datos a un archivo Excel
export const exportToExcel = async (data, headers, title, properties) => {
    // Crear un nuevo libro de trabajo de Excel
    const workbook = new ExcelJS.Workbook();
    // Añadir una nueva hoja de trabajo con el nombre 'Datos'
    const worksheet = workbook.addWorksheet('Datos');
    
    // Añadir una imagen al documento (opcional)
    const imageId = workbook.addImage({ base64: logoBase64, extension: 'png' });
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 200, height: 50 }
    });
  
    // Añadir filas vacías para el espaciado antes de los encabezados
    for (let i = 0; i < 5; i++) {
        worksheet.addRow([]);
    }

    // Agregar los encabezados a la hoja de trabajo
    headers = [...headers, 'USUARIO MODIFICADO', 'FECHA MODIFICADO'];
    const headerRow = worksheet.addRow(headers);
    // Personalizar el estilo de los encabezados
    headerRow.eachCell((cell, number) => {
        if (number > headers.length - 2) {
            // Estilo para las dos últimas columnas
            cell.font = { color: { argb: 'FFFFFF' }, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '25848F' }
            };
        } else {
            // Estilo para las demás columnas
            cell.font = { color: { argb: '000' }, bold: true }; 
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCA53' }
            };
        }
    });

    // Añadir los datos a la hoja de trabajo
    data.forEach(item => {
        // Mapear las propiedades a las celdas, incluyendo conversiones especiales
        const rowData = properties.map(prop => {
            // Si 'prop' es un arreglo, concatenar los valores con un guión
            if (Array.isArray(prop)) {
                const values = prop.map(p => item[p]);
                // Si todos los valores son 'NA', retornar una cadena vacía
                if (values.every(value => value === 'NA')) {
                    return '';
                }
                return values.join(' - ');
            }
            // Si 'prop' es un string, usar el valor tal cual
            return item[prop];
        });

        // Agregar datos de usuario y fecha de modificación al final de cada fila
        rowData.push(item.usuMod); // Usuario que modificó
        rowData.push(new Date(item.fecMod + 'Z')); // Fecha de modificación

        // Añadir la fila a la hoja de trabajo
        const row = worksheet.addRow(rowData);
        // Personalizar la alineación de las celdas
        row.eachCell(cell => {
            cell.alignment = { vertical: 'middle', readingOrder: 'leftToRight', textRotation: 'horizontal' };
        });

        // Aplicar formato de porcentaje y fecha donde corresponda
        const metPorAvaTecIndex = properties.indexOf('metPorAvaTec');
        if (metPorAvaTecIndex !== -1) {
            row.getCell(metPorAvaTecIndex + 1).numFmt = '0.00%';
        }
        row.getCell(rowData.length).numFmt = 'dd/mm/yy hh:mm';
    });

    // Personalizar el ancho de las columnas
    worksheet.columns.forEach(column => column.width = 20);

    // Insertar una columna vacía al principio para el espaciado
    worksheet.spliceColumns(1, 0, []);

    // Añadir el título del documento en la celda B6 y combinar celdas para el título
    const lastColumnLetter = worksheet.lastColumn.letter;
    const titleCell = worksheet.getCell('B6');
    titleCell.value = `LISTADO DE ${title}`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`B6:${lastColumnLetter}6`);
  
    // Generar el archivo Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${title}_${Date.now()}.xlsx`);
};

// Función para exportar datos a un archivo PDF
export const exportToPdf = async (data, headers, title, properties, format) => {
    // Función interna para guardar el PDF
    const savePdf = async () => {
        // Crear una nueva instancia de jsPDF en orientación horizontal
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format
        });

        // Agregar la imagen (asegúrate de tener la imagen en formato base64 o en un ArrayBuffer)
        doc.addImage(logo, 'PNG', 10, 10, 60, 15); // Ajusta las coordenadas y el tamaño según tus necesidades

        // Configurar el título del documento
        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
        doc.text(`LISTADO DE ${title}`, titleX, 26); // Ajusta la posición vertical según tus necesidades

        // Definir las columnas de la tabla, incluyendo 'USUARIO MODIFICADO' y 'FECHA MODIFICADO'
        headers = [...headers, 'USUARIO MODIFICADO', 'FECHA MODIFICADO'];
        const tableColumns = headers.map(header => ({
            title: header.toUpperCase(),
            dataKey: header
        }));

        // Definir los datos de la tabla, incluyendo la conversión de 'benSex' y el formato de 'fecMod'
        const tableData = data.map(item => {
            const rowData = properties.map(prop => {
                // Si 'prop' es un arreglo, concatenar los valores con un guión
                if (Array.isArray(prop)) {
                    const values = prop.map(p => item[p]);
                    // Si todos los valores son 'NA', retornar una cadena vacía
                    if (values.every(value => value === 'NA')) {
                        return '';
                    }
                    return values.join(' - ');
                }
                // Si 'prop' es un string, usar el valor tal cual
                return item[prop];
            });
            // Convertir 'benSex' a 'MASCULINO' o 'FEMENINO'
            const sexIndex = properties.indexOf('benSex');
            if (sexIndex !== -1) {
                rowData[sexIndex] = item.benSex === 'M' ? 'MASCULINO' : 'FEMENINO';
            }
            // Agregar datos de usuario y fecha de modificación al final de cada fila
            rowData.push(item.usuMod); // Usuario que modificó

            let fecha = new Date(item.fecMod + 'Z').toISOString();

            // Formatear la fecha y hora
            let fechaFormateada = fecha.substring(0, 16).replace('T', ' ');

            rowData.push(fechaFormateada); // Fecha de modificación
            return rowData;
        });

        // Generar los estilos de las columnas
        let columnStyles = {};
        headers.forEach((header, index) => {
            columnStyles[index] = { halign: index >= headers.length - 2 ? 'center' : 'left' };
        });

        // Agregar la tabla al documento
        doc.autoTable({
            columns: tableColumns,
            body: tableData,
            startY: 40,
            columnStyles: columnStyles,
            didDrawCell: data => {
                // Personalizar el estilo de las celdas de encabezado
                if (data.section === 'head') {
                    doc.setTextColor(255, 255, 255);
                    doc.setFillColor(data.column.index >= headers.length - 2 ? '25848F' : 'FFCA53');
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    doc.text(data.cell.text, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height - 3, { align: 'center' });
                }
            }
        });

        // Añadir numeración de páginas
        let pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
            doc.setFontSize(12);
            doc.text(`Página ${pageCurrent} de ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        // Guardar el documento PDF
        doc.save(`${title}_${Date.now()}.pdf`);
    };

    // Ejecutar la función de guardado
    savePdf();
};
