import  { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal';
import SearchTagsInput from '../../reusable/Tables/SearchTagsInput';
import ExportMenu from '../../reusable/Tables/ExportMenu';
import CommonTable from '../../reusable/Tables/CommonTable';
import { useSearchTags } from '../../../hooks/useSearchTags';
import { getColumns } from './columns';
import useEntityActions from '../../../hooks/useEntityActions';
import { fetchDataLoading } from '../../reusable/fetchs';
import ModalEditBeneficiarie from './ModalEditBeneficiarie';
import useModal from '../../../hooks/useModal';

const ModalBeneficiariesAssociated = ({openModal, closeModal, metaData, update, setUpdate, initialSelectCount}) => {
    // Estados locales para manejar los datos y el refresco de la tabla
   const [ data, setData ] = useState([]);

   // Obtener las acciones permitidas para la entidad 'BENEFICIARIO'
   const actions = useEntityActions('BENEFICIARIO');

   const { modalVisible, estadoEditado, openModal: openModalForm, closeModal: closeModalForm } = useModal();

    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        if (openModal) {
            fetchDataLoading(`Beneficiario/meta/${metaData.metAno}/${metaData.metCod}`, setData);
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
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
                item.benAno.includes(tag.toUpperCase()) ||
                item.benCod.includes(tag.toUpperCase()) ||
                item.benNom.includes(tag.toUpperCase()) ||
                item.benApe.includes(tag.toUpperCase()) ||
                item.benCorEle.includes(tag.toUpperCase()) ||
                item.benTel.includes(tag.toUpperCase()) ||
                item.benTelCon.includes(tag.toUpperCase()) ||
                item.benCodUni.includes(tag.toUpperCase()) ||
                item.benDir.includes(tag.toUpperCase()) ||
                item.benNomApo.includes(tag.toUpperCase()) ||
                item.benApeApo.includes(tag.toUpperCase()) ||
                item.genNom.includes(tag.toUpperCase()) ||
                item.nacNom.includes(tag.toUpperCase()) ||
                (item.benSex === 'M' && 'MASCULINO'.includes(tag.toUpperCase())) ||
                (item.benSex === 'F' && 'FEMENINO'.includes(tag.toUpperCase()))
            )
        ), [data, searchTags]
    );

    const headers = ['CUB','NOMBRE','APELLIDO','EMAIL','TELÉFONO','TELÉFONO CONTACTO','DIRECCIÓN','NOMBRE APODERADO','APELLIDO APODERADO','GÉNERO','NACIONALIDAD'];
    const properties = ['benCodUni','benNom','benApe','benCorEle','benTel','benTelCon','benDir','benNomApo','benApeApo','genNom','nacNom'];

    return (
        <Modal
            ariaHideApp={false}
            isOpen={openModal}
            onRequestClose={closeModal}
            closeTimeoutMS={200}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    width: '90%',
                    height: '90%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column',
                    
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 30
                }
            }}
        >
            <div className="flex flex-column gap_25 flex-grow-1 overflow-auto">
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
                        filteredData={filteredData}
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