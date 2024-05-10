import Notiflix from "notiflix";
import intlTelInput from 'intl-tel-input';

export const handleSubmitMetaBeneficiario = async (data, handleReset, updateData, setUpdateData, fetchBeneficiarie) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        console.log(response)
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
        console.log(successData);
        fetchBeneficiarie();
        setUpdateData(!updateData);
        handleReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleSubmitMetaBeneficiarioExiste = async (data, handleReset, updateData, setUpdateData, fetchBeneficiarie)=> {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/existe`, {
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
        fetchBeneficiarie();
        setUpdateData(!updateData);
        handleReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleSubmitMetaEjecucion = async (data, handleReset, fetchBeneficiarie)=> {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/execution`, {
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
                console.log(errorData)
                return;
            } else {
                Notiflix.Notify.failure(errorData.message);
                console.log(errorData)
                return;
            }
        }

        const successData = await response.json();
        Notiflix.Notify.success(successData.message);
        fetchBeneficiarie();
        handleReset();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const fetchBeneficiariosMeta = async (metAno, metCod, setBeneficiariosMeta) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/meta/${metAno}/${metCod}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response)
        if (!response.ok) {
            if(response.status == 401 || response.status == 403){
                const data = await response.json();
                Notiflix.Notify.failure(data.message);
            }
            return;
        }
        const data = await response.json();
        if (data.success == false) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        console.log(data)
        setBeneficiariosMeta(data)
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};

export const handleDeleteBeneficiarioMeta = async (controller,metAno,metCod,benAno,benCod,ubiAno,ubiCod,metBenAnoEjeTec, metBenMesEjeTec, setUpdate) => {
    Notiflix.Confirm.show(
        'Eliminar Registro',
        '¿Está seguro que quieres eliminar este registro?',
        'Sí',
        'No',
        async () => {

            Notiflix.Loading.pulse();
            const url = `${import.meta.env.VITE_APP_API_URL}/api/${controller}/eliminar-beneficiario/${metAno}/${metCod}/${benAno}/${benCod}/${ubiAno}/${ubiCod}/${metBenAnoEjeTec}/${metBenMesEjeTec}`;
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                console.log(response)
                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }

                setUpdate(prevUpdate => !prevUpdate);
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

export const initPhoneInput = (inputRef, setIsValid, setTelefono, setErrorMessage, initialNumber, ubiNom, setIsTouchable) => {
    const countryNameToCode = {
        'PERÚ': 'pe',
        'COLOMBIA': 'co',
        'ECUADOR': 'ec',
      };
    // Obtén el código del país basado en metaData.ubiNom
    const initialCountryCode = countryNameToCode[ubiNom?.toUpperCase()];
    const phoneInput = intlTelInput(inputRef.current, {
        initialCountry: initialCountryCode || "auto",
        geoIpLookup: function(callback) {
            fetch('https://ipinfo.io/json')
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback(''));
        },
    });

    // Establece el número de teléfono inicial
    if (initialNumber) {
        phoneInput.setNumber(initialNumber);
        setTelefono(phoneInput.getNumber());
        setIsValid(phoneInput.isValidNumberPrecise());
    } else {
        setTelefono('');
        setIsValid(true);
    }


    inputRef.current.addEventListener('countrychange', function() {
        setIsValid(false)
        const countryData = phoneInput.getSelectedCountryData();
        console.log(countryData)
    });

    inputRef.current.addEventListener('input', function() {
        const inputValue = this.value;
        if (inputValue === '') {
            // Si el campo está vacío, se considera válido
            setIsValid(true);
            setErrorMessage('');
            setTelefono('')
        } else {
            // Si el campo no está vacío, se verifica si el número de teléfono es válido
            setTelefono(phoneInput.getNumber());
            setIsValid(phoneInput.isValidNumberPrecise())
            setIsTouchable(true);
    
            let errorMessage = '';
            switch (phoneInput.getValidationError()) {
                case 1:
                    errorMessage = 'El código del país es inválido';
                    break;
                case 2:
                    errorMessage = 'El número de teléfono es demasiado corto';
                    break;
                case 3:
                    errorMessage = 'El número de teléfono es demasiado largo';
                    break;
                case 4:
                    errorMessage = 'Por favor, ingresa un número de teléfono válido';
                    break;
                default:
                    errorMessage = 'Por favor, ingresa un número de teléfono válido';
            }
            setErrorMessage(errorMessage);
        }
    });
};