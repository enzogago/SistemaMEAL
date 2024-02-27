import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { StatusContext } from '../../context/StatusContext';
import { handleSubmit } from '../reusable/helper';
// sources
import logo from '../../img/PowerMas_LogoAyudaEnAccion.svg';

const ModalAcerca = ({ isOpen, closeModal }) => {
    // variables state de AuthContext
    const { authActions } = useContext(AuthContext);
    const { setIsLoggedIn } = authActions;
    // variables state de StatusContext
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { estadoEditado, modalVisible } = statusInfo;
    const { setModalVisible } = statusActions;

    
    // Activar focus en input
    useEffect(() => {
        if (isOpen) {
            document.getElementById('nuevaContraseña').focus();
        }
    }, [isOpen]);


    
    const closeModalAndReset = () => {
        closeModal();
    };


    return (
        <div className={`color-black PowerMas_Modal ${isOpen ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent" style={{width: '45%'}}>
                <span 
                    className="PowerMas_CloseModal" 
                    onClick={closeModalAndReset}
                >
                    ×
                </span>
                <div className="PowerMas_SidebarHeader flex flex-row ai-center p_5">
                    <img className='Large_4 Medium_10 Phone_6' height="auto"  title="Sistema MEAL Ayuda en Acción" src={logo} alt="Logo Ayuda En Accion" />
                    <h2 className="Large_9 center f1_5"> SISTEMA MEAL </h2>
                </div>
                <br />
                <div className='f1'>
                    Una herramienta desarrollada por Ayuda en Acción Ecuador para optimizar el monitoreo, evaluación, aprendizaje y rendición de cuentas en nuestros proyectos. 
                    <br /><br />
                    <span className='bold'>  Versión 1.0.1.3 (Marzo 2024)</span>
                    <br />
                    <br />
                    Queremos agradecer especialmente al equipo de Monitoreo, Evaluación Aprendizaje y Rendición de Cuentas por su dedicación en la conceptualización y desarrollo del proceso MEAL. También reconocemos el esfuerzo del equipo de PowerMAs, quienes han contribuido con su experiencia y habilidades técnicas en el desarrollo de esta plataforma. 
                    <br /><br />
                    <span className='flex flex-column jc-center center'>
                        <span className='bold m0'>
                            Todos los derechos reservados | Copyrigth © 2024 
                        </span>
                        Ayuda en Acción Ecuador.
                    </span>
                </div>
                <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                    <button className='' value="Cerrar"onClick={closeModalAndReset} > Cerrar </button>
                </div>
            </div>
        </div>
    );
}

export default ModalAcerca;
