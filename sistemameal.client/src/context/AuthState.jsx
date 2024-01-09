import { useEffect, useReducer, useState } from "react";
import { authReducer } from "../reducers/authReducer"; // Asegúrate de definir este reducer
import { types } from "../types/types";
import { AuthContext } from "./AuthContext";
import Notiflix from "notiflix";

const AuthState = ({ children }) => {
    // Estados locales
    const [ userLogged, setUserLogged ] = useState({})

    const validarUsuario = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario/perfil`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                    const data = await response.json();
                    console.log(data.message)
                    setIsLoggedIn(false);
                    setUserLogged({})
                    localStorage.removeItem('token');
            }else {
                const data = await response.json();
                setUserLogged(data)
            }
        } catch (error) {
            console.error(`Error al hacer la solicitud: ${error}`);
        }
    };
    
    useEffect( () => {
        validarUsuario();
    }, []);
    
    const initialState = {
        isLoggedIn: false,
        users: [],
        menuData: [],
        userMaint: {},
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

    const setUserMaint = (userMaint) => {
        dispatch({ type: types.setUserMaint, payload: userMaint });
    }

    const resetUsers = () => {
        dispatch({ type: types.resetUsers });
    }

    // Agrupar en un solo objeto
    const authInfo = {
        isLoggedIn: state.isLoggedIn,
        users: state.users,
        menuData: state.menuData,
        userMaint: state.userMaint,
        userLogged
    };

    const authActions = {
        setIsLoggedIn,
        setUsers,
        setMenuData,
        setUserMaint,
        setUserLogged,
        resetUsers
    };

    return (
        <AuthContext.Provider value={{ authInfo, authActions }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthState;
