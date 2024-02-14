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
import { AuthContext } from '../../context/AuthContext';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../reusable/helper';
// Componentes
import CustomTable from '../reusable/CustomTable';

const Table = ({ data, openModal, setData }) => {
    // Variables State AuthContext 
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    /* TANSTACK */
    const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR BENEFICIARIO"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR BENEFICIARIO"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR BENEFICIARIO"),
    };

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Código",
                accessorKey: "benCod",
                cell: ({row}) => (
                    <div className="">
                        {row.original.benAno + row.original.benCod}
                    </div>
                ),
            },
            {
                header: "Nombre",
                accessorKey: "benNom",
                cell: ({row}) => {
                    const text = row.original.benNom.toLowerCase();
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {text}
                        </div>
                    )
                }
            },
            {
                header: "Apellido",
                accessorKey: "benApe",
                cell: ({row}) => {
                    const text = row.original.benApe.toLowerCase();
                    return (
                        <div style={{textTransform: 'capitalize'}}>
                            {text}
                        </div>
                    )
                }
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
                header: "Telefono",
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
                            {text === 'M' ? 'Masculino' : 'Femenino'}
                        </>
                    )
                },
            },
        ]
    
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
                                onClick={() => handleDelete('Beneficiario', row.original.uniCod, setData, setIsLoggedIn)} 
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
            item.benAno.includes(searchFilter.toUpperCase()) ||
            item.benCod.includes(searchFilter.toUpperCase()) ||
            item.benNom.includes(searchFilter.toUpperCase()) ||
            item.benApe.includes(searchFilter.toUpperCase()) ||
            item.benCorEle.includes(searchFilter.toUpperCase()) ||
            item.benTel.includes(searchFilter.toUpperCase()) ||
            item.benTelCon.includes(searchFilter.toUpperCase()) ||
            (item.benSex === 'M' && 'MASCULINO'.includes(searchFilter.toUpperCase())) ||
            (item.benSex === 'F' && 'FEMENINO'.includes(searchFilter.toUpperCase()))
        ), [data, searchFilter]
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
    let dataExport = [...table.options.data]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        uniInvPer: item.uniInvPer === 'S' ? 'SI' : 'NO',
    }));
    const headers = ['CODIGO', 'NOMBRE', 'INVOLUCRA', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'UNIDADES';  // El título de tu archivo
    const properties = ['uniCod', 'uniNom', 'uniInvPer', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
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
            title="Listado de Beneficiarios" 
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
