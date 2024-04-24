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
    const ciphertext = atob(safeCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const usuAno = id.slice(0, 4);
    const usuCod = id.slice(4);
    
    //
    const [ proyectos, setProyectos ] = useState([]);

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

        const fetchUsuario = async () => {
            try {
                startRequest();
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Usuario/${usuAno}/${usuCod}`, {
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

        fetchUsuario();
        fetchProyectos();

        return () => {
            isCancelled = true;
        };
    }, []);


    const handleSubmit = async () => {
        navigate('/user')
    }

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
                                            let indChildren = [];
                                            if (resItem.indicadoresActividades) {
                                                indChildren = resItem.indicadoresActividades.map((indItem,index) => {
                                                    return {
                                                        title: 
                                                        <div>
                                                            <span className="bold">
                                                                Indicador:{' '}
                                                            </span>
                                                            {indItem.indActResNom.charAt(0).toUpperCase() + indItem.indActResNom.slice(1).toLowerCase()}
                                                        </div>,
                                                        key: `${item.proAno}-${item.proCod}-${subItem.subProAno}-${subItem.subProCod}-${objItem.objAno}-${objItem.objCod}-${objEspItem.objEspAno}-${objEspItem.objEspCod}-${resItem.resAno}-${resItem.resCod}-${indItem.indActResAno}-${indItem.indActResCod}-${indItem.indActResTip}${index}`
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
                                                children: indChildren
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
            <div className="flex flex-grow-1 overflow-auto p1_25">
                <div className="flex flex-grow-1  gap-1">
                    <div className="PowerMas_ListPermission PowerMas_Form_Card p1 Large_6 overflow-auto">
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
                <button onClick={handleSubmit} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar y Finalizar</button>
            </footer>
        </div>
    )
}

export default PermissionUser