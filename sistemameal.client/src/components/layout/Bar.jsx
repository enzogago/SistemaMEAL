import { useContext } from 'react';
import avatar from '../../img/avatar.jpeg';
import { AuthContext } from '../../context/AuthContext';

const Bar = () => {
  // Variables state AuthContext
  const { authInfo } = useContext(AuthContext);
  const { userLogged } = authInfo;
  
  return (
    <div className="PowerMas_BarContainer">
        <h2 className="Large-f1_5">¡Hola de nuevo!</h2>
        <div className="PowerMas_ProfileContainer">
            <div className="PowerMas_ProfilePicture">
                <img src={avatar} alt="Descripción de la imagen" />
            </div>
            <div className="PowerMas_ProfileInfo Large-p1">
                <span className="PowerMas_Username Large-f_1">{userLogged && userLogged.cargo ? `${userLogged.usuNom} ${userLogged.usuApe}` : ''}</span>
                <span className="PowerMas_UserRole Large-f_75">{userLogged && userLogged.cargo ? userLogged.cargo.carNom : ''}</span>
            </div>
                <div className="PowerMas_MenuIcon"> &gt; </div>
        </div>
    </div>
  )
}

export default Bar