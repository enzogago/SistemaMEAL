import Notiflix from "notiflix";
import { logoBase64 } from "../../img/Powermas_Logo_Ayuda_En_Accion";
import logo from '../../img/PowerMas_LogoAyudaEnAccion.png';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

Notiflix.Confirm.init({
    className: 'notiflix-confirm',
    width: '300px',
    zindex: 4003,
    position: 'center',
    distance: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '5px',
    backOverlay: true,
    backOverlayColor: 'rgba(0,0,0,0.5)',
    rtl: false,
    fontFamily: 'DMono',
    cssAnimation: true,
    cssAnimationDuration: 300,
    cssAnimationStyle: 'fade',
    plainText: true,
    titleColor: '#EC5251',
    titleFontSize: '1.25rem',
    titleMaxLength: 34,
    messageColor: '#1e1e1e',
    messageFontSize: '1rem',
    messageMaxLength: 110,
    buttonsFontSize: '1rem',
    buttonsMaxLength: 34,
    okButtonColor: '#f8f8f8',
    okButtonBackground: '#EC5251',
    cancelButtonColor: '#000',
    cancelButtonBackground: '#FFF7F3',
});

export const handleDelete = async (controller, codigo, setRegistros, setIsLoggedIn) => {
    Notiflix.Confirm.show(
        'Eliminar registro',
        '¿Estás seguro de que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}/${codigo}`;

            const token = localStorage.getItem('token');

            try {
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
                    if (data.result) {
                        setIsLoggedIn(false);
                    }
                    
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

export const handleSubmit = async (controller, objetoEditado, data, setRegistros, setModalVisible, setIsLoggedIn, fieldMapping, codeField) => {

    const objeto = objetoEditado 
        ?   { 
                ...objetoEditado, 
                ...Object.keys(data).reduce((obj, key) => ({...obj, [fieldMapping[key]]: data[key]}), {}),
            } 
        :   { 
                ...Object.keys(data).reduce((obj, key) => ({...obj, [fieldMapping[key]]: data[key]}), {}),
            };

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
        console.log("desde response: ",response)
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
            if (data.result) {
                setIsLoggedIn(false);
            }

            Notiflix.Notify.failure(data.message);
            setModalVisible(false); 
            return;
        }
        
        const text = await response.text();
        Notiflix.Notify.success(text);
        console.log(text)
        setModalVisible(false); // Cierra el modal

        // Actualiza los datos después de insertar o modificar un registro
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
    
  
    // Añadir los datos
    data.forEach(item => {
        let fecha = new Date(item.fecMod);
        const rowData = properties.map(prop => prop === 'fecMod' ? fecha : item[prop]);
        const row = worksheet.addRow(rowData);
        row.eachCell(cell => {
            cell.alignment = { 
                vertical: 'middle',
                readingOrder: 'leftToRight',
                textRotation: 'horizontal' 
            };
        });
        row.getCell(4).numFmt = 'dd/mm/yy hh:mm';
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
        const tableColumns = headers;

        // Definir los datos de la tabla
        const tableData = data.map(item => {
            let fecha = new Date(item.fecMod);

            // Formatear la fecha y hora
            let fechaFormateada = fecha.toLocaleString('es-EC', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return properties.map(prop => prop === 'fecMod' ? fechaFormateada : item[prop]);
        });

        // Agregar la tabla al documento
        doc.autoTable({
            columns: tableColumns,
            body: tableData,
            startY: 40,
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
