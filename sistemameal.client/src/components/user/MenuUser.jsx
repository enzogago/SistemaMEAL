import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';
import { Tree } from 'antd';
import UserInfo from "./UserInfo";
import { fetchDataBlock, fetchDataReturn } from "../reusable/fetchs";
import AccessIcon from "../../icons/AccessIcon";
import useModal from "../../hooks/useModal";
import ModalPermission from "./ModalPermission";

const generarClavesDeAcceso = (menuData) => {
    const construirClaves = (menus, menAnoPad, menCodPad, parentKey = '') => {
        return menus
            .filter(menu => menu.menAnoPad === menAnoPad && menu.menCodPad === menCodPad)
            .reduce((keys, menu) => {
            const currentKey = parentKey ? `${parentKey}-${menu.menAno}-${menu.menCod}` : `${menu.menAno}-${menu.menCod}`;
            keys.push(currentKey);
            const clavesDeSubmenus = construirClaves(menus, menu.menAno, menu.menCod, currentKey);
            return keys.concat(clavesDeSubmenus);
        }, []);
    };
  
    return construirClaves(menuData, null, null);
};
  
const MenuUser = () => {
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

    const [ menus, setMenus ] = useState([]);

    const [ user, setUser ] = useState(null);

    const [initialCheckedKeys, setInitialCheckedKeys] = useState([]);

    const { modalVisible, estadoEditado, openModal, closeModal } = useModal();

    const transformMenuData = (menuData) => {
        // Función para construir la estructura jerárquica
        const buildTree = (menus, menAnoPad, menCodPad, parentKey = '') => {
            return menus
                .filter(menu => menu.menAnoPad === menAnoPad && menu.menCodPad === menCodPad)
                .map(menu => {
                const currentKey = parentKey ? `${parentKey}-${menu.menAno}-${menu.menCod}` : `${menu.menAno}-${menu.menCod}`;
                return {
                    title:
                    <div className="flex ai-center gap-1 PowerMas_IconsTable">
                        <span>
                            {menu.menNom}
                        </span>
                        {
                            (menu.menRef !== '#' && menu.menRef !== '') &&
                            <span
                                data-tooltip-id="edit-tooltip" 
                                data-tooltip-content="Permisos" 
                                className='flex f1_25 p_25' 
                                onClick={() => openModal(menu)}
                            >
                                <AccessIcon />
                            </span>
                        }
                    </div>,
                    key: currentKey,
                    children: buildTree(menus, menu.menAno, menu.menCod, currentKey),
                };
            });
        };
      
        // Iniciamos la construcción de la estructura desde el nivel más alto (menAnoPad y menCodPad nulos)
        return buildTree(menuData, null, null);
    };
    

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
            fetchDataReturn(`Menu`),
            fetchDataReturn(`Menu/${usuAno}/${usuCod}`),
        ]).then(([menuData, menuAccessData]) => {
            const treeData = transformMenuData(menuData)
            setMenus(treeData)
            
            const userAccessKeys = generarClavesDeAcceso(menuAccessData);
            setCheckedKeys(userAccessKeys);
            setInitialCheckedKeys(userAccessKeys);
        }).catch(error => {
            // Maneja los errores
            console.error('Error:', error);
            Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
        }).finally(() => {
            // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
            Notiflix.Block.remove('.access-block');
        });
    
    }, []);
    
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue, e) => {
        let newCheckedKeys = [...checkedKeysValue.checked];
        if (e.checked) {
            let keyParts = e.node.key.split('-');
            // Comprueba si el nodo marcado es un nodo de primer nivel (nodo principal)
            if (keyParts.length === 2) {
                // Si es un nodo principal, añade todas las claves de sus descendientes
                let nodeAndAllDescendants = getAllDescendants(e.node);
                // Asegúrate de que no estás añadiendo claves duplicadas
                nodeAndAllDescendants.forEach(key => {
                    if (!newCheckedKeys.includes(key)) {
                        newCheckedKeys.push(key);
                    }
                });
            } else {
                // Si no es un nodo principal, solo añade las claves de los nodos padres
                for (let i = 0; i < keyParts.length; i += 2) {
                    let parentKey = keyParts.slice(0, i+2).join('-');
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

    const handleSubmit = async() => {
        // Convertir los Sets a arreglos para poder trabajar con ellos
        const currentKeys = Array.from(checkedKeys);
        const initialKeys = Array.from(initialCheckedKeys);
    
        // Determinar las claves añadidas y eliminadas
        const keysAñadidas = currentKeys.filter(key => !initialKeys.includes(key));
        const keysEliminadas = initialKeys.filter(key => !currentKeys.includes(key));
    
        // Extraer menAno y menCod de las claves añadidas y eliminadas
        const permisosInsertar = keysAñadidas.map(key => {
            const parts = key.split('-');
            return { menAno: parts[parts.length - 2], menCod: parts[parts.length - 1] };
        });
    
        const permisosAEliminar = keysEliminadas.map(key => {
            const parts = key.split('-');
            return { menAno: parts[parts.length - 2], menCod: parts[parts.length - 1] };
        });

        const MenuUsuarioDto = {
            MenuUsuarioInsertar: permisosInsertar,
            MenuUsuarioEliminar: permisosAEliminar,
            Usuario: {
                usuAno,
                usuCod
            }
        };


        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(MenuUsuarioDto),
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message)
                return;
            }
            Notiflix.Notify.success(data.message)
            navigate(`/permiso-user/${safeCiphertext}`);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    

    return (
        <>
            <div className="bg-white h-100 flex flex-column">
                <div className="PowerMas_Header_Form_Beneficiarie flex ai-center">
                    <Bar currentStep={3} type='user' />
                </div>
                <div className="flex flex-grow-1 overflow-auto p1_25">
                    <div className="flex flex-grow-1 Large_12 gap-1">
                        <div className="PowerMas_ListPermission PowerMas_Form_Card p1 Large_6 overflow-auto access-block">
                            <Tree
                                className="tree-node-custom"
                                checkable
                                onExpand={onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onCheck={onCheck}
                                checkedKeys={checkedKeys}
                                treeData={menus}
                                checkStrictly={true}
                            />
                        </div>
                        <div className="Large_6 overflow-auto user-block">
                            <UserInfo user={user} />
                        </div>
                    </div>
                </div>
                <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                    <button onClick={() => navigate(`/form-user/${safeCiphertext}`)} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                    <button onClick={handleSubmit} className="Large_3 m_75 PowerMas_Buttom_Primary">Grabar y Finalizar</button>
                </footer>
            </div>
            <ModalPermission 
                modalVisible={modalVisible}
                estadoEditado={estadoEditado}
                closeModal={closeModal}
                user={{usuAno,usuCod}}
            />
        </>
    )
}

export default MenuUser