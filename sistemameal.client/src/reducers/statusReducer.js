import { types } from "../types/types";

export const statusReducer = (state, action) => {
    switch (action.type) {
        case types.setEstados:
            return {
                ...state,
                estados: action.payload
            }

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

        default:
            return state;
    }
}
