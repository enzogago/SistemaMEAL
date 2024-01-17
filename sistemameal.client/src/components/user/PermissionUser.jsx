import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import ProjectItem from "./ProjectItem";

const PermissionUser = () => {
  const navigate = useNavigate();
  // Variables State AuthContext 
  const { authInfo } = useContext(AuthContext);
  const { userMaint } = authInfo;
  //
  const [ proyectos, setProyectos ] = useState([]);
  const [ checkedProyectos, setCheckedProyectos ] = useState({});
  const [ checkedSubProyectos, setCheckedSubProyectos ] = useState({});
  const [ addedProyectos, setAddedProyectos ] = useState({});
  const [ addedSubProyectos, setAddedSubProyectos ] = useState({});
  const [ removedProyectos, setRemovedProyectos ] = useState({});
  const [ removedSubProyectos, setRemovedSubProyectos ] = useState({});


  useEffect(() => {
    // Verifica si userMaint es un objeto vacío
    if (!userMaint || Object.keys(userMaint).length === 0) {
        // Si es un objeto vacío, redirige al usuario a Table
        navigate('/user');
    }
  }, [userMaint, navigate]);
  

  // EFECTO AL CARGAR COMPONENTE GET - LISTAR PROYECTOS
  useEffect(() => {
    let isCancelled = false;

    const fetchProyectos = async () => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                Notiflix.Notify.failure(data.message);
                return;
            }
            const data = await response.json();
            console.log(data)
            if (!isCancelled) {
                setProyectos(data);
            }
        } catch (error) {
            Notiflix.Notify.failure('Ha ocurrido un error al cargar los proyectos.');
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const fetchProyectosAccesibles = async () => {
      try {
          Notiflix.Loading.pulse('Cargando...');
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/accesibles/${userMaint.usuAno}/${userMaint.usuCod}`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (!response.ok) {
              const data = await response.json();
              Notiflix.Notify.failure(data.message);
              return;
          }
          const data = await response.json();
          console.log(data)
          if (!isCancelled) {
            let newCheckedProyectos = { ...checkedProyectos };
            let newCheckedSubProyectos = { ...checkedSubProyectos };
    
            data.forEach(proyecto => {
                newCheckedProyectos[`${proyecto.proAno}-${proyecto.proCod}`] = true;
                if (proyecto.subProyectos) {
                    proyecto.subProyectos.forEach(subProyecto => {
                        newCheckedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`] = true;
                    });
                }
            });
            setCheckedProyectos(newCheckedProyectos);
            setCheckedSubProyectos(newCheckedSubProyectos);
          }
      } catch (error) {
          console.log(error)
          Notiflix.Notify.failure('Ha ocurrido un error al cargar los proyectos accesibles.');
      } finally {
          Notiflix.Loading.remove();
      }
    };

    fetchProyectos();
    fetchProyectosAccesibles();

    return () => {
        isCancelled = true;
    };
  }, []);


  const handleCheck = (item, isChecked, isSubProyecto, proyecto) => {
    let newCheckedProyectos = { ...checkedProyectos };
    let newCheckedSubProyectos = { ...checkedSubProyectos };
    let newAddedProyectos = { ...addedProyectos };
    let newAddedSubProyectos = { ...addedSubProyectos };
    let newRemovedProyectos = { ...removedProyectos };
    let newRemovedSubProyectos = { ...removedSubProyectos };

    if (isSubProyecto) {
        newCheckedSubProyectos[`${item.subProAno}-${item.subProCod}`] = isChecked;
        if (isChecked && !newCheckedProyectos[`${proyecto.proAno}-${proyecto.proCod}`]) {
          newCheckedProyectos[`${proyecto.proAno}-${proyecto.proCod}`] = isChecked;
          // Solo agrega el proyecto a newAddedProyectos si no está en newRemovedProyectos
          if (!newRemovedProyectos[`${proyecto.proAno}-${proyecto.proCod}`]) {
              newAddedProyectos[`${proyecto.proAno}-${proyecto.proCod}`] = proyecto;
          }
          delete newRemovedProyectos[`${proyecto.proAno}-${proyecto.proCod}`];
        }

        if (isChecked) {
            // Solo agrega el subproyecto a newAddedSubProyectos si no está en newRemovedSubProyectos
            if (!newRemovedSubProyectos[`${item.subProAno}-${item.subProCod}`]) {
                newAddedSubProyectos[`${item.subProAno}-${item.subProCod}`] = item;
            }
            delete newRemovedSubProyectos[`${item.subProAno}-${item.subProCod}`];
        } else {
            // Solo agrega el subproyecto a newRemovedSubProyectos si no está en newAddedSubProyectos
            if (!newAddedSubProyectos[`${item.subProAno}-${item.subProCod}`]) {
                newRemovedSubProyectos[`${item.subProAno}-${item.subProCod}`] = item;
            }
            delete newAddedSubProyectos[`${item.subProAno}-${item.subProCod}`];
        }
    } else {
        newCheckedProyectos[`${item.proAno}-${item.proCod}`] = isChecked;
        if (isChecked) {
            // Solo agrega el proyecto a newAddedProyectos si no está en newRemovedProyectos
            if (!newRemovedProyectos[`${item.proAno}-${item.proCod}`]) {
                newAddedProyectos[`${item.proAno}-${item.proCod}`] = item;
            }
            delete newRemovedProyectos[`${item.proAno}-${item.proCod}`];
        } else {
            // Solo agrega el proyecto a newRemovedProyectos si no está en newAddedProyectos
            if (!newAddedProyectos[`${item.proAno}-${item.proCod}`]) {
                newRemovedProyectos[`${item.proAno}-${item.proCod}`] = item;
            }
            delete newAddedProyectos[`${item.proAno}-${item.proCod}`];
        }
        if (item.subProyectos) {
          item.subProyectos.forEach(subProyecto => {
            // Solo desmarca el subproyecto si está marcado
            if (newCheckedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`]) {
                newCheckedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`] = isChecked;
                if (!newAddedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`]) {
                  newRemovedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`] = subProyecto;
                }
                delete newAddedSubProyectos[`${subProyecto.subProAno}-${subProyecto.subProCod}`];
            }
          });
        }
    }

    setCheckedProyectos(newCheckedProyectos);
    setCheckedSubProyectos(newCheckedSubProyectos);
    setAddedProyectos(newAddedProyectos);
    setAddedSubProyectos(newAddedSubProyectos);
    setRemovedProyectos(newRemovedProyectos);
    setRemovedSubProyectos(newRemovedSubProyectos);
    console.log(newAddedProyectos);
    console.log(newAddedSubProyectos);
    console.log(newRemovedProyectos);
    console.log(newRemovedSubProyectos);
  };


  const agregarExclusiones = async (proyectos, subProyectos) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/agregar-exclusiones/${userMaint.usuAno}/${userMaint.usuCod}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Proyectos: proyectos,
            SubProyectos: subProyectos
        })
    });

    if (!response.ok) {
        const data = await response.json();
        Notiflix.Notify.failure(data.message);
        return;
    }

    Notiflix.Notify.success('Los permisos del usuario han sido agregados exitosamente.');
  };

  const eliminarExclusiones = async (proyectos, subProyectos) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/eliminar-exclusiones/${userMaint.usuAno}/${userMaint.usuCod}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              Proyectos: proyectos,
              SubProyectos: subProyectos
          })
      });

      if (!response.ok) {
          const data = await response.json();
          Notiflix.Notify.failure(data.message);
          return;
      }

      Notiflix.Notify.success('Los permisos del usuario han sido eliminados exitosamente.');
  };


  const handleClickaso = async () => {
    const proyectosToAdd = Object.values(addedProyectos);
    const subProyectosToAdd = Object.values(addedSubProyectos);
    const proyectosToRemove = Object.values(removedProyectos);
    const subProyectosToRemove = Object.values(removedSubProyectos);

    // Ahora puedes usar estas listas para hacer tus solicitudes a la API
    if (proyectosToAdd.length > 0 || subProyectosToAdd.length > 0) {
      console.log(proyectosToAdd)
      console.log(subProyectosToAdd)
      await eliminarExclusiones(proyectosToAdd, subProyectosToAdd);
    }
    if (proyectosToRemove.length > 0 || subProyectosToRemove.length > 0) {
      console.log(proyectosToRemove)
      console.log(subProyectosToRemove)
      await agregarExclusiones(proyectosToRemove, subProyectosToRemove);
    }
    navigate('/user');
  }


  return (
    <div className="PowerMas_MenuUserContainer h-100 bg-white Large-p2_5">
      <h1 className="Large-f1_25">Permisos para el usuario {userMaint.usuNom} {userMaint.usuApe} con código {userMaint.usuAno}{userMaint.usuCod}</h1>
      <div>
        <div className="PowerMas_ListPermission">
          <ul>
            {proyectos.map(proyecto => (
              <ProjectItem 
                  key={proyecto.proCod} 
                  proyecto={proyecto} 
                  handleCheck={handleCheck} 
                  checkedProyectos={checkedProyectos} 
                  checkedSubProyectos={checkedSubProyectos} 
              />
            ))}
          </ul>
        </div>
      </div>
      <button onClick={handleClickaso}> Siguiente </button>
    </div>
  )
}

export default PermissionUser