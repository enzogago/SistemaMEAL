const InputSimbolo = ({register, errors, dirtyFields, isSubmitted}) => {
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
            Simbolo:
        </label>
        <input 
            id="simbolo"
            className={`PowerMas_Modal_Form_${dirtyFields.simbolo || isSubmitted ? (errors.simbolo ? 'invalid' : 'valid') : ''}`}  
            type="text" 
            placeholder='Ingresa Simbolo' 
            maxLength={2}
            name="simbolo" 
            autoComplete='off'
            {...register(
                'simbolo', { 
                    required: 'El campo es requerido',
                    maxLength: { value: 2, message: 'El campo no puede tener más de 2 caracteres' },
                    pattern: {
                        value: /^[S/.€$¥£₹₽₺₫₴₣₤₧₩₪₮₯₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿฿៛₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿]+$/,
                        message: 'Por favor, introduce solo símbolos de moneda',
                    },
                    validate: validateNoLeadingSpaces,
                }
            )}
        />
        {errors.simbolo ? (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.simbolo.message}</p>
        ) : (
            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
            </p>
        )}
    </>
    )
}

export default InputSimbolo