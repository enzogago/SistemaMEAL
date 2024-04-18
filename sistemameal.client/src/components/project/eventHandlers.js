import Notiflix from "notiflix";

export const handleSubmit = async (data, isEditing, setRegistros, closeModalAndReset) => {
    const method = isEditing ? 'PUT' : 'POST';
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
    console.log(newData)

    try {
        Notiflix.Loading.pulse();
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newData),
        });
        
        const dataResult = await response.json();
        if (!response.ok) {
            Notiflix.Notify.failure(dataResult.message)
            return;
        }

         // Actualiza los datos después de eliminar un registro
         const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const updateData = await updateResponse.json();
        setRegistros(updateData);
        closeModalAndReset();
        Notiflix.Notify.success(dataResult.message)
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};


export const handleDelete = async (controller, obj, setRegistros) => {
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
                
                // Actualiza los datos después de eliminar un registro
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const updateData = await updateResponse.json();
                setRegistros(updateData);
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