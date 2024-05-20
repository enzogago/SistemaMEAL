import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const formatMonthKey = (index) => {
    return (index + 1).toString().padStart(2, '0');
};

export const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

export const exportToExcel = async (additionalRows) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PRESUPUESTO EJECUTADO');

    // Añadir una imagen (opcional)
    // Asegúrate de tener el logo en base64 si deseas incluirlo
    // const imageId = workbook.addImage({ base64: logoBase64, extension: 'png' });
    // worksheet.addImage(imageId, {
    //     tl: { col: 0, row: 0 },
    //     ext: { width: 200, height: 50 }
    // });

    // Agregar filas vacías al inicio (si es necesario)
    for (let i = 0; i < 6; i++) {
        worksheet.addRow([]);
    }

    // Definir los encabezados de las primeras columnas y los meses
    const firstHeaders = ['Código', 'Indicador', 'Financiador', 'Implementador', 'Ubicación'];
    firstHeaders.forEach((header, index) => {
        worksheet.mergeCells(6, index + 1, 7, index + 1);
        const cell = worksheet.getCell(6, index + 1);
        cell.value = header;
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCA53' }
        };
        cell.font = {
            color: { argb: '000000' },
            bold: true
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    meses.forEach((mes, index) => {
        const startColumn = firstHeaders.length + index * 2 + 1;
        worksheet.mergeCells(6, startColumn, 6, startColumn + 1);
        const cell = worksheet.getCell(6, startColumn);
        cell.value = mes;
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '25848F' }
        };
        cell.font = {
            color: { argb: 'FFFFFF' },
            bold: true
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        // Subencabezados 'Meta' y 'Ejecución'
        worksheet.getCell(7, startColumn).value = 'Meta';
        worksheet.getCell(7, startColumn + 1).value = 'Ejecución';
    });

    const columns = [
        { key: 'Código', width: 10 },
        { key: 'Indicador', width: 30 },
        { key: 'Financiador', width: 30 },
        { key: 'Implementador', width: 15 },
        { key: 'Ubicación', width: 20 },
    ];
    
    // Añadir las columnas de 'Meta' y 'Ejecución' para cada mes
    meses.forEach(mes => {
        columns.push({key: `Meta ${mes}`, width: 15 });
        columns.push({key: `Ejecución ${mes}`, width: 15 });
    });
    
    // Asignar el arreglo de columnas a worksheet.columns
    worksheet.columns = columns;

    // Agregar los datos de los indicadores y las filas adicionales
    Object.values(additionalRows).forEach((row, rowIndex) => {
        const rowValues = {
            'Código': row.indNum,
            'Indicador': row.indNom,
            'Financiador': row.finNom,
            'Implementador': row.impNom,
            'Ubicación': row.ubiNom,
        };

        meses.forEach((mes, indexMes) => {
            const monthKey = formatMonthKey(indexMes);
            const valoresMes = row.cells[monthKey];
            rowValues[`Meta ${mes}`] = valoresMes ? valoresMes.map(v => v.metPre).join(', ') : ''; // Clave única para Meta
            rowValues[`Ejecución ${mes}`] = valoresMes ? valoresMes.map(v => v.ejePre).join(', ') : ''; // Clave única para Ejecución
        });

        // Calcular totales si es necesario
        // rowValues['Total Meta'] = ...;
        // rowValues['Total Ejecución'] = ...;

        worksheet.addRow(rowValues);
    });

    // Aplicar formato a las celdas si es necesario
    // ... (El código para aplicar formato sigue igual)

    // Crear el archivo de Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `PRESUPUESTO_EJECUTADO_${Date.now()}.xlsx`);
};