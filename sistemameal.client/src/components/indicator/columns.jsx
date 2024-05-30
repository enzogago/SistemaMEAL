import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { getMonthYearText, renderCellWithTooltip } from "../reusable/columns";
import { handleDelete } from "../reusable/fetchs";

const tipoIndicadorMapping = {
    'IRE': 'Indicador de Resultado',
    'IAC': 'Indicador de Actividad',
    'IOB': 'Indicador de Objetivo',
    'IOE': 'Indicador de Objetivo Específico',
    'ISA': 'Indicador de Sub Actividad',
};

export const getColumns = (actions, controller, openModal, setRefresh) => {
    let baseColumns = [
        {
            header: "Código",
            accessorKey: "indNum"
        },
        {
            header: "Nombre",
            accessorKey: "indNom",
            cell: ({row}) => renderCellWithTooltip([row.original.indNom])
        },
        {
            header: "Tipo",
            accessorKey: "indTipInd",
            cell: ({row}) => tipoIndicadorMapping[row.original.indTipInd].toUpperCase()
        },
        {
            header: "Unidad",
            accessorKey: "uniNom",
        },
        {
            header: "Tipo Valor",
            accessorKey: "tipValNom"
        },
        {
            header: "Fórmula",
            accessorKey: "indFor"
        },
        {
            header: "Resultado",
            accessorKey: "resNum",
            cell: ({row}) => {
                if (row.original.resNum == 'NA') {
                    return '';
                } else {
                    renderCellWithTooltip([row.original.resNum, row.original.resNom]);
                }
            }
        },
        {
            header: "Objetivo Específico",
            accessorKey: "objEspNum",
            cell: ({row}) => {
                if (row.original.objEspNum == 'NA') {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.objEspNum, row.original.objEspNom]);
                }
            }
        },
        {
            header: "Objetivo",
            accessorKey: "objNum",
            cell: ({row}) => renderCellWithTooltip([row.original.objNum, row.original.objNom])
        },
        {
            header: "Sub Proyecto",
            accessorKey: "subProNom",
            cell: ({row}) => renderCellWithTooltip([row.original.subProNom])
        },
        {
            header: "Proyecto",
            accessorKey: "proNom",
            cell: ({row}) => renderCellWithTooltip([row.original.proNom])
        },
        {
            header: "Responsable",
            accessorKey: "subProRes"
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