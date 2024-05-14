import { useState } from 'react';

// Hook personalizado para manejar etiquetas de búsqueda y entrada de usuario
export const useSearchTags = () => {
    const [searchTags, setSearchTags] = useState([]); // Almacena las etiquetas de búsqueda
    const [isInputEmpty, setIsInputEmpty] = useState(true); // Indica si el input está vacío
    const [inputValue, setInputValue] = useState(''); // Almacena el valor actual del input

    // Función para manejar el cambio en el input
    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Actualiza el valor del input
        setIsInputEmpty(e.target.value === ''); // Actualiza si el input está vacío
    };

    // Función para manejar la tecla presionada en el input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue && !searchTags.includes(inputValue)) {
            setSearchTags(prevTags => [...prevTags, inputValue]); // Añade la etiqueta
            setInputValue(''); // Limpia el input
            setIsInputEmpty(true); // Establece el input como vacío
        } else if (e.key === 'Backspace' && isInputEmpty && searchTags.length > 0) {
            setSearchTags(prevTags => prevTags.slice(0, -1)); // Elimina la última etiqueta
        }
    };

    // Función para eliminar una etiqueta específica
    const removeTag = (tag) => {
        setSearchTags(searchTags.filter(t => t !== tag)); // Filtra la etiqueta a eliminar
    };

    // Devuelve las variables y funciones que se pueden usar en otros componentes
    return {
        searchTags,
        setSearchTags,
        isInputEmpty,
        setIsInputEmpty,
        inputValue,
        setInputValue,
        handleInputChange,
        handleKeyDown,
        removeTag
    };
};
