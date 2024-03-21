import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from './Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Result = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'Resultado';
    const fieldMapping = { codigo: 'resNum', nombre: 'resNom', 'Objetivo Específico': 'objEspNom', 'Objetivo': 'objNom', 'Subproyecto': 'subProNomSap', 'Proyecto': 'proNom', 'Responsable': 'proRes','Periodo Inicio':'proPerIni','Periodo Fin': 'proPerFin' };
  
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
                title='Resultados'
                resize={false}
            />
            <Modal
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Resultado'
            />  
        </>
    );
};

export default Result;
