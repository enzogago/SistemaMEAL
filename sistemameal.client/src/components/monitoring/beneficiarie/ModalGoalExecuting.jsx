import Modal from 'react-modal';
import TableExecuting from './TableExecuting';
import { useEffect, useState } from 'react';
import { fetchData } from '../../reusable/helper';

const ModalGoalExecuting = ({openModalGoalExecuting, closeModalExecuting, metaData}) => {

    useEffect(() => {
        if (!openModalGoalExecuting) {
            return;
        } else {
            fetchData(`Meta/executing/${metaData.metAno}/${metaData.metCod}`, (data) => {
                console.log(data)
                setData(data)
            })
        }
    }, [openModalGoalExecuting])

    const [data, setData] = useState([]);
    return (
        <Modal
            ariaHideApp={false}
            isOpen={openModalGoalExecuting}
            onRequestClose={closeModalExecuting}
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
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModalExecuting}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Ejecuciones asociados a la meta</h2>

            <TableExecuting
                data={data}
                openModalGoalExecuting={openModalGoalExecuting}
                metaData={metaData}
            />
        </Modal>
    )
}

export default ModalGoalExecuting