import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from '../reusable/ModalForm/Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Activity = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'Actividad';
    const fieldMapping = { codigo: 'actNum', nombre: 'actNom', 'Resultado': 'resNom', 'Objetivo Específico': 'objEspNom', 'Objetivo': 'objNom', 'Subproyecto': 'subProNomSap', 'Proyecto': 'proNom', 'Responsable': 'proRes','Periodo Inicio':'proPerIni','Periodo Fin': 'proPerFin' };
    const filterProperties = {
        'CODIGO_ACTIVIDAD': 'actNum',
        'ACTIVIDAD': 'actNom',
        'CODIGO_RESULTADO': 'resNum',
        'RESULTADO': 'resNom',
        'CODIGO_OBJETIVO_ESPECIFICO': 'objEspNum',
        'OBJETIVO_ESPECIFICO': 'objEspNom',
        'CODIGO_OBJETIVO': 'objNum',
        'OBJETIVO': 'objNom',
        'SUBPROYECTO': 'subProNom',
        'CODIGO_SAP': 'subProSap',
        'PROYECTO': 'proNom',
        'RESPONSABLE': 'proRes',
        'AÑO_INICIO': 'proPerAnoIni',
        'MES_INICIO': 'proPerMesIniNombre',
        'AÑO_FIN': 'proPerAnoFin',
        'MES_FIN': 'proPerMesFinNombre',
    };
  
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
    }, []);

    return (
        <>
            <Table 
                data={data} 
                openModal={openModal} 
                setData={setData}
                controller={controller}
                fieldMapping={fieldMapping}
                title='Actividades'
                resize={false}
                filterProperties={filterProperties}
            />
            {/* <Modal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                fieldMapping={fieldMapping}
                controller={controller}
                codeField={codigo}
                title='Actividad'
                controllerSelect={controllerSelect}
                select={select}
                selectMapping={selectMapping}
            /> */}
        </>
    );
};

export default Activity;
