import { useEffect, useMemo, useState } from "react";
import useModal from "../../hooks/useModal";
import SearchInput from "../reusable/Tables/SearchInput";
import ExportMenu from "../reusable/Tables/ExportMenu";
import CommonTable from "../reusable/Tables/CommonTable";
import useEntityActions from "../../hooks/useEntityActions";
import Plus from "../../icons/Plus";
import { fetchDataBlock } from "../reusable/fetchs";
import { getMonthYearText } from "../reusable/columns";
import Modal from "./Modal";
import { getColumns } from "./columns";

const ObjectiveSpecific = () => {
   // States locales
   const [ data, setData ] = useState([])
   const [ refresh, setRefresh ] = useState([]);

   const { modalVisible, estadoEditado, openModal, closeModal } = useModal();

   const actions = useEntityActions('OBJETIVOESPECIFICO');
   // Columnas de la tabla definidas en un hook personalizado
   const columns = useMemo(() => getColumns(actions, 'ObjetivoEspecifico', openModal, setRefresh), [actions, 'ObjetivoEspecifico', openModal, setRefresh]);
 
   // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('ObjetivoEspecifico', (data) => {
            // Filtramos los datos para excluir los objetos que no queremos
            const filteredData = data.filter(item => item.objEspNum !== 'NA' && item.objEspNom !== 'NA');
            // Luego llamamos a setData con los datos filtrados
            setData(filteredData);
        }, '.content-block');
    }, [refresh]);


    const [searchFilter, setSearchFilter] = useState('');
    const filteredData = useMemo(() => 
        data.filter(item => {
            // Genera el texto del mes y año de inicio y fin
            const periodoInicio = getMonthYearText(item.subProPerMesIni, item.subProPerAnoIni);
            const periodoFin = getMonthYearText(item.subProPerMesFin, item.subProPerAnoFin);

            return (
                (item.objEspNum ? item.objEspNum.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objEspNom ? item.objEspNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objNum ? item.objNum.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objNom ? item.objNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.subProSap ? item.subProSap.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.subProNom ? item.subProNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.proLinInt ? item.proLinInt.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.proIde ? item.proIde.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.proNom ? item.proNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.usuNom && item.usuApe ? (item.usuNom + ' ' + item.usuApe).toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.usuNom && item.usuApe ? (item.usuNom + ' ' + item.usuApe).toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (periodoInicio ? periodoInicio.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (periodoFin ? periodoFin.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false)
            );
        }), [data, searchFilter]
    );

   const headers = ['CÓDIGO','OBJETIVO ESPECÍFICO','OBJETIVO','SUBPROYECTO','PROYECTO','CÓDIGO','LINEA_INTERVENCIÓN','RESPONSABLE','MES_INICIO','AÑO_INICIO','MES_FIN','AÑO_FIN'];
   const properties = ['objEspNum','objEspNom',['objNum','objNom'],['subProSap','subProNom'],'proNom','proIde','proLinInt',['usuNom','usuApe'],'subProPerMesIni','subProPerAnoIni','subProPerMesFin','subProPerAnoFin'];

    return (
        <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto content-block">
                <h3>Listado de Objetivos Específicos</h3>
                <div className="flex gap_5 p_25">
                    {/* Componente para la entrada de búsqueda con etiquetas */}
                    <SearchInput
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    {
                        actions.add &&
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
                    }
                    {/* Menú de exportación con opciones condicionales basadas en los permisos */}
                    <ExportMenu
                        filteredData={filteredData}
                        headers={headers}
                        title={'OBJETIVOS_ESPECIFICOS'}
                        properties={properties}
                        format={[1000,500]}
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
                setRefresh={setRefresh}
                title='Objetivo Específico'
            />  
        </>
    );
};

export default ObjectiveSpecific;
