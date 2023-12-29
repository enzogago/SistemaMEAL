import { types } from "../types/types";

export const authReducer = (state, action) => {
    switch (action.type) {
        case types.setIsLoggedIn:
            return {
                ...state,
                isLoggedIn: action.payload
            }

        case types.setUsers:
            return {
                ...state,
                users: action.payload
            }

        case types.setMenuData:
            return {
                ...state,
                menuData: action.payload
            }

        case types.setUserMaint:
            return {
                ...state,
                userMaint: action.payload
            }
        default:
            return state;
    }
}
