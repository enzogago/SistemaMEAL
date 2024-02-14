import Notiflix from "notiflix";
import CryptoJS from 'crypto-js';

export const handleSubmit = async (data, isEditing, navigate, safeCiphertext) => {
    const url = isEditing ? `${import.meta.env.VITE_APP_API_URL}/usuario/${data.usuAno}/${data.usuCod}` : `${import.meta.env.VITE_APP_API_URL}/usuario`;
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
        
        if (!response.ok) {
            const errorData = await response.json();
            if(response.status === 409){
                Notiflix.Notify.warning(`${errorData.message} ${(data.usuCorEle).toUpperCase()}`);
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
        console.log(successData)
        // Si se está creando un nuevo usuario, obtén el usuAno y usuCod del último usuario
        if (!isEditing) {
            const { usuAno, usuCod } = successData;
            const id = `${usuAno}${usuCod}`;
            // Encripta el ID
            const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
            // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
            const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
            navigate(`/menu-user/${safeCiphertext}`);
        } else {
            navigate(`/menu-user/${safeCiphertext}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
