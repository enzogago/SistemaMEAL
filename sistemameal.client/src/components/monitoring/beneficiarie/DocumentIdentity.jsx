// DocumentoIdentidad.js
import { useFormContext } from "react-hook-form";

const DocumentIdentity = ({ documentos, index }) => {
    const { register, formState: { errors, dirtyFields, isSubmitted } } = useFormContext();
    const fieldName = `documentos[${index}]`;

    const isDirty = dirtyFields.documentos && dirtyFields.documentos[index] && dirtyFields.documentos[index].docIdeCod;
    const error = errors.documentos && errors.documentos[index] && errors.documentos[index].docIdeCod;

    return (
        <div className="m_75">
            <label htmlFor={`${fieldName}.docIdeCod`} className="">
                Tipo de documento:
            </label>
            <select 
                id={`${fieldName}.docIdeCod`} 
                className={`block Phone_12 PowerMas_Modal_Form_${isDirty ? (error ? 'invalid' : 'valid') : ''}`} 
                {...register(`${fieldName}.docIdeCod`, { 
                    validate: value => value !== '0' || 'El documento de identidad es requerido' 
                })}
            >
                <option value="0">--Seleccione Documento Identidad--</option>
                {documentos.map(documento => (
                    <option 
                        key={documento.docIdeCod} 
                        value={documento.docIdeCod}> ({documento.docIdeAbr}) {documento.docIdeNom}
                    </option>
                ))}
            </select>
            {error ? (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{error.message}</p>
            ) : (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                Espacio reservado para el mensaje de error
                </p>
            )}
        </div>
    );
};

export default DocumentIdentity;
