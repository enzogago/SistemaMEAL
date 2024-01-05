import { useContext, useMemo, useState } from 'react';
import { FaPenNib, FaPlus, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa';
import { StatusContext } from '../../context/StatusContext';
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


const Table = ({ data, openModal }) => {
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    // Variables State statusContext
    const { statusActions } = useContext(StatusContext);
    const { setDocumentosIdentidad } = statusActions;
    // States locales
    const [codigoFilter, setCodigoFilter] = useState('');
    const [nombreFilter, setNombreFilter] = useState('');
    const [abreviaturaFilter, setAbreviaturaFilter] = useState('');

    /* TANSTACK */
    const columns = [
        {
            header: "Código",
            accessorKey: "docIdeCod"
        },
        {
            header: "Nombre",
            accessorKey: "docIdeNom"
        },
        {
            header: "Abreviatura",
            accessorKey: "docIdeAbr"
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({row}) => (
                <div className='PowerMas_IconsTable flex jc-center ai-center'>
                    <FaTrash className='Large-p_25' onClick={() => handleDelete('DocumentoIdentidad',row.original.docIdeCod, setDocumentosIdentidad, setIsLoggedIn)} />
                    <FaPenNib className='Large-p_25' onClick={() => openModal(row.original)} />
                </div>
            ),
        },
    ]

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.docIdeCod.includes(codigoFilter.toUpperCase()) &&
            item.docIdeNom.includes(nombreFilter.toUpperCase()) &&
            item.docIdeAbr.includes(abreviaturaFilter.toUpperCase())
        ), [data, codigoFilter, nombreFilter, abreviaturaFilter]
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
    /* END TANSTACK */

    return (
        <div className='TableMainContainer Large-p2'>
            <div className="flex jc-space-between">
                <h1 className="flex left Large-f1_75">Listado de Documentos de Identidad</h1>
                <button className='Large-p_5 PowerMas_ButtonStatus' onClick={() => openModal()}>
                    Nuevo <FaPlus /> 
                </button>
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 PowerMas_TableStatus">
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar por Codigo'
                                    value={codigoFilter}
                                    onChange={e => setCodigoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar por Nombre'
                                    value={nombreFilter}
                                    onChange={e => setNombreFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar por Abreviatura'
                                    value={abreviaturaFilter}
                                    onChange={e => setAbreviaturaFilter(e.target.value)}
                                />
                            </th>
                            <th></th>
                        </tr>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header =>(
                                            <th style={{ width: header.getSize(), position: 'relative'  }} key={header.id} onClick={header.column.getToggleSortingHandler()}>
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
    )
}

export default Table