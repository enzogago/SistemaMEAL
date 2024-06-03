import Notiflix from 'notiflix';

export const fetchDataLoading = async (controller, setData) => {
    try {
        Notiflix.Loading.pulse();
        // Valores del storage
        const token = localStorage.getItem('token');
        // Obtenemos los datos
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if(response.status === 401 || response.status === 403){
                const data = await response.json();
                Notiflix.Notify.failure(data.message);
            }
            return;
        }
        const data = await response.json();
        if (data.success === false) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        setData(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const fetchDataBlock = async (controller, setData, element) => {
    try {
        if (document.querySelector(element)) {
            Notiflix.Block.pulse(element, {
                svgSize: '100px',
                svgColor: '#F87C56',
            });
        }
        // Valores del storage
        const token = localStorage.getItem('token');
        // Obtenemos los datos
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if(response.status === 401 || response.status === 403){
                const data = await response.json();
                Notiflix.Notify.failure(data.message);
            }
            return;
        }
        const data = await response.json();
        if (data.success === false) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        setData(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (document.querySelector(element)) {
            Notiflix.Block.remove(element);
        }
    }
};

export const fetchDataReturn = async (controller) => {
    try {
        // Valores del storage
        const token = localStorage.getItem('token');
        // Obtenemos los datos
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if(response.status === 401 || response.status === 403){
                const data = await response.json();
                Notiflix.Notify.failure(data.message);
            }
            return;
        }
        const data = await response.json();
        if (data.success === false) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        return (data);
    } catch (error) {
        console.error('Error:', error);
    }
};

export const handleDelete = async (controller, obj, setRefresh) => {
    Notiflix.Confirm.show(
        'Eliminar Registro',
        '¿Está seguro que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}`;

            try {
                Notiflix.Loading.pulse();
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(obj),
                });
                const data = await response.json();
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                
                setRefresh(prevRefresh => !prevRefresh);
                Notiflix.Notify.success(data.message);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};