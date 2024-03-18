const InputCodigoSap = ({register, errors, dirtyFields, isSubmitted}) => {
    // Función de validación personalizada
    const validateNoLeadingSpaces = (value) => {
        if (value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };

    return (
        <>
        <label className="block">
            Codigo SAP:
        </label>
        <input 
            id="codigoSAP"
            className={`p1 PowerMas_Modal_Form_${dirtyFields.codigoSAP || isSubmitted ? (errors.codigoSAP ? 'invalid' : 'valid') : ''}`}  
            type="text" 
            placeholder='123456' 
            maxLength={100} 
            name="codigoSAP" 
            autoComplete='disabled'
            {...register(
                'codigoSAP', { 
                    required: 'El campo es requerido',
                    maxLength: { value: 100, message: 'El campo no puede tener más de 100 caracteres' },
                    minLength:  { value: 5, message: 'El campo no puede tener menos de 5 caracteres' },
                    pattern: {
                        value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ().,;üÜ\s-_]+$/,
                        message: 'Por favor, introduce solo letras y espacios',
                    },
                    validate: validateNoLeadingSpaces,
                }
            )}
        />
        {errors.codigoSAP ? (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.codigoSAP.message}</p>
        ) : (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
            </p>
        )}
    </>
    )
}

export default InputCodigoSap