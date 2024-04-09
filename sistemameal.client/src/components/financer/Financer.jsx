import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from '../reusable/ModalForm/Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Financer = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'Financiador';
    const fieldMapping = { codigo: 'finIde', nombre: 'finNom'};
    const filterProperties = {
        'CODIGO': 'finIde',
        'NOMBRE': 'finNom',
    };
    const { codigo, ...restFieldMapping } = fieldMapping;
  
    // Toggle Modal
    const openModal = (estado = null) => {
        setEstadoEditado(estado);
        setModalVisible(true);
    };
    const closeModal = () => {
        setEstadoEditado(null);
        setModalVisible(false);
    };
  
    // Cargar los registros
    useEffect(() => {
        fetchData(controller, setData);
    }, []);

    return (
        <>
            <Table
                data={data} 
                openModal={openModal} 
                setData={setData}
                controller={controller}
                fieldMapping={fieldMapping}
                title='Financiadores'
                filterProperties={filterProperties}
            />

            <Modal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                fieldMapping={fieldMapping}
                controller={controller}
                codeField={codigo}
                title='Financiador'
            />
        </>
    )
}

export default Financer