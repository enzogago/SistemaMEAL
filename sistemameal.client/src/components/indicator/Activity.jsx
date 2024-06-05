import { useEffect, useMemo, useState } from 'react';
// Fetch Get
import { fetchData } from '../reusable/helper';
import SearchInput from '../reusable/Tables/SearchInput';
import CommonTable from '../reusable/Tables/CommonTable';
import { getColumns } from './columns';
import { fetchDataBlock } from '../reusable/fetchs';
import useEntityActions from '../../hooks/useEntityActions';
import { getMonth, getMonthYearText } from '../reusable/columns';
import ExportMenu from '../reusable/Tables/ExportMenu';
import Plus from '../../icons/Plus';
import useModal from '../../hooks/useModal';
import ModalActividad from './ModalActividad';

const tipoIndicadorMapping = {
    'IRE': 'Indicador de Resultado',
    'IAC': 'Actividad',
    'IIN': 'Indicador Institucional',
    'IOB': 'Indicador de Objetivo',
    'IOE': 'Indicador de Objetivo Específico',
    'ISA': 'Indicador de Sub Actividad',
};

const Indicator = () => {
    // States locales
    const [ unidades, setUnidades] = useState([]);
    const [ tiposDeValor, setTiposDeValor] = useState([]);
    const [ data, setData ] = useState([])
    const [ refresh, setRefresh ] = useState([]);

    const { modalVisible, estadoEditado, openModal, closeModal } = useModal([
        () => fetchData('Unidad', setUnidades),
        () => fetchData('TipoValor', setTiposDeValor)
    ]);

    const actions = useEntityActions('INDICADOR');
    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions, 'Indicador', openModal, setRefresh), [actions, 'Indicador', openModal, setRefresh]);
  
    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('Indicador', (data) => {
            const filteredData = data.filter(item => item.indTipInd === 'IAC');
            setData(filteredData)
        }, '.indicator-block');
    }, [refresh]);


    const [searchFilter, setSearchFilter] = useState('');
    const filteredData = useMemo(() => 
        data.filter(item => {
            // Genera el texto del mes y año de inicio y fin
            const periodoInicio = getMonthYearText(item.subProPerMesIni, item.subProPerAnoIni);
            const periodoFin = getMonthYearText(item.subProPerMesFin, item.subProPerAnoFin);

            return (
                (item.indNom ? item.indNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.indNum ? item.indNum.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.uniNom ? item.uniNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.tipValNom ? item.tipValNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.indFor ? item.indFor.replace(/{/g, '').replace(/}/g, '').toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.resNum ? item.resNum.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.resNom ? item.resNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.objEspNum ? item.objEspNum.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.objEspNom ? item.objEspNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.objNum ? item.objNum.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.objNom ? item.objNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.subProNom ? item.subProNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.subProSap ? item.subProSap.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.proLinInt ? item.proLinInt.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.proIde ? item.proIde.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.proNom ? item.proNom.toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (item.usuNom && item.usuApe ? (item.usuNom + ' ' + item.usuApe).toUpperCase().includes(searchFilter.toUpperCase().trim()) : false) ||
                (periodoInicio ? periodoInicio.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (periodoFin ? periodoFin.toUpperCase().includes(searchFilter.toUpperCase()) : false)
            );
        }), [data, searchFilter]
    );

    const headers = ['CÓDIGO','NOMBRE','TIPO','UNIDAD','TIPO_VALOR','FORMULA','RESULTADO','OBJETIVO_ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO','CÓDIGO','LINEA_INTERVENCIÓN','RESPONSABLE','MES_INICIO','AÑO_INICIO','MES_FIN','AÑO_FIN'];
    const properties = ['indNum','indNom','indTipInd','uniNom','tipValNom','indFor',['resNum','resNom'],['objEspNum','objEspNom'],['objNum','objNom'],['subProSap','subProNom'],'proNom','proIde','proLinInt',['usuNom','usuApe'],'subProPerMesIni','subProPerAnoIni','subProPerMesFin','subProPerAnoFin'];
    // Preparar los datos
    let dataExport = [...filteredData]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        indFor: item.indFor.replace(/{/g, '[').replace(/}/g, ']'),
        indTipInd: tipoIndicadorMapping[item.indTipInd].toUpperCase(),
        subProPerMesIni: getMonth(item.subProPerMesIni),
        subProPerMesFin: getMonth(item.subProPerMesFin),
    }));

    return (
        <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto indicator-block">
                <h3>Listado de Actividades</h3>
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
                        filteredData={dataExport}
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
            
            <ModalActividad
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Actividad'
                unidades={unidades}
                tiposDeValor={tiposDeValor}
            />  
        </>
    );
};

export default Indicator;
