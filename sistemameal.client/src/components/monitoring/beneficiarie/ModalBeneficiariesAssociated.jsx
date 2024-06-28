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
import { getMonth, getMonthYearText, tipoIndicadorMapping } from '../../reusable/columns';

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
                item.docIdeNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.benDir.toUpperCase().includes(tag.toUpperCase()) ||
                item.benNomApo.toUpperCase().includes(tag.toUpperCase()) ||
                item.benApeApo.toUpperCase().includes(tag.toUpperCase()) ||
                item.genNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.nacNom.toUpperCase().includes(tag.toUpperCase()) ||
                item.metBenEda.toUpperCase().includes(tag.toUpperCase()) ||
                item.benFecNac.toUpperCase().includes(tag.toUpperCase()) ||
                (item.benSex === 'M' && 'MASCULINO'.includes(tag.toUpperCase())) ||
                (item.benSex === 'F' && 'FEMENINO'.includes(tag.toUpperCase())) ||
                (periodoEjecucion ? periodoEjecucion.toUpperCase().includes(tag.toUpperCase()) : false)
            );
        });
    }, [data, searchTags]);

    const headers = ['CUB','TIPO DOCUMENTO','NOMBRE','APELLIDO','SEXO','GÉNERO','FECHA NACIMIENTO','EDAD EJECUTADO','NACIONALIDAD','EMAIL','TELÉFONO','DIRECCIÓN','NOMBRE APODERADO','APELLIDO APODERADO','TELÉFONO CONTACTO','AÑO EJECUTADO','MES EJECUTADO','UBICACIÓN EJECUTADA','INDICADOR','TIPO','RESULTADO','OBJETIVO ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO'];
    const properties = ['benCodUni','docIdeNom','benNom','benApe','benSex','genNom','benFecNac','metBenEda','nacNom','benCorEle','benTel','benDir','benNomApo','benApeApo','benTelCon','metBenAnoEjeTec','metBenMesEjeTec','ubiNom',['indNum','indNom'],'indTipInd',['resNum','resNom'],['objEspNum','objEspNom'],['objNum','objNom'],['subProSap','subProNom'],['proIde','proNom']];
    // Preparar los datos
    let dataExport = [...filteredData]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        benSex: item.benSex === 'M' ? 'MASCULINO' : 'FEMENINO',
        indTipInd: tipoIndicadorMapping[item.indTipInd].toUpperCase(),
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
                        format={[1600,800]}
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