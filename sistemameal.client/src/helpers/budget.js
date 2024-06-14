import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logoBase64 } from "../img/Powermas_Logo_Ayuda_En_Accion";

export const formatMonthKey = (index) => {
    return (index + 1).toString().padStart(2, '0');
};

export const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

export const exportToExcel = async (additionalRows, getValues, subproyectos, ano) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PRESUPUESTO EJECUTADO');

    // Añadir una imagen (opcional)
    // Asegúrate de tener el logo en base64 si deseas incluirlo
    const imageId = workbook.addImage({ base64: logoBase64, extension: 'png' });
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 200, height: 50 }
    });

    // Obtener el valor seleccionado del subproyecto con getValues
    const selectedSubprojectValue = getValues('subproyecto');
    const selectedSubproject = selectedSubprojectValue !== '0' ? JSON.parse(selectedSubprojectValue) : null;

    // Buscar el subproyecto en el estado para obtener el texto a mostrar
    const subprojectText = selectedSubproject ? subproyectos.find(subproyecto => 
        subproyecto.subProAno === selectedSubproject.subProAno && 
        subproyecto.subProCod === selectedSubproject.subProCod
    ) : null;

    // Construir el título con los datos del subproyecto seleccionado
    const title = subprojectText ? `${subprojectText.subProSap} - ${subprojectText.subProNom} | ${subprojectText.proNom}` : '';

    // Añadir un título
    let titleRow = worksheet.addRow([]);
    let titleCell = titleRow.getCell(4);
    titleCell.value = `METAS PRESUPUESTO`;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D3:O3');

    // Añadir un segundo título
    let secondTitleRow = worksheet.addRow([]);
    let secondTitleCell = secondTitleRow.getCell(4);
    secondTitleCell.value = title || ''; // Aquí iría el valor seleccionado del subproyecto
    secondTitleCell.font = { bold: true, size: 14 };
    secondTitleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D4:O4');

    // Añadir un segundo título
    let tercerTitleRow = worksheet.addRow([]);
    let tercerTitleCell = tercerTitleRow.getCell(4);
    tercerTitleCell.value = ano || ''; // Aquí iría el valor seleccionado del subproyecto
    tercerTitleCell.font = { bold: true, size: 14 };
    tercerTitleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D5:O5');

    // Agregar 5 filas vacías al inicio
    for (let i = 0; i < 3; i++) {
        worksheet.addRow([]);
    }
    
    // Definir los encabezados de las primeras columnas y los meses
    const firstHeaders = ['CÓDIGO', 'NOMBRE', 'UNIDAD', 'FINANCIADOR', 'IMPLEMENTADOR', 'UBICACIÓN'];
    firstHeaders.forEach((header, index) => {
        console.log(index)
        worksheet.mergeCells(7, index + 2, 8, index + 2);
        const cell = worksheet.getCell(7, index + 2);
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
        const startColumn = (firstHeaders.length + 2) + index * 2;
        worksheet.mergeCells(7, startColumn, 7, startColumn + 1);
        const cell = worksheet.getCell(7, startColumn);
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
        worksheet.getCell(8, startColumn).value = 'Meta';
        worksheet.getCell(8, startColumn + 1).value = 'Ejecución';
    });

    const columns = [
        { key: 'EMPTY', width: 5 },
        { key: 'CÓDIGO', width: 10 },
        { key: 'NOMBRE', width: 20 },
        { key: 'UNIDAD', width: 20 },
        { key: 'FINANCIADOR', width: 20 },
        { key: 'IMPLEMENTADOR', width: 15 },
        { key: 'UBICACIÓN', width: 20 },
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
            'EMPTY': '',
            'CÓDIGO': row.indNum,
            'NOMBRE': row.indNom,
            'UNIDAD': row.uniNom,
            'FINANCIADOR': row.finNom,
            'IMPLEMENTADOR': row.impNom,
            'UBICACIÓN': row.ubiNom,
        };

        meses.forEach((mes, indexMes) => {
            const monthKey = formatMonthKey(indexMes);
            const valoresMes = row.cells[monthKey];
            rowValues[`Meta ${mes}`] = valoresMes ? valoresMes.map(v => v.metPre ? v.metPre : 0).join(', ') : '';
            rowValues[`Ejecución ${mes}`] = valoresMes ? valoresMes.map(v => v.ejePre ? v.ejePre : 0).join(', ') : '';
        });

        worksheet.addRow(rowValues);
    });

    // Crear el archivo de Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `PRESUPUESTO_EJECUTADO_${Date.now()}.xlsx`);
};