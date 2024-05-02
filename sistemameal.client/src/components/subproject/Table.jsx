import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDeleteMant } from '../reusable/helper';
// Componentes
import { AuthContext } from "../../context/AuthContext";
import CustomTable from "../reusable/Table/CustomTable";
import Edit from "../../icons/Edit";
import Delete from "../../icons/Delete";


const Table = ({data = [], setData, setModalIsOpen}) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchFilter, setSearchFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [actionsWidth, setActionsWidth] = useState(0);

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
                header: "Sub Proyecto",
                accessorKey: "subProNom",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.subProSap + ' - ' +row.original.subProNom}
                    </div>
                ),
            },
            {
                header: "Proyecto",
                accessorKey: "proNom",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.proIde + ' - ' +row.original.proNom}
                    </div>
                ),
            },
            {
                header: "Responsable",
                accessorKey: "subProRes",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.subProRes}
                    </div>
                ),
            },
            {
                header: "Periodo Inicio",
                accessorKey: "subProPerAnoIni",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>{row.original.subProPerMesIniNombre.toUpperCase() + ' - ' +  row.original.subProPerAnoIni }</div>
                    );
                },
            },
            {
                header: "Periodo Fin",
                accessorKey: "subProPerAnoFin",
                cell: ({row}) => {
                    return (
                        <div style={{textTransform: 'capitalize'}}>{row.original.subProPerMesFinNombre.toUpperCase() + ' - ' +  row.original.subProPerAnoFin }</div>
                    );
                },
            },
            {
                header: "Involucra Sub Acvtidad",
                accessorKey: "subProInvSubAct",
                cell: ({row}) => {
                    return (
                        <>{row.original.subProInvSubActNombre}</>
                    );
                },
            },
            {
                header: "FFVV",
                accessorKey: "subProFueVer",
                disableSorting: true,
                stickyRight: actionsWidth+10,
                cell: ({row}) => {
                    return (
                        <div className="flex jc-center ai-center" >
                            <button  
                                className="PowerMas_Add_Beneficiarie f_75 flex-grow-1" 
                                style={{padding: '0.25rem 0.75rem'}}
                                onClick={() => setModalIsOpen(row.original)}
                            >
                                Documentación Formulacion
                            </button>
                        </div>
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
                            <span
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='flex f1_25 p_25' 
                                onClick={() => Editar_Sub_Proyecto(row)} 
                            >
                                <Edit />
                            </span>
                        }
                        {actions.delete &&
                            <span
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='flex f1_25 p_25'
                                onClick={() => handleDeleteMant(row.original, row.original, setData)} 
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
        item.subProPerMesFinNombre = new Date(2024, item.subProPerMesFin - 1).toLocaleString('es-ES', { month: 'long' });
        item.subProPerMesIniNombre = new Date(2024, item.subProPerMesIni - 1).toLocaleString('es-ES', { month: 'long' });
        item.subProInvSubActNombre = item.subProInvSubAct === 'S' ? 'PROYECTO CON SUB ACTIVIDADES' : 'PROYECTO SIN SUB ACTIVIDADES';
    });

    const [sorting, setSorting] = useState([]);
    const filteredData = useMemo(() => 
        data.filter(item => 
            (item.subProNom ? item.subProNom.includes(searchFilter.toUpperCase()) : false) ||
            (item.subProSap ? item.subProSap.includes(searchFilter.toUpperCase()) : false) ||
            (item.proIde ? item.proIde.includes(searchFilter.toUpperCase()) : false) ||
            (item.proNom ? item.proNom.includes(searchFilter.toUpperCase()) : false) ||
            (item.subProRes ? item.subProRes.includes(searchFilter.toUpperCase()) : false) ||
            (item.subProPerAnoFin ? item.subProPerAnoFin.includes(searchFilter.toUpperCase()) : false) ||
            (item.subProPerAnoIni ? item.subProPerAnoIni.includes(searchFilter.toUpperCase()) : false) ||
            (item.subProPerMesFinNombre ? item.subProPerMesFinNombre.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
            (item.subProPerMesIniNombre ? item.subProPerMesIniNombre.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
            (item.subProInvSubActNombre ? item.subProInvSubActNombre.toUpperCase().includes(searchFilter.toUpperCase()) : false)
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
        subProInvSubAct: item.subProInvSubAct === 'S' ? 'SI' : 'NO',

    }));
    const headers = ['CODIGO_FINANCIACION', 'NOMBRE', 'RESPONSABLE','AÑO_INICIO','MES_INICIO','AÑO_FIN','MES_FIN','INVOLUCRA_SUB_ACTIVIDAD', 'PROYECTO', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'SUB PROYECTOS';  // El título de tu archivo
    const properties = ['subProSap', 'subProNom', 'subProRes', 'subProPerAnoIni', 'subProPerMesIni', 'subProPerAnoFin', 'subProPerMesFin', 'subProInvSubAct', 'proNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
    const format = [500, 250];

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
            setActionsWidth={setActionsWidth}
        />
    )
}

export default Table