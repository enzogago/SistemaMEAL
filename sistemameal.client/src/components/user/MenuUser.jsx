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


  const groupByParent = (menuData) => {
    // Primero, creamos un objeto donde las claves son los códigos de los menús (menCod)
    // y los valores son los elementos del menú correspondientes.
    const menuMap = menuData.reduce((map, item) => {
        map[item.menCod] = { ...item, subMenus: [] };
        return map;
    }, {});

    // Luego, recorremos menuData de nuevo para asignar cada menú a su menú padre.
    menuData.forEach((item) => {
        if (item.menCodPad) {
            const parent = menuMap[item.menCodPad];
            if (parent) {
                parent.subMenus.push(menuMap[item.menCod]);
                menuMap[item.menCod].parent = parent;
            }
        }
    });

    // Finalmente, filtramos menuData para obtener solo los menús principales.
    const rootMenus = menuData.filter(item => item.menAnoPad === null).map(item => menuMap[item.menCod]);

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
          const allMenus = await responseAllMenus.json();
          // Marca los menús a los que el usuario tiene acceso
          const markedMenus = allMenus.map(menu => ({
              ...menu,
              isChecked: userMenus.some(userMenu => userMenu.menCod === menu.menCod)
          }));
          const groupData = groupByParent(markedMenus);
          console.log(markedMenus);
          setMenus(groupData);
          console.log(menus);
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
    console.log('handleCheck called');
    setCheckedMenus(prevCheckedMenus => {
        const newCheckedMenus = { ...prevCheckedMenus, [menu.menCod]: isChecked };

        // Si se está marcando el checkbox, también marca todos los menús padres.
        let currentMenu = menu;
        while (isChecked && currentMenu.parent) {
            newCheckedMenus[currentMenu.parent.menCod] = isChecked;
            currentMenu = currentMenu.parent;
        }

        // Si se está desmarcando el checkbox, también desmarca todos los submenús.
        if (!isChecked) {
            const uncheckSubMenus = (menu) => {
                menu.subMenus.forEach(subMenu => {
                    newCheckedMenus[subMenu.menCod] = false;
                    uncheckSubMenus(subMenu);
                });
            };
            uncheckSubMenus(menu);
        }
        console.log(checkedMenus);
        return newCheckedMenus;
    });
  }, []);



  const renderMenu = (menu, level) => (
    <MenuItem 
        key={menu.menCod} 
        menu={menu} 
        level={level} 
        handleToggle={handleToggle} 
        handleCheck={handleCheck} 
        openMenus={openMenus} 
        checkedMenus={checkedMenus} 
    />
  );

  const handleNext = async (event) => {
    event.preventDefault();
    // Convertir currentMenus a un objeto para facilitar la búsqueda
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
    console.log('Menús agregados:', addedMenusData);
    console.log('Menús eliminados:', removedMenusData);
    navigate('/permiso-user');
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