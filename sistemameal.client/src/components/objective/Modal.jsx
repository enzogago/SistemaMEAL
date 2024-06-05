import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchData, handleSubmitMant } from '../reusable/helper';
// import { handleSubmit } from './eventHandlers';

const Modal = ({ estadoEditado, modalVisible, closeModal, setData, title }) => {
    const [ subProyectos, setSubProyectos ] = useState([])
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
            subProyecto: '0',
            objNom: '',
            objNum: '',
        });
    };

    const onSubmit = (data) => {
        const {subProAno, subProCod} = JSON.parse(data.subProyecto);
        data = {
            ...data,
            subProAno,
            subProCod
        }
        handleSubmitMant('Objetivo',!!estadoEditado, data, setData, closeModalAndReset)
    };

    const [subProyectosLoaded, setSubProyectosLoaded] = useState(false);

    // Activar focus en input
    useEffect(() => {
        if (modalVisible) {
            fetchData('SubProyecto', (data) => {
                setSubProyectos(data);
                setSubProyectosLoaded(true); // Mueve esta línea aquí
            });
            document.getElementById('objNum').focus();
        }
    }, [modalVisible]);
    


    useEffect(() => {
        if (estadoEditado && subProyectosLoaded) {
            const {subProAno, subProCod} = estadoEditado;
            setValue('subProyecto', JSON.stringify({ subProAno, subProCod }));
        }
    }, [estadoEditado, subProyectosLoaded, setValue])


    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado) {
            reset(estadoEditado);
        }
    }, [estadoEditado, reset, setValue]);



    return (
        <div className={` PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent" style={{width: '40%'}}>
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {title}</h2>
                <form className='Large-f1 PowerMas_FormStatus flex flex-column gap_3' onSubmit={validateForm(onSubmit)}>
                    <div>
                        <label htmlFor='subProyecto' className="">
                            Sub Proyecto:
                        </label>
                        <select 
                            id='subProyecto'
                            
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.subProyecto || isSubmitted ? (errors.subProyecto ? 'invalid' : 'valid') : ''}`} 
                            {...register('subProyecto', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Sub Proyecto--</option>
                            {subProyectos.map((item, index) => (
                                <option 
                                    key={index} 
                                    value={JSON.stringify({ subProAno: item.subProAno, subProCod: item.subProCod })}
                                > 
                                    {item.subProSap + ' - ' + item.subProNom + ' | ' + item.proNom}
                                </option>
                            ))}
                        </select>
                        {errors.subProyecto ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.subProyecto.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label className="block" htmlFor='objNum'>
                            Código del Objetivo General:
                        </label>
                        <input 
                            id="objNum"
                            className={`PowerMas_Modal_Form_${dirtyFields.objNum || isSubmitted ? (errors.objNum ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='OG' 
                            maxLength={100} 
                            name="objNum" 
                            autoComplete='off'
                            {...register(
                                'objNum', { 
                                    required: 'El campo es requerido',
                                    maxLength: { value: 100, message: 'El campo no puede tener más de 100 caracteres' },
                                    minLength:  { value: 2, message: 'El campo no puede tener menos de 2 caracteres' },
                                    pattern: {
                                        value: /^[A-Za-z0-9.\s]+$/,
                                        message: 'Por favor, introduce solo letras, numeros y puntos',
                                    },
                                }
                            )}
                        />
                        {errors.objNum ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.objNum.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="objNom" className="">
                            Nombre del Objetivo General
                        </label>
                        <input type="text"
                            id="objNom"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.objNom || isSubmitted ? (errors.objNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Contribuir al ejercicio de derechos y a la integración socioeconómica"
                            autoComplete='off'
                            maxLength={400}
                            {...register('objNom', { 
                                required: 'El campo es requerido',
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-%_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                maxLength: { value: 400, message: 'El campo no puede tener más de 400 caracteres' },
                            })} 
                        />
                        {errors.objNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.objNom.message}</p>
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