export const getColumns = () => {
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

    return baseColumns;
};
