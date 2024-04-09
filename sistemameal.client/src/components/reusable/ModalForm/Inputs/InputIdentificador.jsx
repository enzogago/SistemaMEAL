const InputIdentificador = ({register, errors, dirtyFields, isSubmitted}) => {
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
            Código Financiador:
        </label>
        <input 
            id="codigo"
            className={`PowerMas_Modal_Form_${dirtyFields['codigo'] || isSubmitted ? (errors['codigo'] ? 'invalid' : 'valid') : ''}`}  
            type="text" 
            placeholder='12345' 
            maxLength={10} 
            name="codigo" 
            autoComplete='disabled'
            {...register(
                'codigo', { 
                    required: 'El campo es requerido',
                    minLength: { value: 2, message: 'El campo no puede tener menos de 2 caracteres' },
                    maxLength: { value: 10, message: 'El campo no puede tener más de 5 caracteres' },
                    pattern: {
                        value: /^[A-Za-z0-9.\s]+$/,
                        message: 'Por favor, introduce solo letras y espacios',
                    },
                    validate: validateNoLeadingSpaces,
                }
            )}
        />
        {errors['codigo'] ? (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors['codigo'].message}</p>
        ) : (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
            </p>
        )}
    </>
    )
}

export default InputIdentificador