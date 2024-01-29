import React from 'react'
import { FaUser } from 'react-icons/fa'
import { FaListCheck } from 'react-icons/fa6'

const Bar = ({ currentStep }) => {
    return (
        <div className="PowerMas_Form_User_Bar flex jc-flex-end gap-1 p_25">
            <div className={`p_25 ${currentStep >= 1 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>
                <p className="flex ai-center gap_5"><span className="f1_5">1</span> Nuevo Usuario</p>
                <FaUser className="f1_5" />
            </div>
            <div className={`p_25 ${currentStep >= 2 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>
                <p className="flex ai-center gap_5"><span className="f1_5">2</span> Menu del Usuario</p>
                <FaUser className="f1_5" />
            </div>
            <div className={`p_25 ${currentStep >= 3 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>
                <p className="flex ai-center gap_5"><span className="f1_5">3</span> Permisos del Usuario</p>
                <FaListCheck className="f1_5" />
            </div>
        </div>
    )
}

export default Bar