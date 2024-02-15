import Notiflix from "notiflix";
import { useCallback, useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import { useNavigate, useParams } from "react-router-dom";
import Bar from "./Bar";
import CryptoJS from 'crypto-js';

const MenuUser = () => {
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
  
  console.log(usuAno)
  console.log(usuCod)
  // Estados locales
  const [ menus, setMenus ] = useState([]);
  const [ openMenus, setOpenMenus ] = useState({}); 
  const [ checkedMenus, setCheckedMenus] = useState({});
  const [ currentMenus, setCurrentMenus ] = useState([]);
  const [ allMenus, setAllMenus ] = useState([]);
  const [ checkedPermissions, setCheckedPermissions ] = useState({});
  const [ userPermissions, setUserPermissions ] = useState({});

  const [ user, setUser ] = useState(null);


  const groupByParent = (menuData) => {
    const menuMap = {};
    const rootMenus = [];
  
    menuData.forEach((item) => {
      menuMap[item.menCod] = { ...item, subMenus: [] };
  
      if (item.menCodPad) {
        const parent = menuMap[item.menCodPad];
        if (parent) {
          parent.subMenus.push(menuMap[item.menCod]);
          menuMap[item.menCod].parent = parent;
        }
      }
  
      if (item.menAnoPad === null) {
        rootMenus.push(menuMap[item.menCod]);
      }
    });
  
    return rootMenus;
  };
  

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

    const fetchMenus = async () => {
      try {
        startRequest();
        const token = localStorage.getItem('token');
        // Permisos por usuario
        const responseUserPermissions = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso/${usuAno}/${usuCod}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });
        const userPermissions = await responseUserPermissions.json();
        console.log(userPermissions)
        setUserPermissions(userPermissions);
        // Obtener todos los permisos
        const responseAllPermissions = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });
        const allPermissions = await responseAllPermissions.json();
        console.log(allPermissions)
        const markedPermissions = allPermissions.map(permission => ({
          ...permission,
          isChecked: checkedPermissions[permission.perCod] || userPermissions.some(userPermission => userPermission.perCod === permission.perCod)
        }));
          
        const newCheckedPermissions = userPermissions.reduce((map, permission) => {
          map[permission.perCod] = true;
          return map;
        }, {});
        setCheckedPermissions(newCheckedPermissions);

        // Obtén los menús del usuario
        const responseUserMenus = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/${usuAno}/${usuCod}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const userMenus = await responseUserMenus.json();
        setCurrentMenus(userMenus);
        // Obtén todos los menús
        const responseAllMenus = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // Respuesta de todos los menus disponibles en la aplicacion
        const allMenus = await responseAllMenus.json();
        console.log(allMenus)
        // Marca los menús a los que el usuario tiene acceso
        const markedMenus = allMenus.map(menu => {
          const menuPermissions = markedPermissions.filter(permission => permission.perRef === menu.menRef);
          return{
              ...menu,
              isChecked: userMenus.some(userMenu => userMenu.menCod === menu.menCod),
              permissions: menuPermissions
          }
        });
        console.log(markedMenus)
        const groupData = groupByParent(markedMenus);
        setMenus(groupData);
        const newCheckedMenus = userMenus.reduce((map, menu) => {
          map[menu.menCod] = true;
          return map;
        }, {});
        setCheckedMenus(newCheckedMenus);
        setAllMenus(allMenus);
          
      } catch (error) {
        console.error('Error:', error);
      } finally {
        endRequest();
      }
    };

    fetchUsuario();
    fetchMenus();
  }, []);


  const handleToggle = useCallback((menu) => {
    console.log('handleToggle called');
    setOpenMenus(prevOpenMenus => ({
        ...prevOpenMenus,
        [menu.menCod]: !prevOpenMenus[menu.menCod]
    }));
  }, []);

  const handleCheck = useCallback((menu, isChecked) => {
    setCheckedMenus(prevCheckedMenus => {
      const newCheckedMenus = { ...prevCheckedMenus, [menu.menCod]: isChecked };
  
      // Si se está marcando el checkbox, también marca todos los menús padres.
      let currentMenu = menu;
      while (isChecked && currentMenu.parent) {
        newCheckedMenus[currentMenu.parent.menCod] = isChecked;
        currentMenu = currentMenu.parent;
      }
  
      // Si se está marcando o desmarcando el checkbox, también marca o desmarca todos los submenús.
      const checkSubMenus = (menu, isChecked) => {
        menu.subMenus.forEach(subMenu => {
          newCheckedMenus[subMenu.menCod] = isChecked;
          checkSubMenus(subMenu, isChecked);
        });
      };
      checkSubMenus(menu, isChecked);
  
      console.log(newCheckedMenus)
      return newCheckedMenus;
    });
  }, []);
  
  
  const handlePermissionCheck = useCallback((permission, isChecked) => {
    console.log(permission)
    setCheckedPermissions(prevCheckedPermissions => {
        const newCheckedPermissions = {...prevCheckedPermissions, [permission.perCod]: isChecked}

        return newCheckedPermissions;
    });
    console.log(checkedPermissions);
  }, []);



  const renderMenu = (menu, level) => (
    <MenuItem 
        key={menu.menCod} 
        menu={menu} 
        level={level} 
        handleToggle={handleToggle} 
        handleCheck={handleCheck} 
        handlePermissionCheck={handlePermissionCheck}
        openMenus={openMenus} 
        checkedMenus={checkedMenus}
        checkedPermissions={checkedPermissions}
    />
  );

  const handleNext = async (event) => {
    event.preventDefault();
    // Convertir currentMenus a un objeto para facilitar la búsqueda
    try {
      Notiflix.Loading.pulse('Cargando...');
      const currentMenuMap = currentMenus.reduce((map, menu) => {
        map[menu.menCod] = menu;
        return map;
      }, {});
  
      const allMenuMap = allMenus.reduce((map, menu) => {
        map[menu.menCod] = menu;
        return map;
      }, {});
  
      // Identificar los menús que se han marcado (agregados)
      const addedMenus = Object.keys(checkedMenus)
      .filter(menCod => checkedMenus[menCod] && !currentMenuMap[menCod])
      .map(menCod => allMenuMap[menCod]); 
  
      // Identificar los menús que se han desmarcado (eliminados)
      const removedMenus = currentMenus
        .filter(menu => !checkedMenus[menu.menCod]);
  
      // Preparar los datos para las peticiones
      const addedMenusData = addedMenus.map(menu => ({
        UsuAno: usuAno,
        UsuCod: usuCod,
        MenAno: menu.menAno,
        MenCod: menu.menCod
      }));
      const removedMenusData = removedMenus.map(menu => ({
        UsuAno: usuAno,
        UsuCod: usuCod,
        MenAno: menu.menAno,
        MenCod: menu.menCod
      }));
  
      const token = localStorage.getItem('token');
      // Realizar la petición para agregar menús
      const responseAdd = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/agregar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addedMenusData)
      });
      if (!responseAdd.ok) {
        // Manejar el error...
      }
  
      // Realizar la petición para eliminar menús
      const responseRemove = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/eliminar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(removedMenusData)
      });
      if (!responseRemove.ok) {
        // Manejar el error...
      }
  
      // Identificar los permisos que se han marcado (agregados)
      const addedPermissions = Object.keys(checkedPermissions).filter(perCod => checkedPermissions[perCod] && !userPermissions.some(userPermission => userPermission.perCod === perCod));
  
      // Identificar los permisos que se han desmarcado (eliminados)
      const removedPermissions = userPermissions.filter(permission => !checkedPermissions[permission.perCod]).map(permission => permission.perCod);
  
      // Preparar los datos para las peticiones
      const addedPermissionsData = addedPermissions.map(perCod => ({
        UsuAno: usuAno,
        UsuCod: usuCod,
        PerCod: perCod
      }));
      const removedPermissionsData = removedPermissions.map(perCod => ({
        UsuAno: usuAno,
        UsuCod: usuCod,
        PerCod: perCod
      }));
      console.log(addedPermissionsData)
      console.log(removedPermissionsData)
  
      const responseAddPermissions = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso/agregar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addedPermissionsData)
      });
      if (!responseAddPermissions.ok) {
        // Manejar el error...
      }
  
      // Realizar la petición para eliminar menús
      const responseRemovePermissions = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso/eliminar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(removedPermissionsData)
      });
      if (!responseRemovePermissions.ok) {
        // Manejar el error...
      }
      Notiflix.Notify.success("Menus actualizados correctamente")
    } catch (error) {
      console.log(error)
    } finally{
      Notiflix.Loading.remove();
      navigate(`/permiso-user/${safeCiphertext}`)
    }

  };

  return (
    <>
      <div className="bg-white h-100 flex flex-column">
        <div className="PowerMas_Header_Form_Beneficiarie flex ai-center">
          <Bar currentStep={2} />
        </div>
        <div className="flex-grow-1 overflow-auto p1_25">
        <div className="PowerMas_MenuUserContainer">
        <div className="flex gap-1">
          <div className="PowerMas_ListMenus Large_6">
            <ul>
              {menus.map(menu => renderMenu(menu, 1))}
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
        </div>
        <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
            <button onClick={() => navigate(`/form-user/${safeCiphertext}`)} className="Large_5 m2 PowerMas_Buttom_Secondary">Atras</button>
            <button onClick={handleNext} className="Large_5 m2 PowerMas_Buttom_Primary">Siguiente</button>
        </div>
      </div>
    </>
  )
}

export default MenuUser