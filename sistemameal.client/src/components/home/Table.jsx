import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import CryptoJS from 'crypto-js';
import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Iconos package
import { FaEdit, FaPlus, FaRegTrashAlt, FaSearch, FaSortDown } from 'react-icons/fa';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { GrNext, GrPrevious  } from "react-icons/gr";
// Iconos source
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../reusable/helper';
// Componentes
import Pagination from "../reusable/Pagination";
import TableRow from "./TableRow"
// Context
import { AuthContext } from "../../context/AuthContext";

const Table = ({ data }) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');

    const [sorting, setSorting] = useState([]);

    const filteredData = useMemo(() => 
        data.filter(item => 
            item.estNom.includes(searchFilter.toUpperCase()) ||
            item.metMetTec.includes(searchFilter.toUpperCase()) ||
            item.metEjeTec.includes(searchFilter.toUpperCase()) ||
            item.metPorAvaTec.includes(searchFilter.toUpperCase()) ||
            item.indActResNom.includes(searchFilter.toUpperCase())
        ), [data, searchFilter]
    );


    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              B = ((num >> 8) & 0x00FF) + amt,
              G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    }
    

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Estado",
                accessorKey: "estNom",
                cell: ({row}) => (
                    <div className="bold" style={{ color: row.original.estCol }}>
                        {row.original.estNom}
                    </div>
                ),
            },
            {
                header: "Indicador",
                accessorKey: "indActResNom",
                cell: ({row}) => {
                    const text = row.original.indActResNom;
                    const shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;
                    return (
                        <div>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                            <Tooltip 
                                id="info-tooltip"
                                effect="solid"
                                place='bottom-start'
                                className="tooltip"
                            />
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
                header: "Ejecucion",
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
                                style={{width: `${row.original.metPorAvaTec}%`, backgroundColor: row.original.estCol}}
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
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
    })

    return (
        <div className='TableMainContainer Large-p1 Medium-p1 Small-p_5 h-100 overflow-auto'>
            <div className="Large-flex ai-center">
                <h1 className="flex left f1_5 ">Listado de Metas</h1>
                <div className="flex flex-grow-1">
                    <div className="PowerMas_Search_Container Large-m_25 Phone_12">
                        <FaSearch style={{left: '10px'}} className="Large_1 search-icon" />
                        <input 
                            className='PowerMas_Input_Filter Large_12 Large-p_5'
                            type="search"
                            placeholder='Buscar'
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainerHome">
                <table className="Large_12 Large-f_75 Medium-f_75 PowerMas_TableStatus">
                    <thead>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="">
                                    {
                                        headerGroup.headers.map(header =>(
                                            <th className="ws-nowrap" key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                                <div>
                                                    {
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                    <div className='flex flex-column ai-center jc-center PowerMas_Icons_Sorter'>
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
        </div>
    )
}

export default Table