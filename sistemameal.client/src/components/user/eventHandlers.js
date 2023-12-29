import Notiflix from "notiflix";

export const handleSubmit = async (e, userMaint, formValues, setUsers, setIsLoggedIn) => {
    e.preventDefault();

    var usuario = userMaint ? { ...userMaint, ...formValues } : { ...formValues };
    const isEditing = Object.keys(userMaint).length > 0;

    const url = isEditing ? `${import.meta.env.VITE_APP_API_URL}/usuario/${usuario.usuAno}/${usuario.usuCod}` : `${import.meta.env.VITE_APP_API_URL}/usuario`;
    const method = isEditing ? 'PUT' : 'POST';


    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...usuario }),
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
            return;
        }
        
        const text = await response.text();
        Notiflix.Notify.success(text);
        console.log(text)

        // Actualiza los datos después de insertar o modificar un registro
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await updateResponse.json();
        setUsers(data);
    } catch (error) {
        console.error('Error:', error);
    }
};
