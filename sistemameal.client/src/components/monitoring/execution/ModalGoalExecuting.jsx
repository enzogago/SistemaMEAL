import Modal from 'react-modal';
import { useEffect, useMemo, useState } from 'react';
import SearchTagsInput from '../../reusable/Tables/SearchTagsInput';
import ExportMenu from '../../reusable/Tables/ExportMenu';
import useModal from '../../../hooks/useModal';
import { getColumnsExecuting } from '../beneficiarie/columns';
import { useSearchTags } from '../../../hooks/useSearchTags';
import useEntityActions from '../../../hooks/useEntityActions';
import CommonTable from '../../reusable/Tables/CommonTable';
import { getMonth, getMonthYearText, tipoIndicadorMapping } from '../../reusable/columns';
import ModalEditExecution from './ModalEditExecution';
import { fetchDataBlock } from '../../reusable/fetchs';

const ModalGoalExecuting = ({openModalGoalExecuting, closeModalExecuting, metaData, refresh, setRefresh}) => {
    // Estados locales para manejar los datos y el refresco de la tabla
   const [ data, setData ] = useState([]);

   // Obtener las acciones permitidas para la entidad 'BENEFICIARIO'
   const actions = useEntityActions('BENEFICIARIO');

   const { modalVisible, estadoEditado, openModal, closeModal } = useModal();

    useEffect(() => {
        if (openModalGoalExecuting) {
            fetchDataBlock(`Meta/executing/${metaData.metAno}/${metaData.metCod}`, setData, '.table-execution-block')
        } else {
            setData([]);
        }
    }, [openModalGoalExecuting, refresh])

    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumnsExecuting(actions, openModal, setRefresh), [actions, openModal, setRefresh]);

    // Hook personalizado para manejar las etiquetas de búsqueda
    const {
        searchTags,
        inputValue,
        handleInputChange,
        handleKeyDown,
        removeTag
    } = useSearchTags();

    // Datos filtrados basados en las etiquetas de búsqueda
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const periodoEjecucion = getMonthYearText(item.metEjeMesEjeTec, item.metEjeAnoEjeTec);
            return searchTags.every(tag => 
                item.ubiNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.metEjeVal.toUpperCase().includes(tag.toUpperCase()) ||
                item.metEjeDet.toUpperCase().includes(tag.toUpperCase()) ||
                (periodoEjecucion ? periodoEjecucion.toUpperCase().includes(tag.toUpperCase()) : false)
            );
        });
    }, [data, searchTags]);
    
    const headers = ['AÑO EJECUTADO','MES EJECUTADO','UBICACIÓN EJECUTADA','EJECUCION','DETALLE','INDICADOR','TIPO','RESULTADO','OBJETIVO ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO'];
    const properties = ['metEjeAnoEjeTec','metEjeMesEjeTec','ubiNom','metEjeVal','metEjeDet',['indNum','indNom'],'indTipInd',['resNum','resNom'],['objEspNum','objEspNom'],['objNum','objNom'],['subProSap','subProNom'],['proIde','proNom']];
    // Preparar los datos
    let dataExport = [...filteredData]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        indTipInd: tipoIndicadorMapping[item.indTipInd].toUpperCase(),
        metEjeMesEjeTec: getMonth(item.metEjeMesEjeTec),
    }));

    return (
        <Modal
            ariaHideApp={false}
            isOpen={openModalGoalExecuting}
            onRequestClose={closeModalExecuting}
            closeTimeoutMS={200}
            className='PowerMas_React_Modal_Content Large_10 Medium_10 Phone_11'
            overlayClassName='PowerMas_React_Modal_Overlay'
            style={{
                content: {
                    height: '90%',
                },
                overlay: {
                    zIndex: 30
                }
            }}
        >   
            <div className="flex flex-column gap_25 flex-grow-1 overflow-auto table-execution-block">
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModalExecuting}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Ejecuciones asociados a la meta</h2>

                <div className="flex gap_5 p_25">
                    {/* Componente para la entrada de búsqueda con etiquetas */}
                    <SearchTagsInput 
                        searchTags={searchTags}
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        removeTag={removeTag}
                    />
                    {/* Menú de exportación con opciones condicionales basadas en los permisos */}
                    <ExportMenu
                        filteredData={dataExport}
                        headers={headers}
                        title={'EJECUCIONES'}
                        properties={properties}
                        format={[1200,500]}
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
            <ModalEditExecution 
                modalVisible={modalVisible}
                closeModal={closeModal}
                record={estadoEditado}
                initialSelectCount={metaData?.initialSelectCount}
                setRefresh={setRefresh}
                metaData={metaData}
            />
        </Modal>
    )
}

export default ModalGoalExecuting