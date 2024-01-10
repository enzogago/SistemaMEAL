import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Notiflix from "notiflix";
import Table from "./Table";

const ProjectList = () => {
    // Estados del AuthContext
    const { authInfo } = useContext(AuthContext);
    const { userLogged  } = authInfo;
    // States locales
    const [ proyectos, setProyectos ] = useState([])

    useEffect(() => {
        const fetchProyectos = async () => {
            if(userLogged){
                const token = localStorage.getItem('token');
                Notiflix.Loading.pulse('Cargando...');
                
                const usuAno = userLogged.usuAno;
                const usuCod = userLogged.usuCod;
                console.log(userLogged);
                try {
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/${usuAno}/${usuCod}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();
                    if (!response.ok) {
                            Notiflix.Notify.failure(data.message);
                        return;
                    }
                    console.log(data);
                    setProyectos(data);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    Notiflix.Loading.remove();
                }
            }
        };
    
        fetchProyectos();
    }, [userLogged]);

    return (
        <div className='bg-white h-100'>
            <Table 
                data={ proyectos }
            />
        </div>
    );
};

export default ProjectList;
