import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from '../reusable/ModalForm/Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Indicator = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ select, setSelect ] = useState([]) // Nuevo caso
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    const controllerSelect = 'Actividad';
    // Definir controller y fieldMapping como variables
    const controller = 'Indicador';
    const fieldMapping = { codigo: 'indNum', nombre: 'indNom', 'Tipo de Indicador': 'indTipInd', 'Unidad': 'uniNom', 'Tipo de Valor': 'tipValNom', 'Actividad': 'actNom', 'Resultado': 'resNom', 'Objetivo Específico': 'objEspNom', 'Código Objetivo': 'objNum', 'Objetivo': 'objNom', 'Sub Proyecto': 'subProNom', 'Proyecto': 'proNom', 'Responsable': 'proRes','Periodo Inicio':'proPerIni','Periodo Fin': 'proPerFin' };
  
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

    return (
        <>
            <Table 
                data={data} 
                openModal={openModal} 
                setData={setData}
                controller={controller}
                fieldMapping={fieldMapping}
                title='Indicadores'
                resize={false}
                isLargePagination={true}
            />
            {/* <Modal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                fieldMapping={fieldMapping}
                controller={controller}
                title='Indicador'
                controllerSelect={controllerSelect}
                select={select}
                selectMapping={selectMapping}
            /> */}
        </>
    );
};

export default Indicator;
