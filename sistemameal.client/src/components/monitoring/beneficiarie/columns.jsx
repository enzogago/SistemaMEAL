import Delete from "../../../icons/Delete";
import Edit from "../../../icons/Edit";
import masculino from '../../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../../img/PowerMas_Avatar_Femenino.svg';
import { getMonthYearText, renderCellWithTooltip, tipoIndicadorMapping } from "../../reusable/columns";
import { handleDelete } from "../../reusable/fetchs";


export const getColumns = (actions, openModalForm, setRefresh) => {
    let baseColumns = [
        {
            header: "",
            accessorKey: "avatar",
            disableSorting: true,
            cell: ({row}) => {
                const ben = row.original;
                return (
                    <div className="PowerMas_ProfilePicture2 m_25" style={{width: '35px', height: '35px', border: `2px solid ${ben && (ben.benSex === 'M' ? '#20737b' : '#E5554F')}`}}>
                        <img src={ben && (ben.benSex === 'M' ? masculino : femenino)} alt="Avatar" />
                    </div>
                )
            }
        },
        {
            header: "CUB",
            accessorKey: "benCodUni"
        },
        {
            header: "Tipo de Documento",
            accessorKey: "docIdeNom"
        },
        {
            header: "Nombres",
            accessorKey: "benNom"
        },
        {
            header: "Apellidos",
            accessorKey: "benApe"
        },
        {
            header: "Sexo",
            accessorKey: "benSex",
            cell: ({row}) => {
                const text = row.original.benSex;
                return (
                    <>
                        {text === 'M' ? 'MASCULINO' : 'FEMENINO'}
                    </>
                )
            },
        },
        {
            header: "Género",
            accessorKey: "genNom"
        },
        {
            header: "Fecha Nacimiento",
            accessorKey: "benFecNac",
        },
        {
            header: "Nacionalidad",
            accessorKey: "nacNom"
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
            accessorKey: "benTelCon"
        },
        {
            header: "Dirección",
            accessorKey: "benDir"
        },
        {
            header: "Nombre Apoderado",
            accessorKey: "benNomApo"
        },
        {
            header: "Apellido Apoderado",
            accessorKey: "benApeApo"
        },
        {
            header: "Edad Ejecutada",
            accessorKey: "metBenEda",
            cell: ({row}) => (
                <span className="flex jc-center">
                    {row.original.metBenEda}
                </span>
            )
        },
        {
            header: "Periodo Ejecutado",
            accessorKey: "metBenAnoEjeTec",
            cell: ({row}) => getMonthYearText(row.original.metBenMesEjeTec, row.original.metBenAnoEjeTec)
        },
        {
            header: "Ubicación Ejecutada",
            accessorKey: "ubiNom",
        },
        {
            header: "Actividad o Indicador",
            accessorKey: "indNom",
            cell: ({row}) => renderCellWithTooltip([row.original.indNum, row.original.indNom])
        },
        {
            header: "Tipo",
            accessorKey: "indTipInd",
            cell: ({row}) => tipoIndicadorMapping[row.original.indTipInd].toUpperCase()
        },
        {
            header: "Resultado",
            accessorKey: "resNum",
            cell: ({row}) => {
                if (row.original.resNum == 'NA' && row.original.resNom == 'NA' ) {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.resNum, row.original.resNom]);
                }
            }
        },
        {
            header: "Objetivo Específico",
            accessorKey: "objEspNum",
            cell: ({row}) => {
                if (row.original.objEspNum == 'NA' && row.original.objEspNom == 'NA') {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.objEspNum, row.original.objEspNom]);
                }
            }
        },
        {
            header: "Objetivo",
            accessorKey: "objNum",
            cell: ({row}) => {
                if (row.original.objNum == 'NA' && row.original.objNom == 'NA') {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.objNum, row.original.objNom]);
                }
            }
        },
        {
            header: "Sub Proyecto",
            accessorKey: "subProNom",
            cell: ({row}) => renderCellWithTooltip([row.original.subProSap, row.original.subProNom])
        },
        {
            header: "Proyecto",
            accessorKey: "proNom",
            cell: ({row}) => renderCellWithTooltip([row.original.proIde, row.original.proNom])
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
                            onClick={() => openModalForm(row.original)} 
                        >
                            <Edit />
                        </span>
                    }
                    {actions.delete &&
                        <span
                            data-tooltip-id="delete-tooltip" 
                            data-tooltip-content="Eliminar" 
                            className='flex f1_25 p_25'
                            onClick={() => handleDelete('Monitoreo/eliminar-beneficiario', row.original, setRefresh)} 
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

export const getColumnsExecuting = (actions, openModalForm, setRefresh) => {
    let baseColumns = [
        {
            header: "Periodo Ejecutado",
            accessorKey: "metEjeAnoEjeTec",
            cell: ({row}) => getMonthYearText(row.original.metEjeMesEjeTec, row.original.metEjeAnoEjeTec)
        },
        {
            header: "Ubicación Ejecutada",
            accessorKey: "ubiNom",
        },
        {
            header: "Ejecución",
            accessorKey: "metEjeVal",
            cell: ({row}) => <span className="flex jc-center">{row.original.metEjeVal}</span>
        },
        {
            header: "Detalle",
            accessorKey: "metEjeDet",
        },
        {
            header: "Actividad o Indicador",
            accessorKey: "indNom",
            cell: ({row}) => renderCellWithTooltip([row.original.indNum, row.original.indNom])
        },
        {
            header: "Tipo",
            accessorKey: "indTipInd",
            cell: ({row}) => tipoIndicadorMapping[row.original.indTipInd].toUpperCase()
        },
        {
            header: "Resultado",
            accessorKey: "resNum",
            cell: ({row}) => {
                if (row.original.resNum == 'NA' && row.original.resNom == 'NA' ) {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.resNum, row.original.resNom]);
                }
            }
        },
        {
            header: "Objetivo Específico",
            accessorKey: "objEspNum",
            cell: ({row}) => {
                if (row.original.objEspNum == 'NA' && row.original.objEspNom == 'NA') {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.objEspNum, row.original.objEspNom]);
                }
            }
        },
        {
            header: "Objetivo",
            accessorKey: "objNum",
            cell: ({row}) => {
                if (row.original.objNum == 'NA' && row.original.objNom == 'NA') {
                    return '';
                } else {
                    return renderCellWithTooltip([row.original.objNum, row.original.objNom]);
                }
            }
        },
        {
            header: "Sub Proyecto",
            accessorKey: "subProNom",
            cell: ({row}) => renderCellWithTooltip([row.original.subProSap, row.original.subProNom])
        },
        {
            header: "Proyecto",
            accessorKey: "proNom",
            cell: ({row}) => renderCellWithTooltip([row.original.proIde, row.original.proNom])
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
                            onClick={() => openModalForm(row.original)} 
                        >
                            <Edit />
                        </span>
                    }
                    {actions.delete &&
                        <span
                            data-tooltip-id="delete-tooltip" 
                            data-tooltip-content="Eliminar" 
                            className='flex f1_25 p_25'
                            onClick={() => handleDelete('Meta/goal-execution', row.original, setRefresh)} 
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
