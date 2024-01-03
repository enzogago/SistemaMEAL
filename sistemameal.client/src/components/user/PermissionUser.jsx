import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import ProjectItem from "./ProjectItem";

const PermissionUser = () => {
  const navigate = useNavigate();
  // Variables State AuthContext 
  const { authInfo } = useContext(AuthContext);
  const { userMaint } = authInfo;
  //
  const [ proyectos, setProyectos ] = useState([]);
  const [checkedProyectos, setCheckedProyectos] = useState({});
  const [checkedSubProyectos, setCheckedSubProyectos] = useState({});

  const groupByProject = (data) => {
    const projectMap = data.reduce((map, item) => {
      if (!map[item.proCod]) {
        map[item.proCod] = { ...item, subProyectos: [] };
      }
      if (item.subProyecto && item.subProyecto.length > 0) {
        map[item.proCod].subProyectos.push(...item.subProyecto);
      }
      return map;
    }, {});
  
    const proyectos = Object.values(projectMap);
  
    return proyectos;
  };
  

  // EFECTO AL CARGAR COMPONENTE GET - LISTAR PROYECTOS
  useEffect(() => {
    const fetchProyectos = async () => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response)
            if (!response.ok) {
                if(response.status == 401 || response.status == 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                    // setIsLoggedIn(false);
                }
                return;
            }
            const data = await response.json();
            if (data.success == false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            const proyectos = groupByProject(data);
            setProyectos(proyectos);
            console.log(proyectos);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    fetchProyectos();
  }, []);

  

  const handleCheck = useCallback((item, isChecked, isSubProyecto = false) => {
    if (isSubProyecto) {
      setCheckedSubProyectos(prevChecked => ({
        ...prevChecked,
        [item.subProCod]: isChecked
      }));
  
      // Si se está marcando el checkbox, también marca el proyecto padre.
      if (isChecked) {
        setCheckedProyectos(prevChecked => ({
          ...prevChecked,
          [item.proCod]: isChecked
        }));
      }
    } else {
      setCheckedProyectos(prevChecked => ({
        ...prevChecked,
        [item.proCod]: isChecked
      }));
    }
  }, [checkedSubProyectos]);
  
  
  
  const renderProyecto = (proyecto) => (
    <ProjectItem 
      key={proyecto.proCod} 
      proyecto={proyecto} 
      handleCheck={handleCheck} 
      checkedProyectos={checkedProyectos} 
      checkedSubProyectos={checkedSubProyectos} 
    />
  );


  return (
    <div className="PowerMas_MenuUserContainer h-100 bg-white Large-p2_5">
      <h1 className="Large-f1_25">Permisos para el usuario {userMaint.usuNom} {userMaint.usuApe} con código {userMaint.usuAno}{userMaint.usuCod}</h1>
      <div>
        <div className="PowerMas_ListPermission">
          <ul>
            {proyectos.map(proyecto => renderProyecto(proyecto))}
          </ul>
        </div>
      </div>
      <button> Siguiente </button>
    </div>
  )
}

export default PermissionUser