import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Funciones reusables
import { Export_Excel_Helper, Export_PDF_Helper, handleDelete } from '../../reusable/helper';
// Context
import CustomTable from "../../reusable/Table/CustomTable";
import { AuthContext } from "../../../context/AuthContext";

const TableGoalBeneficiarie = ({ data }) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');

    // Añade una nueva etiqueta al presionar Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue && !searchTags.includes(inputValue)) {
            setSearchTags(prevTags => [...prevTags, inputValue]);
            setInputValue('');  // borra el valor del input
            setIsInputEmpty(true);
        } else if (e.key === 'Backspace' && isInputEmpty && searchTags.length > 0) {
            setSearchTags(prevTags => prevTags.slice(0, -1));
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);  // actualiza el valor del input
        setIsInputEmpty(e.target.value === '');
    }

    // Elimina una etiqueta
    const removeTag = (tag) => {
        setSearchTags(searchTags.filter(t => t !== tag));
    }

    const actions = {
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF META`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL META`),
    };
    const [sorting, setSorting] = useState([]);
    // Añade una nueva propiedad 'metMesPlaTecNombre' a cada objeto de tus datos
    data.forEach(item => {
        item.metMesPlaTecNombre = new Date(2024, item.metMesPlaTec - 1).toLocaleString('es-ES', { month: 'long' });
    });

    // Filtra los datos por todas las etiquetas
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
                item.estNom.includes(tag.toUpperCase()) ||
                item.metMetTec.includes(tag.toUpperCase()) ||
                item.metEjeTec.includes(tag.toUpperCase()) ||
                item.metPorAvaTec.includes(tag.toUpperCase()) ||
                item.metAnoPlaTec.includes(tag.toUpperCase()) ||
                item.metMesPlaTecNombre.toUpperCase().includes(tag.toUpperCase()) ||
                item.indActResNum.includes(tag.toUpperCase()) ||
                item.indActResNom.includes(tag.toUpperCase()) ||
                item.tipInd.includes(tag.toUpperCase()) ||
                item.resNom.includes(tag.toUpperCase()) ||
                item.resNum.includes(tag.toUpperCase()) ||
                item.objEspNom.includes(tag.toUpperCase()) || 
                item.objEspNum.includes(tag.toUpperCase()) || 
                item.objNom.includes(tag.toUpperCase()) || 
                item.subProNom.includes(tag.toUpperCase()) || 
                item.ubiNom.includes(tag.toUpperCase()) || 
                item.proNom.includes(tag.toUpperCase())
            )
        ), [data, searchTags]
    );

    const Editar_Meta = (row) => {
        console.log(row)
        const id = `${row.original.usuAno}${row.original.usuCod}`;
        console.log(id)
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-goal/${safeCiphertext}`);
    }

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Ubicaciòn",
                accessorKey: "ubiNom",
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.ubiNom.toLowerCase()}
                    </div>
                ),
            },
            {
                header: "Año",
                accessorKey: "metAnoPlaTec"
            },
            {
                header: "Mes",
                accessorKey: "metMesPlaTecNombre", // Usa la nueva propiedad como accessorKey
                cell: ({row}) => (
                    <div style={{textTransform: 'capitalize'}}>
                        {row.original.metMesPlaTecNombre}
                    </div>
                ),
            },
            {
                header: "Sub Actividad",
                accessorKey: "subActResNom",
            },
            {
                header: "Indicador",
                accessorKey: "indActResNom",
                cell: ({row}) => {
                    const text = row.original.indActResNum + ' - ' + row.original.indActResNom.charAt(0).toUpperCase() + row.original.indActResNom.slice(1).toLowerCase();
                    const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Tipo Inidicador",
                accessorKey: "tipInd",
                cell: ({row}) => {
                    const text = row.original.tipInd.charAt(0).toUpperCase() + row.original.tipInd.slice(1).toLowerCase();
                    return (
                        <>
                            {text}
                        </>
                    )
                },
            },
            {
                header: "Resultado",
                accessorKey: "resNom",
                cell: ({row}) => {
                    const text = row.original.resNum + ' - ' + row.original.resNom.charAt(0).toUpperCase() + row.original.resNom.slice(1).toLowerCase();
                    const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Objetivo Especifico",
                accessorKey: "objEspNom",
                cell: ({row}) => {
                    const text = row.original.objEspNum + ' - ' + row.original.objEspNom.charAt(0).toUpperCase() + row.original.objEspNom.slice(1).toLowerCase();
                    const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Objetivo",
                accessorKey: "objNom",
                cell: ({row}) => {
                    const text = row.original.objNum + ' - ' + row.original.objNom.charAt(0).toUpperCase() + row.original.objNom.slice(1).toLowerCase();
                    const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                    return (
                        <>
                            <span 
                                data-tooltip-id="info-tooltip" 
                                data-tooltip-content={text} 
                            >{shortText}</span>
                        </>
                    );
                },
            },
            {
                header: "Subproyecto",
                accessorKey: "subProNom"
            },
            {
                header: "Proyecto",
                accessorKey: "proNom"
            },
            
            {
                header: "Financiador",
                accessorKey: "finNom"
            },
            {
                header: "Implementador",
                accessorKey: "impNom"
            },
        ];

        baseColumns = baseColumns.filter(column => 
            data.some(item => item[column.accessorKey] !== null)
        );
    
        return baseColumns;
    }, [actions]);

    
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

    // Preparar los datos
    const dataExport = table.options.data;  // Tus datos
    const headers = ['UBICACION','AÑO','MES','INDICADOR','TIPO_INDICADOR','RESULTADO','OBJETIVO_ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'METAS';  // El título de tu archivo Excel
    const properties = ['ubiNom', 'metAnoPlaTec', 'metMesPlaTec', 'indActResNom', 'tipInd', 'resNom', 'objEspNom', 'objNom', 'subProNom', 'proNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir en el Excel
    const format = [1000, 500];

    const Export_Excel = () => {
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_Excel_Helper(dataExport, headers, title, properties);
    };
    const Export_PDF = () => {
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_PDF_Helper(dataExport, headers, title, properties, format);
    };

    return (
        <>
            <CustomTable 
                title='Metas Involucradas'
                actions={actions} 
                dropdownOpen={dropdownOpen} 
                setDropdownOpen={setDropdownOpen} 
                Export_Excel={Export_Excel} 
                Export_PDF={Export_PDF} 
                table={table}
                navigatePath='form-goal'
                resize={false}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                inputValue={inputValue}
                removeTag={removeTag}
                searchTags={searchTags}
                setSearchTags={setSearchTags}
            />
            
        </>
    )
}

export default TableGoalBeneficiarie