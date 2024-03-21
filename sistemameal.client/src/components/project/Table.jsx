import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
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
import { handleDelete } from "./eventHandlers";


const Table = ({data = [], setData, openModal}) => {
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
                accessorKey: "proNom",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.proNom.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Descripción",
                accessorKey: "proDes",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.proDes.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Responsable",
                accessorKey: "proRes",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.proRes.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Periodo Inicio",
                accessorKey: "proPerAnoIni",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>{row.original.proPerMesIniNombre + ' - ' +  row.original.proPerAnoIni }</div>
                    );
                },
            },
            {
                header: "Periodo Fin",
                accessorKey: "proPerAnoFin",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>{row.original.proPerMesFinNombre + ' - ' +  row.original.proPerAnoFin }</div>
                    );
                },
            },
            {
                header: "Involucra Sub Acvtidad",
                accessorKey: "proInvSubAct",
                cell: ({row}) => {
                    return (
                        <>{row.original.proInvSubActNombre}</>
                    );
                },
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
                                onClick={() => openModal(row.original)} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDelete('Proyecto',row.original, setData)} 
                            />
                        }
                    </div>
                ),
            });
        }

        return baseColumns;
    }, [actions]);

    data.forEach(item => {
        item.proPerMesFinNombre = new Date(2024, item.proPerMesFin - 1).toLocaleString('es-ES', { month: 'long' });
        item.proPerMesIniNombre = new Date(2024, item.proPerMesIni - 1).toLocaleString('es-ES', { month: 'long' });
        item.proInvSubActNombre = item.proInvSubAct === 'S' ? 'Proyecto con Sub Actividades' : 'Proyecto con Sub Actividades';
    });

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
            (item.proAno ? item.proAno.includes(tag.toUpperCase()) : false) ||
            (item.proCod ? item.proCod.includes(tag.toUpperCase()) : false) ||
            (item.proNom ? item.proNom.includes(tag.toUpperCase()) : false) ||
            (item.proRes ? item.proRes.includes(tag.toUpperCase()) : false) ||
            (item.proPerAnoFin ? item.proPerAnoFin.includes(tag.toUpperCase()) : false) ||
            (item.proPerAnoIni ? item.proPerAnoIni.includes(tag.toUpperCase()) : false) ||
            (item.proPerMesFinNombre ? item.proPerMesFinNombre.toUpperCase().includes(tag.toUpperCase()) : false) ||
            (item.proPerMesIniNombre ? item.proPerMesIniNombre.toUpperCase().includes(tag.toUpperCase()) : false) ||
            (item.proInvSubActNombre ? item.proInvSubActNombre.toUpperCase().includes(tag.toUpperCase()) : false) 
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
        proInvSubAct: item.proInvSubAct === 'S' ? 'SI' : 'NO',

    }));
    const headers = ['AÑO', 'CODIGO', 'NOMBRE', 'RESPONSABLE','AÑO_INICIO','MES_INICIO','AÑO_FIN','MES_FIN','INVOLUCRA_SUB_ACTIVIDAD', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'PROYECTOS';  // El título de tu archivo
    const properties = ['proAno', 'proCod', 'proNom', 'proRes', 'proPerAnoIni', 'proPerMesIni', 'proPerAnoFin', 'proPerMesFin', 'proInvSubAct', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
    const format = 'a3';  // El tamaño del formato que quieres establecer para el PDF

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
            resize={false}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            inputValue={inputValue}
            removeTag={removeTag}
            searchTags={searchTags}
            setSearchTags={setSearchTags}
            openModal={openModal}
        />
    )
}

export default Table