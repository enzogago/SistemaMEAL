import Notiflix from "notiflix";
export const handleSubmit = async (data, reset) => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario`, {
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
        reset();
        console.log(successData)
        // Actualiza los datos después de insertar o modificar un registro
        // const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // });
        // const updateData = await updateResponse.json();
        // if(!updateResponse.ok){
        //     Notiflix.Notify.failure(updateData.message);
        //     console.log(updateData.message)
        // }
        // console.log(updateData);
    } catch (error) {
        console.error('Error:', error);
    } finally {

    }
}