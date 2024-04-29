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
            await fetchData(`Meta/access/${usuAno}/${usuCod}`, (data) => {
                console.log(data)
                const metasKeys = data.map(meta => {
                    return `${meta.proAno}-${meta.proCod}-${meta.subProAno}-${meta.subProCod}-${meta.objAno}-${meta.objCod}-${meta.objEspAno}-${meta.objEspCod}-${meta.resAno}-${meta.resCod}-${meta.actAno}-${meta.actCod}-${meta.indAno}-${meta.indCod}-meta-${meta.metAno}-${meta.metCod}`;
                });
                console.log(metasKeys)
                setCheckedKeys(metasKeys);
                setInitialCheckedKeys(metasKeys);
            });
        };
    
        fetchDataAsync();
    }, []);
    
    

    const handleSubmit = async () => {
        // Filtra las claves marcadas para obtener solo las de las metas
        const metaKeys = checkedKeys.filter(key => key.includes('meta'));
        
        // Extrae metAno y metCod de las claves de las metas
        const metas = metaKeys.map(key => {
            const parts = key.split('-');
            return {
                usuAno,
                usuCod,
                metAno: parts[parts.length - 2],
                metCod: parts[parts.length - 1]
            };
        });
        
        console.log(metas);
    
        // Calcula los accesos a insertar y eliminar
        const metasToInsert = metaKeys.filter(key => !initialCheckedKeys.includes(key)).map(key => {
            const parts = key.split('-');
            return {
                usuAno,
                usuCod,
                metAno: parts[parts.length - 2],
                metCod: parts[parts.length - 1]
            };
        });

        const metasToDelete = initialCheckedKeys.filter(key => !checkedKeys.includes(key)).map(key => {
            const parts = key.split('-');
            return {
                usuAno,
                usuCod,
                metAno: parts[parts.length - 2],
                metCod: parts[parts.length - 1]
            };
        });

        
        const MetasDto = {
            MetasInsertar: metasToInsert,
            MetasEliminar: metasToDelete,
        }
        
        handleSubmit2(MetasDto);
    }
    

    const handleSubmit2 = async (env) => {
        try {
            Notiflix.Loading.pulse();

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/access`, {
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
                                                                        key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}-${objEspItem.objEspAno}-${objEspItem.objEspCod}-${resItem.resAno}-${resItem.resCod}-${actItem.actAno}-${actItem.actCod}-${indItem.indAno}-${indItem.indCod}-meta-${metItem.metAno}-${metItem.metCod}`
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
                                                                key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}-${objEspItem.objEspAno}-${objEspItem.objEspCod}-${resItem.resAno}-${resItem.resCod}-${actItem.actAno}-${actItem.actCod}-${indItem.indAno}-${indItem.indCod}`,
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
                                                        key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}-${objEspItem.objEspAno}-${objEspItem.objEspCod}-${resItem.resAno}-${resItem.resCod}-${actItem.actAno}-${actItem.actCod}`,
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
                                                key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}-${objEspItem.objEspAno}-${objEspItem.objEspCod}-${resItem.resAno}-${resItem.resCod}`,
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
                                        key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}-${objEspItem.objEspAno}-${objEspItem.objEspCod}`,
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
                                key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}`,
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
                        key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}`,
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
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    return (
        <div className="bg-white h-100 flex flex-column over">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center">
                <Bar currentStep={3} type='user' />
            </div>
            <div className="flex flex-grow-1 overflow-auto p1_25">
                <div className="flex flex-grow-1  gap-1">
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
                        />
                    </div>
                    <UserInfo user={user} />
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