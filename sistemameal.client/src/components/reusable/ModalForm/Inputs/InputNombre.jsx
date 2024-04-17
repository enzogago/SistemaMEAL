const InputNombre = ({register, errors, dirtyFields, isSubmitted}) => {
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
            Nombre:
        </label>
        <input 
            id="nombre"
            className={`p_5 PowerMas_Modal_Form_${dirtyFields.nombre || isSubmitted ? (errors.nombre ? 'invalid' : 'valid') : ''}`}  
            type="text" 
            placeholder='Nuevo' 
            maxLength={300} 
            name="nombre" 
            autoComplete='off'
            {...register(
                'nombre', { 
                    required: 'El campo es requerido',
                    maxLength: { value: 300, message: 'El campo no puede tener más de 300 caracteres' },
                    minLength:  { value: 3, message: 'El campo no puede tener menos de 3 caracteres' },
                    pattern: {
                        value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ().,;üÜ0-9/\s-_]+$/,
                        message: 'Por favor, introduce solo letras y espacios',
                    },
                    validate: validateNoLeadingSpaces,
                }
            )}
        />
        {errors.nombre ? (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.nombre.message}</p>
        ) : (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
            </p>
        )}
    </>
    )
}

export default InputNombre