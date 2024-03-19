import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from '../reusable/ModalForm/Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Result = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ select, setSelect ] = useState([]) // Nuevo caso
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    const controllerSelect = 'ObjetivoEspecifico';
    // Definir controller y fieldMapping como variables
    const controller = 'Resultado';
    const fieldMapping = { codigo: 'resNum', nombre: 'resNom', 'Código Objetivo Específico': 'objEspNum', 'Objetivo Específico': 'objEspNom', 'Código Objetivo': 'objNum', 'Objetivo': 'objNom', 'Sub Proyecto': 'subProNom', 'Proyecto': 'proNom' };
  
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
        value: item => JSON.stringify({ objEspCod: item.objEspCod, objEspAno: item.objEspAno }),
        display: item => item.objEspNom.toLowerCase(),
        properties: ['objEspCod', 'objEspAno'] // Aquí defines las propiedades que quieres extraer
    };

    return (
        <>
            <Table 
                data={data} 
                openModal={openModal} 
                setData={setData}
                controller={controller}
                fieldMapping={fieldMapping}
                title='Resultados'
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
                title='Resultado'
                controllerSelect={controllerSelect}
                select={select}
                selectMapping={selectMapping}
            />
        </>
    );
};

export default Result;
