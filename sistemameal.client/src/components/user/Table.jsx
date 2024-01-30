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
import { AuthContext } from "../../context/AuthContext";

const Table = ({data}) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setUserMaint } = authActions;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Dropdown botones Export
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const columns = useMemo(() => { 
        let baseColumns = [
            {
                header: "Año",
                accessorKey: "usuAno"
            },
            {
                header: "Código",
                accessorKey: "usuCod"
            },
            {
                header: "Nombre",
                accessorKey: "usuNom"
            },
            {
                header: "Apellido",
                accessorKey: "usuApe"
            },
            {
                header: "Correo",
                accessorKey: "usuCorEle"
            },
            {
                header: "Cargo",
                accessorKey: "carNom"
            },
            {
                header: "Rol",
                accessorKey: "rolNom"
            },
            {
                header: "Estado",
                accessorKey: "usuEst"
            },
        ]

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
                                onClick={() => Editar_Usuario(row)} 
                            />
                        }
                        {true && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                // onClick={() => handleDelete('Proyecto', row.original.estCod, setEstados, setIsLoggedIn)} 
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
    }, []);

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
    data.filter(item => 
        item.usuAno.includes(searchFilter.toUpperCase()) ||
        item.usuCod.includes(searchFilter.toUpperCase()) ||
        item.usuNom.includes(searchFilter.toUpperCase()) ||
        item.usuApe.includes(searchFilter.toUpperCase()) ||
        item.usuCorEle.includes(searchFilter.toUpperCase()) ||
        item.cargo.carNom.includes(searchFilter.toUpperCase()) ||
        item.rol.rolNom.includes(searchFilter.toUpperCase()) ||
        item.usuEst.includes(searchFilter.toUpperCase())
    ), [data, searchFilter]
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

     // Preparar los datos
     const dataExport = table.options.data;  // Tus datos
     const headers = ['AÑO', 'CODIGO', 'NOMBRE', 'RESPONSABLE', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
     const title = 'PROYECTOS';  // El título de tu archivo
     const properties = ['proAno', 'proCod', 'proNom', 'proRes', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
     const format = 'a4';  // El tamaño del formato que quieres establecer para el PDF
 
     const Export_Excel = () => {
         // Luego puedes llamar a la función Export_Excel_Helper de esta manera:
         Export_Excel_Helper(dataExport, headers, title, properties);
         setDropdownOpen(false);
     };
 
     const Export_PDF = () => {
         // Luego puedes llamar a la función Export_PDF_Helper de esta manera:
         Export_PDF_Helper(dataExport, headers, title, properties, format);
         setDropdownOpen(false);
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
     
     const Editar_Usuario = (row) => {
         console.log(row)
         const id = `${row.original.usuAno}${row.original.usuCod}`;
         console.log(id)
         // Encripta el ID
         const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
         // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
         const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
         navigate(`/form-user/${safeCiphertext}`);
     }
    
    return (
        <div className='TableMainContainer Large-p1 Medium-p1 Small-p_5'>
            <div>
                <h1 className="flex left Large-f1_5 Medium-f1_5 Small-f1_5 ">Listado de Usuarios</h1>
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
                    <button 
                        className=' flex jc-space-between Large_3 Large-m_5 Large-p_5 PowerMas_ButtonStatus'
                        onClick={() => navigate('/form-user')}
                    >
                        Nuevo <FaPlus className='Large_1' /> 
                    </button>
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
                <table className="Large_12 PowerMas_TableStatus">
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
                {/* <GrPrevious className="slider" style={{left: '0'}} onClick={() => scrollTable(-1)} /> 
                <GrNext className="slider" style={{right: '0'}} onClick={() => scrollTable(1)} />  */}
            </div>
            <Pagination table={table} />
        </div>
    )
}

export default Table