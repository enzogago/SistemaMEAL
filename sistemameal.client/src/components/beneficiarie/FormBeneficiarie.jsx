import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import ContentForm from "./ContentForm";
import { handleSubmit } from "./eventHandlers";
import Return from "../../icons/Return";

const FormBeneficiarie = () => {
    const navigate = useNavigate();
    
    const { id: safeCiphertext } = useParams();
    let id = '';
    if (safeCiphertext) {
        const ciphertext = atob(safeCiphertext);
        // Desencripta el ID
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        id = bytes.toString(CryptoJS.enc.Utf8);
    }
    const isEditing = id && id.length === 10;
    var benAno;
    var benCod;
    if (isEditing) {
        benAno = id.slice(0, 4);
        benCod = id.slice(4);
    }

    const { 
        register, 
        watch, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = useForm({ mode: "onChange", defaultValues: { benNomApo: '', benApeApo: ''}});
    
    const handleNext = () => {
        validateForm((data) => {
            console.log(data)
            const { docIdeCod, docIdeBenNum } = data;
            const benCodUni = data.docIdeBenNum;
            let payload = {
                Beneficiario: { ...data, benCodUni: docIdeBenNum },
                DocumentoBeneficiario: {
                    docIdeCod,
                    docIdeBenNum
                }
            }

            if (isEditing) {
                handleSubmit(isEditing ,data, reset, navigate);
            } else {
                handleSubmit(isEditing ,payload, reset, navigate);
            }
        })();
    }

    return (
        <>
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_5 gap-1">
                <span className="flex pointer   " onClick={() => navigate('/beneficiarie')} >
                    <span className='flex f1_25'>
                        <Return />
                    </span>
                </span>
                <h1 className="flex-grow-1 f1_75">{isEditing ? 'Editar' : 'Nuevo'} Beneficiario</h1>
            </div>
            <ContentForm
                register={register}
                dirtyFields={dirtyFields}
                isSubmitted={isSubmitted}
                errors={errors}
                reset={reset}
                watch={watch}
                trigger={trigger}
                setValue={setValue}
                isEditing={isEditing}
                benAno={benAno}
                benCod={benCod}
            />
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/beneficiarie')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={handleNext} className="Large_3 m_75 PowerMas_Buttom_Primary">Siguiente</button>
            </footer>
        </>
    )
}

export default FormBeneficiarie