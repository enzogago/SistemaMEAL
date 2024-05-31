import { useState } from "react";

const useModal = (fetchDataFunctions = []) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoEditado, setEstadoEditado] = useState(null);

    const openModal = async (estado = null) => {
        
        console.log(estado)
        // Limpieza de los datos del estado si es necesario
        if (estado) {
            for (let key in estado) {
                if (typeof estado[key] === 'string') {
                    estado[key] = estado[key].replace(/\s+/g, ' ').trim();
                }
            }
        }

        // Ejecutar todas las funciones de carga de datos en paralelo
        try {
            await Promise.all(fetchDataFunctions.map(func => func()));
            setEstadoEditado(estado);
            setModalVisible(true);
        } catch (error) {
            console.error('Error al cargar los datos para el modal:', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setEstadoEditado(null);
    };

    return { modalVisible, estadoEditado, openModal, closeModal };
};

export default useModal;
