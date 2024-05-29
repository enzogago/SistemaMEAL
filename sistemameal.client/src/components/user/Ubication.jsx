import { Tree } from "antd"
import { useEffect, useState } from "react";
import { fetchDataReturn } from "../reusable/fetchs";
import Notiflix from "notiflix";

const generarClavesDeAcceso = (ubicacionData) => {
    const construirClaves = (ubicacion, ubiAnoPad, ubiCodPad, parentKey = '') => {
        return ubicacion
            .filter(menu => menu.ubiAnoPad === ubiAnoPad && menu.ubiCodPad === ubiCodPad)
            .reduce((keys, menu) => {
            const currentKey = parentKey ? `${parentKey}-${menu.ubiAno}-${menu.ubiCod}` : `${menu.ubiAno}-${menu.ubiCod}`;
            keys.push(currentKey);
            const ClavesUbicacion = construirClaves(ubicacion, menu.ubiAno, menu.ubiCod, currentKey);
            return keys.concat(ClavesUbicacion);
        }, []);
    };
  
    return construirClaves(ubicacionData, null, null);
};
  

const Ubication = () => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const [initialCheckedKeys, setInitialCheckedKeys] = useState([]);

    const [ubicaciones, setUbicaciones] = useState([])

    const [refresh, setRefresh] = useState(true)

    const transformMenuData = (menuData) => {
        // Función para construir la estructura jerárquica
        const buildTree = (ubicaciones, ubiAnoPad, ubiCodPad, parentKey = '') => {
            return ubicaciones
                .filter(ubicacion => ubicacion.ubiAnoPad === ubiAnoPad && ubicacion.ubiCodPad === ubiCodPad)
                .map(ubicacion => {
                const currentKey = parentKey ? `${parentKey}-${ubicacion.ubiAno}-${ubicacion.ubiCod}` : `${ubicacion.ubiAno}-${ubicacion.ubiCod}`;
                return {
                    title:
                    <div className="flex ai-center gap-1 PowerMas_IconsTable">
                        <span className="bold">
                            {ubicacion.ubiTip}:
                        </span>
                        <span>
                            {ubicacion.ubiNom}
                        </span>
                    </div>,
                    key: currentKey,
                    children: buildTree(ubicaciones, ubicacion.ubiAno, ubicacion.ubiCod, currentKey),
                };
            });
        };
      
        // Iniciamos la construcción de la estructura desde el nivel más alto (ubiAnoPad y ubiCodPad nulos)
        return buildTree(menuData, null, null);
    };

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR METAS
    useEffect(() => {
        // Inicia el bloqueo de Notiflix
        if (document.querySelector('.access-block')) {
            Notiflix.Block.pulse('.access-block', {
                svgSize: '100px',
                svgColor: '#F87C56',
            });
        }

        Promise.all([
            fetchDataReturn(`Ubicacion/todos`),
            fetchDataReturn(`Ubicacion/activo`),
        ]).then(([data, dataAccess]) => {
            const treeData = transformMenuData(data)
            setUbicaciones(treeData)

            const allKeys = generarClavesDeAcceso(data);
            setExpandedKeys(allKeys);

            const userAccessKeys = generarClavesDeAcceso(dataAccess);
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
    
    }, [refresh]);

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

    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const handleSubmit = async() => {
        console.log(checkedKeys)
        console.log(initialCheckedKeys)
        // Convertir los Sets a arreglos para poder trabajar con ellos
        const currentKeys = Array.from(checkedKeys);
        const initialKeys = Array.from(initialCheckedKeys);
    
        // Determinar las claves añadidas y eliminadas
        const keysAñadidas = currentKeys.filter(key => !initialKeys.includes(key));
        const keysEliminadas = initialKeys.filter(key => !currentKeys.includes(key));
    
        // Extraer ubiAno y ubiCod de las claves añadidas y eliminadas
        const ubicacionInsertar = keysAñadidas.map(key => {
            const parts = key.split('-');
            return { ubiAno: parts[parts.length - 2], ubiCod: parts[parts.length - 1] };
        });
    
        const ubicacionEliminar = keysEliminadas.map(key => {
            console.log(key)
            const parts = key.split('-');
            return { ubiAno: parts[parts.length - 2], ubiCod: parts[parts.length - 1] };
        });

        const UbicacionDto = {
            UbicacionActivo: ubicacionInsertar,
            UbicacionInactivo: ubicacionEliminar,
        };

        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/acceso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(UbicacionDto),
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message)
                return;
            }
            Notiflix.Notify.success(data.message)
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    return (
        <>
           <div className="flex flex-column flex-grow-1 overflow-auto p1_25 gap_5">
                <h3 className="center">Administrar Ubicaciones</h3>
                <div className="flex flex-grow-1 Large_12 gap-1 overflow-auto">
                    <div className="PowerMas_ListPermission PowerMas_Form_Card Large_12 overflow-auto access-block">
                        <Tree
                            className="tree-node-custom"
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            treeData={ubicaciones}
                            checkStrictly={true}
                        />
                    </div>
                </div>
                <div className="flex jc-center">
                    <button onClick={handleSubmit} className="Large_3 PowerMas_Buttom_Primary p_5">Grabar</button>
                </div> 
            </div>
        </>
    )
}

export default Ubication