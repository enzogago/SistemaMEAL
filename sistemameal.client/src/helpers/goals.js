import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logoBase64 } from "../img/Powermas_Logo_Ayuda_En_Accion";

export const exportToExcel = async (indicadores, totales, additionalRows, getValues, subproyectos, usersTecnicos, ubicacionesSelect, implementadoresSelect, meses) => {
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
    titleCell.value = `METAS TÉCNICAS PROGRAMÁTICAS`;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D3:O3');

    worksheet.addRow([]);
    // Añadir un segundo título
    let secondTitleRow = worksheet.addRow([]);
    let secondTitleCell = secondTitleRow.getCell(3);
    secondTitleCell.value = title || ''; // Aquí iría el valor seleccionado del subproyecto
    secondTitleCell.font = { bold: true, size: 14 };
    secondTitleCell.alignment = { horizontal: 'center' };
    worksheet.mergeCells('D5:O5');
    
    // Agregar 5 filas vacías al inicio
    for (let i = 0; i < 2; i++) {
        worksheet.addRow([]);
    }

    // Definir los encabezados
    const headers = ['CODIGO', 'NOMBRE', 'UNIDAD', 'TIPO_VALOR', 'TÉCNICO', 'IMPLEMENTADOR', 'UBICACION', ...meses, 'TOTAL'];
    worksheet.columns = headers.map(header => ({ key: header, width: 15 }));

    // Insertar una columna vacía al principio
    worksheet.spliceColumns(1, 0, []);
    // Agregar los encabezados en la sexta fila
    const headerRow = worksheet.getRow(7);
    headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 2);
        cell.value = header;
    
        // Establecer el color de fondo y el color del texto para los dos primeros encabezados
        if (index < 7) {
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
                    .reduce((sum, [, value]) => sum + value, 0);
                return obj;
            }, {}),
            'TOTAL': Object.entries(totales)
                .filter(([key]) => key.startsWith(`${indicador.indAno}_${indicador.indCod}`) && key.endsWith('_total'))
                .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
        };
        const rowIndex = worksheet.addRow(row).number;

        // Obtén la celda combinada y aplica el estilo de alineación centrado
        const mergedCell = worksheet.getCell(`H${rowIndex}`);
        mergedCell.value = 'TOTALES:'; // Establece el valor de la celda combinada

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
            if (colNumber >= 9) {
                cell.numFmt = '#,##0';
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            }
        });

        // Agregar las filas adicionales para este indicador
        additionalRows.filter(row => row.indAno === indicador.indAno && row.indCod === indicador.indCod).forEach(additionalRow => {
            const { usuAno, usuCod } = JSON.parse(getValues(`tecnico_${additionalRow.id}`));
            const { ubiAno, ubiCod } = JSON.parse(getValues(`ubicacion_${additionalRow.id}`));
            const userTecnico = usersTecnicos.find(user => user.usuAno === usuAno && user.usuCod === usuCod);
            const ubicacion = ubicacionesSelect.find(item => item.ubiAno === ubiAno && item.ubiCod === ubiCod);
            const impCod = getValues(`implementador_${additionalRow.id}`);
            const implementador = implementadoresSelect.find(imp => imp.impCod === impCod);

            const additionalRowData = {
                'CODIGO': indicador.indNum,
                'NOMBRE': indicador.indNom,
                'UNIDAD': indicador.uniNom,
                'TIPO_VALOR': indicador.tipValNom,
                'TÉCNICO': userTecnico ? (userTecnico.usuNom + ' ' + userTecnico.usuApe) : '',
                'IMPLEMENTADOR': implementador ? implementador.impNom : '',
                'UBICACION': ubicacion ? ubicacion.ubiNom : '',
                ...meses.reduce((obj, mes, i) => {
                    const fieldValue = getValues(`mes_${String(i+1).padStart(2, '0')}_${additionalRow.id}`);
                    obj[mes] = Number(fieldValue) || 0;
                    return obj;
                }, {}),
                'TOTAL': Object.entries(totales)
                    .filter(([key]) => key.startsWith(`${additionalRow.id}`) && key.endsWith('_total'))
                    .reduce((sum, [, value]) => sum + value, 0)
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
                if (colNumber >= 9) {
                    cell.numFmt = '#,##0';
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
            });
        });
    });

    // Crear el archivo de Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `METAS_PROGRAMATICAS_${Date.now()}.xlsx`);
};