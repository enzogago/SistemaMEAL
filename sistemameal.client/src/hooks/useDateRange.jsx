import { useState } from 'react';

const useDateRange = () => {
    const [periodoInicio, setPeriodoInicio] = useState('');
    const [periodoFin, setPeriodoFin] = useState('');

    const validarFormatoFecha = (fecha) => {
        const regex = /^(0[1-9]|1[0-2])-([0-9]{4})$/;
        return regex.test(fecha);
    };

    const handlePeriodoChange = (setPeriodo) => (e) => {
        if (e.key === 'Enter') {
            const nuevoValor = e.target.value;
            if (validarFormatoFecha(nuevoValor)) {
                setPeriodo(nuevoValor);
            } else {
                setPeriodo('');
            }
        }
    };

    return {
        periodoInicio,
        setPeriodoInicio,
        periodoFin,
        setPeriodoFin,
        handlePeriodoChange,
    };
};

export default useDateRange;
