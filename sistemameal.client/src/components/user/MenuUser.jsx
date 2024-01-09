import Notiflix from "notiflix";
import { useCallback, useContext, useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MenuUser = () => {
  const navigate = useNavigate();
  // Variables State AuthContext 
  const { authInfo } = useContext(AuthContext);
  const { userMaint } = authInfo;
  // Estados locales
  const [ menus, setMenus ] = useState([]);
  const [ openMenus, setOpenMenus ] = useState({}); 
  const [ checkedMenus, setCheckedMenus] = useState({});
  const [ currentMenus, setCurrentMenus ] = useState([]);
  const [ allMenus, setAllMenus ] = useState([]);
  const [ checkedPermissions, setCheckedPermissions ] = useState({});
  const [ userPermissions, setUserPermissions ] = useState({});


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
    // Verifica si userMaint es un objeto vacío
    if (!userMaint || Object.keys(userMaint).length === 0) {
        // Si es un objeto vacío, redirige al usuario a Table
        navigate('/user');
    }
  }, [userMaint, navigate]);

  

  useEffect(() => {
    const fetchMenus = async () => {
      try {
          Notiflix.Loading.pulse('Cargando...');
          const token = localStorage.getItem('token');
          // Permisos por usuario
          const responseUserPermissions = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso/${userMaint.usuAno}/${userMaint.usuCod}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
          });
          const userPermissions = await responseUserPermissions.json();
          setUserPermissions(userPermissions);
          // Obtener todos los permisos
          const responseAllPermissions = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
          });
          const allPermissions = await responseAllPermissions.json();
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
          const responseUserMenus = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/${userMaint.usuAno}/${userMaint.usuCod}`, {
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
          // Marca los menús a los que el usuario tiene acceso
          const markedMenus = allMenus.map(menu => {
            const menuPermissions = markedPermissions.filter(permission => permission.perRef === menu.menRef);
            return{
                ...menu,
                isChecked: userMenus.some(userMenu => userMenu.menCod === menu.menCod),
                permissions: menuPermissions
            }
          });
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
          Notiflix.Loading.remove();
      }
    };
    fetchMenus();
  }, [userMaint]);


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
        UsuAno: userMaint.usuAno,
        UsuCod: userMaint.usuCod,
        MenAno: menu.menAno,
        MenCod: menu.menCod
      }));
      const removedMenusData = removedMenus.map(menu => ({
        UsuAno: userMaint.usuAno,
        UsuCod: userMaint.usuCod,
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
        UsuAno: userMaint.usuAno,
        UsuCod: userMaint.usuCod,
        PerCod: perCod
      }));
      const removedPermissionsData = removedPermissions.map(perCod => ({
        UsuAno: userMaint.usuAno,
        UsuCod: userMaint.usuCod,
        PerCod: perCod
      }));
  
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
    } catch (error) {
      
    } finally{
      Notiflix.Loading.remove();
      navigate('/permiso-user');
    }

  };

  return (
    <div className="PowerMas_MenuUserContainer h-100 bg-white Large-p2_5">
      <h1 className="Large-f1_25">Menú para el usuario {userMaint.usuNom} {userMaint.usuApe} con código {userMaint.usuAno}{userMaint.usuCod}</h1>
      <div>
        <div className="PowerMas_ListMenus">
          <ul>
            {menus.map(menu => renderMenu(menu, 1))}
          </ul>
        </div>
      </div>
      <button onClick={handleNext}> Siguiente </button>
    </div>
  )
}

export default MenuUser