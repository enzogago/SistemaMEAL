import { useMemo, useState } from "react";
import TableRow from "./TableRow"
import { FaEdit, FaPenNib, FaPlus, FaRegTrashAlt, FaSearch, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import Pagination from "../reusable/Pagination";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';

const Table = ({ data }) => {
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }
    
    const actions = {
        // add: userPermissions.some(permission => permission.perNom === "CREAR ESTADO"),
        // delete: userPermissions.some(permission => permission.perNom === "ELIMINAR ESTADO"),
        // edit: userPermissions.some(permission => permission.perNom === "MODIFICAR ESTADO"),
    };
    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.estNom.includes(searchFilter.toUpperCase()) ||
            item.proNom.includes(searchFilter.toUpperCase())
        ), [data, searchFilter]
    );

    const columns = useMemo(() => {
        let baseColumns = [
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
        ];
    
        if (true || true) {
            baseColumns.push({
                header: "Acciones",
                accessorKey: "acciones",
                cell: ({row}) => (
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {true && 
                            <FaEdit 
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='Large-p_25' 
                                onClick={() => openModal(row.original)} 
                            />
                        }
                        {true && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDelete('Estado', row.original.estCod, setEstados, setIsLoggedIn)} 
                            />
                        }
                        <Tooltip 
                            id="edit-tooltip"
                            effect="solid"
                            place='top-end'
                        />
                        <Tooltip 
                            id="delete-tooltip" 
                            effect="solid"
                            place='top-start'
                        />
                    </div>
                ),
            });
        }
    
        return baseColumns;
    }, [actions]);

    
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
        <div className='TableMainContainer Large-p2 Medium-p1 Small-p_5'>
            <div>
                <h1 className="flex left Large-f1_5 Medium-f1_5 Small-f1_5 ">Listado de Metas</h1>
                <div className="flex ">
                    <div className="PowerMas_Search_Container Large_6 Large-m_5">
                        <FaSearch className="Large_1 search-icon" />
                        <input 
                            className='PowerMas_Input_Filter Large_12 Large-p_5'
                            type="search"
                            placeholder='Buscar'
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                        />
                    </div>
                    {
                        /*actions.add*/ true && 
                        <button 
                            className=' flex jc-space-between Large_3 Large-m_5 Large-p_5 PowerMas_ButtonStatus'
                            // onClick={() => openModal()} 
                            // disabled={!actions.add}
                        >
                            Nuevo <FaPlus className='Large_1' /> 
                        </button>
                    }
                    <div className={`PowerMas_Dropdown_Export Large_3 Large-m_5 ${dropdownOpen  ? 'open' : ''}`}>
                        <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                        <div className="PowerMas_Dropdown_Export_Content Phone_12">
                            <a  className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                            <a  className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 Large-f_75 Medium-f_75 PowerMas_TableStatus">
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
                                                    <div className='flex flex-column ai-center jc-center'>
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