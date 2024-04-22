import  { useEffect, useState } from 'react'
import TableForm from './TableForm';
import Modal from 'react-modal';
import { fetchData } from '../../reusable/helper';

const ModalBeneficiariesAssociated = ({openModal, closeModal, metaData}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!openModal) {
            return;
        } else {
            fetchData(`Beneficiario/meta/${metaData.metAno}/${metaData.metCod}`, (data) => {
                setData(data)
            })
        }
    }, [openModal])


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
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Beneficiarios asociados a la meta</h2>
            <TableForm
                data={data}
                openModal={openModal}
                metaData={metaData}
            />
        </Modal>
    )
}

export default ModalBeneficiariesAssociated