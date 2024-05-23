// Función para acortar el texto y agregar tooltip si es necesario
export const renderCellWithTooltip = (values, length = 60) => {
    // Combina los valores en un solo texto
    const text = values.join(' - ');
    const shortText = text.length > length ? `${text.substring(0, length)}...` : text;
    return text.length > length ? (
        <span data-tooltip-id="info-tooltip" data-tooltip-content={text}>
            {shortText}
        </span>
    ) : (
        text
    );
};

export const getMonthYearText = (monthNum, year) => {
    const monthName = new Date(2024, monthNum - 1).toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    return `${monthName} - ${year}`;
};