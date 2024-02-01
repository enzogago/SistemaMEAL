import { useContext, useState } from 'react';
import avatar from '../../img/avatar.jpeg';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Bar = () => {
  // Variables state AuthContext
  const { authInfo } = useContext(AuthContext);
  const { userLogged } = authInfo;

  // Estado para rastrear si el menú está abierto
  const [isOpen, setIsOpen] = useState(false);

  // Función para manejar el clic en el icono
  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="PowerMas_BarContainer flex ai-center jc-space-between p_5">
        <h2 className="Large-f2 Medium-f1_5 Small-f1">¡Hola de nuevo!</h2>
        <div className="PowerMas_ProfileContainer">
            <div className="PowerMas_ProfilePicture">
                <img src={avatar} alt="Descripción de la imagen" />
            </div>
            <div className="PowerMas_ProfileInfo m_5">
                <span className="PowerMas_Username Large-f1 Medium-f1 Small-f_75">{userLogged && userLogged.cargo ? `${userLogged.usuNom} ${userLogged.usuApe}` : ''}</span>
                <span className="PowerMas_UserRole Large-f_75 Medium-f_75 Small-f_5">{userLogged && userLogged.cargo ? userLogged.cargo.carNom : ''}</span>
            </div>
            <div 
                className={`pointer round p_25 PowerMas_MenuIcon ${isOpen ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                onClick={handleIconClick}
            >
                &gt;
            </div>
            {isOpen && (
                 <div className={`Phone_2 PowerMas_DropdownMenu ${isOpen ? 'PowerMas_DropdownMenu--open' : ''}`}>
                 <Link className='p_75' to="/configurar">Configuración</Link>
                 <Link className='p_75' to="/cerrar-sesion">Cerrar sesión</Link>
             </div>
            )}
        </div>
    </div>
  )
}

export default Bar