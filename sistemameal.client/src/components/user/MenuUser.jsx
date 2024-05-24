import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';
import { Tree } from 'antd';
import UserInfo from "./UserInfo";
import { fetchDataBlock, fetchDataReturn } from "../reusable/fetchs";

// Función para encontrar y organizar los submenús de manera recursiva
function organizarSubmenus(menuData) {
    // Función para construir la estructura jerárquica
    const construirEstructura = (menus, menAnoPad, menCodPad) => {
      return menus
        .filter(menu => menu.menAnoPad === menAnoPad && menu.menCodPad === menCodPad)
        .map(menu => ({
          ...menu,
          subMenus: construirEstructura(menus, menu.menAno, menu.menCod),
        }));
    };
  
    // Ordenamos los menús por menAnoPad y menCodPad
    const menusOrdenados = menuData.sort((a, b) => {
      if (a.menAnoPad === b.menAnoPad) {
        return a.menCodPad - b.menCodPad;
      }
      return a.menAnoPad - b.menAnoPad;
    });
  
    // Iniciamos la construcción de la estructura desde el nivel más alto (menAnoPad y menCodPad nulos)
    return construirEstructura(menusOrdenados, null, null);
  }
  
  const transformMenuData = (menuData) => {
    // Función para construir la estructura jerárquica
    const buildTree = (menus, menAnoPad, menCodPad, parentKey = '') => {
      return menus
        .filter(menu => menu.menAnoPad === menAnoPad && menu.menCodPad === menCodPad)
        .map(menu => {
          const currentKey = parentKey ? `${parentKey}-${menu.menAno}-${menu.menCod}` : `${menu.menAno}-${menu.menCod}`;
          return {
            title: menu.menNom,
            key: currentKey,
            children: buildTree(menus, menu.menAno, menu.menCod, currentKey),
          };
        });
    };
  
    // Iniciamos la construcción de la estructura desde el nivel más alto (menAnoPad y menCodPad nulos)
    return buildTree(menuData, null, null);
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
    //
    const [ proyectos, setProyectos ] = useState([]);
    const [ menus, setMenus ] = useState([]);

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
            fetchDataReturn(`Menu`),
            fetchDataReturn(`Menu/${usuAno}/${usuCod}`),
        ]).then(([menuData, menuAccessData]) => {
            setMenus(transformMenuData(menuData))
            console.log(menuAccessData)
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
            navigate(`/user`)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
  
    
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
                    <div className="PowerMas_ListPermission PowerMas_Form_Card p1 Large_6 overflow-auto access-block">
                        <Tree
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
    )
}

export default MenuUser