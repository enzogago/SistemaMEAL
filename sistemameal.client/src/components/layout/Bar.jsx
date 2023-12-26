import avatar from '../../img/avatar.jpeg';

const Bar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="PowerMas_BarContainer">
        <h2 className="Large-f1_5">¡Hola de nuevo!</h2>
        <div className="PowerMas_ProfileContainer">
            <div className="PowerMas_ProfilePicture">
                <img src={avatar} alt="Descripción de la imagen" />
            </div>
            <div className="PowerMas_ProfileInfo Large-p1">
                <span className="PowerMas_Username Large-f_1">{`${user.usuNom} ${user.usuApe} `}</span>
                <span className="PowerMas_UserRole Large-f_75">{user.cargo.carNom}</span>
            </div>
                <div className="PowerMas_MenuIcon"> &gt; </div>
        </div>
    </div>
  )
}

export default Bar