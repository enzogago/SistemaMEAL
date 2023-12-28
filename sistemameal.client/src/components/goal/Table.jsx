import { useState } from "react";
import TableRow from "./TableRow"
import { FaPenNib, FaPlus, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa';
import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import Pagination from "../reusable/Pagination";

const Table = ({ data }) => {

    const [sorting, setSorting] = useState([]);
    const columns = [
        {
            header: "Estado",
            accessorKey: "estNom"
        },
        {
            header: "Proyecto",
            accessorKey: "proNom"
        },
        {
            header: "Meta",
            accessorKey: "metMetTec"
        },
        {
            header: "Ejecucion",
            accessorKey: "metEjeTec"
        },
        {
            header: "% de Avance",
            accessorKey: "metPorAvaTec"
        },
        {
            header: "Año",
            accessorKey: "metAnoPlaTec"
        },
        {
            header: "Mes",
            accessorKey: "metMesPlaTec"
        },
        {
            header: "Subproyectos",
            accessorKey: "subProNom"
        },
        {
            header: "Activiades",
            accessorKey: "actResNom"
        },
        {
            header: "Sub Actividades",
            accessorKey: "subActResNom"
        },
        {
            header: "Resultados",
            accessorKey: "resNom"
        },
    ]
    const table = useReactTable({
        data,
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
            <h1 className="flex left Large-f1_75">Monitoreo</h1>
        </div>
        <div className="PowerMas_TableContainer">
            <table className="Large_12 Large-f_75 PowerMas_TableStatus">
                <thead>
                    <tr>
                        <th>
                            <label htmlFor="">
                                Proyecto
                                <select name="" id="">
                                    <option value="">--Filtrar--</option>
                                </select>
                            </label>
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
                        : <tr className='PowerMas_TableEmpty'><td colSpan={1} className='Large-p1 center'>No se encontraron registros</td></tr>
                    }
                </tbody>
            </table>
        </div>
        <Pagination table={table} />
    </div>
    )
}

export default Table