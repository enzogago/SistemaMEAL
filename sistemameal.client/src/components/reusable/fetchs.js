import Notiflix from 'notiflix';

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
        Notiflix.Block.remove(element);
    }
};