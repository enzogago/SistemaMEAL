const InputNombre = ({register, errors, dirtyFields, isSubmitted, nameRegister, maxLength}) => {
    // Función de validación personalizada
    const validateNoLeadingSpaces = (value) => {
        if (value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };

    return (
        <>
        <label className="block" style={{textTransform: 'capitalize'}}>
            {nameRegister}:
        </label>
        <input 
            id={nameRegister}
            className={`p_5 PowerMas_Modal_Form_${dirtyFields[nameRegister] || isSubmitted ? (errors[nameRegister] ? 'invalid' : 'valid') : ''}`}  
            type="text" 
            placeholder='Nuevo' 
            maxLength={maxLength} 
            name={nameRegister} 
            autoComplete='off'
            {...register(
                nameRegister, { 
                    required: 'El campo es requerido',
                    maxLength: { value: maxLength, message: `El campo no puede tener más de ${maxLength} caracteres` },
                    minLength:  { value: 3, message: 'El campo no puede tener menos de 3 caracteres' },
                    pattern: {
                        value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ().,;üÜ0-9/\s-_]+$/,
                        message: 'Por favor, introduce solo letras y espacios',
                    },
                    validate: validateNoLeadingSpaces,
                }
            )}
        />
        {errors[nameRegister] ? (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors[nameRegister].message}</p>
        ) : (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
            </p>
        )}
    </>
    )
}

export default InputNombre