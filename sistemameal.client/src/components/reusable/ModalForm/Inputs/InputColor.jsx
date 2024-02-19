const InputColor = ({register, errors, dirtyFields, isSubmitted, setValue, color, setColor}) => {
    // Función de validación personalizada
    const validateNoLeadingSpaces = (value) => {
        if (value.startsWith(' ')) {
            return 'El campo no puede comenzar con espacios en blanco';
        }
        return true;
    };

    return (
        <>
            <div className='flex'>
                <input 
                    id="color"
                    className={`p1 Large_11 PowerMas_Modal_Form_${dirtyFields.color || isSubmitted ? (errors.color ? 'invalid' : 'valid') : ''}`}  
                    type="text" 
                    placeholder='EJM: #000000' 
                    maxLength={50} 
                    autoComplete='disabled'
                    name="color" 
                    {...register(
                        'color', { 
                            required: 'El color es requerido',
                            pattern: {
                                value: /^#([0-9A-Fa-f]{6})$/,
                                message: 'Por favor, introduce un color en formato hexadecimal (ejemplo: #123abc)',
                            },
                            validate: validateNoLeadingSpaces,
                        }
                    )}
                />
                <input 
                    className='Large_1 PowerMas_Input_Color pointer'
                    type="color" 
                    value={color}
                    onChange={(e) => {
                        const newColor = e.target.value.toUpperCase();
                        setValue('color', newColor);
                        setColor(newColor);
                    }}
                />
            </div>
            {errors.color ? (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.color.message}</p>
            ) : (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
                </p>
            )}
        </>
    )
}

export default InputColor