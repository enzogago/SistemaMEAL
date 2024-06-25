import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { handleDelete } from "../reusable/fetchs";
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';

export const getColumns = (actions, controller, openModal, setRefresh, handleEditNavigate) => {
    let baseColumns = [
        {
            header: "",
            accessorKey: "avatar",
            disableSorting: true,
            cell: ({row}) => {
                const user = row.original;
                return (
                    <div className="PowerMas_ProfilePicture2 m_25" style={{width: '35px', height: '35px', border: `2px solid ${user && (user.usuEst === 'A' ? '#20737b' : '#E5554F')}`}}>
                        <img src={user && (user.usuSex === 'M' ? masculino : femenino)} alt="Descripción de la imagen" />
                    </div>
                )
            }
        },
        {
            header: "Estado",
            accessorKey: "usuEst",
            cell: ({row}) => {
                const text = row.original.usuEst === 'A' ? 'ACTIVO' : 'INACTIVO';
                return (text)
            }
        },
        {
            header: "Nombre Completo",
            accessorKey: "usuNom",
            cell: ({row}) => {
                const text = row.original.docIdeAbr + ' ' + row.original.usuNumDoc + ' - ' + row.original.usuNom + ' ' + row.original.usuApe;
                return (text)
            }
        },
        {
            header: "Fecha Nacimiento",
            accessorKey: "usuFecNac",
        },
        {
            header: "Ubicación",
            accessorKey: "ubiNom",
        },
        {
            header: "Correo",
            accessorKey: "usuCorEle",
        },
        {
            header: "País",
            accessorKey: "ubiNom",
        },
        {
            header: "Teléfono",
            accessorKey: "usuTel",
        },
        {
            header: "Cargo",
            accessorKey: "carNom",
        },
        {
            header: "Rol",
            accessorKey: "rolNom",
        },
        {
            header: "Contraseña",
            accessorKey: "password",
            disableSorting: true,
            cell: ({row}) => {
                return (
                    <div className="flex jc-center ai-center">
                        <button  
                            className="PowerMas_Add_Beneficiarie f_75 p_25 flex-grow-1" 
                            onClick={() => openModal(row.original)}
                        >
                            Restablecer
                        </button>
                    </div>
                )
            }
        },
        
    ]

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