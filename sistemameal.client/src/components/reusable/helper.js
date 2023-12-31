import Notiflix from "notiflix";

export const handleDelete = async (controller, codigo, setRegistros, setIsLoggedIn) => {
    Notiflix.Confirm.show(
        'Eliminar registro',
        '¿Estás seguro de que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}/${codigo}`;

            const token = localStorage.getItem('token');

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    const text = await response.text();
                    const messageType = text.split(":")[0];
                    if (messageType === "1") {
                        Notiflix.Notify.failure("Error durante la ejecución del procedimiento almacenado");
                    } else {
                        Notiflix.Notify.failure(text);
                    }
                    throw new Error(text);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    if (data.result) {
                        setIsLoggedIn(false);
                    }
                    
                    Notiflix.Notify.failure(data.message);
                    setModalVisible(false); 
                    return;
                }

                const text = await response.text();
                Notiflix.Notify.success(text);
                
                // Actualiza los datos después de eliminar un registro
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await updateResponse.json();
                setRegistros(data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};

export const handleSubmit = async (controller, objetoEditado, data, setRegistros, setModalVisible, setIsLoggedIn, fieldMapping, codeField) => {

    const objeto = objetoEditado 
        ?   { 
                ...objetoEditado, 
                ...Object.keys(data).reduce((obj, key) => ({...obj, [fieldMapping[key]]: data[key]}), {}),
            } 
        :   { 
                ...Object.keys(data).reduce((obj, key) => ({...obj, [fieldMapping[key]]: data[key]}), {}),
            };

    const url = objetoEditado 
                ? `${import.meta.env.VITE_APP_API_URL}/api/${controller}/${objeto[codeField]}` 
                : `${import.meta.env.VITE_APP_API_URL}/api/${controller}`;

    const method = objetoEditado ? 'PUT' : 'POST';
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objeto),
        });
        console.log("desde response: ",response)
        if (!response.ok) {
            const text = await response.text();
            const messageType = text.split(":")[0];
            if (messageType === "1") {
                Notiflix.Notify.failure("Error durante la ejecución del procedimiento almacenado");
            } else {
                Notiflix.Notify.failure(text);
            }
            throw new Error(text);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            if (data.result) {
                setIsLoggedIn(false);
            }

            Notiflix.Notify.failure(data.message);
            setModalVisible(false); 
            return;
        }
        
        const text = await response.text();
        Notiflix.Notify.success(text);
        console.log(text)
        setModalVisible(false); // Cierra el modal

        // Actualiza los datos después de insertar o modificar un registro
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await updateResponse.json();
        setRegistros(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

