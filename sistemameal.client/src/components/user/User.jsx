import { useEffect, useState } from "react";
// Libraries
import Notiflix from 'notiflix';
// Componentes
import Table from "./Table"

const User = () => {
    const [ usersTable, setUsersTable] = useState([])

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                setUsersTable(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
    
        fetchUsuarios();
    }, []);
    return (
        <>
            <Table
                data={ usersTable }
            />
        </>
    )
}

export default User