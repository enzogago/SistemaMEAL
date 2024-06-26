import { useEffect, useMemo, useState } from "react";
import useModal from "../../hooks/useModal";
import SearchInput from "../reusable/Tables/SearchInput";
import ExportMenu from "../reusable/Tables/ExportMenu";
import CommonTable from "../reusable/Tables/CommonTable";
import { getColumns } from "./columns";
import useEntityActions from "../../hooks/useEntityActions";
import Plus from "../../icons/Plus";
import { fetchDataBlock } from "../reusable/fetchs";
import { getMonthYearText } from "../reusable/columns";

const Activity = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ refresh, setRefresh ] = useState([]);

    const { modalVisible, estadoEditado, openModal, closeModal } = useModal();

  
    const actions = useEntityActions('ACTIVIDAD');
    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions, 'Actividad', openModal, setRefresh), [actions, 'Actividad', openModal, setRefresh]);
  
    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('Actividad', setData, '.activity-block');
    }, [refresh]);


    const [searchFilter, setSearchFilter] = useState('');
    const filteredData = useMemo(() => 
        data.filter(item => {
            // Genera el texto del mes y año de inicio y fin
            const periodoInicio = getMonthYearText(item.subProPerMesIni, item.subProPerAnoIni);
            const periodoFin = getMonthYearText(item.subProPerMesFin, item.subProPerAnoFin);

            return (
                (item.actNum ? item.actNum.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.actNom ? item.actNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.resNum ? item.resNum.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.resNom ? item.resNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objEspNum ? item.objEspNum.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objEspNom ? item.objEspNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objNum ? item.objNum.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.objNom ? item.objNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.subProNom ? item.subProNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.proNom ? item.proNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.usuNom && item.usuApe ? (item.usuNom + ' ' + item.usuApe).toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.subProRes ? item.subProRes.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (periodoInicio ? periodoInicio.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (periodoFin ? periodoFin.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false)
            );
        }), [data, searchFilter]
    );

    const headers = ['CÓDIGO','NOMBRE','RESULTADO','OBJETIVO_ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO','RESPONSABLE','MES_INICIO','AÑO_INICIO','MES_FIN','AÑO_FIN'];
    const properties = ['actNum','actNom',['resNum','resNom'],['objEspNum','objEspNom'],['objNum','objNom'],'subProNom','proNom','subProRes','subProPerMesIni','subProPerAnoIni','subProPerMesFin','subProPerAnoFin'];
    

    return (
         <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto activity-block">
                <h3>Listado de Actividades</h3>
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
                        title={'ACTIVIDADES'}
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
        </>
    );
};

export default Activity;
