import { types } from "../types/types";

export const authReducer = (state, action) => {
    console.log('action', action);
    switch (action.type) {
        case types.setIsLoggedIn:
            return {
                ...state,
                isLoggedIn: action.payload
            }
        case types.setUser:
            const newState = {
                ...state,
                user: action.payload
            };
            console.log('newState', newState);
            return newState;
        default:
            return state;
    }
}
