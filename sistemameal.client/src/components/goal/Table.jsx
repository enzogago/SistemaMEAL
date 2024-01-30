import { useMemo, useRef, useState } from "react";
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

const Table = ({ data }) => {
    const navigate = useNavigate();
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Dropdown botones Export
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const Register_Beneficiarie = (row) => {
        console.log(row);
        const id = `${row.original.metAno}${row.original.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-beneficiarie/${safeCiphertext}`);
    }
    
    const actions = {
        // add: userPermissions.some(permission => permission.perNom === "CREAR META"),
        // delete: userPermissions.some(permission => permission.perNom === "ELIMINAR META"),
        // edit: userPermissions.some(permission => permission.perNom === "MODIFICAR META"),
    };
    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.estNom.includes(searchFilter.toUpperCase()) ||
            item.metMetTec.includes(searchFilter.toUpperCase()) ||
            item.metEjeTec.includes(searchFilter.toUpperCase()) ||
            item.metPorAvaTec.includes(searchFilter.toUpperCase()) ||
            item.metAnoPlaTec.includes(searchFilter.toUpperCase()) ||
            item.metMesPlaTec.includes(searchFilter.toUpperCase()) ||
            item.indActResNom.includes(searchFilter.toUpperCase()) ||
            item.tipInd.includes(searchFilter.toUpperCase()) ||
            item.resNom.includes(searchFilter.toUpperCase()) ||
            item.resNum.includes(searchFilter.toUpperCase()) ||
            item.objEspNom.includes(searchFilter.toUpperCase()) || 
            item.objEspNum.includes(searchFilter.toUpperCase()) || 
            item.objNom.includes(searchFilter.toUpperCase()) || 
            item.subProNom.includes(searchFilter.toUpperCase()) || 
            item.proNom.includes(searchFilter.toUpperCase())
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
                    <div style={{ color: row.original.estCol }}>
                        {row.original.estNom}
                    </div>
                ),
            },
            {
                header: "Meta",
                accessorKey: "metMetTec",
            },
            {
                header: "Ejecucion",
                accessorKey: "metEjeTec"
            },
            {
                header: "% de Avance",
                accessorKey: "metPorAvaTec",
                cell: ({row}) => (
                    <div className="flex gap_5">
                        <div style={{color: row.original.estCol, textDecoration: 'underline'}}>
                            {row.original.metPorAvaTec}%
                        </div>
                        <div 
                            className="progress-bar"
                            style={{backgroundColor: darkenColor(row.original.estCol, 80), border: `1px solid ${row.original.estCol}`}}
                        >
                            <div 
                                className="progress-bar-fill" 
                                style={{width: `${row.original.metPorAvaTec}%`, backgroundColor: row.original.estCol}}
                            ></div>
                        </div>
                    </div>
                ),
            },
            {
                header: "Año",
                accessorKey: "metAnoPlaTec"
            },
            {
                header: "Mes",
                accessorKey: "metMesPlaTec",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {new Date(2024, row.original.metMesPlaTec - 1).toLocaleString('es-ES', { month: 'long' })}
                    </div>
                ),
            },
            {
                header: "Sub Actividad",
                accessorKey: "subActResNom",
            },
            {
                header: "Indicador",
                accessorKey: "indActResNom",
                
            },
            {
                header: "Tipo Inidicador",
                accessorKey: "tipInd"
            },
            {
                header: "Beneficiario",
                accessorKey: "beneficiario",
                cell: ({row}) => (
                    <div className="flex jc-center ai-center">
                        <button  
                            className="PowerMas_Add_Beneficiarie f_75 p_25" 
                            onClick={() => Register_Beneficiarie(row)}
                        >
                            Añadir
                        </button>
                    </div>
                ),
            },
            {
                header: "Resultado",
                accessorKey: "resNom",
                cell: ({row}) => (
                    <div>
                        {row.original.resNum} - {row.original.resNom}
                    </div>
                ),
            },
            {
                header: "Objetivo Especifico",
                accessorKey: "objEspNom",
                cell: ({row}) => (
                    <div>
                        {row.original.objEspNum} - {row.original.objEspNom}
                    </div>
                ),
            },
            {
                header: "Objetivo",
                accessorKey: "objNom",
                cell: ({row}) => (
                    <div>
                        {row.original.objNum} - {row.original.objNom}
                    </div>
                ),
            },
            {
                header: "Subproyecto",
                accessorKey: "subProNom"
            },
            {
                header: "Proyecto",
                accessorKey: "proNom"
            },
            {
                header: "Financiador",
                accessorKey: "finNom"
            },
            {
                header: "Implementador",
                accessorKey: "impNom"
            },
        ];

        baseColumns = baseColumns.filter(column => 
            data.some(item => item[column.accessorKey] !== null)
        );
    
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

    // Preparar los datos
    const dataExport = table.options.data;  // Tus datos
    const headers = ['ESTADO', 'META', 'EJECUCION', 'PORCENTAJE_AVANCE','AÑO','MES','INDICADOR','TIPO_INDICADOR','RESULTADO','OBJETIVO_ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'METAS';  // El título de tu archivo Excel
    const properties = ['estNom', 'metMetTec', 'metEjeTec', 'metPorAvaTec', 'metAnoPlaTec', 'metMesPlaTec', 'indActResNom', 'tipInd', 'resNom', 'objEspNom', 'objNom', 'subProNom', 'proNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir en el Excel
    const format = [1000, 500];

    const Export_Excel = () => {
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_Excel_Helper(dataExport, headers, title, properties);
    };
    const Export_PDF = () => {
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_PDF_Helper(dataExport, headers, title, properties, format);
    };

    const tableRef = useRef();  // Referencia al elemento de la tabla

    const animateScroll = (element, to, duration) => {
        const start = element.scrollLeft,
            change = to - start,
            increment = 20;
        let currentTime = 0;
    
        const animateScroll = () => {
            currentTime += increment;
            const val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollLeft = val;
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }
    
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };
    
    const scrollTable = (direction) => {
        if (tableRef.current) {
            const distance = tableRef.current.offsetWidth * 0.8;  // 50% del ancho de la tabla
            const to = tableRef.current.scrollLeft + distance * direction;
            animateScroll(tableRef.current, to, 500);
        }
    }
    
    return (
        <div className='TableMainContainer Large-p1 Medium-p1 Small-p_5 h-100 overflow-auto'>
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
                            <a onClick={Export_Excel} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                            <a onClick={Export_PDF} className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainer" ref={tableRef}>
                <table className="Large_12 Large-f_75 Medium-f_75 PowerMas_TableStatus w-200">
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
                            : <tr className='PowerMas_TableEmpty'><td colSpan={11} className='Large-p1 center'>No se encontraron registros</td></tr>
                        }
                    </tbody>
                </table>
                <GrPrevious className="slider" style={{left: '0'}} onClick={() => scrollTable(-1)} /> 
                <GrNext className="slider" style={{right: '0'}} onClick={() => scrollTable(1)} /> 
            </div>
            <Pagination table={table} />
        </div>
    )
}

export default Table