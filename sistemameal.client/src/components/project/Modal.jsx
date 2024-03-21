import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { handleSubmit } from './eventHandlers';

const Modal = ({ estadoEditado, modalVisible, closeModal, setData, title }) => {

    // Configuracion useForm
    const { 
        register, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue 
    } 
    = useForm({ mode: "onChange"});

    const closeModalAndReset = () => {
        closeModal();
        reset({
            proNom: '',
            proDes: '',
            proPerAnoIni: '',
            proPerMesIni: '0',
            proPerAnoFin: '',
            proPerMesFin: '0',
            proRes: '',
            proInvSubAct: '',
        });
    };

    const onSubmit = (data) => {

        handleSubmit(data,!!estadoEditado, setData, closeModalAndReset)
    };

    // Activar focus en input
    useEffect(() => {
        if (modalVisible) {
            document.getElementById('proNom').focus();
        }
    }, [modalVisible]);


    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado) {
            let newData = {};
            for (let key in estadoEditado) {
                if (typeof estadoEditado[key] === 'string') {
                    // Convierte cada cadena a minúsculas
                    newData[key] = estadoEditado[key].trim().toLowerCase();
                } else {
                    // Mantiene los valores no string tal como están
                    newData[key] = estadoEditado[key];
                }
            }
           reset(newData)
        }
    }, [estadoEditado, reset]);


    const currentYear = new Date().getFullYear();
    
    return (
        <div className={` PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent" style={{width: '40%'}}>
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {title}</h2>
                <form className='Large-f1 PowerMas_FormStatus flex flex-column gap_3' onSubmit={validateForm(onSubmit)}>
                    <div className="">
                        <label htmlFor="proNom" className="">
                            Nombre del proyecto
                        </label>
                        <input type="text"
                            id="proNom"
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proNom || isSubmitted ? (errors.proNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Movilidad Humana"
                            autoComplete="disabled"
                            {...register('proNom', { 
                                required: 'El campo es requerido',
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.proNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proNom.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="proDes" className="">
                            Descripción del proyecto
                        </label>
                        <textarea
                            id="proDes"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proDes || isSubmitted ? (errors.proDes ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Descripción del proyecto"
                            autoComplete="disabled"
                            style={{textTransform: 'capitalize'}}
                            {...register('proDes', { 
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.proDes ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proDes.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="proRes" className="">
                            Responsable del proyecto
                        </label>
                        <input type="text"
                            id="proRes"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proRes || isSubmitted ? (errors.proRes ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Andres Eras"
                            autoComplete="disabled"
                            style={{textTransform: 'capitalize'}}
                            {...register('proRes', { 
                                required: 'El campo es requerido',
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ/\s-_]+$/,
                                    message: 'Por favor, introduce solo letras y espacios',
                                },
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                            })} 
                        />
                        {errors.proRes ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proRes.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label className="block f1">
                            ¿El proyecto involucra sub actividades?
                        </label>
                        <div className="flex gap-1">
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="si" 
                                    name="uniInvPer" 
                                    value="s"
                                    {...register('proInvSubAct', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label htmlFor="si">Si</label>
                            </div>
                            <div className="flex gap_5">
                                <input 
                                    type="radio" 
                                    id="no" 
                                    name="uniInvPer" 
                                    value="n"
                                    {...register('proInvSubAct', { required: 'Por favor, selecciona una opción' })}
                                />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                        {errors.proInvSubAct ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proInvSubAct.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <div className="Large_6 ">
                            <label htmlFor="proPerMesIni" className="">
                                Mes Inicio:
                            </label>
                            <select 
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerMesIni || isSubmitted ? (errors.proPerMesIni ? 'invalid' : 'valid') : ''}`} 
                                {...register('proPerMesIni', { 
                                    validate: value => value !== '0' || 'El mes es requerido' 
                                })}
                                id="proPerMesIni" 
                            >
                                <option value="0">--Seleccione Mes--</option>
                                <option value="01">Enero</option>
                                <option value="02">Febrero</option>
                                <option value="03">Marzo</option>
                                <option value="04">Abril</option>
                                <option value="05">Mayo</option>
                                <option value="06">Junio</option>
                                <option value="07">Julio</option>
                                <option value="08">Agosto</option>
                                <option value="09">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                            {errors.proPerMesIni ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerMesIni.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 ">
                            <label htmlFor="proPerAnoIni" className="">
                                Año Inicio:
                            </label>
                            <input
                                id="proPerAnoIni"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerAnoIni || isSubmitted ? (errors.proPerAnoIni ? 'invalid' : 'valid') : ''}`} 
                                type="text" 
                                placeholder="2023"
                                autoComplete="disabled"
                                maxLength={4}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('proPerAnoIni', { 
                                    required: 'El campo es requerido',
                                    validate: value => {
                                        if (value < currentYear - 1 || value > currentYear + 10) {
                                            return 'El año debe estar entre ' + (currentYear - 1) + ' y ' + (currentYear + 10);
                                        }
                                    },
                                    minLength: {
                                        value: 4,
                                        message: 'El campo debe tener al menos 4 dígitos'
                                    },
                                    maxLength: {
                                        value: 4,
                                        message: 'El campo no debe tener más de 4 dígitos'
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'El campo solo debe contener números'
                                    }
                                })}
                                />
                                {errors.proPerAnoIni ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerAnoIni.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                    </p>
                                )}
                        </div>
                        
                    </div>
                    <div className="flex gap-1">
                        <div className="Large_6 ">
                            <label htmlFor="proPerMesFin" className="">
                                Mes Fin:
                            </label>
                            <select 
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerMesFin || isSubmitted ? (errors.proPerMesFin ? 'invalid' : 'valid') : ''}`} 
                                {...register('proPerMesFin', { 
                                    validate: value => value !== '0' || 'El mes es requerido' 
                                })}
                                id="proPerMesFin" 
                            >
                                <option value="0">--Seleccione Mes--</option>
                                <option value="01">Enero</option>
                                <option value="02">Febrero</option>
                                <option value="03">Marzo</option>
                                <option value="04">Abril</option>
                                <option value="05">Mayo</option>
                                <option value="06">Junio</option>
                                <option value="07">Julio</option>
                                <option value="08">Agosto</option>
                                <option value="09">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                            {errors.proPerMesFin ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerMesFin.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        <div className="Large_6 ">
                            <label htmlFor="proPerAnoFin" className="">
                                Año Fin:
                            </label>
                            <input
                                id="proPerAnoFin"
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proPerAnoFin || isSubmitted ? (errors.proPerAnoFin ? 'invalid' : 'valid') : ''}`} 
                                type="text" 
                                placeholder="2023"
                                autoComplete="disabled"
                                maxLength={4}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
                                {...register('proPerAnoFin', { 
                                    required: 'El campo es requerido',
                                    validate: value => {
                                        if (value < currentYear - 1 || value > currentYear + 10) {
                                            return 'El año debe estar entre ' + (currentYear - 1) + ' y ' + (currentYear + 10);
                                        }
                                    },
                                    minLength: {
                                        value: 4,
                                        message: 'El campo debe tener al menos 4 dígitos'
                                    },
                                    maxLength: {
                                        value: 4,
                                        message: 'El campo no debe tener más de 4 dígitos'
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'El campo solo debe contener números'
                                    }
                                })}
                            />
                            {errors.proPerAnoFin ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.proPerAnoFin.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal