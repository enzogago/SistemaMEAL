import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../../img/PowerMas_Pdf_Icon.svg';
// Componentes
import Pagination from "../../reusable/Pagination";
import TableRow from "./TableRow"
// Context
import { AuthContext } from "../../../context/AuthContext";
import Notiflix from "notiflix";
import CustomTable from "../../reusable/Table/CustomTable";
import { Export_Excel_Helper, Export_PDF_Helper } from "../../reusable/helper";
import { handleDeleteBeneficiarioMeta } from "./eventHandlers";

const TableForm = ({data, closeModal, metAno, metCod, updateData, setUpdateData }) => {
    
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');


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

    const actions = {
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF META`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL META`),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR META"),
    };

    const [sorting, setSorting] = useState([]);


    // Filtra los datos por todas las etiquetas
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
                item.benCod.includes(tag.toUpperCase()) ||
                item.benNom.includes(tag.toUpperCase()) ||
                item.benApe.includes(tag.toUpperCase()) ||
                item.benCodUni.includes(tag.toUpperCase()) ||
                item.benCorEle.includes(tag.toUpperCase()) ||
                item.benTel.includes(tag.toUpperCase()) ||
                item.benTelCon.includes(tag.toUpperCase())
            )
        ), [data, searchTags]
    );

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Codigo",
                accessorKey: "benCod",
            },
            {
                header: "Nombre",
                accessorKey: "benNom",
            },
            {
                header: "Apellido",
                accessorKey: "benApe",
            },
            {
                header: "CUB",
                accessorKey: "benCodUni",
            },
            {
                header: "Correo",
                accessorKey: "benCorEle",
            },
            {
                header: "Teléfono",
                accessorKey: "benTel",
            },
            {
                header: "Contacto",
                accessorKey: "benTelCon",
            },
            {
                header: "Ubicación",
                accessorKey: "ubiNom",
            },
        ];

        baseColumns = baseColumns.filter(column => 
            data.some(item => item[column.accessorKey] !== null)
        );

        if (actions.delete) {
            baseColumns.push({
                header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>Acciones</div>,
                accessorKey: "acciones",
                disableSorting: true,
                cell: ({row}) => (
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDeleteBeneficiarioMeta('Monitoreo',row.original.benAno,row.original.benCod,row.original.ubiAno,row.original.ubiCod,metAno,metCod, updateData, setUpdateData)} 
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
     let dataExport = [...table.options.data]; 
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

    return (
        <>
            <CustomTable 
                actions={actions} 
                dropdownOpen={dropdownOpen} 
                setDropdownOpen={setDropdownOpen} 
                Export_Excel={Export_Excel} 
                Export_PDF={Export_PDF} 
                table={table}
                navigatePath='form-goal'
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

export default TableForm