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
import { Export_Excel_Helper, Export_PDF_Helper, handleDeleteMant, orthographicCorrections } from '../helper';
import CustomTable from './CustomTable';

const Table = ({ data, openModal, setData, controller, fieldMapping, title, resize }) => {
    console.log(data)
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
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF ${controller.toUpperCase()}`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL ${controller.toUpperCase()}`),
    };

    const columns = useMemo(() => {
        let baseColumns = Object.keys(fieldMapping).map(field => {
            // Usa el objeto de mapeo para obtener la versión corregida ortográficamente de la palabra
            const correctedHeader = orthographicCorrections[field.toLowerCase()] || field;
            return {
                header: correctedHeader,
                accessorKey: fieldMapping[field],
                cell: ({row}) => {
                    let text = row.original[fieldMapping[field]];
                    if (field === 'involucra') {
                        text = text === 'S' ? 'Si' : 'No';
                    } else if (field === 'color') {
                        return (
                            <div style={{color: text}}>
                                {text}
                            </div>
                        );
                    } else {
                        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                        const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                        if(text.length >= 60){
                            return (
                                <>
                                    <span 
                                        data-tooltip-id="info-tooltip" 
                                        data-tooltip-content={text} 
                                    >{shortText}</span>
                                </>
                            );
                        } else {
                            return text;
                        }
                    }
                },
            };
        });
    
        if (actions.delete || actions.edit) {
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
                                onClick={() => handleDeleteMant(controller, row.original, setData)} 
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
            Object.keys(fieldMapping).some(field => {
                let value = item[fieldMapping[field]].toUpperCase();
                if (field === 'involucra') {
                    value = value === 'S' ? 'SI' : 'NO';
                }
                return value.includes(searchFilter.toUpperCase());
            })
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
    const titleExport = controller.toUpperCase();  // El título de tu archivo
    const headers = Object.keys(fieldMapping).map(field => field.toUpperCase()).concat(['USUARIO_MODIFICADO', 'FECHA_MODIFICADO']);
    const properties = Object.values(fieldMapping).concat(['usuMod', 'fecMod']);
    const format = 'a4';  // El tamaño del formato que quieres establecer para el PDF

    const Export_Excel = () => {
        // Luego puedes llamar a la función Export_Excel_Helper de esta manera:
        Export_Excel_Helper(dataExport, headers, titleExport, properties);
        setDropdownOpen(false);
    };

    const Export_PDF = () => {
        // Luego puedes llamar a la función Export_PDF_Helper de esta manera:
        Export_PDF_Helper(dataExport, headers, titleExport, properties, format);
        setDropdownOpen(false);
    };

    
    return (
        <CustomTable 
            title={title}
            searchFilter={searchFilter} 
            setSearchFilter={setSearchFilter} 
            actions={actions} 
            openModal={openModal} 
            dropdownOpen={dropdownOpen}
            resize={resize}
            setDropdownOpen={setDropdownOpen} 
            Export_Excel={Export_Excel} 
            Export_PDF={Export_PDF} 
            table={table}
        />
    );
}

export default Table;
