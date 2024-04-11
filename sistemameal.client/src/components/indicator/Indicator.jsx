import { useEffect, useState } from 'react';
// Componentes
import Table from '../reusable/Table/Table';
import Modal from './Modal';
// Fetch Get
import { fetchData } from '../reusable/helper';

const Indicator = () => {
    // States locales
    const [ unidades, setUnidades] = useState([]);
    const [ tiposDeValor, setTiposDeValor] = useState([]);
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    // Definir controller y fieldMapping como variables
    const controller = 'Indicador';
    const fieldMapping = { codigo: 'indNum', nombre: 'indNom', 'Tipo de Indicador': 'indTipInd', 'Unidad': 'uniNom', 'Tipo de Valor': 'tipValNom', 'Actividad': 'actNom', 'Resultado': 'resNom', 'Objetivo Específico': 'objEspNom', 'Código Objetivo': 'objNum', 'Objetivo': 'objNom', 'Sub Proyecto': 'subProNom', 'Proyecto': 'proNom', 'Responsable': 'subProRes','Periodo Inicio':'subProPerIni','Periodo Fin': 'subProPerFin' };
    const filterProperties = {
        'CODIGO_INDICADOR': 'indNum',
        'INDICADOR': 'indNom',
        'TIPO_INDICADOR': 'indTipIndNombre',
        'UNIDAD': 'uniNom',
        'TIPO_VALOR': 'tipValNom',
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
        'RESPONSABLE': 'subProRes',
        'AÑO_INICIO': 'subProPerAnoIni',
        'MES_INICIO': 'subProPerMesIniNombre',
        'AÑO_FIN': 'subProPerAnoFin',
        'MES_FIN': 'subProPerMesFinNombre',
    };

    // Toggle Modal
    const openModal = async (estado = null) => {
        console.log(estado)
        for (let key in estado) {
            if (typeof estado[key] === 'string') {
                estado[key] = estado[key].replace(/\s+/g, ' ').trim();
            }
        }
        await fetchData('Unidad',setUnidades)
        await fetchData('TipoValor',setTiposDeValor)
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
                title='Indicadores'
                resize={false}
                isLargePagination={true}
                format='A1'
                filterProperties={filterProperties}
            />
            <Modal
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Indicador'
                unidades={unidades}
                tiposDeValor={tiposDeValor}
            />  
        </>
    );
};

export default Indicator;
