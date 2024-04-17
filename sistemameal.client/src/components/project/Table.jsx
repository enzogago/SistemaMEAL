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
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                header: "Código",
                accessorKey: "proIde",
            },
            {
                header: "Linea de Intervención",
                accessorKey: "proLinInt",
            },
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

    

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            (item.proNom ? item.proNom.includes(searchFilter.toUpperCase()) : false) ||
            (item.proDes ? item.proRes.includes(searchFilter.toUpperCase()) : false) ||
            (item.proIde ? item.proIde.includes(searchFilter.toUpperCase()) : false)
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
        proInvSubAct: item.proInvSubAct === 'S' ? 'SI' : 'NO',

    }));
    const headers = ['CODIGO', 'NOMBRE', 'DESCRIPCION', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'PROYECTOS';  // El título de tu archivo
    const properties = ['proIde', 'proNom', 'proDes', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
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
            searchFilter={searchFilter} 
            setSearchFilter={setSearchFilter} 
            openModal={openModal}
        />
    )
}

export default Table