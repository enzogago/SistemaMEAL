import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import { FaPenNib, FaPlus, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa';
import Pagination from '../reusable/Pagination';
import { useMemo, useState } from 'react';
import TableRow from './TableRow';

const Table = ({data = []}) => {
    console.log(data)
    // Estados locales para el filtrado
    
    const [anoFilter, setAnoFilter] = useState('');
    const [codigoFilter, setCodigoFilter] = useState('');
    const [nombreFilter, setNombreFilter] = useState('');
    const [responsableFilter, setResponsableFilter] = useState('');
    const [periodoFilter, setPeriodoFilter] = useState('');

    

    const columns = [
        {
            header: "Año",
            accessorKey: "proAno"
        },
        {
            header: "Código",
            accessorKey: "proCod"
        },
        {
            header: "Nombre",
            accessorKey: "proNom"
        },
        {
            header: "Responsable",
            accessorKey: "proRes"
        },
        {
            header: "Periodo",
            accessorKey: "proPer"
        }
    ]

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.proAno.includes(anoFilter.toUpperCase()) &&
            item.proCod.includes(codigoFilter.toUpperCase()) &&
            item.proNom.includes(nombreFilter.toUpperCase()) &&
            item.proRes.includes(responsableFilter.toUpperCase()) &&
            item.proPer.includes(periodoFilter.toUpperCase()) 
        ), [data, codigoFilter, nombreFilter, responsableFilter, periodoFilter ]
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

    return (
        <div className='TableMainContainer Large-p2'>
            <div className="flex jc-space-between">
                <h1 className="flex left Large-f1_75">Listado de proyectos</h1>
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 PowerMas_TableStatus">
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={anoFilter}
                                    onChange={e => setAnoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={codigoFilter}
                                    onChange={e => setCodigoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={nombreFilter}
                                    onChange={e => setNombreFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={responsableFilter}
                                    onChange={e => setResponsableFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={periodoFilter}
                                    onChange={e => setPeriodoFilter(e.target.value)}
                                />
                            </th>
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
                                    <TableRow key={row.id} row={row} flexRender={flexRender} />
                                ))
                            : <tr className='PowerMas_TableEmpty'><td colSpan={5} className='Large-p1 center'>No se encontraron registros</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination table={table} />
        </div>
    )
}

export default Table