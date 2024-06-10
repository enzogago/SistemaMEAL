const InputInvolucra = ({register, errors, dirtyFields, isSubmitted}) => {
    return (
        <>
            <label className="block f1">
                ¿Involucra Beneficiario?
            </label>
            <div className="flex gap-1">
                <div className="flex gap_5">
                    <input 
                        type="radio" 
                        id="activo" 
                        name="uniInvPer" 
                        value="S"
                        {...register('¿involucra beneficiario?', { required: 'Por favor, selecciona una opción' })}
                    />
                    <label htmlFor="activo">Si</label>
                </div>
                <div className="flex gap_5">
                    <input 
                        type="radio" 
                        id="inactivo" 
                        name="uniInvPer" 
                        value="N"
                        {...register('¿involucra beneficiario?', { required: 'Por favor, selecciona una opción' })}
                    />
                    <label htmlFor="inactivo">No</label>
                </div>
            </div>
            {errors['¿involucra beneficiario?'] ? (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors['¿involucra beneficiario?'].message}</p>
            ) : (
                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                    Espacio reservado para el mensaje de error
                </p>
            )}
        </>
    )
}

export default InputInvolucra