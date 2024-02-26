import { useMemo, useState } from "react";
import {
    useReactTable, 
    getCoreRowModel, 
    getSortedRowModel, 
} from '@tanstack/react-table';
// Componentes
import CustomTable from "../reusable/Table/CustomTable";

const Table = ({ data }) => {
    // States locales
    const [sorting, setSorting] = useState([]);

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Estado",
                accessorKey: "estNom",
                cell: ({row}) => (
                    <div className="bold" style={{ color: row.original.estCol }}>
                        {row.original.estNom.charAt(0).toUpperCase() + row.original.estNom.slice(1).toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Indicador",
                accessorKey: "indActResNom",
                cell: ({row}) => {
                    let text = row.original.indActResNum + ' - ' + row.original.indActResNom.charAt(0).toUpperCase()  + row.original.indActResNom.slice(1).toLowerCase()
                    let shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;
                    return (
                        <div style={{textWrap: 'nowrap'}}>
                            <span
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </div>
                    );
                },
            },
            {
                header: "Meta",
                accessorKey: "metMetTec",
                cell: ({row}) => {
                    // Convierte el número a una cadena y añade las comas de miles
                    const formattedNumber = Number(row.original.metMetTec).toLocaleString();
                    return (
                        <div className="center">
                            {formattedNumber}
                        </div>
                    );
                },
            },
            {
                header: "Ejecución",
                accessorKey: "metEjeTec",
                cell: ({row}) => {
                    // Convierte el número a una cadena y añade las comas de miles
                    const formattedNumber = Number(row.original.metEjeTec).toLocaleString();
                    return (
                        <div className="center">
                            {formattedNumber}
                        </div>
                    );
                },
            },            
            {
                header: "% de Avance",
                accessorKey: "metPorAvaTec",
                cell: ({row}) => (
                    <div className="flex flex-column">
                        <div className="bold" style={{color: row.original.estCol}}>
                            {row.original.metPorAvaTec}%
                        </div>
                        <div 
                            className="progress-bar"
                            style={{backgroundColor: '#d3d3d3', border: `0px solid ${row.original.estCol}`}}
                        >
                            <div 
                                className="progress-bar-fill" 
                                style={{width: `${row.original.metPorAvaTec > 100 ? 100 : row.original.metPorAvaTec}%`, backgroundColor: row.original.estCol}}
                            ></div>
                        </div>
                    </div>
                ),
            },
            
        ];

        baseColumns = baseColumns.filter(column => 
            data.some(item => item[column.accessorKey] !== null)
        );

        return baseColumns;
    }, []);

    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
    })

    return (
        <CustomTable 
            title='Metas'
            table={table}
            showPagination={false}
        />
    )
}

export default Table