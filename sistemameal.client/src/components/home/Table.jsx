import { useMemo, useState } from "react";
import {
    useReactTable, 
    getCoreRowModel, 
    getSortedRowModel, 
} from '@tanstack/react-table';
// Componentes
import CustomTable from "../reusable/Table/CustomTable";
import { formatter } from "../monitoring/goal/helper";

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
                header: () => <div style={{whiteSpace: 'normal'}} className="center">Meta Programática</div>,
                accessorKey: "metMetTec",
                cell: ({row}) => {
                    // Convierte el número a una cadena y añade las comas de miles
                    const formattedNumber = formatter.format(Number(row.original.metMetTec));
                    return (
                        <div className="center">
                            {formattedNumber}
                        </div>
                    );
                },
            },
            {
                header: () => <div style={{whiteSpace: 'normal'}} className="center">Ejecución Programática</div>,
                accessorKey: "metEjeTec",
                cell: ({row}) => {
                    // Convierte el número a una cadena y añade las comas de miles
                    const formattedNumber = formatter.format(Number(row.original.metEjeTec));
                    return (
                        <div className="center">
                            {formattedNumber}
                        </div>
                    );
                },
            },
            {
                header: () => <div style={{whiteSpace: 'normal'}} className="center">% avance Técnico </div>,
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
            {
                header: () => <div className="center" style={{color: '#20737B', whiteSpace: 'normal'}}>Meta Presupuesto</div>,
                accessorKey: "metMetPre",
                cell: ({row}) => {
                    if(row.original.metMetPre){
                        // Convierte el número a una cadena y añade las comas de miles
                        const formattedNumber = formatter.format(Number(row.original.metMetPre));
                        return (
                            <div className="center">
                                ${formattedNumber}
                            </div>
                        );
                    }
                },
            },
            {
                header: () => <div className="center" style={{color: '#20737B',whiteSpace: 'normal'}}>Ejecución Presupuesto</div>,
                accessorKey: "metEjePre",
                cell: ({row}) => {
                    if (row.original.metEjePre) {
                        // Convierte el número a una cadena y añade las comas de miles
                        const formattedNumber = formatter.format(Number(row.original.metEjePre));
                        return (
                            <div className="center">
                                ${formattedNumber}
                            </div>
                        );
                    }
                },
            },            
            {
                header: () => <div className="center" style={{whiteSpace: 'normal',color: '#20737B'}}>% avance Presupuesto</div>,
                accessorKey: "metPorAvaPre",
                cell: ({row}) => {
                    if (row.original.metPorAvaPre) {
                        return (
                        <div className="flex flex-column">
                            <div className="bold" style={{color: row.original.estCol}}>
                                {row.original.metPorAvaPre}%
                            </div>
                            <div 
                                className="progress-bar"
                                style={{backgroundColor: '#d3d3d3', border: `0px solid ${row.original.estCol}`}}
                            >
                                <div 
                                    className="progress-bar-fill" 
                                    style={{width: `${row.original.metPorAvaPre > 100 ? 100 : row.original.metPorAvaPre}%`, backgroundColor: row.original.estCol}}
                                ></div>
                            </div>
                        </div>
                    )}
                },
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
            resize={false}
            showPagination={false}
        />
    )
}

export default Table