import { useEffect, useState } from 'react';

const AutocompleteInput = ({ options, register, watch, dirtyFields, isSubmitted, setValue, setSelectedOption,optionToString, handleOption,name, errors,disabled,titulo, trigger  }) => {
    const watchedValue = watch(name);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setFilteredOptions(options);
        console.log(options)
    }, [options]);

    useEffect(() => {
        if (watchedValue) {
            const filtered = options.filter(option =>
                optionToString(option).toLowerCase().includes(watchedValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [watchedValue]);

    const handleOptionClick = (option) => {
        setValue(name, optionToString(option));
        setFilteredOptions([]);
        setIsFocused(false);
        if (handleOption) {
            handleOption(option); // Maneja la opción seleccionada
        }
        if (setSelectedOption) {
            setSelectedOption(option); // Actualizamos el estado en FormGoal
        }
        trigger(name)
    };

    const handleBlur = () => {
        // Verifica si el valor actual del campo de entrada coincide con alguna de las opciones
        const matchingOption = options.find(option => optionToString(option) === watch(name));

        if (!matchingOption) {
            // Si no hay ninguna opción que coincida, limpia el campo de entrada
            setValue(name, '');
        }

        setTimeout(() => {
            setIsFocused(false);
        }, 100);
    };

    return (
        <div className='m_75 PowerMas_Autocomplete'>
            <label htmlFor={name} className="">
                {titulo}:
            </label>
            <input
                id={name}
                 className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields[name] || isSubmitted ? (errors[name] ? 'invalid' : 'valid') : ''}`} 
                {...register(name, {
                    required: `El ${titulo} es requerido`,
                })} 
                type="search"
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                disabled={disabled}
                autoComplete='disabled'
            />
            { isFocused && filteredOptions.length > 0 && (
                <ul className="PowerMas_Autocomplete_Options">
                    {filteredOptions.map((option, index) => (
                        <li key={index} onClick={() => handleOptionClick(option)} className="PowerMas_Autocomplete_Option f1 p_25">
                            {
                                optionToString(option).length > 30 ? optionToString(option).substring(0, 30) + '...' : optionToString(option)
                            }
                        </li>
                    ))}
                </ul>
            )}
            {errors[name] && (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors[name].message}</p>
            )}
        </div>
    );
};

export default AutocompleteInput;
