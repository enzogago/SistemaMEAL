import { useEffect, useState } from 'react';
// Componentes
import Table from './Table';
import { fetchData } from '../reusable/helper';

const Beneficiarie = () => {
    // States locales
    const [ data, setData ] = useState([])

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        fetchData('Beneficiario',setData);
    }, []);

    return (
        <>
            <Table
                data={data} 
            />
        </>
    )
}

export default Beneficiarie