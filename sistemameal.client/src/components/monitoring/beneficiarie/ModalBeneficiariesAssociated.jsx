import  { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal';
import SearchTagsInput from '../../reusable/Tables/SearchTagsInput';
import ExportMenu from '../../reusable/Tables/ExportMenu';
import CommonTable from '../../reusable/Tables/CommonTable';
import { useSearchTags } from '../../../hooks/useSearchTags';
import { getColumns } from './columns';
import useEntityActions from '../../../hooks/useEntityActions';
import { fetchDataBlock } from '../../reusable/fetchs';
import ModalEditBeneficiarie from './ModalEditBeneficiarie';
import useModal from '../../../hooks/useModal';
import { getMonth, getMonthYearText } from '../../reusable/columns';

const ModalBeneficiariesAssociated = ({openModal, closeModal, metaData, update, setUpdate, initialSelectCount}) => {
    // Estados locales para manejar los datos y el refresco de la tabla
   const [ data, setData ] = useState([]);

   // Obtener las acciones permitidas para la entidad 'BENEFICIARIO'
   const actions = useEntityActions('BENEFICIARIO');

   const { modalVisible, estadoEditado, openModal: openModalForm, closeModal: closeModalForm } = useModal();

    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        if (openModal) {
            fetchDataBlock(`Beneficiario/meta/${metaData.metAno}/${metaData.metCod}`, setData, '.table-beneficiarie-block');
        } else {
            setData([])
        }
    }, [openModal, update]);

    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions, openModalForm, setUpdate), [actions, openModalForm, setUpdate]);

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
            const periodoEjecucion = getMonthYearText(item.metBenMesEjeTec, item.metBenAnoEjeTec);
            return searchTags.every(tag => 
                item.benAno.toUpperCase().includes(tag.toUpperCase()) ||
                item.benCod.toUpperCase().includes(tag.toUpperCase()) ||
                item.benNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.benApe.toUpperCase().includes(tag.toUpperCase()) ||
                item.benCorEle.toUpperCase().includes(tag.toUpperCase()) ||
                item.benTel.toUpperCase().includes(tag.toUpperCase()) ||
                item.benTelCon.toUpperCase().includes(tag.toUpperCase()) ||
                item.benCodUni.toUpperCase().includes(tag.toUpperCase()) ||
                item.benDir.toUpperCase().includes(tag.toUpperCase()) ||
                item.benNomApo.toUpperCase().includes(tag.toUpperCase()) ||
                item.benApeApo.toUpperCase().includes(tag.toUpperCase()) ||
                item.genNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.nacNom.toUpperCase().includes(tag.toUpperCase()) ||
                (item.benSex === 'M' && 'MASCULINO'.includes(tag.toUpperCase())) ||
                (item.benSex === 'F' && 'FEMENINO'.includes(tag.toUpperCase())) ||
                item.indNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.indNum.toUpperCase().includes(tag.toUpperCase()) ||
                item.resNum.toUpperCase().includes(tag.toUpperCase()) ||
                item.resNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.objEspNum.toUpperCase().includes(tag.toUpperCase()) ||
                item.objEspNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.objNum.toUpperCase().includes(tag.toUpperCase()) ||
                item.objNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.subProSap.toUpperCase().includes(tag.toUpperCase()) ||
                item.subProNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.proIde.toUpperCase().includes(tag.toUpperCase()) ||
                item.proNom.toUpperCase().includes(tag.toUpperCase()) ||
                (periodoEjecucion ? periodoEjecucion.toUpperCase().includes(tag.toUpperCase()) : false)
            );
        });
    }, [data, searchTags]);

    const headers = ['CUB','NOMBRE','APELLIDO','EMAIL','TELÉFONO','TELÉFONO CONTACTO','DIRECCIÓN','NOMBRE APODERADO','APELLIDO APODERADO','GÉNERO','NACIONALIDAD','AÑO EJECUTADO','MES EJECUTADO','UBICACIÓN EJECUTADA','INDICADOR','RESULTADO','OBJETIVO ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO'];
    const properties = ['benCodUni','benNom','benApe','benCorEle','benTel','benTelCon','benDir','benNomApo','benApeApo','genNom','nacNom','metBenAnoEjeTec','metBenMesEjeTec','ubiNom',['indNum','indNom'],['resNum','resNom'],['objEspNum','objEspNom'],['objNum','objNom'],['subProSap','subProNom'],['proIde','proNom']];
    // Preparar los datos
    let dataExport = [...filteredData]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        metBenMesEjeTec: getMonth(item.metBenMesEjeTec),
    }));

    return (
        <Modal
            ariaHideApp={false}
            isOpen={openModal}
            onRequestClose={closeModal}
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
            <div className="flex flex-column gap_25 flex-grow-1 overflow-auto table-beneficiarie-block">
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Beneficiarios asociados a la meta</h2>
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
                        title={'BENEFICIARIOS'}
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
            <ModalEditBeneficiarie 
                modalVisible={modalVisible}
                closeModalEdit={closeModalForm} 
                record={estadoEditado}
                setUpdate={setUpdate}
                metaData={metaData}
                initialSelectCount={initialSelectCount}
            />
        </Modal>
    )
}

export default ModalBeneficiariesAssociated