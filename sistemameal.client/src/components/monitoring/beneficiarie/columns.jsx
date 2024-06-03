import Delete from "../../../icons/Delete";
import Edit from "../../../icons/Edit";
import masculino from '../../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../../img/PowerMas_Avatar_Femenino.svg';
import { getMonthYearText } from "../../reusable/columns";
import { handleDelete } from "../../reusable/fetchs";

export const getColumns = (actions, openModalForm, setUpdate) => {
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
            header: "Nombre",
            accessorKey: "benNom"
        },
        {
            header: "Apellido",
            accessorKey: "benApe"
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
            header: "Edad Ejecutada",
            accessorKey: "metBenEda",
            cell: ({row}) => (
                <span className="flex jc-center">
                    {row.original.metBenEda}
                </span>
            )
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
            header: "Género",
            accessorKey: "genNom"
        },
        {
            header: "Nacionalidad",
            accessorKey: "nacNom"
        },
        {
            header: "Ubicación",
            accessorKey: "ubiNom",
        },
        {
            header: "Ejecución",
            accessorKey: "metBenAnoEjeTec",
            cell: ({row}) => getMonthYearText(row.original.metBenMesEjeTec, row.original.metBenAnoEjeTec)
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
                            onClick={() => handleDelete('Monitoreo/eliminar-beneficiario', row.original, setUpdate)} 
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
