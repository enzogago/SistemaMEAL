import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import Sort from '../../../icons/Sort';
import TableEmpty from '../../../img/PowerMas_TableEmpty.svg';

const smallPageSizes = [10, 20, 30, 50];
const largePageSizes = [100, 200, 300, 500];

const CommonTable = ({data = [], columns = [], isLargePagination = false}) => {
    const pageSizes = isLargePagination ? largePageSizes : smallPageSizes;

    const [sorting, setSorting] = useState([]);

    const stickyColumns = ['actions','subProFueVer','password'];

    // Referencias para las columnas
    const columnRefs = useRef(new Map());

    // Estado para almacenar los anchos de las columnas
    const [columnWidths, setColumnWidths] = useState({});

    // Medir el ancho de las columnas después de que se hayan renderizado
    useEffect(() => {
        const newColumnWidths = {};
        let totalWidth = 0;
        stickyColumns.forEach(key => {
            if (columnRefs.current.has(key) && columnRefs.current.get(key).current) {
                const width = columnRefs.current.get(key).current.getBoundingClientRect().width;
                newColumnWidths[key] = totalWidth; // Asigna el total acumulado antes de esta columna
                totalWidth += width; // Suma el ancho de esta columna al total
            }
        });
        setColumnWidths(newColumnWidths);
    }, [data]); // Dependencia en los datos para recalcular cuando cambien

    // Filtrar columnas que no tienen datos, excepto las columnas de acción
    const filteredColumns = useMemo(() => {
        return columns.filter(column => {
            // Si la columna es de acciones, siempre la incluimos
            if (column.accessorKey === 'actions' ||
                column.accessorKey === 'subProFueVer' ||
                column.accessorKey === 'password' ||
                column.accessorKey === 'avatar'
            ) {
                return true;
            }
            // Para las demás columnas, verificamos si tienen datos
            return data.some(row => row[column.accessorKey] != null && row[column.accessorKey] !== '');
        });
    }, [columns, data]);

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: isLargePagination ? 100 : 10, //default page size
    });

    const table = useReactTable({
        data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        columnResizeMode: "onChange"
    })

    if (data.length <= 0) {
        return(
            <div className='Phone_12 flex flex-column ai-center jc-center flex-grow-1'>
                <img src={TableEmpty} alt="TableEmpty" className='Medium_6 Phone_12' />
                <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
            </div>
        )
    }

    return (
        <>
            <div className='flex-grow-1 overflow-auto'>
                <table className='PowerMas_TableStatus Large_12 f_75'>
                    {
                        <thead className=''>
                            {
                                table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className='' style={{zIndex: 2}}>
                                        {
                                            headerGroup.headers.map((header, index, array) => {
                                                // Asignar una referencia a cada celda de encabezado
                                                if (!columnRefs.current.has(header.id)) {
                                                    columnRefs.current.set(header.id, createRef());
                                                }
                                                const ref = columnRefs.current.get(header.id);

                                                const isSticky = stickyColumns.includes(header.id);
                                                const stickyStyle = isSticky ? {
                                                    position: 'sticky',
                                                    right: `${columnWidths[header.id] || 0}px`,
                                                    zIndex: 1,
                                                    background: 'white',
                                                } : {};

                                                return (
                                                <th
                                                    ref={ref}
                                                    style={{
                                                        ...stickyStyle,
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    key={header.id} 
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <div className='flex ai-center jc-space-between pointer gap-1'>
                                                        {
                                                            <span className='bold flex-grow-1'>
                                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                            </span>
                                                        }
                                                        <div className='flex ai-center jc-center'>
                                                            {header.column.getIsSorted() === 'asc' && !header.column.columnDef.disableSorting ? 
                                                                <span className="sort-icon active">
                                                                    <Sort type='asc' />
                                                                </span> :
                                                                header.column.getIsSorted() === 'desc' && !header.column.columnDef.disableSorting ? 
                                                                <span className="sort-icon active">
                                                                    <Sort type='desc' />
                                                                </span> :
                                                                !header.column.columnDef.disableSorting &&
                                                                <>
                                                                    <span className="sort-icon active">
                                                                        <Sort />
                                                                    </span>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </th>
                                            )})
                                        }
                                    </tr>
                                ))
                            }
                        </thead>
                    }
                    <tbody>
                        {
                            <>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        // Aplicar el estilo sticky a las celdas del cuerpo si corresponde
                                        const isSticky = stickyColumns.includes(cell.column.id);
                                        const stickyStyle = isSticky ? {
                                            position: 'sticky',
                                            right: `${columnWidths[cell.column.id] || 0}px`,
                                            zIndex: 1,
                                            background: 'white',
                                        } : {};
        
                                        return (
                                            <td
                                                style={{
                                                    ...stickyStyle,
                                                    width: cell.column.getSize(),
                                                    whiteSpace: 'nowrap'
                                                }}
                                                key={cell.id}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                                ))}
                            </>
                        }
                    </tbody>
                </table>
            </div>
            <div className="PowerMas_Pagination Large_12 flex column jc-space-between ai-center Large-p_5">
                <div className="">
                    <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{"<<"}</button>
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{"<"}</button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{">"}</button> 
                    <button onClick={() => table.setPageIndex(table.getPageCount() -1)} disabled={!table.getCanNextPage()}>{">>"}</button>
                </div>
                <div>
                    <select 
                        value={table.options.state.pagination.pageSize} 
                        onChange={(e) => table.setPageSize(e.target.value)}
                        className="p_25"
                    > 
                        {pageSizes.map(pageSize => {
                            return  <option key={pageSize} value={pageSize}> 
                                        {pageSize} 
                                    </option>;
                        })}
                    </select>
                </div>
                <div>
                    <p className=''>
                        Mostrando {table.options.state.pagination.pageIndex * table.options.state.pagination.pageSize + 1} al {Math.min((table.options.state.pagination.pageIndex + 1) * table.options.state.pagination.pageSize, table.options.data.length)} de {table.options.data.length} registros
                    </p>
                </div>
            </div>
        </>
    )
}

export default CommonTable