import { useMemo, useState } from "react";
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
    // Supongamos que 'filters' es el estado de los filtros de la tabla
    const [filters, setFilters] = useState({});

    const uniqueValues = {};

    const handleFilterChange = (accessorKey, value) => {
        if (value === "") {
            const newFilters = {...filters};
            delete newFilters[accessorKey];
            setFilters(newFilters);
        } else {
            setFilters({
                ...filters,
                [accessorKey]: value
            });
        }
    };
    

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

    columns.forEach(column => {
        const accessorKey = column.accessorKey;
        uniqueValues[accessorKey] = [...new Set(data.map(item => item[accessorKey]))];
    });

    const filteredData = useMemo(() => 
    data.filter(item => 
        Object.entries(filters).every(([key, value]) => 
            item[key] === value
        )
    ), [data, filters]);

    
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

    const selectedColumns = ["proNom", "subProNom", "actResNom", "subActResNom", "resNom"];

    return (
        <div className='TableMonitoringContainer Large-p2 Medium-p1 Small-p_5'>
            <div className="flex jc-space-between">
                <h1 className="flex left Large-f1_75 Medium-f1_5 Small-f1_5 ">Monitoreo</h1>
            </div>
            <div className="PowerMas_GroupSelect Medium-p_25 Small-p_25">
                {columns.filter(column => selectedColumns.includes(column.accessorKey)).map((column, index) => (
                    <div className="Large_3 Medium_3 Phone_5" key={column.accessorKey}>
                        <label className="Small-f1" htmlFor={column.accessorKey}>{column.header}</label>
                        <select 
                            className="Large-f_75 Medium-f_75 Phone_12"
                            key={index}
                            name={column.accessorKey} 
                            id={column.accessorKey} 
                            onChange={event => handleFilterChange(column.accessorKey, event.target.value)}
                        >
                            <option value=""> Sin seleccion</option>
                            {uniqueValues[column.accessorKey].map(value => (
                                <option value={value} key={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 Large-f_75 Medium-f_75 PowerMas_TableMonitoring">
                    <thead>
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
                            : <tr className='PowerMas_TableEmpty'><td colSpan={11} className='Large-p1 center'>No se encontraron registros</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination table={table} />
        </div>
    )
}

export default Table