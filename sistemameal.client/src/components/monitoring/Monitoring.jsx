import Notiflix from 'notiflix';
import React, { useEffect, useState } from 'react'
import Table from './Table';

const Monitoring = () => {
    const [ monitoringData, setMonitoringData] = useState([])
    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchMonitoreo = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/Filter`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if(response.status == 401 || response.status == 403){
                        const data = await response.json();
                        Notiflix.Notify.failure(data.message);
                    }
                    return;
                }
                const data = await response.json();
                if (data.success == false) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                setMonitoringData(data);
                console.log(data)
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        fetchMonitoreo();
    }, []);

    return (
        <>
            <Table 
                data={monitoringData}
                setMonitoringData={setMonitoringData}
            />
        </>
    )
}

export default Monitoring