import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
// Fetch Get
import { fetchData } from '../reusable/helper';
import Modal from './Modal';

const Objective = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'Objetivo';
    const fieldMapping = { codigo: 'objNum', nombre: 'objNom', 'Subproyecto': 'subProNom', 'Proyecto': 'proNom', 'Responsable': 'proRes','Periodo Inicio':'proPerAnoIni','Periodo Fin': 'proPerAnoFin' };
    const filterProperties = {
        'CODIGO': 'objNum',
        'OBJETIVO': 'objNom',
        'SUBPROYECTO': 'subProNom',
        'CODIGO_SAP': 'subProSap',
        'SUBPROYECTO': 'proNom',
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
                title='Objetivos'
                resize={false}
                format='A2'
                filterProperties={filterProperties}
            />
            <Modal
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Objetivo'
            />  
        </>
    );
};

export default Objective;
