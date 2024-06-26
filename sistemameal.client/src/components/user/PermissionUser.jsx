import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';
import { Tree } from 'antd';
import UserInfo from "./UserInfo";
import { fetchDataBlock, fetchDataReturn } from "../reusable/fetchs";


const PermissionUser = () => {
    const navigate = useNavigate();

    const { id: safeCiphertext } = useParams();
    const ciphertext = atob(safeCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const usuAno = id.slice(0, 4);
    const usuCod = id.slice(4);
    

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    //
    const [ proyectos, setProyectos ] = useState([]);

    const [ user, setUser ] = useState(null);

    const [initialCheckedKeys, setInitialCheckedKeys] = useState([]);


    // EFECTO AL CARGAR COMPONENTE GET - LISTAR METAS
    useEffect(() => {
        fetchDataBlock(`Usuario/${usuAno}/${usuCod}`, setUser, '.user-block');

        // Inicia el bloqueo de Notiflix
        if (document.querySelector('.access-block')) {
            Notiflix.Block.pulse('.access-block', {
                svgSize: '100px',
                svgColor: '#F87C56',
            });
        }

        Promise.all([
            fetchDataReturn(`Proyecto/proyectos-subproyectos`),
            fetchDataReturn(`Usuario/access/${usuAno}/${usuCod}`),
        ]).then(([proyectosData, accesosData]) => {
            const transformedData = transformData(proyectosData);
            setProyectos(transformedData);

            setCheckedKeys(accesosData.map(permiso => permiso.usuAccPad.trim()));
            setInitialCheckedKeys(accesosData);
        }).catch(error => {
            // Maneja los errores
            console.error('Error:', error);
            Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
        }).finally(() => {
            // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
            Notiflix.Block.remove('.access-block');
        });
    
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
        const permisosToInsert = permisosArr.filter(permiso => !initialCheckedKeys.some(initialPermiso => initialPermiso.usuAccPad.trim() === permiso.usuAccPad.trim()));
        const permisosToDelete = initialCheckedKeys.filter(initialPermiso => !permisosArr.some(permiso => permiso.usuAccPad.trim() === initialPermiso.usuAccPad.trim()));
        
        const PermisosDto = {
            AccesosInsertar: permisosToInsert,
            AccesosEliminar: permisosToDelete,
        }
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
                                                                            {`Responsable: ${tecnico} | Implementador: ${implementador} | Ubicación: ${ubicacion} | Periodo: ${periodo} | Meta: ${metItem.metMetTec}`}
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
  
    
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue, e) => {
        let newCheckedKeys = [...checkedKeysValue.checked];
        const keyParts = e.node.key.split('-');
    
        if (e.checked) {
            // Añade la clave del nodo actual si no está presente
            if (!newCheckedKeys.includes(e.node.key)) {
                newCheckedKeys.push(e.node.key);
            }
            // Añade todas las claves de los descendientes del nodo actual
            const nodeAndAllDescendants = getAllDescendants(e.node);
            newCheckedKeys = [...new Set([...newCheckedKeys, ...nodeAndAllDescendants])];
    
            // Añade todas las claves de los nodos padres del nodo actual
            const nodeAndAllAncestors = getAllAncestors(e.node.key, proyectos);
            newCheckedKeys = [...new Set([...newCheckedKeys, ...nodeAndAllAncestors])];
        } else {
            // Elimina la clave del nodo actual y todas las claves de sus descendientes
            const nodeAndAllDescendants = getAllDescendants(e.node);
            newCheckedKeys = newCheckedKeys.filter(key => !nodeAndAllDescendants.includes(key));
        }
    
        setCheckedKeys(newCheckedKeys);
    };

    const getAllAncestors = (key, nodes) => {
        const keyParts = key.split('-');
        let ancestors = [];
        for (let i = keyParts.length; i > 0; i -= 3) {
            const ancestorKey = keyParts.slice(0, i).join('-');
            ancestors.push(ancestorKey);
        }
        return ancestors;
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
                    <div className="PowerMas_ListPermission PowerMas_Form_Card p1 Large_6 overflow-auto access-block">
                        <Tree
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            treeData={proyectos}
                            checkStrictly={true}
                        />
                    </div>
                    <div className="Large_6 overflow-auto user-block">
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