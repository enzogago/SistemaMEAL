import { useNavigate } from "react-router-dom";
import Bar from '../user/Bar'

const UploadValidate = () => {
    const navigate = useNavigate();

    return (
        <>
            <Bar currentStep={2} type='uploadBeneficiarie' />
            <div className="flex-grow-1">

            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/upload-beneficiarie')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button 
                className="Large_3 m_75 PowerMas_Buttom_Primary"
                // disabled={!selectedFile}
                >
                    Siguiente
                </button>
            </footer>
        </>
    )
}

export default UploadValidate