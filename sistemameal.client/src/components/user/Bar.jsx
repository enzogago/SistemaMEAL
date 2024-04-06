import React from "react";

const Bar = ({ currentStep, type }) => {
    const stepsByType = {
        user: [
            { title: 'Datos del Usuario', description: 'Ingresa los datos' },
            { title: 'Acceso al Menú', description: 'Ingresa los datos' },
            { title: 'Acceso a la Información', description: 'Ingresa los datos' },
        ],
        upload: [
            { title: 'Subir Archivo', description: 'Selecciona el archivo a subir' },
            { title: 'Confirmación', description: 'Confirma la subida del archivo' },
            { title: 'Registro', description: 'Registro de implementadores y ubicación' },
        ],
        uploadBeneficiarie: [
            { title: 'Subir Archivo', description: 'Selecciona el archivo a subir' },
            { title: 'Confirmación', description: 'Confirma la subida del archivo' },
        ],
        // Agrega aquí más tipos si los necesitas
    };

    const steps = stepsByType[type] || []; // Usa un array vacío como valor por defecto si el tipo no se encuentra

    return (
        <div className="PowerMas_Form_User_Bar flex ai-center gap-1 p_25 Phone_12 p1">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className={`p_25 `}>
                        <div className='flex jc-center ai-center gap-1'>
                            <span className={`f1_25 ${currentStep >= index + 1 ? 'PowerMas_Form_User_Bar_Active' : ''}`}>{index + 1}</span> 
                            <article>
                                <p className="flex ai-center gap_5 bold">{step.title}</p>
                                <p className='f_75' >{step.description}</p>
                            </article>
                        </div>
                    </div>
                    {index < steps.length - 1 && <hr className='PowerMas_Hr' />}
                </React.Fragment>
            ))}
        </div>
    )
}

export default Bar
