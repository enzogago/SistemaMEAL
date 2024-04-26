import { useContext, useEffect, useState } from 'react';
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
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import Logo from '../../img/PowerMas_LogoAyudaEnAccion.png';
import ModalProfile from './ModalProfile';

const Bar = ({showSidebarAndBar, isOpen, setIsOpen}) => {
    const navigate = useNavigate();
    // Variables state AuthContext
    const { authInfo, authActions } = useContext(AuthContext);
    const { userLogged } = authInfo;
    console.log(userLogged)
    const { setUserLogged } = authActions;
    // Variables State statusContext
    const { statusActions } = useContext(StatusContext);
    const { setModalVisible, setEstadoEditado } = statusActions;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAcercaOpen, setIsModalAcercaOpen] = useState(false);
    const [isOpenModalProfile, setIsOpenModalProfile] = useState(false);
    
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

    const closeModalProfile = () => {
        setIsOpenModalProfile(false);
    };

    // Función para manejar el clic en el icono
    const handleIconClick = (e) => {
        e.stopPropagation(); // Previene que el evento de click se propague al documento
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
    const editarPerfil = () => {
        setIsOpenModalProfile(true);
        setIsOpen(false);
    }
    const AcercDe = () => {
        openModalAcerca();
        setIsOpen(false);
    }


    useEffect(() => {
        // Función para manejar el clic en el documento
        const handleDocumentClick = () => {
            setIsOpen(false); // Cierra el menú cuando se hace clic fuera de él
        };

        // Agrega el event listener cuando el componente se monta
        document.addEventListener('click', handleDocumentClick);

        // Limpia el event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []); // Dependencias vacías para que se ejecute solo al montar y desmontar

    return (
        <div style={{backgroundColor: '#fff', boxShadow: 'inset 10px 0px 10px rgba(0, 0, 0, 0.2)'}}>
            <div 
                className={`PowerMas_BarContainer flex ai-center ${showSidebarAndBar ? 'jc-space-between' : 'jc-flex-end'} c p1`}
                style={{
                    backgroundColor: `${showSidebarAndBar? '#FFC65860' : '#ffffff'}`,
                    color: `${showSidebarAndBar? '#372E2C' : '#000000'}`,
                    borderBottom:`${showSidebarAndBar? '' : '2px solid #C6D5D7'}`,
                    padding:`${showSidebarAndBar? '' : '0.5rem 1rem'}`,

                }}
            >
                {
                    showSidebarAndBar ?
                    <h1 className="Powermas_FontTitle Large-f2_5 Medium-f1_5 Small-f1">Hola de nuevo</h1>
                    :
                    '' // <img className='Large_1 Medium_10 Phone_6' height="auto"  title="Sistema MEAL Ayuda en Acción" src={Logo} alt="Logo Ayuda En Accion" />
                }
                <div className="PowerMas_ProfileContainer">
                    <div className="PowerMas_ProfilePicture">
                        <img src={Object.keys(userLogged).length && `data:image/jpeg;base64,${userLogged.usuAva}`} alt="Descripción de la imagen" />
                    </div>
                    {
                        showSidebarAndBar &&
                        <div className="PowerMas_ProfileInfo flex-column m_5">
                            <span style={{textTransform: 'capitalize', borderBottom: '1px solid #000', marginBottom: '0.25rem', paddingBottom: '0.25rem'}} className="PowerMas_Username Large-f1 Medium-f1 Small-f_75">{userLogged  ? `${userLogged.usuNom.toLowerCase()} ${userLogged.usuApe.toLowerCase()}` : ''}</span>
                            <span style={{textTransform: 'capitalize'}}  className="PowerMas_UserRole Large-f_75 Medium-f_75 Small-f_5">{userLogged  ? userLogged.rolNom.toLowerCase() : ''}</span>
                        </div>
                    }
                    <div 
                        className={`pointer round p_25 PowerMas_MenuIcon ${isOpen ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                        onClick={handleIconClick}
                    >
                        &gt;
                    </div>
                    {isOpen && (
                        <div className={`Medium_2 Phone_6 PowerMas_DropdownMenu ${isOpen ? 'PowerMas_DropdownMenu--open' : ''}`}>
                            <div className='PowerMas_Profile_Name p_75 flex flex-column jc-center ai-center gap_5'> 
                                <div className="PowerMas_ProfilePicture2" style={{width: '75px'}}>
                                    <img src={userLogged && `data:image/jpeg;base64,${userLogged.usuAva}`} alt="Descripción de la imagen" />
                                </div>
                                <p style={{textTransform: 'capitalize'}} className='color-black'>Hola, {userLogged ? `${userLogged.usuNom.toLowerCase()}` : ''}</p>
                            </div>
                            <hr className='PowerMas_Hr m0' />
                            {
                                showSidebarAndBar &&
                                <>
                                    <Link className='flex ai-center p_25' onClick={editarPerfil}>
                                        <FaUserAlt className='w-auto m_5' />
                                        <span className='flex'>Perfil</span>
                                    </Link>
                                    <Link className='flex ai-center p_25 grey-hover' onClick={CambiarContraseña}>
                                        <FaUnlockKeyhole className='w-auto m_5' />
                                        <span className='flex'>Contraseña</span>
                                    </Link>
                                    <Link className='flex ai-center p_25' onClick={() => setIsOpen(false)}  to="/tutorial">
                                        <IoPlayCircleSharp className='w-auto m_5' />
                                        <span className='flex'>Tutoriales</span>
                                    </Link>
                                    <Link className='flex ai-center p_25' onClick={AcercDe}>
                                        <AiFillTool className='w-auto m_5' />
                                        <span className='flex'>Acerca De</span>
                                    </Link>
                                    <hr className='PowerMas_Hr m0' />
                                </>
                            }
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
                <ModalProfile 
                    openModal={isOpenModalProfile}
                    closeModal={closeModalProfile}
                />
            </div>
        </div>
    )
}

export default Bar