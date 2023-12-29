import Notiflix from "notiflix";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { handleSubmit } from './eventHandlers';


const FormUser = () => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authInfo, authActions } = useContext(AuthContext);
    const { userMaint } = authInfo;
    const { setUsers, setIsLoggedIn, setUserMaint } = authActions;
    //
    const [newPassword, setNewPassword] = useState('');
    const [resetPassword, setResetPassword] = useState(false);

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };
    const handleResetPasswordChange = (event) => {
        setResetPassword(event.target.checked);
        if (!event.target.checked) {
            // Si el usuario desmarca la casilla, borra la nueva contraseña
            setNewPassword('');
        }
    };    
    //
    const isEditing = userMaint && Object.keys(userMaint).length > 0;

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
        usuEst: 'A',
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
            setFormValues({ ...initialFormValues, ...userMaint });
        }
    }, [isEditing, userMaint]);

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
        console.log(formValues);
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value
        });
    };

    const handleNext = async (event) => {
        event.preventDefault();

        await handleSubmit(event, userMaint, formValues, setUsers, setIsLoggedIn, newPassword);
        
        navigate('/menu-user');
    };
    
    

  return (
    <div className="PowerMas_FormUserContainer h-100 bg-white Large-p2_5">
        <h1 className="Large-f1_5">
            {isEditing ? 'Editar': 'Nuevo'} Usuario
        </h1>
        <form>
            {
                isEditing &&
                (
                    <>
                        <label>
                            Año:
                            <input type="text" name="usuAno" value={formValues.usuAno} onChange={handleChange} disabled={isEditing} />
                        </label>
                        <label>
                            Código:
                            <input type="text" name="usuCod" value={formValues.usuCod} onChange={handleChange} disabled={isEditing} />
                        </label>
                    </>
                )
            }
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
            {
                !isEditing &&
                (
                    <label>
                        Contraseña:
                        <input type="password" name="usuPas" value={formValues.usuPas} onChange={handleChange} />
                    </label>
                )
            }
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
                Fecha de nacimiento:
                <input type="text" name="usuFecNac" value={formValues.usuFecNac} onChange={handleChange} />
            </label>
            <div className="PowerMasInputSex">
                Sexo:
                <div >
                    <div>
                        <input type="radio" id="masculino" name="usuSex" value="M" checked={formValues.usuSex === "M"} onChange={handleChange} />
                        <label htmlFor="masculino">Masculino</label>
                    </div>
                    <div>
                        <input type="radio" id="femenino" name="usuSex" value="F" checked={formValues.usuSex === "F"} onChange={handleChange} />
                        <label htmlFor="femenino">Femenino</label>
                    </div>
                </div>
            </div>
            <div className="PowerMasInputSex">
                Estado:
                <div >
                    <div>
                        <input type="radio" id="activo" name="usuEst" value="A" checked={formValues.usuEst === "A"} onChange={handleChange} />
                        <label htmlFor="activo">Activo</label>
                    </div>
                    <div>
                        <input type="radio" id="inactivo" name="usuEst" value="I" checked={formValues.usuEst === "I"} onChange={handleChange} />
                        <label htmlFor="inactivo">Inactivo</label>
                    </div>
                </div>
            </div>
        </form>
        <button onClick={handleNext}> Siguiente </button>
    </div>
  )
}

export default FormUser