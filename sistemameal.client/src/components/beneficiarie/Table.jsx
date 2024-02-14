import { useContext, useMemo, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
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
// Iconos source
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
// 
import CryptoJS from 'crypto-js';
// Context
import { AuthContext } from '../../context/AuthContext';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../reusable/helper';
import Pagination from '../reusable/Pagination';
import TableRow from '../user/TableRow';

const Table = ({ data }) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Dropdown botones Export
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const Editar_Beneficiario = (row) => {
        console.log(row)
        const id = `${row.original.benAno}${row.original.benCod}`;
        console.log(id)
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-beneficiarie/${safeCiphertext}`);
    }

    /* TANSTACK */
    const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR BENEFICIARIO"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR BENEFICIARIO"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR BENEFICIARIO"),
    };

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Código",
                accessorKey: "benCod",
                cell: ({row}) => (
                    <div className="">
                        {row.original.benAno + row.original.benCod}
                    </div>
                ),
            },
            {
                header: "Nombre",
                accessorKey: "benNom",
                cell: ({row}) => {
                    const text = row.original.benNom.toLowerCase();
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Apellido",
                accessorKey: "benApe",
                cell: ({row}) => {
                    const text = row.original.benApe.toLowerCase();
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Correo",
                accessorKey: "benCorEle",
                cell: ({row}) => {
                    const text = row.original.benCorEle.toLowerCase();
                    return (
                        <div>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Telefono",
                accessorKey: "benTel",
            },
            {
                header: "Contacto",
                accessorKey: "benTelCon"
            },
            {
                header: "Sexo",
                accessorKey: "benSex",
                cell: ({row}) => {
                    const text = row.original.benSex;
                    return (
                        <>
                            {text === 'M' ? 'Masculino' : 'Femenino'}
                        </>
                    )
                },
            },
        ]
    
        if (actions.delete || actions.edit) {
            baseColumns.push({
                header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>Acciones</div>,
                accessorKey: "acciones",
                disableSorting: true,
                cell: ({row}) => (
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {actions.edit && 
                            <FaEdit 
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='Large-p_25' 
                                onClick={() => Editar_Beneficiario(row)}  
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                // onClick={() => handleDelete('Beneficiario', row.original.uniCod, setData, setIsLoggedIn)} 
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

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.benAno.includes(searchFilter.toUpperCase()) ||
            item.benCod.includes(searchFilter.toUpperCase()) ||
            item.benNom.includes(searchFilter.toUpperCase()) ||
            item.benApe.includes(searchFilter.toUpperCase()) ||
            item.benCorEle.includes(searchFilter.toUpperCase()) ||
            item.benTel.includes(searchFilter.toUpperCase()) ||
            item.benTelCon.includes(searchFilter.toUpperCase()) ||
            (item.benSex === 'M' && 'MASCULINO'.includes(searchFilter.toUpperCase())) ||
            (item.benSex === 'F' && 'FEMENINO'.includes(searchFilter.toUpperCase()))
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
    /* END TANSTACK */

    // Preparar los datos
    let dataExport = [...table.options.data]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        uniInvPer: item.uniInvPer === 'S' ? 'SI' : 'NO',
    }));
    const headers = ['AÑO', 'CODIGO', 'NOMBRE', 'APELLIDO', 'CODIGO_UNICO', 'CORREO', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'BENEFICIARIOS';  // El título de tu archivo
    const properties = ['benAno', 'benCod', 'benNom', 'benApe', 'benCodUni', 'benCorEle', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
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
    
    return (
        <div className='TableMainContainer Large-p1 Medium-p1 Small-p_5'>
            <div>
                <h1 className="flex left Large-f1_5 Medium-f1_5 Small-f1_5 ">Listado de Beneficiarios</h1>
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
                        onClick={() => navigate('/form-beneficiarie')}
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
                                                    <div className='flex flex-column ai-center jc-center'>
                                                        {header.column.getIsSorted() === 'asc' && !header.column.columnDef.disableSorting ? 
                                                            <TiArrowSortedUp className={`sort-icon active`} /> :
                                                            header.column.getIsSorted() === 'desc' && !header.column.columnDef.disableSorting ? 
                                                            <TiArrowSortedDown className={`sort-icon active`} /> :
                                                            !header.column.columnDef.disableSorting &&
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
            </div>
            <Pagination table={table} />
        </div>
    );
}

export default Table;
