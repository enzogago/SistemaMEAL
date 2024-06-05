import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { getMonthYearText, renderCellWithTooltip } from "../reusable/columns";
import { handleDelete } from "../reusable/fetchs";

export const getColumns = (actions, controller, openModal, setRefresh, handleEditNavigate) => {
    let baseColumns = [
        {
            header: "Financiador Principal",
            accessorKey: "subProSap",
            cell: ({row}) => renderCellWithTooltip([row.original.subProSap])
        },
        {
            header: "Sub Proyecto",
            accessorKey: "subProNom",
            cell: ({row}) => renderCellWithTooltip([row.original.subProSap, row.original.subProNom])
        },
        {
            header: "Proyecto",
            accessorKey: "proNom",
            cell: ({row}) => renderCellWithTooltip([row.original.proNom])
        },
        {
            header: "Código",
            accessorKey: "proIde",
            cell: ({row}) => renderCellWithTooltip([row.original.proIde])
        },
        {
            header: "Línea de Intervención",
            accessorKey: "proLinInt",
            cell: ({row}) => renderCellWithTooltip([row.original.proLinInt])
        },
        {
            header: "Responsable",
            accessorKey: "usuNom",
            cell: ({row}) => (
                `${row.original.usuNom} ${row.original.usuApe}`
            )
        },
        {
            header: "Periodo Inicio",
            accessorKey: "subProPerMesIni",
            cell: ({row}) => getMonthYearText(row.original.subProPerMesIni, row.original.subProPerAnoIni)
        },
        {
            header: "Periodo Fin",
            accessorKey: "subProPerMesFin",
            cell: ({row}) => getMonthYearText(row.original.subProPerMesFin, row.original.subProPerAnoFin)
        },
        {
            header: "Involucra Sub Acvtidad",
            accessorKey: "subProInvSubAct",
            cell: ({row}) => {
                const text = row.original.subProInvSubAct;
                return (
                    <>
                        {text === 'S' ? 'PROYECTO CON SUB ACTIVIDADES' : 'PROYECTO SIN SUB ACTIVIDADES'}
                    </>
                )
            },
        },
        {
            header: "FFVV",
            accessorKey: "subProFueVer",
            disableSorting: true,
            cell: ({row}) => {
                return (
                    <div className="flex jc-center ai-center" >
                        <button  
                            className="PowerMas_Add_Beneficiarie f_75 flex-grow-1" 
                            style={{padding: '0.25rem 0.75rem'}}
                            onClick={() => openModal(row.original)}
                        >
                            Documentación Formulación
                        </button>
                    </div>
                );
            },
        },
    ];

    if (actions.delete || actions.edit) {
        baseColumns.push({
            header: () => <div style={{textAlign: 'center', flexGrow: '1'}}>Acciones</div>,
            accessorKey: "actions",
            disableSorting: true,
            cell: ({row}) => (
                <div className='PowerMas_IconsTable flex jc-center ai-center'>
                     {actions.edit &&
                        <span
                            data-tooltip-id="edit-tooltip" 
                            data-tooltip-content="Editar" 
                            className='flex f1_25 p_25' 
                            onClick={() => handleEditNavigate(row.original)} 
                        >
                            <Edit />
                        </span>
                    }
                    {actions.delete &&
                        <span
                            data-tooltip-id="delete-tooltip" 
                            data-tooltip-content="Eliminar" 
                            className='flex f1_25 p_25'
                            onClick={() => handleDelete(controller, row.original, setRefresh)} 
                        >
                            <Delete />
                        </span>
                    }
                </div>
            ),
        });
    }
    
    return baseColumns;
};