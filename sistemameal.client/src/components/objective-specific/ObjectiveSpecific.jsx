import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from './Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const ObjectiveSpecific = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'ObjetivoEspecifico';
    const fieldMapping = { codigo: 'objEspNum', nombre: 'objEspNom', 'Objetivo': 'objNom', 'Subproyecto': 'subProNomSap', 'Proyecto': 'proNom', 'Responsable': 'proRes','Periodo Inicio':'proPerIni','Periodo Fin': 'proPerFin' };
    const filterProperties = {
        'CODIGO_OBJETIVO_ESPECIFICO': 'objEspNum',
        'OBJETIVO_ESPECIFICO': 'objEspNom',
        'CODIGO_OBJETIVO': 'objNum',
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
                title='Objetivos Especificos'
                resize={false}
                format='A1'
                filterProperties={filterProperties}
            />
            <Modal
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Objetivo Específico'
            />  
        </>
    );
};

export default ObjectiveSpecific;
