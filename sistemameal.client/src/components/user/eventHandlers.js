import Notiflix from "notiflix";

export const handleSubmit = async (e, userMaint, formValues, setUsers, setIsLoggedIn, setUserMaint, navigate) => {
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
        
        if (!response.ok) {
            const data = await response.json();
            if(response.status === 409){
                Notiflix.Notify.warning(`${data.message} ${(usuario.usuCorEle).toUpperCase()}`);
                return;
            } else {
                Notiflix.Notify.failure(data.message);
                return;
            }
        }

        const dataSuccess = await response.json();
        Notiflix.Notify.success(dataSuccess.message);

        // Actualiza los datos después de insertar o modificar un registro
        const updateResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await updateResponse.json();
        if(!updateResponse.ok){
            Notiflix.Notify.failure(data.message);
        }
        console.log(data);
        // Setear userMaint con los datos del usuario
        setUserMaint(data[data.length - 1]);
        navigate('/menu-user');
    } catch (error) {
        console.error('Error:', error);
    }
};
