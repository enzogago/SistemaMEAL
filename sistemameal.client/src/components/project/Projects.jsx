import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import useModal from "../../hooks/useModal";
import SearchInput from "../reusable/Tables/SearchInput";
import ExportMenu from "../reusable/Tables/ExportMenu";
import CommonTable from "../reusable/Tables/CommonTable";
import { getColumns } from "./columns";
import useEntityActions from "../../hooks/useEntityActions";
import Plus from "../../icons/Plus";
import { fetchDataBlock } from "../reusable/fetchs";

const projects = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ refresh, setRefresh ] = useState([]);

    const { modalVisible, estadoEditado, openModal, closeModal } = useModal();

    const actions = useEntityActions('PROYECTO');
    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions, 'Proyecto', openModal, setRefresh), [actions, 'Proyecto', openModal, setRefresh]);
  
    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('Proyecto', setData, '.project-block');
    }, [refresh]);


    const [searchFilter, setSearchFilter] = useState('');
    const filteredData = useMemo(() => 
        data.filter(item => {
            return (
                (item.proLinInt ? item.proLinInt.includes(searchFilter.toUpperCase()) : false) ||
                (item.proNom ? item.proNom.includes(searchFilter.toUpperCase()) : false) ||
                (item.proDes ? item.proDes.includes(searchFilter.toUpperCase()) : false) ||
                (item.proIde ? item.proIde.includes(searchFilter.toUpperCase()) : false)
            );
        }), [data, searchFilter]
    );

    const headers = ['CODIGO', 'LINEA_INTERVENCION', 'PROYECTO', 'DESCRIPCION'];
    const properties = ['proIde', 'proLinInt', 'proNom', 'proDes'];

    return (
        <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto project-block">
                <h3>Listado de Proyectos</h3>
                <div className="flex gap_5 p_25">
                    {/* Componente para la entrada de búsqueda con etiquetas */}
                    <SearchInput
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    <button 
                        className='flex jc-space-between ai-center Large_3 Large-p_5 PowerMas_Buttom_Primary'
                        onClick={() => openModal()} 
                        disabled={!actions.add}
                    >
                        Nuevo 
                        <span className='flex f1_25'>
                            <Plus />
                        </span>
                    </button>
                    {/* Menú de exportación con opciones condicionales basadas en los permisos */}
                    <ExportMenu
                        filteredData={filteredData}
                        headers={headers}
                        title={'PROYECTOS'}
                        properties={properties}
                        format={[500,250]}
                        actions={actions}
                    />
                </div>
                {/* Tabla común para mostrar los datos filtrados */}
                <CommonTable 
                    data={filteredData} 
                    columns={columns}
                    isLargePagination={true}
                />
            </div>
            <Modal
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Proyecto'
            />  
        </>
    );
};

export default projects;
