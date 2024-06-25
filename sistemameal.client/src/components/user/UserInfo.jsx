import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';

const UserInfo = ({user}) => {
    return (
        <div className="PowerMas_Info_User PowerMas_Form_Card p1 overflow-auto" style={{backgroundColor: '#f7f7f7'}}>
            <div className="flex flex-column jc-center ai-center gap_5">
                <div className="PowerMas_ProfilePicture2" style={{width: 125, height: 125}}>
                    <img src={user && (user.usuAva ? `data:image/jpeg;base64,${user.usuAva}` : (user.usuSex == 'M' ? masculino : femenino ))} alt="Descripción de la imagen" />
                </div>
                <div className="center">
                    <p className="f1_25 bold" style={{textTransform: 'capitalize'}}>{user && user.usuNom.toLowerCase() + ' ' + user.usuApe.toLowerCase() }</p>
                    <p className="color-gray" style={{textTransform: 'capitalize'}}>{user && user.carNom.toLowerCase() }</p>
                </div>
            </div>
            <br />
            <article className="p_25">
            <p className="bold">Tipo Documento:</p>
            <p className="color-gray" style={{textTransform: 'capitalize'}}>{user && user.docIdeNom.toLowerCase() }</p>
            </article>
            <article className="p_25">
            <p className="bold">Documento:</p>
            <p className="color-gray">{user && user.usuNumDoc}</p>
            </article>
            <article className="p_25">
            <p className="bold">Correo:</p>
            <p className="color-gray">{user && user.usuCorEle.toLowerCase() }</p>
            </article>
            <article className="p_25">
            <p className="bold">Nacimiento:</p>
            <p className="color-gray">{user && user.usuFecNac }</p>
            </article>
            <article className="p_25">
            <p className="bold">Teléfono:</p>
            <p className="color-gray">{user && user.usuTel }</p>
            </article>
            <article className="p_25">
            <p className="bold">Rol:</p>
            <p className="color-gray" style={{textTransform: 'capitalize'}}>{user && user.rolNom.toLowerCase() }</p>
            </article>
            <article className="p_25">
            <p className="bold">Estado:</p>
            <p className="color-gray bold" style={{color: `${user && (user.usuEst === 'A' ? '#20737b' : '#E5554F')}`}}>{user && (user.usuEst === 'A' ? 'Activo' : 'Inactivo')}</p>
            </article>
        </div>
    )
}

export default UserInfo