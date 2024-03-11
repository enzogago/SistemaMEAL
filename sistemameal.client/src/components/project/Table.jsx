import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Iconos package
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper } from '../reusable/helper';
// Componentes
import { AuthContext } from "../../context/AuthContext";
import CustomTable from "../reusable/Table/CustomTable";


const Table = ({data = []}) => {
    const navigate = useNavigate();
    console.log(data)
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');

     /* TANSTACK */
     const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR PROYECTO"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR PROYECTO"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR PROYECTO"),
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF PROYECTO`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL PROYECTO`),
    };
    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Nombre",
                accessorKey: "proNom"
            },
            {
                header: "Periodo Inicio",
                accessorKey: "proPerAnoIni",
                cell: ({row}) => {
                    return (
                        <>{row.original.proPerAnoIni + ' - ' + row.original.proPerMesIni}</>
                    );
                },
            },
            {
                header: "Periodo Fin",
                accessorKey: "proPerAnoFin",
                cell: ({row}) => {
                    return (
                        <>{row.original.proPerAnoFin + ' - ' + row.original.proPerMesFin}</>
                    );
                },
            },
            {
                header: "Responsable",
                accessorKey: "proRes"
            },
        ];

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
                                onClick={() => Editar_Proyecto(row)} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                // onClick={() => Eliminar_Meta_Indicador(row.original)} 
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
            item.proAno.includes(tag.toUpperCase()) ||
            item.proCod.includes(tag.toUpperCase()) ||
            item.proNom.includes(tag.toUpperCase()) ||
            item.proRes.includes(tag.toUpperCase()) ||
            item.proPer.includes(tag.toUpperCase()) 
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
            title='Proyectos'
            actions={actions} 
            dropdownOpen={dropdownOpen} 
            setDropdownOpen={setDropdownOpen} 
            Export_Excel={Export_Excel} 
            Export_PDF={Export_PDF} 
            table={table}
            navigatePath='form-project'
            resize={false}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            inputValue={inputValue}
            removeTag={removeTag}
            searchTags={searchTags}
            setSearchTags={setSearchTags}
        />
    )
}

export default Table