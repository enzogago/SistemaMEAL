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
// 
import CryptoJS from 'crypto-js';
// Context
import { AuthContext } from '../../context/AuthContext';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../reusable/helper';
import CustomTable from '../reusable/Table/CustomTable';

const Table = ({ data }) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');

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
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF BENEFICIARIO`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL BENEFICIARIO`),
    };

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Código Único",
                accessorKey: "benCodUni",
                cell: ({row}) => (
                    <div className="">
                        {row.original.benCodUni}
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
                header: "Teléfono",
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
                item.benAno.includes(tag.toUpperCase()) ||
                item.benCod.includes(tag.toUpperCase()) ||
                item.benNom.includes(tag.toUpperCase()) ||
                item.benApe.includes(tag.toUpperCase()) ||
                item.benCorEle.includes(tag.toUpperCase()) ||
                item.benTel.includes(tag.toUpperCase()) ||
                item.benTelCon.includes(tag.toUpperCase()) ||
                (item.benSex === 'M' && 'MASCULINO'.includes(tag.toUpperCase())) ||
                (item.benSex === 'F' && 'FEMENINO'.includes(tag.toUpperCase()))
            )
        ), [data, searchTags]
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
    const title = 'BENEFICIARIO';  // El título de tu archivo
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
        <CustomTable 
            title='Beneficiarios'
            actions={actions} 
            dropdownOpen={dropdownOpen} 
            setDropdownOpen={setDropdownOpen} 
            Export_Excel={Export_Excel} 
            Export_PDF={Export_PDF} 
            table={table}
            navigatePath='form-beneficiarie'
            resize={false}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            inputValue={inputValue}
            removeTag={removeTag}
            searchTags={searchTags}
            setSearchTags={setSearchTags}
        />
    );
}

export default Table;
