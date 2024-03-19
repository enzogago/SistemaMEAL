import { useEffect, useState } from "react";
import Table from "./Table";
import { fetchData } from "../reusable/helper";
import Modal from "./Modal";

const projects = () => {
    // States locales
    const [ data, setData ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ estadoEditado, setEstadoEditado ] = useState(false)

    const openModal = (estado = null) => {
        setEstadoEditado(estado);
        setModalVisible(true);
    };
    const closeModal = () => {
        setEstadoEditado(null);
        setModalVisible(false);
    };

    useEffect(() => {
        fetchData('Proyecto',setData)
    }, []);

    return (
        <>
            <Table 
                data={data}
                setData= {setData}
                openModal={openModal} 
            />
            <Modal
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal} 
                setData={setData}
                title='Proyecto'
            />  
        </>
    );
};

export default projects;
