import { useReducer } from "react";
import { authReducer } from "../reducers/authReducer"; // Asegúrate de definir este reducer
import { types } from "../types/types";
import { AuthContext } from "./AuthContext";

const AuthState = ({ children }) => {
    const initialState = {
        isLoggedIn: false,
        users: [],
        menuData: []
    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Funciones dispatch
    const setIsLoggedIn = (isLoggedIn) => {
        dispatch({ type: types.setIsLoggedIn, payload: isLoggedIn });
    }

    const setUsers = (users) => {
        dispatch({ type: types.setUsers, payload: users });
    }

    const setMenuData = (menuData) => {
        dispatch({ type: types.setMenuData, payload: menuData });
    }

    // Agrupar en un solo objeto
    const authInfo = {
        isLoggedIn: state.isLoggedIn,
        users: state.users,
        menuData: state.menuData,
    };

    const authActions = {
        setIsLoggedIn,
        setUsers,
        setMenuData,
    };

    return (
        <AuthContext.Provider value={{ authInfo, authActions }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthState;
