import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Sort from '../../../icons/Sort';
import TableEmpty from '../../../img/PowerMas_TableEmpty.svg';

const smallPageSizes = [10, 20, 30, 50];
const largePageSizes = [100, 200, 300, 500];

const CommonTable = ({data = [], columns = []}) => {
    const [sorting, setSorting] = useState([]);

    // Filtrar columnas que no tienen datos
    const filteredColumns = useMemo(() => {
        return columns.filter(column => {
            // Verificar si alguna fila tiene un valor no nulo o no indefinido para esta columna
            return data.some(row => row[column.accessorKey] != null && row[column.accessorKey] !== '');
        });
    }, [columns, data]);
    
    const table = useReactTable({
        data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
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
                                    <tr key={headerGroup.id} className=''>
                                        {
                                            headerGroup.headers.map((header, index, array) => (
                                                <th
                                                    style={{whiteSpace: 'nowrap'}}
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
                                            ))
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
                                        {row.getVisibleCells().map(cell => (
                                            <td style={{ width:  cell.column.getSize(), whiteSpace: 'nowrap'}} key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
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
                        {smallPageSizes.map(pageSize => {
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