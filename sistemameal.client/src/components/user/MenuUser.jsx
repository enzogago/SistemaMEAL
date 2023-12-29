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
  const [menus, setMenus] = useState([]);
  const [openMenus, setOpenMenus] = useState({}); 
  const [checkedMenus, setCheckedMenus] = useState({});


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
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu`, {
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
          const groupData = groupByParent(data);
          setMenus(groupData);
      } catch (error) {
          console.error('Error:', error);
      } finally {
          Notiflix.Loading.remove();
      }
    };
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

    // Aquí puedes agregar la lógica para guardar los datos del formulario.
    // Por ejemplo, podrías hacer una solicitud POST a tu API.

    // Cuando hayas terminado, puedes usar el hook useNavigate para navegar a la siguiente página.
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