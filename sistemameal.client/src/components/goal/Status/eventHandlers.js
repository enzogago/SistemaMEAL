import Notiflix from "notiflix";

export const handleSubmit = async (e, estadoEditado, nombreEstado, setEstados, setNombreEstado, setModalVisible) => {
    e.preventDefault();

    if (!nombreEstado || nombreEstado.trim() === ''){
        Notiflix.Notify.failure('El campo nombre es requerido');
        return;
    }

    const estado = estadoEditado ? { EstCod: estadoEditado.estCod, EstNom: nombreEstado } : { EstNom: nombreEstado };

    const url = estadoEditado ? `${import.meta.env.VITE_APP_API_URL}/api/Estado/${estadoEditado.estCod}` : `${import.meta.env.VITE_APP_API_URL}/api/Estado`;
    const method = estadoEditado ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estado),
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

        const text = await response.text();
        Notiflix.Notify.success(text);
        setNombreEstado(""); // Limpia el campo de entrada
        setModalVisible(false); // Cierra el modal

        // Actualiza los datos después de insertar o modificar un registro
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Estado`);
        const data = await updateResponse.json();
        setEstados(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

export const handleDelete = async (estCod, setEstados) => {
    Notiflix.Confirm.show(
        'Eliminar Estado',
        '¿Estás seguro de que quieres eliminar este estado?',
        'Sí',
        'No',
        async () => {
            const url = `${import.meta.env.VITE_APP_API_URL}/api/Estado/${estCod}`;

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
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

                const text = await response.text();
                Notiflix.Notify.success(text);

                // Actualiza los datos después de eliminar un registro
                const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Estado`);
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
