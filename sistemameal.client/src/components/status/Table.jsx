import { useContext, useMemo, useState } from 'react';
import { FaPlus, FaSearch, FaSortDown, FaSortUp, FaEdit , FaRegTrashAlt } from 'react-icons/fa';
import { TiArrowSortedUp ,TiArrowSortedDown } from "react-icons/ti";
import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import Pagination from '../reusable/Pagination';
import { AuthContext } from '../../context/AuthContext';
import { handleDelete } from '../reusable/helper';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
import { Tooltip } from 'react-tooltip';
import logo from '../../img/PowerMas_LogoAyudaEnAccion.png';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Table = ({ data, openModal, setEstados }) => {
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }
    console.log(userPermissions)
    /* TANSTACK */
    const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR ESTADO"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR ESTADO"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR ESTADO"),
    };

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Codigo",
                accessorKey: "estCod",
            },
            {
                header: "Nombre",
                accessorKey: "estNom",
            },
            {
                header: "Color",
                accessorKey: "estCol",
            }
        ];
    
        if (actions.delete || actions.edit) {
            baseColumns.push({
                header: "Acciones",
                accessorKey: "acciones",
                cell: ({row}) => (
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {actions.edit && 
                            <FaEdit 
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='Large-p_25' 
                                onClick={() => openModal(row.original)} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDelete('Estado', row.original.estCod, setEstados, setIsLoggedIn)} 
                            />
                        }
                        <Tooltip 
                            id="edit-tooltip"
                            effect="solid"
                            place='top-end'
                        />
                        <Tooltip 
                            id="delete-tooltip" 
                            effect="solid"
                            place='top-start'
                        />
                    </div>
                ),
            });
        }
    
        return baseColumns;
    }, [actions]);

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.estCod.includes(searchFilter.toUpperCase()) ||
            item.estNom.includes(searchFilter.toUpperCase())
        ), [data, searchFilter]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
        columnResizeMode: "onChange"
    })
    console.log(table.options.data)
    console.log(table.options.columns)
    /* END TANSTACK */

    const Export_Excel = async () => {
        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');
        
        const base64 = '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'
        // Añadir una imagen (opcional)
        const imageId = workbook.addImage({
          base64: base64,  // Reemplaza esto con tu imagen en base64
          extension: 'png',
        });
        worksheet.addImage(imageId, {
            tl: { col: 0, row: 1 },
            ext: { width: 200, height: 50 }
        });
      
        // Añadir filas vacías
        for (let i = 0; i < 5; i++) {
            worksheet.addRow([]);
        }

        // Añadir los encabezados
        const headers = ['CODIGO', 'NOMBRE', 'COLOR', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Ajusta esto según tus necesidades
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell, number) => {
            if (number > 3) {  // Cambia el color de fondo de las dos últimas columnas
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
        table.options.data.forEach(item => {
            let fecha = new Date(item.fecMod);

            const row = worksheet.addRow([item.estCod, item.estNom, item.estCol, item.usuMod, fecha]);  // No añadir un valor vacío aquí
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
        worksheet.columns = [
            { key: 'estCod', width: 10 },
            { key: 'estNom', width: 40 },
            { key: 'estCol', width: 20 },
            { key: 'usuMod', width: 30 },
            { key: 'fecMod', width: 20 },
        ];
        // Insertar una columna vacía al principio
        worksheet.spliceColumns(1, 0, []);

        // Añadir el título en la celda B6 y combinar las celdas hasta la última columna con datos
        const title = "LISTADO DE ESTADOS";  // Reemplaza esto con tu título
        const lastColumnLetter = worksheet.lastColumn.letter;  // Obtener la letra de la última columna
        const titleCell = worksheet.getCell('B6');
        titleCell.font = { size: 14, bold: true };
        titleCell.alignment = { horizontal: 'center' };
        titleCell.value = title;
        worksheet.mergeCells(`B6:${lastColumnLetter}6`);
      
        // Generar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `ESTADOS_${Date.now()}.xlsx`);
    };

    const Export_PDF = () => {
        const savePdf = async () => {
            const doc = new jsPDF('landscape');  // Crear una nueva instancia de jsPDF en orientación horizontal
    
            // Agregar la imagen
            // Asegúrate de tener la imagen en formato base64 o en un ArrayBuffer
            doc.addImage(logo, 'PNG', 10, 10, 60, 15);  // Ajusta las coordenadas y el tamaño según tus necesidades

            doc.setFontSize(18);  // Ajusta el tamaño de la fuente según tus necesidades
            doc.setFont('Helvetica','bold');
            const title = 'LISTADO DE ESTADOS';  // Reemplaza esto con tu título
            const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
            doc.text(title, titleX, 30);  // Ajusta la posición vertical según tus necesidades
            
            // Definir las columnas de la tabla
            const tableColumns = ['CODIGO', 'NOMBRE', 'COLOR', 'USUARIO_MODIFICADO', 'FECHA_MODIFICADO'];
    
            // Definir los datos de la tabla
            const tableData = table.options.data.map(item => {
                // Crear un objeto Date a partir de la cadena de fecha
                let fecha = new Date(item.fecMod);

                // Formatear la fecha y hora
                let fechaFormateada = fecha.toLocaleString('es-EC', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                return [item.estCod, item.estNom, item.estCol, item.usuMod, fechaFormateada];
            });
            // Agregar la tabla al documento
            doc.autoTable({
                columns: tableColumns,
                body: tableData,
                startY: 40,
                didDrawCell: function(data) {
                    var col = data.column.index;
                    if (data.section === 'head') {
                        if (col === 3 || col === 4) {
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
            doc.save(`ESTADOS_${Date.now()}.pdf`);
        };
    
        savePdf();
    };
    
    return (
        <div className='TableMainContainer Large-p1'>
            <div className="">
                <h1 className="Large-f1_5">Listado de estados</h1>
                <div className="flex ">
                    <div className="PowerMas_Search_Container Large_6 Large-m_5">
                        <FaSearch className="Large_1 search-icon" />
                        <input 
                            className='PowerMas_Input_Filter Large_12 Large-p_5'
                            type="search"
                            placeholder='Buscar'
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                        />
                    </div>
                    {
                        actions.add && 
                        <button 
                            className=' flex jc-space-between Large_3 Large-m_5 Large-p_5 PowerMas_ButtonStatus'
                            onClick={() => openModal()} 
                            disabled={!actions.add}
                        >
                            Nuevo <FaPlus className='Large_1' /> 
                        </button>
                    }
                    <div className={`PowerMas_Dropdown_Export Large_3 Large-m_5 ${dropdownOpen ? 'open' : ''}`}>
                        <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                        <div className="PowerMas_Dropdown_Export_Content Phone_12">
                            <a onClick={Export_Excel} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                            <a onClick={Export_PDF} className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 PowerMas_TableStatus">
                    <thead>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header =>(
                                            <th className='' style={{ width: header.getSize(), position: 'relative'  }} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                                <div>
                                                    {
                                                        flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                    <div className='flex flex-column ai-center jc-center'>
                                                        {header.column.getIsSorted() === 'asc' ? 
                                                            <TiArrowSortedUp className={`sort-icon active`} /> :
                                                            header.column.getIsSorted() === 'desc' ? 
                                                            <TiArrowSortedDown className={`sort-icon active`} /> :
                                                            <>
                                                                <TiArrowSortedUp className={`sort-icon`} />
                                                                <TiArrowSortedDown className={`sort-icon`} />
                                                            </>
                                                        }
                                                    </div>
                                                </div>


                                                <span 
                                                    onMouseDown={
                                                        header.getResizeHandler()
                                                    }
                                                    onTouchStart={
                                                        header.getResizeHandler()
                                                    }
                                                    
                                                    className={header.column.getIsResizing() 
                                                    ? "resizer isResizing" 
                                                    : "resizer"} >
                                                </span>

                                                
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>
                    <tbody>
                        {
                            table.getRowModel().rows.length > 0 ?
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td style={{ width: cell.column.getSize() }} key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            :   <tr className='PowerMas_TableEmpty'>
                                    <td colSpan={3} className='Large-p1 center'>
                                        No se encontraron registros
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination table={table} />
        </div>
    );
}

export default Table;
