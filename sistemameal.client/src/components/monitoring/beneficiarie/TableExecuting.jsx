import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
// Iconos package
import { FaEdit, FaPlus, FaRegTrashAlt, FaSearch, FaSortDown } from 'react-icons/fa';
// Context
import { AuthContext } from "../../../context/AuthContext";
import CustomTable from "../../reusable/Table/CustomTable";
import { Export_Excel_Helper, Export_PDF_Helper } from "../../reusable/helper";
import { fetchBeneficiariosMeta, handleDeleteBeneficiarioMeta } from "./eventHandlers";

const TableExecuting = ({data, openModalGoalExecuting, metaData }) => {
    if(!openModalGoalExecuting) return;
    console.log("asdad")

    // Variables State AuthContext 
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;
    // States locales
    const [searchTags, setSearchTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');

    const [ modalVisible, setModalVisible ] = useState(false)

    const [currentRecord, setCurrentRecord] = useState(null);

    const closeModalEdit = () => {
        setModalVisible(false);
    }

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
        edit: userPermissions.some(permission => permission.perNom === "MODIFICAR META"),
        delete: userPermissions.some(permission => permission.perNom === "ELIMINAR META"),
    };

    const [sorting, setSorting] = useState([]);

    data.forEach(item => {
        item.metEjeMesEjeTecNombre = new Date(2024, item.metEjeMesEjeTec - 1).toLocaleString('es-ES', { month: 'long' });
    });
    

    // Filtra los datos por todas las etiquetas
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
                item.metEjeAnoEjeTec.includes(tag.toUpperCase()) ||
                item.metEjeMesEjeTecNombre.toUpperCase().includes(tag.toUpperCase())
            )
        ), [data, searchTags]
    );

    const columns = useMemo(() => {
        let baseColumns = [
            {
                header: "Cantidad",
                accessorKey: "metEjeVal",
            },
            {
                header: () => <div className="text-wrap center">Año Ejecución</div>,
                accessorKey: "metEjeAnoEjeTec",
                cell: ({row}) => (
                    <div className="center">
                        {row.original.metEjeAnoEjeTec}
                    </div>
                ),
            },
            {
                header: () => <div className="text-wrap center">Mes Ejecución</div>,
                accessorKey: "metEjeMesEjeTec",
                cell: ({row}) => (
                    <div className="center" style={{textTransform: 'capitalize'}}>
                        {row.original.metEjeMesEjeTecNombre}
                    </div>
                ),
            },
        ];

        baseColumns = baseColumns.filter(column => 
            data.some(item => item[column.accessorKey] !== null)
        );

        if (actions.edit || actions.delete) {
            baseColumns.push({
                header: () => <div style={{ flexGrow: '1'}}>Acciones</div>,
                accessorKey: "acciones",
                disableSorting: true,
                stickyRight: 0,
                cell: ({row}) => {
                    const {benAno, benCod, ubiAno, ubiCod, metBenAnoEjeTec, metBenMesEjeTec } = row.original;
                    return(
                    <div className='PowerMas_IconsTable flex jc-center ai-center'>
                        {actions.edit && 
                            <FaEdit 
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Editar" 
                                className='Large-p_25' 
                                onClick={() => {
                                    setCurrentRecord(row.original);
                                    setModalVisible(true);
                                }} 
                            />
                        }
                        {actions.delete && 
                            <FaRegTrashAlt 
                                data-tooltip-id="delete-tooltip" 
                                data-tooltip-content="Eliminar" 
                                className='Large-p_25' 
                                onClick={() => handleDeleteBeneficiarioMeta('Monitoreo',metaData.metAno,metaData.metCod,benAno,benCod,ubiAno,ubiCod,metBenAnoEjeTec,metBenMesEjeTec, updateData, setUpdateData, fetchBeneficiarie)} 
                            />
                        }
                        
                    </div>
                )},
            });
        }
    
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
    let dataExport = [...table.options.data]; 


    const headers = ['AUTORIZA','CUB', 'NOMBRES', 'APELLIDOS', 'FECHA_NACIMIENTO', 'EDAD', 'SEXO', 'GENERO', 'NACIONALIDAD', 'CORREO', 'TELEFONO', 'TELEFONO_CONTACTO', 'DIRECCION', 'UBICACION', 'AÑO_EJECUCION' , 'MES_EJECUCION', 'USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'BENEFICIARIO';  // El título de tu archivo
    const properties = ['benAut', 'benCodUni', 'benNom', 'benApe', 'benFecNac', 'edad', 'benSex', 'genNom', 'nacNom', 'benCorEle', 'benTel', 'benTelCon', 'benDir', 'ubiNom', 'metBenAnoEjeTec', 'metBenMesEjeTec', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir
    const format = [700,350];  // El tamaño del formato que quieres establecer para el PDF

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
        <>
            <CustomTable 
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
            {/* {
                currentRecord &&
                <ModalEditBeneficiarie 
                    modalVisible={modalVisible}
                    closeModalEdit={closeModalEdit}
                    metaData={metaData}
                    record={currentRecord}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                />
            } */}
        </>
    )
}

export default TableExecuting