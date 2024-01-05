import { types } from "../types/types";

export const statusReducer = (state, action) => {
    switch (action.type) {
        

        case types.setModalVisible:
            return {
                ...state,
                modalVisible: action.payload
            }

        case types.setNombreEstado:
            return {
                ...state,
                nombreEstado: action.payload
            }

        case types.setEstadoEditado:
            return {
                ...state,
                estadoEditado: action.payload
            }
        case types.setEstados:
            return {
                ...state,
                estados: action.payload
            }
            
        case types.setDocumentosIdentidad:
            return {
                ...state,
                documentosIdentidad: action.payload
            }

        case types.setCargos:
            return {
                ...state,
                cargos: action.payload
            }

        case types.setRoles:
            return {
                ...state,
                roles: action.payload
            }

        case types.setFinanciadores:
            return {
                ...state,
                financiadores: action.payload
            }

        case types.setImplementadores:
            return {
                ...state,
                implementadores: action.payload
            }

        case types.setTiposValor:
            return {
                ...state,
                tiposValor: action.payload
            }

        case types.setPermisos:
            return {
                ...state,
                permisos: action.payload
            }
        
        case types.resetStatus:
            return {
                estados: [],
                modalVisible: false,
                nombreEstado: '',
                estadoEditado: null,
            };

        default:
            return state;
    }
}
