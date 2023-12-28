import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FormUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state !== null && location.state !== undefined;

    const initialFormValues = {
        usuAno: '',
        usuCod: '',
        docIdeCod: '',
        usuNumDoc: '',
        usuCorEle: '',
        usuNom: '',
        usuApe: '',
        usuTel: '',
        rolCod: '',
        carCod: '',
        usuEst: '',
        usuFecNac: '',
        usuSex: '',
        usuFecInc: '',
        usuNomUsu: '',
        usuPas: ''
    };
    

    const [ formValues, setFormValues ] = useState(initialFormValues);
    const [ documentos, setDocumentos ] = useState([]);
    const [ roles, setRoles ] = useState([]);
    const [ cargos, setCargos ] = useState([]);
    
    useEffect(() => {
        if (isEditing) {
        const user = location.state.user;
        
        setFormValues({ ...initialFormValues, ...user });
        }
    }, [isEditing, location.state]);

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/DocumentoIdentidad`, {
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
                console.log(data)
                if (data.success == false) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                setDocumentos(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchCargos = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Cargo`, {
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
                console.log(data)
                if (data.success == false) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                setCargos(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        const fetchRoles = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Rol`, {
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
                console.log(data)
                if (data.success == false) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                setRoles(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        fetchCargos();
        fetchRoles();
        fetchDocumentos();
    }, []);

    const handleChange = (event) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value
        });
    };

    const handleNext = async (event) => {
        event.preventDefault();

        // Aquí puedes agregar la lógica para guardar los datos del formulario.
        // Por ejemplo, podrías hacer una solicitud POST a tu API.

        // Cuando hayas terminado, puedes usar el hook useNavigate para navegar a la siguiente página.
        navigate('/menu-user');
    };

  return (
    <div className="PowerMas_FormUserContainer h-100 bg-white Large-p2_5">
        <form>
            <label>
                Año:
                <input type="text" name="usuAno" value={formValues.usuAno} onChange={handleChange} disabled={isEditing} />
            </label>
            <label>
                Código:
                <input type="text" name="usuCod" value={formValues.usuCod} onChange={handleChange} disabled={isEditing} />
            </label>
            <label>
                Documento de identidad:
                <select name="docIdeCod" value={formValues.docIdeCod} onChange={handleChange}>
                    <option value="0">--SELECCIONE UN DOCUMENTO--</option>
                    {documentos.map(documento => (
                        <option key={documento.docIdeCod} value={documento.docIdeCod}> ({documento.docIdeAbr}) {documento.docIdeNom}</option>
                    ))}
                </select>
            </label>
            <label>
                Número de documento:
                <input type="text" name="usuNumDoc" value={formValues.usuNumDoc} onChange={handleChange} />
            </label>
            <label>
                Correo electrónico:
                <input type="text" name="usuCorEle" value={formValues.usuCorEle} onChange={handleChange} />
            </label>
            <label>
                Nombres:
                <input type="text" name="usuNom" value={formValues.usuNom} onChange={handleChange} />
            </label>
            <label>
                Apellidos:
                <input type="text" name="usuApe" value={formValues.usuApe} onChange={handleChange} />
            </label>
            <label>
                Telefono:
                <input type="text" name="usuTel" value={formValues.usuTel} onChange={handleChange} />
            </label>
            <label>
                Rol:
                <select name="rolCod" value={formValues.rolCod} onChange={handleChange}>
                    <option value="0">--SELECCIONE UN ROL--</option>
                    {roles.map(rol => (
                        <option key={rol.rolCod} value={rol.rolCod}>{rol.rolNom}</option>
                    ))}
                </select>
            </label>
            <label>
                Cargo:
                <select name="carCod" value={formValues.carCod} onChange={handleChange}>
                    <option value="0">--SELECCIONE UN CARGO--</option>
                    {cargos.map(cargo => (
                        <option key={cargo.carCod} value={cargo.carCod}>{cargo.carNom}</option>
                    ))}
                </select>
            </label>
            <label>
                Estado:
                <input type="text" name="usuEst" value={formValues.usuEst} onChange={handleChange} />
            </label>
        </form>
        <button onClick={handleNext}> Siguiente </button>
    </div>
  )
}

export default FormUser