import Notiflix from "notiflix";

export const handleSubmit = async (isEditing ,data, reset, navigate, closeModalEdit, updateData, setUpdateData) => {
    let newData = {};
            
    for (let key in data) {
        if (typeof data[key] === 'string') {
            // Convierte cada cadena a minúsculas
            newData[key] = data[key].toUpperCase();
        } else {
            // Mantiene los valores no string tal como están
            newData[key] = data[key];
        }
    }

    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newData),
        });
        const responseData = await response.json();
        if (!response.ok) {
            Notiflix.Notify.failure(responseData.message);
            return;
        }

        Notiflix.Notify.success(responseData.message);

        if (reset) {
            reset();
        }
        if (navigate) {
            navigate('/beneficiarie');
        }
        if (closeModalEdit) {
            closeModalEdit();
        }
        if (setUpdateData) {
            setUpdateData(!updateData)
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};