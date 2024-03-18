import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from '../reusable/ModalForm/Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Subproject = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ select, setSelect ] = useState([]) // Nuevo caso
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    const controllerSelect = 'Proyecto';
    // Definir controller y fieldMapping como variables
    const controller = 'SubProyecto';
    const fieldMapping = { 'codigoSAP': 'subProSap', nombre: 'subProNom','Nombre Proyecto': 'proNom', 'Responsable': 'proRes' };
    const { codigo, ...restFieldMapping } = fieldMapping;
  
    // Toggle Modal
    const openModal = (estado = null) => {
        for (let key in estado) {
            if (typeof estado[key] === 'string') {
                estado[key] = estado[key].replace(/\s+/g, ' ').trim();
            }
        }
        console.log(estado)
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
        fetchData(controllerSelect, setSelect);
    }, []);

    // En tu componente principal, defines el mapeo
    const selectMapping = {
        value: item => JSON.stringify({ proCod: item.proCod, proAno: item.proAno }),
        display: item => item.proNom.toLowerCase(),
        properties: ['proCod', 'proAno'] // Aquí defines las propiedades que quieres extraer
    };

    return (
        <>
            <Table 
                data={data} 
                openModal={openModal} 
                setData={setData}
                controller={controller}
                fieldMapping={fieldMapping}
                title='Sub Proyectos'
                resize={false}
            />
            <Modal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                fieldMapping={restFieldMapping}
                controller={controller}
                codeField={codigo}
                title='Sub Proyecto'
                controllerSelect={controllerSelect}
                select={select}
                selectMapping={selectMapping}
            />
        </>
    );
};

export default Subproject;
