import Notiflix from "notiflix";
import CryptoJS from 'crypto-js';

export const handleSubmit = async (data, isEditing) => {

    console.log(data)
    const url = isEditing ? `${import.meta.env.VITE_APP_API_URL}/api/Proyecto/${data.proAno}/${data.proCod}` : `${import.meta.env.VITE_APP_API_URL}/api/Proyecto`;
    const method = isEditing ? 'PUT' : 'POST';

    const token = localStorage.getItem('token');
    console.log(method)
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        
        const dataResult = await response.json();
        if (!response.ok) {
            console.log(dataResult)
            return;
        }

        console.log(dataResult)
    } catch (error) {
        console.error('Error:', error);
    }
};
