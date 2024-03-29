import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Iconos package
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDeleteMant } from '../reusable/helper';
// Componentes
import { AuthContext } from "../../context/AuthContext";
import CustomTable from "../reusable/Table/CustomTable";


const Table = ({data = [], setData}) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);


     /* TANSTACK */
     const actions = {
        add: userPermissions.some(permission => permission.perNom === "INSERTAR SUBPROYECTO"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR SUBPROYECTO"),
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR SUBPROYECTO"),
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF SUBPROYECTO`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL SUBPROYECTO`),
    };
    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Código SAP",
                accessorKey: "subProSap",
            },
            {
                header: "Nombre",
                accessorKey: "subProNom",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.subProNom.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Proyecto",
                accessorKey: "proNom",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.proNom.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Responsable",
                accessorKey: "proRes",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.proRes.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Periodo Inicio",
                accessorKey: "proPerAnoIni",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>{row.original.proPerMesIniNombre + ' - ' +  row.original.proPerAnoIni }</div>
                    );
                },
            },
            {
                header: "Periodo Fin",
                accessorKey: "proPerAnoFin",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>{row.original.proPerMesFinNombre + ' - ' +  row.original.proPerAnoFin }</div>
                    );
                },
            },
        ];

        if (actions.edit || actions.delete) {
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
                                onClick={() => Editar_Sub_Proyecto(row)} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDeleteMant('SubProyecto',row.original, setData)} 
                            />
                        }
                    </div>
                ),
            });
        }

        return baseColumns;
    }, [actions]);

    const Editar_Sub_Proyecto = (row) => {
        const id = `${row.original.subProAno}${row.original.subProCod}`;
        console.log(id)
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-subproject/${safeCiphertext}`);
    }
    
    data.forEach(item => {
        item.proPerMesFinNombre = new Date(2024, item.proPerMesFin - 1).toLocaleString('es-ES', { month: 'long' });
        item.proPerMesIniNombre = new Date(2024, item.proPerMesIni - 1).toLocaleString('es-ES', { month: 'long' });
        item.proInvSubActNombre = item.proInvSubAct === 'S' ? 'Proyecto con Sub Actividades' : 'Proyecto con Sub Actividades';
    });

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            (item.subProNom ? item.subProNom.includes(searchFilter.toUpperCase()) : false) ||
            (item.subProSap ? item.subProSap.includes(searchFilter.toUpperCase()) : false) ||
            (item.proNom ? item.proNom.includes(searchFilter.toUpperCase()) : false) ||
            (item.proRes ? item.proRes.includes(searchFilter.toUpperCase()) : false) ||
            (item.proPerAnoFin ? item.proPerAnoFin.includes(searchFilter.toUpperCase()) : false) ||
            (item.proPerAnoIni ? item.proPerAnoIni.includes(searchFilter.toUpperCase()) : false) ||
            (item.proPerMesFinNombre ? item.proPerMesFinNombre.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
            (item.proPerMesIniNombre ? item.proPerMesIniNombre.toUpperCase().includes(searchFilter.toUpperCase()) : false)
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
    const headers = ['NOMBRE', 'CODIGO_SAP', 'PROYECTO', 'RESPONSABLE', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'SUB PROYECTOS';  // El título de tu archivo
    const properties = ['subProNom', 'subProSap', 'proNom', 'proRes', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
    const format = 'a3';  // El tamaño del formato que quieres establecer para el PDF

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
            title='Sub Proyectos'
            actions={actions} 
            dropdownOpen={dropdownOpen} 
            setDropdownOpen={setDropdownOpen} 
            Export_Excel={Export_Excel} 
            Export_PDF={Export_PDF} 
            table={table}
            navigatePath='form-subproject'
            resize={false}
            searchFilter={searchFilter} 
            setSearchFilter={setSearchFilter} 
        />
    )
}

export default Table