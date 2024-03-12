import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Notiflix from "notiflix";
import ProjectItem from "./ProjectItem";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import { Tree } from 'antd';


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
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/proyectos-subproyectos`, {
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
                    const transformedData = transformData(data);
                    setProyectos(transformedData);
                    console.log(transformedData)
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
  const transformData = (data) => {
    return data.map(item => {
      let children = [];
      if (item.subProyectos) {
        children = item.subProyectos.map(subItem => {
          return {
            title: subItem.subProNom,
            key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}`
          };
        });
      }
      return {
        title: item.proNom,
        key: `${item.proAno}-${item.proCod}`,
        children
      };
    });
  };
  
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  return (
        <div className="bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center">
                {/* <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/user')} /> */}
                <Bar currentStep={3} type='user' />
            </div>
            <div className="flex-grow-1 overflow-auto p1_25">
                <div className="flex gap-1">
                    <div className="PowerMas_ListPermission PowerMas_Form_Card p1 Large_6">
                        {/* <ul>
                            {proyectos.map(proyecto => (
                                <ProjectItem 
                                    key={proyecto.proCod} 
                                    proyecto={proyecto} 
                                    handleCheck={handleCheck} 
                                    checkedProyectos={checkedProyectos} 
                                    checkedSubProyectos={checkedSubProyectos} 
                                />
                            ))}
                        </ul> */}
                        <Tree
                          checkable
                          onExpand={onExpand}
                          expandedKeys={expandedKeys}
                          autoExpandParent={autoExpandParent}
                          onCheck={onCheck}
                          checkedKeys={checkedKeys}
                          selectedKeys={selectedKeys}
                          treeData={proyectos}
                        />
                    </div>
                    <div className="PowerMas_Info_User Large_6 PowerMas_Form_Card p1" style={{backgroundColor: '#f7f7f7'}}>
                        <div className="flex flex-column jc-center ai-center gap_5">
                        <div className="PowerMas_ProfilePicture2" style={{width: 125, height: 125}}>
                            <img src={user && user.usuSex === 'M' ? masculino : femenino} alt="Descripción de la imagen" />
                        </div>
                        <div className="center">
                            <p className="f1_25 bold" style={{textTransform: 'capitalize'}}>{user && user.usuNom.toLowerCase() + ' ' + user.usuApe.toLowerCase() }</p>
                            <p className="color-gray" style={{textTransform: 'capitalize'}}>{user && user.carNom.toLowerCase() }</p>
                        </div>
                        </div>
                        <br />
                        <article className="p_25">
                        <p className="bold">Tipo Documento:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize'}}>{user && user.docIdeNom.toLowerCase() }</p>
                        </article>
                        <article className="p_25">
                        <p className="bold">Documento:</p>
                        <p className="color-gray">{user && user.usuNumDoc}</p>
                        </article>
                        <article className="p_25">
                        <p className="bold">Correo:</p>
                        <p className="color-gray">{user && user.usuCorEle.toLowerCase() }</p>
                        </article>
                        <article className="p_25">
                        <p className="bold">Nacimiento:</p>
                        <p className="color-gray">{user && user.usuFecNac }</p>
                        </article>
                        <article className="p_25">
                        <p className="bold">Teléfono:</p>
                        <p className="color-gray">{user && user.usuTel }</p>
                        </article>
                        <article className="p_25">
                        <p className="bold">Rol:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize'}}>{user && user.rolNom.toLowerCase() }</p>
                        </article>
                        <article className="p_25">
                        <p className="bold">Estado:</p>
                        <p className="color-gray bold" style={{color: `${user && (user.usuEst === 'A' ? '#20737b' : '#E5554F')}`}}>{user && (user.usuEst === 'A' ? 'Activo' : 'Inactivo')}</p>
                        </article>
                    </div>
                </div>
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate(`/menu-user/${safeCiphertext}`)} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={handleClickaso} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar y Finalizar</button>
            </footer>
        </div>
    )
}

export default PermissionUser