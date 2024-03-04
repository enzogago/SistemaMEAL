import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import ContentForm from '../../beneficiarie/ContentForm';
import Notiflix from 'notiflix';
import { handleSubmit } from '../../beneficiarie/eventHandlers';

const ModalEditBeneficiarie = ({modalVisible, closeModalEdit, record, updateData, setUpdateData}) => {
    const { benAno, benCod } = record;
    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = useForm({ mode: "onChange", defaultValues: { benNomApo: '', benApeApo: ''}});

    const handleEdit = () => {
        validateForm((data) => {
            handleSubmit(true, data, closeModalEdit, updateData, setUpdateData);
        })();
    }

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalVisible}
            onRequestClose={closeModalEdit}
            contentLabel="Table Form"
            closeTimeoutMS={200}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    width: '80%',
                    height: '90%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column'
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
        >  
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModalEdit}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Editar datos del beneficiario</h2>
            <ContentForm
                register={register}
                dirtyFields={dirtyFields}
                isSubmitted={isSubmitted}
                errors={errors}
                reset={reset}
                watch={watch}
                trigger={trigger}
                setValue={setValue}
                benAno={benAno}
                benCod={benCod}
            />
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={closeModalEdit} className="Large_3 m_75 PowerMas_Buttom_Secondary">Cerrar</button>
                <button onClick={handleEdit} className="Large_3 m_75 PowerMas_Buttom_Primary">Siguiente</button>
            </footer>
        </Modal>
    )
}

export default ModalEditBeneficiarie