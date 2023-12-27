import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FormUser = () => {
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
      rolCod: '',
      cargoCod: '',
      usuEst: ''
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [ documentos, setDocumentos ] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargos, setCargos] = useState([]);
    
  useEffect(() => {
    if (isEditing) {
      const user = location.state.user;
      
      setFormValues({ ...initialFormValues, ...user });
    }
  }, [isEditing, location.state]);

  useEffect(() => {
    // Aquí va tu función para obtener los roles y cargos de la base de datos
    // y establecerlos en los estados 'roles' y 'cargos'
  }, []);

  const handleChange = (event) => {
    setFormValues({
        ...formValues,
        [event.target.name]: event.target.value
    });
  };

  return (
    <div className="PowerMas_FormUserContainer bg-white Large-p2_5">
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
                {documentos.map(documento => (
                    <option key={documento.docIdeCod} value={documento.docIdeCod}>{documento.docIdeNom}</option>
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
                {roles.map(rol => (
                    <option key={rol.rolCod} value={rol.rolCod}>{rol.rolNom}</option>
                ))}
            </select>
        </label>
        <label>
            Cargo:
            <select name="carCod" value={formValues.carCod} onChange={handleChange}>
                {cargos.map(cargo => (
                    <option key={cargo.carCod} value={cargo.carCod}>{cargo.carNom}</option>
                ))}
            </select>
        </label>
        <label>
            Estado:
            <input type="text" name="usuEst" value={formValues.usuEst} onChange={handleChange} />
        </label>
        <button type="submit"> Siguiente </button>
      </form>
    </div>
  )
}

export default FormUser