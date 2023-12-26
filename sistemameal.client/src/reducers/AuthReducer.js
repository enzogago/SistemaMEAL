import { types } from "../types/types";

export const authReducer = (state, action) => {
    switch (action.type) {
        case types.setIsLoggedIn:
            return {
                ...state,
                isLoggedIn: action.payload
            }

        case types.setUser:
            return {
                ...state,
                user: action.payload
            }

        case types.setUsers:
            return {
                ...state,
                users: action.payload
            }

        default:
            return state;
    }
}
