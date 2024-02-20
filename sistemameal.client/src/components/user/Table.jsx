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
// Iconos source
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
// Context
import { AuthContext } from '../../context/AuthContext';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper } from '../reusable/helper';
// Componentes
import Pagination from "../reusable/Pagination";
import TableRow from "./TableRow"
import Modal from "../layout/Modal";
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';

const Table = ({data}) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    // Dropdown botones Export
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    // Funciones para abrir y cerrar los modales
    const openModal = () => {
        setIsOpen(true);
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };

    const Restablecer_Password = (row) => {
        setSelectedUser({ usuAno: row.original.usuAno, usuCod: row.original.usuCod });
        console.log({ usuAno: row.original.usuAno, usuCod: row.original.usuCod })
        openModal();
    }

    /* TANSTACK */
    const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR USUARIO"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR USUARIO"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR USUARIO"),
    };

    const columns = useMemo(() => { 
        let baseColumns = [
            {
                header: "",
                accessorKey: "avatar",
                disableSorting: true,
                cell: ({row}) => {
                    const user = row.original;
                    return (
                        <div className="PowerMas_ProfilePicture2 m_25" style={{width: '35px', height: '35px', border: `2px solid ${user && (user.usuSex === 'M' ? '#20737b' : '#E5554F')}`}}>
                            <img src={user && (user.usuSex === 'M' ? masculino : femenino)} alt="Descripción de la imagen" />
                        </div>
                    )
                }
            },
            {
                header: "Estado",
                accessorKey: "usuEst",
                cell: ({row}) => {
                    const text = row.original.usuEst === 'A' ? 'Activo' : 'Inactivo';
                    return (
                        <div
                            className="bold"
                            style={{textTransform: 'capitalize', color: `${row.original.usuEst === 'A' ? '#20737b' : '#E5554F'}`}}
                        >
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Nombre Completo",
                accessorKey: "usuNom",
                cell: ({row}) => {
                    const text = row.original.docIdeAbr + ' ' + row.original.usuNumDoc + ' - ' + row.original.usuNom.toLowerCase() + ' ' + row.original.usuApe.toLowerCase();
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Fecha Nacimiento",
                accessorKey: "usuFecNac",
            },
            {
                header: "Correo",
                accessorKey: "usuCorEle",
                cell: ({row}) => {
                    const text = row.original.usuCorEle.toLowerCase();
                    return (
                        <div>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Teléfono",
                accessorKey: "usuTel",
            },
            {
                header: "Cargo",
                accessorKey: "carNom",
                cell: ({row}) => {
                    const text = row.original.carNom.charAt(0).toUpperCase() + row.original.carNom.slice(1).toLowerCase();
                    return (
                        <div>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Rol",
                accessorKey: "rolNom",
                cell: ({row}) => {
                    const text = row.original.rolNom.charAt(0).toUpperCase() + row.original.rolNom.slice(1).toLowerCase();
                    return (
                        <div>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Contraseña",
                accessorKey: "password",
                cell: ({row}) => {
                    return (
                        <div className="flex jc-center ai-center">
                            <button  
                                className="PowerMas_Add_Beneficiarie f_75 p_25 flex-grow-1" 
                                onClick={() => Restablecer_Password(row)}
                            >
                                Restablecer
                            </button>
                        </div>
                    )
                }
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
                                onClick={() => Editar_Usuario(row)} 
                            />
                        }
                        {actions.delete && 
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
    }, [actions]);

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
    data.filter(item => 
        item.usuNom.includes(searchFilter.toUpperCase()) ||
        item.usuApe.includes(searchFilter.toUpperCase()) ||
        item.usuCorEle.includes(searchFilter.toUpperCase()) ||
        item.usuFecNac.includes(searchFilter.toUpperCase()) ||
        item.usuTel.includes(searchFilter.toUpperCase()) ||
        item.usuNumDoc.includes(searchFilter.toUpperCase()) ||
        item.docIdeAbr.includes(searchFilter.toUpperCase()) ||
        item.carNom.includes(searchFilter.toUpperCase()) ||
        item.rolNom.includes(searchFilter.toUpperCase()) ||
        item.usuEst.includes(searchFilter.toUpperCase()) ||
        (item.usuEst === 'A' && 'ACTIVO'.includes(searchFilter.toUpperCase())) ||
        (item.usuEst === 'I' && 'INACTIVO'.includes(searchFilter.toUpperCase()))
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
    let dataExport = table.options.data;  // Tus datos

    // Transformar los datos
    dataExport = dataExport.map(item => {
        return {
            ...item,
            usuEst: item.usuEst === 'A' ? 'ACTIVO' : 'INACTIVO'
        };
    });
    const headers = ['ESTADO','DOCUMENTO','NUMERO_DOCUMENTO','NOMBRE', 'APELLIDO', 'CORREO', 'TELEFONO', 'CARGO', 'ROL', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'USUARIOS';  // El título de tu archivo
    const properties = ['usuEst','docIdeNom','usuNumDoc','usuNom', 'usuApe', 'usuCorEle', 'usuTel', 'carNom', 'rolNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
    const format = [500, 250];

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
            <Modal 
                isOpen={isOpen}
                closeModal={closeModal}
                user={selectedUser}
            />
        </div>
    )
}

export default Table