import { useContext, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Componentes
import { AuthContext } from '../../../context/AuthContext';
import { Export_Excel_Helper, Export_PDF_Helper, handleDeleteMant, orthographicCorrections } from '../helper';
import CustomTable from './CustomTable';
import Edit from '../../../icons/Edit';
import Delete from '../../../icons/Delete';

const Table = ({ data, openModal, setData, controller, fieldMapping, title, resize, isLargePagination=false,format='A4',filterProperties }) => {
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
            const correctedHeader = orthographicCorrections[field] || field;
            return {
                header: correctedHeader,
                accessorKey: fieldMapping[field],
                cell: ({row}) => {
                    let text = row.original[fieldMapping[field]];
                    if (fieldMapping[field] === 'uniInvPer') {
                        if (text === 'S') {
                            return 'SI';
                        } else {
                            return 'NO';
                        }
                    } else if (field === 'color') {
                        return (
                            <div style={{color: text}}>
                                {text}
                            </div>
                        );
                    } else if (field === 'Objetivo') {
                        const text = row.original.objNum + ' - ' + row.original.objNom.charAt(0).toUpperCase() + row.original.objNom.slice(1);
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
                    } else if (field === 'Objetivo Específico') {
                        const text = row.original.objEspNum + ' - ' + row.original.objEspNom.charAt(0).toUpperCase() + row.original.objEspNom.slice(1);
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
                    } else if (field === 'Resultado') {
                        const text = row.original.resNum + ' - ' + row.original.resNom.charAt(0).toUpperCase() + row.original.resNom.slice(1);
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
                    } else if (field === 'Actividad') {
                        if (row.original.actNom === 'NA') {
                            return '';
                        } else {
                            const text = row.original.actNum + ' - ' + row.original.actNom.charAt(0).toUpperCase() + row.original.actNom.slice(1);
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
                    } else if (field === 'Subproyecto') {
                        return row.original.subProSap + ' - ' + row.original.subProNom.charAt(0).toUpperCase() + row.original.subProNom.slice(1);
                    } else if (field === 'Periodo Inicio') {
                        return <div style={{textTransform: 'capitalize'}}>{row.original.subProPerMesIniNombre + ' - ' +  row.original.subProPerAnoIni }</div>;
                    } else if (field === 'Periodo Fin') {
                        return <div style={{textTransform: 'capitalize'}}>{row.original.subProPerMesFinNombre + ' - ' +  row.original.subProPerAnoFin }</div>;
                    } else if (field === 'Responsable') {
                        return <div style={{textTransform: 'capitalize'}}>{ text }</div>;
                    } else if (field === 'Tipo de Indicador') {
                        return <div style={{textTransform: 'capitalize'}}>{ row.original.indTipIndNombre }</div>;
                    } else if (field === 'codigo') {
                        return <div>{ text }</div>;
                    } else {
                        text = text.charAt(0).toUpperCase() + text.slice(1);
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
                            <span
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='flex f1_25 p_25' 
                                onClick={() => openModal(row.original)} 
                            >
                                <Edit />
                            </span>
                        }
                        {actions.delete &&
                            <span
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='flex f1_25 p_25'
                                onClick={() => handleDeleteMant(controller, row.original, setData)} 
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
    
    const tipoIndicadorMapping = {
        'IRE': 'Indicador de Resultado',
        'IAC': 'Indicador de Actividad',
        'IOB': 'Indicador de Objetivo',
        'IOE': 'Indicador de Objetivo Específico',
        'ISA': 'Indicador de Sub Actividad',
    };

    data.forEach(item => {
        if (item.subProPerMesFin && item.subProPerMesIni) {
            item.subProPerMesFinNombre = (new Date(2024, item.subProPerMesFin - 1).toLocaleString('es-ES', { month: 'long' })).toUpperCase();
            item.subProPerMesIniNombre = (new Date(2024, item.subProPerMesIni - 1).toLocaleString('es-ES', { month: 'long' })).toUpperCase();
        }
        if (item.indTipInd) {
            console.log(item.indTipInd)
            item.indTipIndNombre = tipoIndicadorMapping[item.indTipInd].toUpperCase();
        }
    });
    

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            Object.keys(filterProperties).some(field => { 
                if (!item.hasOwnProperty(filterProperties[field]) || item[filterProperties[field]] === null) {
                    return false;
                }
                let value = item[filterProperties[field]];
                return value.toUpperCase().includes(searchFilter.toUpperCase());
            })
        ), [data, searchFilter]
    );


    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: isLargePagination ? 100 : 10, //default page size
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
    /* END TANSTACK */

    // Preparar los datos
    const dataExport = table.options.data;
    const titleExport = title.toUpperCase();  // El título de tu archivo
    const headers = Object.keys(filterProperties).map(field => field.toUpperCase()).concat(['USUARIO_MODIFICADO', 'FECHA_MODIFICADO']);
    const properties = Object.values(filterProperties).concat(['usuMod', 'fecMod']);

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
            isLargePagination={isLargePagination}
        />
    );
}

export default Table;
