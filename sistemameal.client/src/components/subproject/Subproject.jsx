import { useEffect, useState } from 'react';
// Componentes
import Table from "./Table";
// Fetch Get
import { fetchData } from '../reusable/helper';

const Subproject = () => {
    // States locales
    const [ data, setData ] = useState([])

    // Cargar los registros
    useEffect(() => {
        fetchData('SubProyecto', setData);
    }, []);


    return (
        <>
            <Table 
                data={data}
                setData= {setData}
            />
        </>
    );
};

export default Subproject;
