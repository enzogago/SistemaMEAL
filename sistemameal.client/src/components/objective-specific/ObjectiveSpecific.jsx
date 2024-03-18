import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from '../reusable/ModalForm/Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const ObjectiveSpecific = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ select, setSelect ] = useState([]) // Nuevo caso
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    const controllerSelect = 'Objetivo';
    // Definir controller y fieldMapping como variables
    const controller = 'ObjetivoEspecifico';
    const fieldMapping = { codigo: 'objEspNum', nombre: 'objEspNom' };
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
        value: item => JSON.stringify({ objCod: item.objCod, objAno: item.objAno }),
        display: item => item.objNom.toLowerCase(),
        properties: ['objCod', 'objAno'] // Aquí defines las propiedades que quieres extraer
    };

    return (
        <>
            <Table 
                data={data} 
                openModal={openModal} 
                setData={setData}
                controller={controller}
                fieldMapping={fieldMapping}
                title='Objetivos Especificos'
                resize={false}
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
                title='Objetivo Especifico'
                controllerSelect={controllerSelect}
                select={select}
                selectMapping={selectMapping}
            />
        </>
    );
};

export default ObjectiveSpecific;
