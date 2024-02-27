import Notiflix from "notiflix";
import CryptoJS from 'crypto-js';

export const handleSubmit = async (data, isEditing, navigate, safeCiphertext) => {
    const url = isEditing ? `${import.meta.env.VITE_APP_API_URL}/usuario/${data.usuAno}/${data.usuCod}` : `${import.meta.env.VITE_APP_API_URL}/usuario`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        Notiflix.Loading.pulse();
        const token = localStorage.getItem('token');
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
            console.log(errorData)
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
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleDelete = async (ano, cod, setData) => {
    Notiflix.Confirm.show(
        'Eliminar Registro',
        '¿Estás seguro que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/usuario/${ano}/${cod}`;

            const token = localStorage.getItem('token');

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message)
                    return;
                }

                Notiflix.Notify.success(data.message);
                
                // Actualiza los datos después de eliminar un registro
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const updateData = await updateResponse.json();
                setData(updateData);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};
