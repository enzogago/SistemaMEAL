import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';

import Modal from './Modal';

// Fetch Get
import { fetchData } from '../reusable/helper';

const Financer = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'Financiador';
    const fieldMapping = { 'Código de Financiación': 'finIde',SAP: 'finSap', nombre: 'finNom', moneda: 'monNom'};
    const filterProperties = {
        'CODIGO_FINANCIACION': 'finIde',
        'SAP': 'finSap',
        'NOMBRE': 'finNom',
        'MONEDA': 'monNom',
    };
    const { codigo, ...restFieldMapping } = fieldMapping;
  
    // Toggle Modal
    const openModal = (estado = null) => {
        for (let key in estado) {
            if (typeof estado[key] === 'string') {
                estado[key] = estado[key].replace(/\s+/g, ' ').trim();
            }
        }
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
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Financiador'
            />  
        </>
    )
}

export default Financer