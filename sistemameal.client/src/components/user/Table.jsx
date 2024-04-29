import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Context
import { AuthContext } from '../../context/AuthContext';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper } from '../reusable/helper';
// Componentes
import Modal from "../layout/Modal";
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import CustomTable from "../reusable/Table/CustomTable";
import { handleDelete } from "./eventHandlers";
import Edit from "../../icons/Edit";
import Delete from "../../icons/Delete";

const Table = ({data, setUsersTable}) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');

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
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF USUARIO`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL USUARIO`),
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
                        <div className="PowerMas_ProfilePicture2 m_25" style={{width: '35px', height: '35px', border: `2px solid ${user && (user.usuEst === 'A' ? '#20737b' : '#E5554F')}`}}>
                            <img src={user && (user.usuSex === 'M' ? masculino : femenino)} alt="Descripción de la imagen" />
                        </div>
                    )
                }
            },
            {
                header: "Estado",
                accessorKey: "usuEst",
                cell: ({row}) => {
                    const text = row.original.usuEst === 'A' ? 'ACTIVO' : 'INACTIVO';
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
                    const text = row.original.docIdeAbr + ' ' + row.original.usuNumDoc + ' - ' + row.original.usuNom + ' ' + row.original.usuApe;
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
                header: "Ubicación",
                accessorKey: "ubiNom",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {row.original.ubiNom}
                        </div>
                    )
                }
            },
            {
                header: "Correo",
                accessorKey: "usuCorEle",
                cell: ({row}) => {
                    const text = row.original.usuCorEle;
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
                    const text = row.original.carNom.charAt(0).toUpperCase() + row.original.carNom.slice(1);
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
                    const text = row.original.rolNom.charAt(0).toUpperCase() + row.original.rolNom.slice(1);
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
                disableSorting: true,
                stickyRight: 90,
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

        // if (actions.delete || actions.edit) {
        if (true) {
            baseColumns.push({
                header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>Acciones</div>,
                accessorKey: "acciones",
                disableSorting: true,
                stickyRight: 0,
                cell: ({row}) => (
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {/* {actions.edit && */}
                        {true &&
                            <span
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='flex f1_5 p_25' 
                                onClick={() => Editar_Usuario(row)} 
                            >
                                <Edit />
                            </span>
                        }
                        {actions.delete &&
                            <span
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='flex f1_5 p_25'
                                onClick={() => handleDelete(row.original.usuAno, row.original.usuCod, setUsersTable)} 
                            >
                                <Delete />
                            </span>
                        }
                    </div>
                ),
            });
        }

        return baseColumns;
    }, [actions]);

    
    
    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
    data.filter(item => 
        searchTags.every(tag =>
            item.usuNom.includes(tag.toUpperCase()) ||
            item.usuApe.includes(tag.toUpperCase()) ||
            item.usuCorEle.includes(tag.toUpperCase()) ||
            item.usuFecNac.includes(tag.toUpperCase()) ||
            item.usuTel.includes(tag.toUpperCase()) ||
            item.usuNumDoc.includes(tag.toUpperCase()) ||
            item.docIdeAbr.includes(tag.toUpperCase()) ||
            item.carNom.includes(tag.toUpperCase()) ||
            item.rolNom.includes(tag.toUpperCase()) ||
            item.usuEst.includes(tag.toUpperCase()) ||
            item.ubiNom.includes(tag.toUpperCase()) ||
            (item.usuEst === 'A' && 'ACTIVO'.includes(tag.toUpperCase())) ||
            (item.usuEst === 'I' && 'INACTIVO'.includes(tag.toUpperCase()))
        )
    ), [data, searchTags]
);

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
    let dataExport = table.options.data;  // Tus datos

    // Transformar los datos
    dataExport = dataExport.map(item => {
        return {
            ...item,
            usuEst: item.usuEst === 'A' ? 'ACTIVO' : 'INACTIVO'
        };
    });
    const headers = ['ESTADO','DOCUMENTO','NUMERO_DOCUMENTO','NOMBRE', 'APELLIDO', 'NACIMIENTO', 'CORREO', 'PAÍS', 'TELEFONO', 'CARGO', 'ROL', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'USUARIO';  // El título de tu archivo
    const properties = ['usuEst','docIdeNom','usuNumDoc','usuNom', 'usuApe', 'usuFecNac', 'usuCorEle', 'ubiNom', 'usuTel', 'carNom', 'rolNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
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
    
    return (
        <>
            <CustomTable 
                title='Usuarios'
                actions={actions} 
                dropdownOpen={dropdownOpen} 
                setDropdownOpen={setDropdownOpen} 
                Export_Excel={Export_Excel} 
                Export_PDF={Export_PDF} 
                table={table}
                navigatePath='form-user'
                resize={false}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                inputValue={inputValue}
                removeTag={removeTag}
                searchTags={searchTags}
                setSearchTags={setSearchTags}
                isLargePagination={true}
            />
            <Modal 
                isOpen={isOpen}
                closeModal={closeModal}
                user={selectedUser}
            />
        </>
    )
}

export default Table