import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";

export const getColumns = (actions) => {
    let baseColumns = [
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
            cell: ({row}) => {
                const text = row.original.benCorEle.toLowerCase();
                return (
                    <div>
                        {text}
                    </div>
                )
            }
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
                            // onClick={() => openModal(row.original)} 
                        >
                            <Edit />
                        </span>
                    }
                    {actions.delete &&
                        <span
                            data-tooltip-id="delete-tooltip" 
                            data-tooltip-content="Eliminar" 
                            className='flex f1_25 p_25'
                            // onClick={() => handleDelete(controller, row.original, setRefresh)} 
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
