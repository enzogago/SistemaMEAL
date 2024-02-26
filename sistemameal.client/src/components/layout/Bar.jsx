import { useContext, useState } from 'react';
import avatar from '../../img/avatar.jpeg';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUnlockKeyhole } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiFillTool } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa";
import { StatusContext } from '../../context/StatusContext';
import Modal from './Modal';
import ModalAcerca from './ModalAcerca';
import CryptoJS from 'crypto-js';
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';

const Bar = () => {
    const navigate = useNavigate();
    // Variables state AuthContext
    const { authInfo, authActions } = useContext(AuthContext);
    const { userLogged } = authInfo;

    const { setUserLogged } = authActions;
    // Variables State statusContext
    const { statusActions } = useContext(StatusContext);
    const { setModalVisible, setEstadoEditado } = statusActions;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAcercaOpen, setIsModalAcercaOpen] = useState(false);
    
    // Funciones para abrir y cerrar los modales
    const openModal = (estado = null) => {
        setEstadoEditado(estado);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setEstadoEditado(null);
        setIsModalOpen(false);
    };
    
    const openModalAcerca = () => {
        setIsModalAcercaOpen(true);
    };
    
    const closeModalAcerca = () => {
        setIsModalAcercaOpen(false);
    };

    // Estado para rastrear si el menú está abierto
    const [isOpen, setIsOpen] = useState(false);

    // Función para manejar el clic en el icono
    const handleIconClick = () => {
        setIsOpen(!isOpen);
    };

    const CerrarSesion = () => {
        setUserLogged({})
        localStorage.removeItem('token');
        navigate('/login');
        setIsOpen(false);
    }

    const CambiarContraseña = () => {
        openModal();
        setIsOpen(false);
    }
    const AcercDe = () => {
        openModalAcerca();
        setIsOpen(false);
    }

    // Función para encriptar el ID del usuario
    const encryptId = (id) => {
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        return safeCiphertext;
    }
  
    return (
        <div className="PowerMas_BarContainer flex ai-center jc-space-between p_5">
            <h2 className="Large-f2 Medium-f1_5 Small-f1">¡Hola de nuevo!</h2>
            <div className="PowerMas_ProfileContainer">
                <div className="PowerMas_ProfilePicture">
                    <img src={Object.keys(userLogged).length && (userLogged.usuSex === 'M' ? masculino : femenino)} alt="Descripción de la imagen" />
                </div>
                <div className="PowerMas_ProfileInfo flex-column m_5">
                    <span style={{textTransform: 'capitalize'}} className="PowerMas_Username Large-f1 Medium-f1 Small-f_75">{userLogged  ? `${userLogged.usuNom.toLowerCase()} ${userLogged.usuApe.toLowerCase()}` : ''}</span>
                    <span style={{textTransform: 'capitalize'}}  className="PowerMas_UserRole Large-f_75 Medium-f_75 Small-f_5">{userLogged  ? userLogged.carNom.toLowerCase() : ''}</span>
                </div>
                <div 
                    className={`pointer round p_25 PowerMas_MenuIcon ${isOpen ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                    onClick={handleIconClick}
                >
                    &gt;
                </div>
                {isOpen && (
                    <div className={`Phone_2 PowerMas_DropdownMenu ${isOpen ? 'PowerMas_DropdownMenu--open' : ''}`}>
                        <div className='PowerMas_Profile_Name p_75 flex flex-column jc-center ai-center gap_5'> 
                            <div className="PowerMas_ProfilePicture2">
                                <img src={userLogged && (userLogged.usuSex === 'M' ? masculino : femenino)} alt="Descripción de la imagen" />
                            </div>
                            <p style={{textTransform: 'capitalize'}} className='color-black'>Hola, {userLogged ? `${userLogged.usuNom.toLowerCase()}` : ''}</p>
                        </div>
                        <hr className='PowerMas_Hr m0' />
                        <Link className='flex ai-center p_25' to={`/form-profile/${encryptId(`${userLogged.usuAno}${userLogged.usuCod}`)}`}>
                            <FaUserAlt className='w-auto m_5' />
                            <span className='flex'>Perfil</span>
                        </Link>
                        <Link className='flex ai-center p_25 grey-hover' onClick={CambiarContraseña}>
                            <FaUnlockKeyhole className='w-auto m_5' />
                            <span className='flex'>Contraseña</span>
                        </Link>
                        <Link className='flex ai-center p_25' to="/configurar">
                            <IoPlayCircleSharp className='w-auto m_5' />
                            <span className='flex'>Tutoriales</span>
                        </Link>
                        <Link className='flex ai-center p_25' onClick={AcercDe}>
                            <AiFillTool className='w-auto m_5' />
                            <span className='flex'>Acerca De</span>
                        </Link>
                        <hr className='PowerMas_Hr m0' />
                        <Link className='flex ai-center p_25' onClick={CerrarSesion}>
                            <FaPowerOff className='w-auto m_5' />
                            <span className='flex'>Cerrar Sesión</span>
                        </Link>
                    </div>
                )}
            </div>

            <Modal 
                isOpen={isModalOpen}
                closeModal={closeModal}
                user={userLogged}
            />
            <ModalAcerca 
                isOpen={isModalAcercaOpen}
                closeModal={closeModalAcerca}
            />
        </div>
    )
}

export default Bar