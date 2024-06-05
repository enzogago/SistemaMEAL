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
    } 
    = useForm({ mode: "onChange"});

    const closeModalAndReset = () => {
        closeModal();
        reset({
            proLinInt: '',
            proIde: '',
            proNom: '',
            proDes: '',
        });
    };

    const onSubmit = (data) => {

        handleSubmit(data,!!estadoEditado, setData, closeModalAndReset)
    };

    // Activar focus en input
    useEffect(() => {
        if (modalVisible) {
            document.getElementById('proIde').focus();
        }
    }, [modalVisible]);


    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado) {
           reset(estadoEditado)
        }
    }, [estadoEditado, reset]);


    
    return (
        <div className={` PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent" style={{width: '40%'}}>
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {title}</h2>
                <form className='Large-f1 PowerMas_FormStatus flex flex-column gap_3' onSubmit={validateForm(onSubmit)}>
                    
                    <div className="">
                        <label className="block">
                            Código Proyecto:
                        </label>
                        <input 
                            id="proIde"
                            className={`PowerMas_Modal_Form_${dirtyFields['proIde'] || isSubmitted ? (errors['proIde'] ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='022001' 
                            maxLength={10} 
                            name="proIde" 
                            autoComplete='off'
                            {...register(
                                'proIde', { 
                                    required: 'El campo es requerido',
                                    minLength: { value: 2, message: 'El campo no puede tener menos de 2 caracteres' },
                                    maxLength: { value: 10, message: 'El campo no puede tener más de 5 caracteres' },
                                    pattern: {
                                        value: /^[A-Za-z0-9.\s]+$/,
                                        message: 'Por favor, introduce solo letras y espacios',
                                    },
                                }
                            )}
                        />
                        {errors['proIde'] ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors['proIde'].message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label className="block">
                            Linea de Intervención:
                        </label>
                        <input 
                            id="proLinInt"
                            className={`PowerMas_Modal_Form_${dirtyFields['proLinInt'] || isSubmitted ? (errors['proLinInt'] ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='PRO.1.0' 
                            maxLength={10} 
                            name="proLinInt" 
                            autoComplete='off'
                            {...register(
                                'proLinInt', { 
                                    required: 'El campo es requerido',
                                    minLength: { value: 6, message: 'El campo no puede tener menos de 6 caracteres' },
                                    maxLength: { value: 10, message: 'El campo no puede tener más de 10 caracteres' },
                                    pattern: {
                                        value: /^[A-Za-z0-9.]+$/,
                                        message: 'Por favor, introduce solo letras y espacios',
                                    },
                                }
                            )}
                        />
                        {errors['proLinInt'] ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors['proLinInt'].message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="proNom" className="">
                            Nombre del proyecto
                        </label>
                        <input type="text"
                            id="proNom"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.proNom || isSubmitted ? (errors.proNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Movilidad Humana"
                            autoComplete='off'
                            {...register('proNom', { 
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-%_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
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
                            autoComplete='off'
                            {...register('proDes', {
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-%_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
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
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal