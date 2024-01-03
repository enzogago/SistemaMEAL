import Notiflix from "notiflix";

export const handleSubmit = async (estadoEditado, nombreEstado, setEstados, setModalVisible, setIsLoggedIn) => {

    const estado = estadoEditado ? { EstCod: estadoEditado.estCod, EstNom: nombreEstado } : { EstNom: nombreEstado };

    const url = estadoEditado ? `${import.meta.env.VITE_APP_API_URL}/api/Estado/${estadoEditado.estCod}` : `${import.meta.env.VITE_APP_API_URL}/api/Estado`;
    const method = estadoEditado ? 'PUT' : 'POST';

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(estado),
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
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Estado`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await updateResponse.json();
        setEstados(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

export const handleDelete = async (estCod, setEstados, setIsLoggedIn) => {
    Notiflix.Confirm.show(
        'Eliminar Estado',
        '¿Estás seguro de que quieres eliminar este estado?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/Estado/${estCod}`;

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
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Estado`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await updateResponse.json();
                setEstados(data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        () => {
            // El usuario ha cancelado la operación de eliminación
        }
    );
};
