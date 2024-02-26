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
import CustomTable from "../reusable/Table/CustomTable";

const Table = ({ data }) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const searchInputRef = useRef('');
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');


    // Dropdown botones Export
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    // Añade una nueva etiqueta al presionar Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue && !searchTags.includes(inputValue)) {
            setSearchTags(prevTags => [...prevTags, inputValue]);
            setInputValue('');  // borra el valor del input
            setIsInputEmpty(true);
        } else if (e.key === 'Backspace' && isInputEmpty && searchTags.length > 0) {
            setSearchTags(prevTags => prevTags.slice(0, -1));
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);  // actualiza el valor del input
        setIsInputEmpty(e.target.value === '');
    }

    // Elimina una etiqueta
    const removeTag = (tag) => {
        setSearchTags(searchTags.filter(t => t !== tag));
    }

    const Register_Beneficiarie = (row) => {
        console.log(row);
        const id = `${row.original.metAno}${row.original.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-goal-beneficiarie/${safeCiphertext}`);
    }
    
    const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR META"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR META"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR META"),
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF META`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL META`),
    };
    const [sorting, setSorting] = useState([]);
    // Añade una nueva propiedad 'metMesPlaTecNombre' a cada objeto de tus datos
    data.forEach(item => {
        item.metMesPlaTecNombre = new Date(2024, item.metMesPlaTec - 1).toLocaleString('es-ES', { month: 'long' });
    });


    // Filtra los datos por todas las etiquetas
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
                item.estNom.includes(tag.toUpperCase()) ||
                item.metMetTec.includes(tag.toUpperCase()) ||
                item.metEjeTec.includes(tag.toUpperCase()) ||
                item.metPorAvaTec.includes(tag.toUpperCase()) ||
                item.metAnoPlaTec.includes(tag.toUpperCase()) ||
                item.metMesPlaTecNombre.toUpperCase().includes(tag.toUpperCase()) ||
                item.indActResNum.includes(tag.toUpperCase()) ||
                item.indActResNom.includes(tag.toUpperCase()) ||
                item.tipInd.includes(tag.toUpperCase()) ||
                item.resNom.includes(tag.toUpperCase()) ||
                item.resNum.includes(tag.toUpperCase()) ||
                item.objEspNom.includes(tag.toUpperCase()) || 
                item.objEspNum.includes(tag.toUpperCase()) || 
                item.objNom.includes(tag.toUpperCase()) || 
                item.subProNom.includes(tag.toUpperCase()) || 
                item.proNom.includes(tag.toUpperCase())
            )
        ), [data, searchTags]
    );

    const Editar_Meta = (row) => {
        console.log(row)
        const id = `${row.original.usuAno}${row.original.usuCod}`;
        console.log(id)
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-goal/${safeCiphertext}`);
    }

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Estado",
                accessorKey: "estNom",
                cell: ({row}) => (
                    <div className="bold" style={{ color: row.original.estCol, whiteSpace: 'nowrap' }}>
                        {row.original.estNom.charAt(0).toUpperCase() + row.original.estNom.slice(1).toLowerCase()}
                    </div>
                ),
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
                        <div className="bold" style={{color: row.original.estCol, textDecoration: ''}}>
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
                header: "Año",
                accessorKey: "metAnoPlaTec"
            },
            {
                header: "Mes",
                accessorKey: "metMesPlaTecNombre", // Usa la nueva propiedad como accessorKey
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.metMesPlaTecNombre}
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
                cell: ({row}) => {
                    const text = row.original.indActResNum + ' - ' + row.original.indActResNom.charAt(0).toUpperCase() + row.original.indActResNom.slice(1).toLowerCase();
                    const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Tipo Inidicador",
                accessorKey: "tipInd",
                cell: ({row}) => {
                    const text = row.original.tipInd.charAt(0).toUpperCase() + row.original.tipInd.slice(1).toLowerCase();
                    return (
                        <>
                            {text}
                        </>
                    )
                },
            },
            {
                header: "Añadir",
                accessorKey: "añadir",
                cell: ({row}) => {
                    return (
                        row.original.uniInvPer === 'S' ?
                        <div className="flex jc-center ai-center">
                            <button  
                                className="PowerMas_Add_Beneficiarie f_75 p_25 flex-grow-1" 
                                onClick={() => Register_Beneficiarie(row)}
                            >
                                Beneficiario
                            </button>
                        </div>
                        :
                        <div className="flex jc-center ai-center">
                            <button  
                                className="PowerMas_Add_Execution f_75 p_25 flex-grow-1" 
                            >
                                Ejecución
                            </button>
                        </div>
                    )
                }
            },
            {
                header: "Resultado",
                accessorKey: "resNom",
                cell: ({row}) => {
                    const text = row.original.resNum + ' - ' + row.original.resNom.charAt(0).toUpperCase() + row.original.resNom.slice(1).toLowerCase();
                    const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Objetivo Especifico",
                accessorKey: "objEspNom",
                cell: ({row}) => {
                    const text = row.original.objEspNum + ' - ' + row.original.objEspNom.charAt(0).toUpperCase() + row.original.objEspNom.slice(1).toLowerCase();
                    const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Objetivo",
                accessorKey: "objNom",
                cell: ({row}) => {
                    const text = row.original.objNum + ' - ' + row.original.objNom.charAt(0).toUpperCase() + row.original.objNom.slice(1).toLowerCase();
                    const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
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
        
    
        if (actions.edit || actions.delete) {
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
                                onClick={() => Editar_Meta(row)} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDelete('Estado', row.original.estCod, setEstados, setIsLoggedIn)} 
                            />
                        }
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

    
    
    return (
        <>
            <CustomTable 
                title='Metas'
                actions={actions} 
                dropdownOpen={dropdownOpen} 
                setDropdownOpen={setDropdownOpen} 
                Export_Excel={Export_Excel} 
                Export_PDF={Export_PDF} 
                table={table}
                navigatePath='form-user'
                scrolled={true}
                resize={false}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                inputValue={inputValue}
                removeTag={removeTag}
                searchTags={searchTags}
                setSearchTags={setSearchTags}
            />
            
        </>
    )
}

export default Table