import { useReducer } from "react";
import { statusReducer } from "../reducers/statusReducer";
import { StatusContext } from "./StatusContext";
import { types } from "../types/types";

const StatusState = ({ children }) => {
    const initialState = {
        estados: [],
        modalVisible: false,
        nombreEstado: '',
        estadoEditado: null,
    }

    const [state, dispatch] = useReducer(statusReducer, initialState);

    // Funciones dispatch
    const setEstados = (estados) => {
        dispatch({ type: types.setEstados, payload: estados });
    }

    const setModalVisible = (visible) => {
        dispatch({ type: types.setModalVisible, payload: visible });
    }

    const setNombreEstado = (nombre) => {
        dispatch({ type: types.setNombreEstado, payload: nombre });
    }

    const setEstadoEditado = (estado) => {
        dispatch({ type: types.setEstadoEditado, payload: estado });
    }

    // Agrupar en un solo objeto
    const statusInfo = {
        estados: state.estados,
        modalVisible: state.modalVisible,
        nombreEstado: state.nombreEstado,
        estadoEditado: state.estadoEditado,
    };

    const statusActions = {
        setEstados,
        setModalVisible,
        setNombreEstado,
        setEstadoEditado,
    };

    return (
        <StatusContext.Provider value={{ statusInfo, statusActions }}>
            {children}
        </StatusContext.Provider>
    );
};

export default StatusState