import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';
import { Tree } from 'antd';
import UserInfo from "./UserInfo";
import { fetchData } from "../reusable/helper";


const PermissionUser = () => {
    const navigate = useNavigate();

    const { id: safeCiphertext } = useParams();
    const ciphertext = atob(safeCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const usuAno = id.slice(0, 4);
    const usuCod = id.slice(4);
    
    //
    const [ proyectos, setProyectos ] = useState([]);

    const [ user, setUser ] = useState(null);

    const [initialCheckedKeys, setInitialCheckedKeys] = useState([]);


    // EFECTO AL CARGAR COMPONENTE GET - LISTAR METAS
        useEffect(() => {
        const fetchDataAsync = async () => {
            console.log(usuAno,usuCod)
            await fetchData(`Usuario/${usuAno}/${usuCod}`, setUser);
            await fetchData(`Proyecto/proyectos-subproyectos`, (data) => {
                const transformedData = transformData(data);
                setProyectos(transformedData);
            });
            await fetchData(`Usuario/access/${usuAno}/${usuCod}`, (data) => {
                console.log(data)
                // Usa los objetos de permiso tal como vienen del servidor
                setCheckedKeys(data.map(permiso => permiso.usuAccPad));
                setInitialCheckedKeys(data);
            });
            
        };
    
        fetchDataAsync();
    }, []);
    
    
    const handleSubmit = async () => {
        let permisosObj = {};
        checkedKeys.forEach(key => {
            const parts = key.split('-');
            for(let i = 0; i < parts.length; i += 3) {
                const permisoKey = `${parts[i]}-${parts[i+1]}-${parts[i+2]}`;
                const parentKey = parts.slice(0, i+3).join('-');
                permisosObj[permisoKey] = { usuAno, usuCod, usuAccTip: parts[i], usuAccAno: parts[i+1], usuAccCod: parts[i+2], usuAccPad: parentKey };
            }
        });
        
        // Convierte los objetos de permisos a un arreglo
        const permisosArr = Object.values(permisosObj);
        
        // Calcula los permisos a insertar y eliminar
        const permisosToInsert = permisosArr.filter(permiso => !initialCheckedKeys.some(initialPermiso => initialPermiso.usuAccPad === permiso.usuAccPad));
        const permisosToDelete = initialCheckedKeys.filter(initialPermiso => !permisosArr.some(permiso => permiso.usuAccPad === initialPermiso.usuAccPad));
        
        const PermisosDto = {
            AccesosInsertar: permisosToInsert,
            AccesosEliminar: permisosToDelete,
        }
        console.log(PermisosDto)
        handleSubmit2(PermisosDto);
    };
    
    
    
    
    
    const handleSubmit2 = async (env) => {
        try {
            Notiflix.Loading.pulse();

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(env),
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            
            Notiflix.Notify.success(data.message);
            navigate('/user')
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    

    const transformData = (data) => {
        return data.map(item => {
            let children = [];
            if (item.subProyectos) {
                children = item.subProyectos.map(subItem => {
                    let subChildren = [];
                    if (subItem.objetivos) {
                        subChildren = subItem.objetivos.map(objItem => {
                            let objChildren = [];
                            if (objItem.objetivosEspecificos) {
                                objChildren = objItem.objetivosEspecificos.map(objEspItem => {
                                    let resChildren = [];
                                    if (objEspItem.resultados) {
                                        resChildren = objEspItem.resultados.map(resItem => {
                                            let actChildren = [];
                                            if (resItem.actividades) {
                                                actChildren = resItem.actividades.map(actItem => {
                                                    let indChildren = [];
                                                    if (actItem.indicadores) {
                                                        indChildren = actItem.indicadores.map((indItem) => {
                                                            let metChildren = [];
                                                            if (indItem.metas) {
                                                                metChildren = indItem.metas.map((metItem) => {
                                                                    const tecnico = metItem.usuNom.charAt(0).toUpperCase() + metItem.usuNom.slice(1).toLowerCase()
                                                                    const implementador = metItem.impNom.charAt(0).toUpperCase() + metItem.impNom.slice(1).toLowerCase()
                                                                    const ubicacion = metItem.ubiNom.charAt(0).toUpperCase() + metItem.ubiNom.slice(1).toLowerCase()
                                                                    
                                                                    const nombreMesPeriodo = metItem.metMesPlaTec ? (new Date(2024, metItem.metMesPlaTec - 1).toLocaleString('es-ES', { month: 'short' })) : '';
                                                                    const mesPeriodo = nombreMesPeriodo.charAt(0).toUpperCase() + nombreMesPeriodo.slice(1).toLowerCase()
                                                                    const periodo = `${mesPeriodo} - ${metItem.metAnoPlaTec}`

                                                                    return {
                                                                        title: 
                                                                        <div>
                                                                            <span className="bold">
                                                                                Meta:{' '}
                                                                            </span>
                                                                            {`Técnico: ${tecnico} | Implementador: ${implementador} | Ubicación: ${ubicacion} | Periodo: ${periodo} | Meta: ${metItem.metMetTec}`}
                                                                        </div>,
                                                                        key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}-OBJETIVO-${objItem.objAno}-${objItem.objCod}-OBJETIVO_ESPECIFICO-${objEspItem.objEspAno}-${objEspItem.objEspCod}-RESULTADO-${resItem.resAno}-${resItem.resCod}-ACTIVIDAD-${actItem.actAno}-${actItem.actCod}-INDICADOR-${indItem.indAno}-${indItem.indCod}-META-${metItem.metAno}-${metItem.metCod}`
                                                                    };
                                                                });
                                                            }
                                                            return {
                                                                title: 
                                                                <div>
                                                                    <span className="bold">
                                                                        Indicador:{' '}
                                                                    </span>
                                                                    {indItem.indNom.charAt(0).toUpperCase() + indItem.indNom.slice(1).toLowerCase()}
                                                                </div>,
                                                                key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}-OBJETIVO-${objItem.objAno}-${objItem.objCod}-OBJETIVO_ESPECIFICO-${objEspItem.objEspAno}-${objEspItem.objEspCod}-RESULTADO-${resItem.resAno}-${resItem.resCod}-ACTIVIDAD-${actItem.actAno}-${actItem.actCod}-INDICADOR-${indItem.indAno}-${indItem.indCod}`,
                                                                children: metChildren
                                                            };
                                                        });
                                                    }
                                                    return {
                                                        title:
                                                            <div>
                                                                <span className="bold">
                                                                    Grupo sin sub-actividades{' '}
                                                                </span>
                                                            </div>,
                                                        key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}-OBJETIVO-${objItem.objAno}-${objItem.objCod}-OBJETIVO_ESPECIFICO-${objEspItem.objEspAno}-${objEspItem.objEspCod}-RESULTADO-${resItem.resAno}-${resItem.resCod}-ACTIVIDAD-${actItem.actAno}-${actItem.actCod}`,
                                                        children: indChildren
                                                    };
                                                });
                                            }
                                            return {
                                                title: 
                                                    <div>
                                                        <span className="bold">
                                                            Resultado:{' '}
                                                        </span>
                                                        {resItem.resNom.charAt(0).toUpperCase() + resItem.resNom.slice(1).toLowerCase()}
                                                    </div>,
                                                key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}-OBJETIVO-${objItem.objAno}-${objItem.objCod}-OBJETIVO_ESPECIFICO-${objEspItem.objEspAno}-${objEspItem.objEspCod}-RESULTADO-${resItem.resAno}-${resItem.resCod}`,
                                                children: actChildren
                                            };
                                        });
                                    }
                                    return {
                                        title: 
                                            <div>
                                                <span className="bold">
                                                    Objetivo Específico:{' '}
                                                </span>
                                                {objEspItem.objEspNom.charAt(0).toUpperCase() + objEspItem.objEspNom.slice(1).toLowerCase()}
                                            </div>,
                                        key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}-OBJETIVO-${objItem.objAno}-${objItem.objCod}-OBJETIVO_ESPECIFICO-${objEspItem.objEspAno}-${objEspItem.objEspCod}`,
                                        children: resChildren
                                    };
                                });
                            }
                            return {
                                title: 
                                    <div>
                                        <span className="bold">
                                            Objetivo:{' '}
                                        </span>
                                        {objItem.objNom.charAt(0).toUpperCase() + objItem.objNom.slice(1).toLowerCase()}
                                    </div>,
                                key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}-OBJETIVO-${objItem.objAno}-${objItem.objCod}`,
                                children: objChildren
                            };
                        });
                    }
                    return {
                        title: 
                            <div>
                                <span className="bold">
                                    Subproyecto:{' '}
                                </span>
                                {subItem.subProNom.charAt(0).toUpperCase() + subItem.subProNom.slice(1).toLowerCase()}
                            </div>,
                        key: `PROYECTO-${item.proAno}-${item.proCod}-SUB_PROYECTO-${subItem.subProAno}-${subItem.subProCod}`,
                        children: subChildren
                    };
                });
            }
            return {
                title: 
                    <div>
                        <span className="bold">
                            Proyecto:{' '}
                        </span>
                        {item.proNom.charAt(0).toUpperCase() + item.proNom.slice(1).toLowerCase()}
                    </div>,
                key: `PROYECTO-${item.proAno}-${item.proCod}`,
                children
            };
        });
    };
  
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue, e) => {
        let newCheckedKeys = [...checkedKeysValue.checked];
        if (e.checked) {
            let keyParts = e.node.key.split('-');
            // Comprueba si el nodo marcado es un nodo de primer nivel (nodo principal)
            if (keyParts.length === 3) {
                // Si es un nodo principal, añade todas las claves de sus descendientes
                let nodeAndAllDescendants = getAllDescendants(e.node);
                newCheckedKeys = [...newCheckedKeys, ...nodeAndAllDescendants];
            } else {
                // Si no es un nodo principal, solo añade las claves de los nodos padres
                for (let i = 0; i < keyParts.length; i += 3) {
                    let parentKey = keyParts.slice(0, i+3).join('-');
                    if (!newCheckedKeys.includes(parentKey)) {
                        newCheckedKeys.push(parentKey);
                    }
                }
            }
        } else {
            let nodeAndAllDescendants = getAllDescendants(e.node);
            newCheckedKeys = newCheckedKeys.filter(key => !nodeAndAllDescendants.includes(key));
        }
        setCheckedKeys(newCheckedKeys);
    };
    
    const getAllDescendants = (node) => {
        let descendants = [node.key];
        if (node.children) {
            node.children.forEach(child => {
                descendants = [...descendants, ...getAllDescendants(child)];
            });
        }
        return descendants;
    };


    return (
        <div className="bg-white h-100 flex flex-column over">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center">
                <Bar currentStep={3} type='user' />
            </div>
            <div className="flex flex-grow-1 overflow-auto p1_25">
                <div className="flex flex-grow-1 Large_12 gap-1">
                    <div className="PowerMas_ListPermission PowerMas_Form_Card p1 Large_6 overflow-auto">
                        <Tree
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            selectedKeys={selectedKeys}
                            treeData={proyectos}
                            checkStrictly={true}
                        />
                    </div>
                    <div className="Large_6 overflow-auto">
                        <UserInfo user={user} />
                    </div>
                </div>
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate(`/menu-user/${safeCiphertext}`)} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={handleSubmit} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar y Finalizar</button>
            </footer>
        </div>
    )
}

export default PermissionUser