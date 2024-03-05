import Notiflix from "notiflix";


export const handleSubmitMetaBeneficiario = async (data, handleReset, updateData, setUpdateData, fetchBeneficiarie) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        console.log(response)
        if (!response.ok) {
            const errorData = await response.json();
            if(response.status === 409){
                Notiflix.Notify.warning(`${errorData.message}`);
                console.log(errorData.message)
                return;
            } else {
                Notiflix.Notify.failure(errorData.message);
                console.log(errorData.message)
                return;
            }
        }

        const successData = await response.json();
        Notiflix.Notify.success(successData.message);
        console.log(successData);
        fetchBeneficiarie();
        setUpdateData(!updateData);
        handleReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleSubmitMetaBeneficiarioExiste = async (data, handleReset, updateData, setUpdateData, fetchBeneficiarie)=> {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/existe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if(response.status === 409){
                Notiflix.Notify.warning(`${errorData.message}`);
                console.log(errorData.message)
                return;
            } else {
                Notiflix.Notify.failure(errorData.message);
                console.log(errorData.message)
                return;
            }
        }

        const successData = await response.json();
        Notiflix.Notify.success(successData.message);
        fetchBeneficiarie();
        setUpdateData(!updateData);
        handleReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const fetchBeneficiariosMeta = async (metAno, metCod, setBeneficiariosMeta) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/meta/${metAno}/${metCod}`, {
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
        console.log(data)
        setBeneficiariosMeta(data)
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleDeleteBeneficiarioMeta = async (controller,metAno,metCod,benAno,benCod,ubiAno,ubiCod,metBenAnoEjeTec, metBenMesEjeTec, updateData, setUpdateData, fetchBeneficiarie) => {
    Notiflix.Confirm.show(
        'Eliminar Registro',
        '¿Estás seguro que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}/eliminar-beneficiario/${metAno}/${metCod}/${benAno}/${benCod}/${ubiAno}/${ubiCod}/${metBenAnoEjeTec}/${metBenMesEjeTec}`;

            const token = localStorage.getItem('token');

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                console.log(response)
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }

                Notiflix.Notify.success(data.message);
                
                setUpdateData(!updateData);
                fetchBeneficiarie();
            } catch (error) {
                console.error('Error:', error);
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};