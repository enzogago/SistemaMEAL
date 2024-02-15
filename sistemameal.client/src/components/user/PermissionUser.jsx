import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import ProjectItem from "./ProjectItem";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';

const PermissionUser = () => {
    const navigate = useNavigate();

    const { id: safeCiphertext } = useParams();
    console.log(safeCiphertext)
    const ciphertext = atob(safeCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    console.log(id)
    const usuAno = id.slice(0, 4);
    const usuCod = id.slice(4);
    
    //
    const [ proyectos, setProyectos ] = useState([]);
    const [ checkedProyectos, setCheckedProyectos ] = useState({});
    const [ checkedSubProyectos, setCheckedSubProyectos ] = useState({});
    const [ addedProyectos, setAddedProyectos ] = useState({});
    const [ addedSubProyectos, setAddedSubProyectos ] = useState({});
    const [ removedProyectos, setRemovedProyectos ] = useState({});
    const [ removedSubProyectos, setRemovedSubProyectos ] = useState({});

    const [ user, setUser ] = useState(null);

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR PROYECTOS
    useEffect(() => {
        let activeRequests = 0;

        const startRequest = () => {
            if (activeRequests === 0) {
                Notiflix.Loading.pulse('Cargando...');
            }
            activeRequests++;
        };

        const endRequest = () => {
            activeRequests--;
            if (activeRequests === 0) {
                Notiflix.Loading.remove();
            }
        };

        const fetchUsuarios = async () => {
            try {
                startRequest();
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario/${usuAno}/${usuCod}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
    
                if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
                }
    
                setUser(data)
            } catch (error) {
                console.error('Error:', error);
            } finally {
                endRequest();
            }
        };

        let isCancelled = false;

        const fetchProyectos = async () => {
            try {
                startRequest();
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
                endRequest();
            }
        };

        const fetchProyectosAccesibles = async () => {
            try {
                startRequest();
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/accesibles/${usuAno}/${usuCod}`, {
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
                endRequest();
            }
        };

        fetchUsuarios();
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
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/agregar-exclusiones/${usuAno}/${usuCod}`, {
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
  };

  const eliminarExclusiones = async (proyectos, subProyectos) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/eliminar-exclusiones/${usuAno}/${usuCod}`, {
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
    Notiflix.Notify.success("Permisos actualizados correctamente")
    navigate('/user');
  }


  return (
    <div className="bg-white h-100 flex flex-column">
      <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p2">
        {/* <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/user')} /> */}
        <h1 className="flex-grow-1">Permisos del Usuario</h1>
        <Bar currentStep={3} />
      </div>
      <div className="flex-grow-1 overflow-auto p1_25">
        <div className="flex gap-1">
            <div className="PowerMas_ListPermission Large_6">
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
            <div className="Large_6">
            <article className="p_25">
              <p>Usuario:</p>
              <p>{user && user.usuNom + ' ' + user.usuApe}</p>
            </article>
            <hr className="PowerMas_Hr m_25" />
            <article className="p_25">
              <p>Documento de identidad:</p>
              <p>{user && user.docIdeNom}</p>
            </article>
            <hr className="PowerMas_Hr m_25" />
            <article className="p_25">
              <p>Número de identidad:</p>
              <p>{user && user.usuNumDoc}</p>
            </article>
            <hr className="PowerMas_Hr m_25" />
            <article className="p_25">
              <p>Rol:</p>
              <p>{user && user.rolNom}</p>
            </article>
            <hr className="PowerMas_Hr m_25" />
            <article className="p_25">
              <p>Cargo:</p>
              <p>{user && user.carNom}</p>
            </article>
            <hr className="PowerMas_Hr m_25" />
            <article className="p_25">
              <p>Estado:</p>
              <p>{user && user.usuEst}</p>
            </article>
          </div>
        </div>
    </div>
    <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
        <button onClick={() => navigate(`/menu-user/${safeCiphertext}`)} className="Large_5 m2 PowerMas_Buttom_Secondary">Atras</button>
        <button onClick={handleClickaso} className="Large_5 m2 PowerMas_Buttom_Primary">Finalizar</button>
    </div>
    </div>
  )
}

export default PermissionUser