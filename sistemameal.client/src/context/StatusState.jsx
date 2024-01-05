import { useReducer } from "react";
import { statusReducer } from "../reducers/statusReducer";
import { StatusContext } from "./StatusContext";
import { types } from "../types/types";

const StatusState = ({ children }) => {
    const initialState = {
        modalVisible: false,
        nombreEstado: '',
        estadoEditado: null,
        estados: [],
        documentosIdentidad: [],
        cargos: [],
        roles: [],
        financiadores: [],
        implementadores: [],
        tiposValor: [],
        permisos: [],
    }

    const [state, dispatch] = useReducer(statusReducer, initialState);

    // Funciones dispatch
    const setModalVisible = (visible) => {
        dispatch({ type: types.setModalVisible, payload: visible });
    }
    
    const setNombreEstado = (nombre) => {
        dispatch({ type: types.setNombreEstado, payload: nombre });
    }
    
    const setEstadoEditado = (estado) => {
        dispatch({ type: types.setEstadoEditado, payload: estado });
    }

    const resetStatus = () => {
        dispatch({ type: types.resetStatus });
    }
    
    const setDocumentosIdentidad = (documentosIdentidad) => {
        dispatch({ type: types.setDocumentosIdentidad, payload: documentosIdentidad });
    }
    
    const setEstados = (estados) => {
        dispatch({ type: types.setEstados, payload: estados });
    }

    const setCargos = (cargos) => {
        dispatch({ type: types.setCargos, payload: cargos });
    }

    const setRoles = (roles) => {
        dispatch({ type: types.setRoles, payload: roles });
    }

    const setFinanciadores = (financiadores) => {
        dispatch({ type: types.setFinanciadores, payload: financiadores });
    }

    const setImplementadores = (implementadores) => {
        dispatch({ type: types.setImplementadores, payload: implementadores });
    }

    const setTiposValor = (tiposValor) => {
        dispatch({ type: types.setTiposValor, payload: tiposValor });
    }

    const setPermisos = (permisos) => {
        dispatch({ type: types.setPermisos, payload: permisos });
    }
    

    // Agrupar en un solo objeto
    const statusInfo = {
        modalVisible: state.modalVisible,
        nombreEstado: state.nombreEstado,
        estadoEditado: state.estadoEditado,
        estados: state.estados,
        documentosIdentidad: state.documentosIdentidad,
        cargos: state.cargos,
        roles: state.roles,
        financiadores: state.financiadores,
        implementadores: state.implementadores,
        tiposValor: state.tiposValor,
        permisos: state.permisos,
    };

    const statusActions = {
        setModalVisible,
        setNombreEstado,
        setEstadoEditado,
        resetStatus,
        setEstados,
        setDocumentosIdentidad,
        setCargos,
        setRoles,
        setFinanciadores,
        setImplementadores,
        setTiposValor,
        setPermisos,
        
    };

    return (
        <StatusContext.Provider value={{ statusInfo, statusActions }}>
            {children}
        </StatusContext.Provider>
    );
};

export default StatusState