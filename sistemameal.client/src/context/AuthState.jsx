import { useReducer } from "react";
import { authReducer } from "../reducers/AuthReducer"; // Asegúrate de definir este reducer
import { types } from "../types/types";
import { AuthContext } from "./AuthContext";

const AuthState = ({ children }) => {
    const initialState = {
        isLoggedIn: false,
        user: null, // Nuevo estado para el usuario
    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Funciones dispatch
    const setIsLoggedIn = (isLoggedIn) => {
        dispatch({ type: types.setIsLoggedIn, payload: isLoggedIn });
    }

    const setUser = (user) => { // Nueva función para actualizar el usuario
        dispatch({ type: types.setUser, payload: user });
    }

    // Agrupar en un solo objeto
    const authInfo = {
        isLoggedIn: state.isLoggedIn,
        user: state.user, // Agregar el usuario al objeto authInfo
    };

    const authActions = {
        setIsLoggedIn,
        setUser, // Agregar setUser a las acciones
    };

    return (
        <AuthContext.Provider value={{ authInfo, authActions }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthState;
