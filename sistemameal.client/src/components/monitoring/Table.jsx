import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Iconos package
import { FaEdit, FaPlus, FaRegTrashAlt, FaSearch, FaSortDown } from 'react-icons/fa';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../reusable/helper';
// Context
import { AuthContext } from "../../context/AuthContext";
import CustomTable from "../reusable/Table/CustomTable";
import Notiflix from "notiflix";

const Table = ({ data, setMonitoringData, setModalIsOpen }) => {
    const indTipIndMap = {
        'IAC': 'Indicador Actividad',
        'IRE': 'Indicador Resultado',
        'IOB': 'Indicador Objetivo',
        'IOE': 'Indicador Objetivo Especifico',
        'ISA': 'Indicador Sub Actividad',
    };
    
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [actionsColumnWidth, setActionsColumnWidth] = useState(0);
    
    const [sums, setSums] = useState(null);

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

        Notiflix.Confirm.show(
            'Registrar Beneficiario',
            '¿Como deseas registrar a los benefiriacios?',
            'Masivo',
            'Individual',
            () => {
                navigate(`/upload-beneficiarie`);
            },
            () => {
                const id = `${row.original.metAno}${row.original.metCod}`;
                // Encripta el ID
                const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
                // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
                const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
                navigate(`/form-goal-beneficiarie/${safeCiphertext}`);
            }
        )
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


    const filteredData = useMemo(() => {
        const filtered = data.filter(item => 
            searchTags.every(tag => 
                (item.estNom ? item.estNom.includes(tag.toUpperCase()) : false) ||
                (item.metMetTec ? item.metMetTec.includes(tag.toUpperCase()) : false) ||
                (item.metEjeTec ? item.metEjeTec.includes(tag.toUpperCase()) : false) ||
                (item.metPorAvaTec ? item.metPorAvaTec.includes(tag.toUpperCase()) : false) ||
                (item.metAnoPlaTec ? item.metAnoPlaTec.includes(tag.toUpperCase()) : false) ||
                (item.metMesPlaTecNombre ? item.metMesPlaTecNombre.toUpperCase().includes(tag.toUpperCase()) : false) ||
                (item.indActResNum ? item.indActResNum.includes(tag.toUpperCase()) : false) ||
                (item.indActResNom ? item.indActResNom.includes(tag.toUpperCase()) : false) ||
                (item.tipInd ? item.tipInd.includes(tag.toUpperCase()) : false) ||
                (item.resNom ? item.resNom.includes(tag.toUpperCase()) : false) ||
                (item.resNum ? item.resNum.includes(tag.toUpperCase()) : false) ||
                (item.objEspNom ? item.objEspNom.includes(tag.toUpperCase()) : false) || 
                (item.objEspNum ? item.objEspNum.includes(tag.toUpperCase()) : false) || 
                (item.objNom ? item.objNom.includes(tag.toUpperCase()) : false) || 
                (item.subProNom ? item.subProNom.includes(tag.toUpperCase()) : false) || 
                (item.ubiNom ? item.ubiNom.includes(tag.toUpperCase()) : false) || 
                (item.proNom ? item.proNom.includes(tag.toUpperCase()) : false) ||
                (item.impNom ? item.impNom.includes(tag.toUpperCase()) : false)
            )
        );
    
        // Calcula las sumas
        const sums = {
            metMetTec: filtered.reduce((sum, item) => sum + Number(item.metMetTec), 0),
            metEjeTec: filtered.reduce((sum, item) => sum + Number(item.metEjeTec), 0),
            metMetPre: filtered.reduce((sum, item) => sum + Number(item.metMetPre), 0),
            metEjePre: filtered.reduce((sum, item) => sum + Number(item.metEjePre), 0),
        };
    
        // Guarda las sumas en el estado
        setSums(sums);
    
        return filtered;
    }, [data, searchTags]);



    const Editar_Meta = (row) => {
        console.log(row)
        const id = `${row.original.metAno}${row.original.metCod}${row.original.indActResAno}${row.original.indActResCod}`;
        console.log(id)
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-goal/${safeCiphertext}`);
    }

    const Eliminar_Meta_Indicador = (row) => {
        console.log(row)
        const { metAno, metCod, indActResAno: metIndAno, indActResCod: metIndCod } = row;

        Notiflix.Confirm.show(
            'Eliminar Registro',
            '¿Estás seguro que quieres eliminar este registro?',
            'Sí',
            'No',
            async () => {
                try {
                    Notiflix.Loading.pulse();
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-indicador/${metAno}/${metCod}/${metIndAno}/${metIndCod}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    console.log(response)
                    const data = await response.text();
                    if (!response.ok) {
                        console.log(data);
                        return;
                    }
                    // Actualiza los datos después de eliminar un registro
                    const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/Filter`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const dataUpdate = await updateResponse.json();
                    setMonitoringData(dataUpdate);
                    Notiflix.Notify.success(data)
                } catch (error) {
                    console.error('Error:', error);
                } finally{
                    Notiflix.Loading.remove();
                }
            },
            () => {
                // El usuario ha cancelado la operación de eliminación
            }
        )
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
                header: "Indicador",
                accessorKey: "indActResNom",
                cell: ({row}) => {
                    if (row.original.indActResNum && row.original.indActResNom) {
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
                    } else {
                        return null;
                    }
                },
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
                header: "Implementador",
                accessorKey: "impNom",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {row.original.impNom.toLowerCase()}
                        </div>
                    )
                }
            },
            {
                header: () => <div className="center" style={{whiteSpace: 'normal'}}>Meta Programática</div>,
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
                header: () => <div className="center" style={{whiteSpace: 'normal'}}>Ejecución Programática</div>,
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
                header: () => <div className="center" style={{whiteSpace: 'normal'}}>% avance Técnico </div>,
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
                header: () => <div className="center" style={{whiteSpace: 'normal',color: '#20737B'}}>Meta Presupuesto</div>,
                accessorKey: "metMetPre",
                cell: ({row}) => {
                    if (row.original.metMetPre) {
                        // Convierte el número a una cadena y añade las comas de miles
                        const formattedNumber = Number(row.original.metMetPre).toLocaleString();
                        return (
                            <div className="center">
                                {formattedNumber} $
                            </div>
                        );
                    }
                },
            },
            {
                header: () => <div className="center" style={{whiteSpace: 'normal',color: '#20737B'}}>Ejecución Presupuesto</div>,
                accessorKey: "metEjePre",
                cell: ({row}) => {
                    if (row.original.metEjePre) {
                        // Convierte el número a una cadena y añade las comas de miles
                        const formattedNumber = Number(row.original.metEjePre).toLocaleString();
                        return (
                            <div className="center">
                                {formattedNumber} $
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
                    return(
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
                )}},
            },
           
            {
                header: "Sub Actividad",
                accessorKey: "subActResNom",
            },
            {
                header: "Tipo Indicador",
                accessorKey: "tipInd",
                cell: ({row}) => {
                    const text = row.original.tipInd;
                    return (
                        <>
                             {text && (indTipIndMap[text] || text.toLowerCase())}
                        </>
                    )
                },
            },
            {
                header: "Resultado",
                accessorKey: "resNom",
                cell: ({row}) => {
                    if (row.original.resNum) {
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
                    }
                },
            },
            {
                header: "Objetivo Especifico",
                accessorKey: "objEspNom",
                cell: ({row}) => {
                    if (row.original.objEspNum) {
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
                    }
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
                accessorKey: "subProNom",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {row.original.subProNom.toLowerCase()}
                        </div>
                    )
                }
            },
            {
                header: "Proyecto",
                accessorKey: "proNom",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {row.original.proNom.toLowerCase()}
                        </div>
                    )
                }
            },
            {
                header: "Ubicaciòn",
                accessorKey: "ubiNom",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {row.original.ubiNom.toLowerCase()}
                        </div>
                    )
                }
            },
           
            {
                header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>FFVV</div>,
                accessorKey: "ffvv",
                disableSorting: true,
                stickyRight: actionsColumnWidth*2-20,
                cell: ({row}) => {
                    return (
                        <div className="flex jc-center ai-center" >
                            <button  
                                className="PowerMas_Add_Beneficiarie f_75 p_25 flex-grow-1" 
                                onClick={() => setModalIsOpen(true)}
                            >
                                FFVV
                            </button>
                        </div>

                    )
                }
            },
            {
                header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>Añadir</div>,
                accessorKey: "añadir",
                disableSorting: true,
                stickyRight: actionsColumnWidth-20,
                cell: ({row}) => {
                    return (
                        row.original.uniInvPer === 'S' ?
                        <div className="flex jc-center ai-center" >
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
        ];

        baseColumns = baseColumns.filter(column => 
            data.some(item => item[column.accessorKey] !== null)
        );
        
    
        if (actions.edit || actions.delete) {
            baseColumns.push({
                header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>Acciones</div>,
                accessorKey: "acciones",
                disableSorting: true,
                stickyRight: 0,
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
                                onClick={() => Eliminar_Meta_Indicador(row.original)} 
                            />
                        }
                    </div>
                ),
            });
        }
    
        return baseColumns;
    }, [actions]);

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 100, //default page size
    });
    
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        columnResizeMode: "onChange"
    })

    // Preparar los datos
    const dataExport = table.options.data;
    const headers = ['ESTADO', 'META_PROGRAMATICA', 'EJECUCION_PROGRAMATICA', 'PORCENTAJE_AVANCE_PROGRAMATICO', 'META_PRESUPUESTO', 'EJECUCION_PRESUPUESTO', 'PORCENTAJE_AVANCE_PRESUPUESTO','AÑO','MES','INDICADOR','TIPO_INDICADOR','RESULTADO','OBJETIVO_ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO','UBICACION', 'IMPLEMENTADOR', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'METAS';
    const properties = ['estNom', 'metMetTec', 'metEjeTec', 'metPorAvaTec', 'metMetPre', 'metEjePre', 'metPorAvaPre', 'metAnoPlaTec', 'metMesPlaTec', 'indActResNom', 'tipInd', 'resNom', 'objEspNom', 'objNom', 'subProNom', 'proNom','ubiNom', 'impNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir en el Excel
    const format = [1200, 600];

    const Export_Excel = () => {
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_Excel_Helper(dataExport, headers, title, properties);
    };
    const Export_PDF = () => {
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_PDF_Helper(dataExport, headers, title, properties, format);
    };

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
                navigatePath='form-goal'
                scrolled={true}
                resize={false}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                inputValue={inputValue}
                removeTag={removeTag}
                searchTags={searchTags}
                setSearchTags={setSearchTags}
                sums={sums}
                actionsColumnWidth={actionsColumnWidth}
                setActionsColumnWidth={setActionsColumnWidth}
                isLargePagination={true}
            />
            
        </>
    )
}

export default Table