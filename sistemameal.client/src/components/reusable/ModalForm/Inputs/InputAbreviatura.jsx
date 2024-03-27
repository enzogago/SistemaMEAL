const InputAbreviatura = ({register, errors, dirtyFields, isSubmitted}) => {
    // Función de validación personalizada
    const validateNoLeadingSpaces = (value) => {
        if (value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };

    return (
        <>
            <label htmlFor='abreviatura' className="block">
                Abreviatura:
            </label>
            <input 
                id="abreviatura"
                className={`p_5 PowerMas_Modal_Form_${dirtyFields.abreviatura || isSubmitted ? (errors.abreviatura ? 'invalid' : 'valid') : ''}`}  
                type="text" 
                placeholder='Dni' 
                maxLength={100} 
                name="abreviatura" 
                autoComplete='disabled'
                {...register(
                    'abreviatura', { 
                        required: 'La abreviatura es requerido',
                        maxLength: { value: 50, message: 'El campo no puede tener más de 50 caracteres' },
                        minLength:  { value: 2, message: 'El campo no puede tener menos de 2 caracteres' },
                        pattern: {
                            value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ().üÜ/\s-_]+$/,
                            message: 'Por favor, introduce solo letras y espacios',
                        },
                        validate: validateNoLeadingSpaces,
                    }
                )}
            />
            {errors.abreviatura ? (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.abreviatura.message}</p>
            ) : (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                    Espacio reservado para el mensaje de error
                </p>
            )}
        </>
    )
}

export default InputAbreviatura