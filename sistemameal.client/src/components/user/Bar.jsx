import React from 'react'
import { FaUser } from 'react-icons/fa'
import { FaListCheck } from 'react-icons/fa6'

const Bar = ({ isEditing, currentStep }) => {
    return (
        <div className="PowerMas_Form_User_Bar flex ai-center gap-1 p_25 Phone_12 p1">
            <div className={`p_25 `}>
                <div className='flex jc-center ai-center gap-1'>
                    <span className={`f1_25 ${currentStep >= 1 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>1</span> 
                    <article>
                        <p className="flex ai-center gap_5 bold">{isEditing ? 'Editar': 'Nuevo'} Usuario</p>
                        <p className='f_75' >Ingresa los datos</p>
                    </article>
                </div>
                {/* <FaUser className="f1_5" /> */}
            </div>
            <hr className='PowerMas_Hr' />
            <div className={`p_25 `}>
                <div className='flex jc-center ai-center gap-1'>
                    <span className={`f1_25 ${currentStep >= 2 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>2</span> 
                    <article>
                        <p className="flex ai-center gap_5 bold">Acceso al Menú</p>
                        <p className='f_75' >Ingresa los datos</p>
                    </article>
                </div>
                {/* <FaUser className="f1_5" /> */}
            </div>
            <hr className='PowerMas_Hr' />
            <div className={`p_25`}>
                <div className='flex jc-center ai-center gap-1'>
                    <span className={`f1_25 ${currentStep >= 3 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>3</span> 
                    <article>
                        <p className="flex ai-center gap_5 bold">Acceso a la Información</p>
                        <p className='f_75' >Ingresa los datos</p>
                    </article>
                </div>
                {/* <FaListCheck className="f1_5" /> */}
            </div>
        </div>
    )
}

export default Bar