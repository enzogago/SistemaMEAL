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
// Funciones reusables
// Componentes
import { AuthContext } from '../../../context/AuthContext';
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../helper';
import CustomTable from './CustomTable';

const Table = ({ data, openModal, setData, controller, fieldMapping }) => {
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    /* TANSTACK */
    const actions = {
        add: userPermissions.some(permission => permission.perNom === `INSERTAR ${controller.toUpperCase()}`),
        delete: userPermissions.some(permission => permission.perNom === `ELIMINAR ${controller.toUpperCase()}`),
        edit: userPermissions.some(permission => permission.perNom === `MODIFICAR ${controller.toUpperCase()}`),
    };

    const columns = useMemo(() => {
        let baseColumns = Object.keys(fieldMapping).map(field => ({
            header: field,
            accessorKey: fieldMapping[field],
            cell: ({row}) => {
                let text = row.original[fieldMapping[field]];
                if (field === 'involucra') {
                    text = text === 'S' ? 'Sí' : 'No';
                } else if (field === 'color') {
                    return (
                        <div style={{color: text}}>
                            {text}
                        </div>
                    );
                } else {
                    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                }
                return text;
            },
        }));
    
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
                                onClick={() => openModal(row.original)} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDelete(controller, row.original[fieldMapping.codigo], setData)} 
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
            Object.keys(fieldMapping).some(field =>
                item[fieldMapping[field]].toUpperCase().includes(searchFilter.toUpperCase())
            )
        ), [data, searchFilter, fieldMapping]
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
    const title = controller.toUpperCase() + 'S';  // El título de tu archivo
    const headers = Object.keys(fieldMapping).map(field => field.toUpperCase()).concat(['USUARIO_MODIFICADO', 'FECHA_MODIFICADO']);
    const properties = Object.values(fieldMapping).concat(['usuMod', 'fecMod']);
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
            title={controller}
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
    );
}

export default Table;
