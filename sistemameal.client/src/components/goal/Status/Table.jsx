import { useContext, useState } from 'react';
import { handleDelete } from './eventHandlers';
import { FaPenNib, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa';
import { StatusContext } from '../../../context/StatusContext';
import styles from './styles'
import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
    getFilteredRowModel 
} from '@tanstack/react-table'
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const Table = ({ data, openModal }) => {
    const { statusActions } = useContext(StatusContext);
    const { setEstados } = statusActions;

    const columns = [
        {
            header: "Código",
            accessorKey: "estCod"
        },
        {
            header: "Nombre",
            accessorKey: "estNom"
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({row}) => (
                <div className='PowerMas_IconsTable flex jc-center ai-center'>
                    <FaTrash className='Large-p_25' onClick={() => handleDelete(row.original.estCod, setEstados)} />
                    <FaPenNib className='Large-p_25' onClick={() => openModal(row.original)} />
                </div>
            ),
        },
    ]

    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');

    const table = useReactTable({
        data, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filtering
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        columnResizeMode: "onChange",
    })

    return (
        <div className='TableMainContainer Large-p2'>
            <h1 className="center flex left Large-f1_75">Listado de estados</h1>
            <SearchBar 
                openModal={openModal} 
                filtering={filtering} 
                setFiltering={setFiltering} 
            />
            <div className="PowerMas_TableContainer">
                <table className="Large_12 PowerMas_TableStatus">
                    <thead>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header =>(
                                            <th style={{ width: header.getSize() }} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                                <div>
                                                    {
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                    {
                                                        {
                                                            asc: <FaSortUp />,
                                                            desc: <FaSortDown />
                                                        }[header.column.getIsSorted() ?? null]
                                                    }
                                                </div>
                                                <span 
                                                    onMouseDown={
                                                        header.getResizeHandler()
                                                    }
                                                    onTouchStart={
                                                        header.getResizeHandler()
                                                    }

                                                    style={header.column.getIsResizing() ? 
                                                    styles.global[".resizer.isResizing"] : 
                                                    styles.global[".resizer"]} >
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
                            : <tr className='PowerMas_TableEmpty'><td colSpan={3} className='Large-p1 center'>No se encontraron registros</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination table={table} />
        </div>
    );
}

export default Table;
