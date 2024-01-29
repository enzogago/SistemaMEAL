import { useContext, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Iconos package
import { FaEdit , FaRegTrashAlt } from 'react-icons/fa';
// Context
import { AuthContext } from '../../context/AuthContext';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../reusable/helper';
// Componentes
import CustomTable from '../reusable/CustomTable';

const Table = ({ data, openModal, setRoles }) => {
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    /* TANSTACK */
    const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR ROL"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR ROL"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR ROL"),
    };

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Código",
                accessorKey: "rolCod",
            },
            {
                header: "Nombre",
                accessorKey: "rolNom",
            }
        ];
    
        if (actions.delete || actions.edit) {
            baseColumns.push({
                header: "Acciones",
                accessorKey: "acciones",
                cell: ({row}) => (
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {actions.delete && <FaTrash className='Large-p_25' onClick={() => handleDelete('Rol', row.original.rolCod, setRoles, setIsLoggedIn)} />}
                        {actions.edit && <FaPenNib className='Large-p_25' onClick={() => openModal(row.original)} />}
                    </div>
                ),
            });
        }
    
        return baseColumns;
    }, [actions]);

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            item.rolCod.includes(searchFilter.toUpperCase()) ||
            item.rolNom.includes(searchFilter.toUpperCase())
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
    const dataExport = table.options.data;  // Tus datos
    const headers = ['CODIGO', 'NOMBRE', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'ROLES';  // El título de tu archivo
    const properties = ['rolCod', 'rolNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
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
        <CustomTable 
            title="Listado de Roles" 
            searchFilter={searchFilter} 
            setSearchFilter={setSearchFilter} 
            actions={actions} 
            openModal={openModal} 
            dropdownOpen={dropdownOpen} 
            setDropdownOpen={setDropdownOpen} 
            Export_Excel={Export_Excel} 
            Export_PDF={Export_PDF} 
            table={table}
        />
    )
}

export default Table