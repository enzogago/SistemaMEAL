
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logoBase64 } from "../../img/Powermas_Logo_Ayuda_En_Accion";
import { meses } from '../../helpers/simple';

export const exportToExcel = async (indicadores, totales, additionalRows, getValues, subproyectos, financiadoresSelect, ano) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('METAS');

    // Añadir una imagen (opcional)
    const imageId = workbook.addImage({base64: logoBase64, extension: 'png' });
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
    let titleCell = titleRow.getCell(3);
    titleCell.value = `METAS PRESUPUESTO`;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D3:O3');

    // Añadir un segundo título
    let secondTitleRow = worksheet.addRow([]);
    let secondTitleCell = secondTitleRow.getCell(3);
    secondTitleCell.value = title || ''; // Aquí iría el valor seleccionado del subproyecto
    secondTitleCell.font = { bold: true, size: 14 };
    secondTitleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D4:O4');

    // Añadir un segundo título
    let tercerTitleRow = worksheet.addRow([]);
    let tercerTitleCell = tercerTitleRow.getCell(3);
    tercerTitleCell.value = ano || ''; // Aquí iría el valor seleccionado del subproyecto
    tercerTitleCell.font = { bold: true, size: 14 };
    tercerTitleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D5:O5');

    // Agregar 5 filas vacías al inicio
    for (let i = 0; i < 2; i++) {
        worksheet.addRow([]);
    }

    // Definir los encabezados
    const headers = ['CODIGO', 'NOMBRE', 'UNIDAD', 'FINANCIADOR', 'IMPLEMENTADOR', 'UBICACION', ...meses, 'TOTAL'];
    worksheet.columns = headers.map(header => ({ key: header, width: 15 }));

    // Insertar una columna vacía al principio
    worksheet.spliceColumns(1, 0, []);
    // Agregar los encabezados en la sexta fila
    const headerRow = worksheet.getRow(7);
    headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 2);
        cell.value = header;
    
        // Establecer el color de fondo y el color del texto para los dos primeros encabezados
        if (index < 6) {
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

    indicadores.forEach(indicador => {
        const row = {
            'CODIGO': indicador.indNum,
            'NOMBRE': indicador.indNom,
            ...meses.reduce((obj, mes, i) => {
                obj[mes] = Object.entries(totales)
                    .filter(([key]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}`) && key.endsWith(String(i+1).padStart(2, '0')))
                    .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
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
            if (colNumber >= 2) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' }
                };
                cell.font = { bold: true }; 
            }
            if (colNumber >= 8) {
                cell.numFmt = '#,##0.00 $';
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            }
        });

        // Combinar las celdas horizontalmente para el nombre del indicador principal
        worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);

        // Agregar las filas adicionales para este indicador
        additionalRows.filter(row => row.indAno === indicador.indAno && row.indCod === indicador.indCod).forEach(additionalRow => {
            const finCod = getValues(`financiador_${additionalRow.id}`);
            const financiador = finCod ? financiadoresSelect.find(fin => fin.finCod === finCod) : '';
            const implementador = getValues(`implementador_${additionalRow.id}`)?.toUpperCase()
            const ubicacion = getValues(`nombreUbicacion_${additionalRow.id}`)?.toUpperCase()

            const additionalRowData = {
                'CODIGO': indicador.indNum,
                'NOMBRE': indicador.indNom,
                'UNIDAD': indicador.uniNom,
                'FINANCIADOR': financiador ? financiador.finNom : '',
                'IMPLEMENTADOR': implementador,
                'UBICACION': ubicacion,
                ...meses.reduce((obj, mes, i) => {
                    const fieldValue = getValues(`mes_${String(i+1).padStart(2, '0')}_${additionalRow.id}`);
                    const metaValue = getValues(`meta_${String(i+1).padStart(2, '0')}_${additionalRow.id}`);
                    // Solo agregar el valor a la celda si está asociado a una meta
                    if (metaValue) {
                        obj[mes] = Number(fieldValue) || 0;
                    } else {
                        obj[mes] = '';
                    }
                    return obj;
                }, {}),
                'TOTAL': Object.entries(totales)
                    .filter(([key]) => key.startsWith(`${additionalRow.id}`) && key.endsWith('_total'))
                    .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
            };
            const additionalRowExcel = worksheet.addRow(additionalRowData);

            // Aplicar el formato de número a las celdas numéricas (columna 3 en adelante)
            additionalRowExcel.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber >= 2) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F3F3F3' }
                    };
                }
                if (colNumber >= 8) {
                    cell.numFmt = '#,##0.00 $';
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
            });
        });
    });

    // Crear el archivo de Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `METAS_PRESUPUESTO_${Date.now()}.xlsx`);
};