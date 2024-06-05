// Importaciones necesarias
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchData, handleSubmitMant } from '../reusable/helper';

const Modal = ({ estadoEditado, modalVisible, closeModal, setData, title }) => {
    // Variables de estado
    const [subProyectos, setSubProyectos] = useState([]);
    const [objetivos, setObjetivos] = useState([]);
    const [objetivosEspecificos, setObjetivosEspecificos] = useState([]);
    const [objetivoEnable, setObjetivoEnable] = useState(false);
    const [objetivoEspecificoEnable, setObjetivoEspecificoEnable] = useState(false);
    const [objetivosLoaded, setObjetivosLoaded] = useState(false);
    const [objetivosEspecificosLoaded, setObjetivosEspecificosLoaded] = useState(false);
    const [subProyectosLoaded, setSubProyectosLoaded] = useState(false);

    // Configuración useForm
    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue, watch } = useForm({ mode: "onChange" });

    // Función para cerrar el modal y resetear el formulario
    const closeModalAndReset = () => {
        closeModal();
        reset({
            subProyecto: '0',
            objetivo: '0',
            objetivoEspecifico: '0',
            resNom: '',
            resNum: '',
        });
        setObjetivosLoaded(false);
        setObjetivosEspecificosLoaded(false);
    };

    // Función para manejar el envío del formulario
    const onSubmit = (data) => {
        const { objEspAno, objEspCod } = JSON.parse(data.objetivoEspecifico);
        data = {
            ...data,
            objEspAno,
            objEspCod
        }
        handleSubmitMant('Resultado', !!estadoEditado, data, setData, closeModalAndReset)
    };

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado && objetivosEspecificosLoaded) {
            const { objEspAno, objEspCod } = estadoEditado;
            setValue('objetivoEspecifico', JSON.stringify({ objEspAno, objEspCod }));
        }
    }, [estadoEditado, objetivosEspecificosLoaded, setValue]);

    // Efecto para manejar el cambio en el subproyecto seleccionado
    useEffect(() => {
        const subProyecto = watch('subProyecto');
        if (subProyecto !== '0' && subProyecto !== '') {
            const { subProAno, subProCod } = JSON.parse(subProyecto);
            fetchData(`Objetivo/subproyecto/${subProAno}/${subProCod}`, (data) => {
                const filteredData = data.filter(item => item.objNum !== 'NA' && item.objNom !== 'NA');
                setValue('objetivo', '0');
                setObjetivos(filteredData);
                setObjetivosLoaded(true);
            });
            setObjetivoEnable(true);
        } else {
            setValue('objetivo', '0');
            setObjetivoEnable(false);
        }
    }, [watch('subProyecto')]);

    // Efecto para manejar el cambio en el objetivo seleccionado
    useEffect(() => {
        const objetivo = watch('objetivo');
        if (objetivo !== '0' && objetivo !== '') {
            const { objAno, objCod } = JSON.parse(objetivo);
            fetchData(`ObjetivoEspecifico/objetivo/${objAno}/${objCod}`, (data) => {
                const filteredData = data.filter(item => item.objEspNum !== 'NA' && item.objEspNom !== 'NA');
                setValue('objetivoEspecifico', '0');
                setObjetivosEspecificos(filteredData);
                setObjetivosEspecificosLoaded(true);
            });
            setObjetivoEspecificoEnable(true);
        } else {
            setValue('objetivoEspecifico', '0');
            setObjetivoEspecificoEnable(false);
        }
    }, [watch('objetivo')]);

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado && objetivosLoaded) {
            const { objAno, objCod } = estadoEditado;
            setValue('objetivo', JSON.stringify({ objAno, objCod }));
        }
    }, [estadoEditado, objetivosLoaded, setValue]);

    // Efecto para manejar la visibilidad del modal
    useEffect(() => {
        if (modalVisible) {
            fetchData('SubProyecto', (data) => {
                setSubProyectos(data);
                setSubProyectosLoaded(true);
            });
            document.getElementById('resNum').focus();
        } else {
            setSubProyectosLoaded(false);
        }
    }, [modalVisible]);

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado && subProyectosLoaded) {
            const { subProAno, subProCod } = estadoEditado;
            setValue('subProyecto', JSON.stringify({ subProAno, subProCod }));
        }
    }, [estadoEditado, subProyectosLoaded, setValue]);

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado) {
            reset(estadoEditado);
        }
    }, [estadoEditado, reset, setValue]);

    return (
        <div className={` PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            {
                
            }
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
                    <div>
                        <label htmlFor='objetivo' className="">
                            Objetivo:
                        </label>
                        <select 
                            id='objetivo'
                           
                            disabled={!objetivoEnable}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.objetivo || isSubmitted ? (errors.objetivo ? 'invalid' : 'valid') : ''}`} 
                            {...register('objetivo', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Objetivo--</option>
                            {objetivos.map((item, index) => {
                                const text = item.objNom;
                                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                                return(
                                    <option 
                                        key={index} 
                                        value={JSON.stringify({ objAno: item.objAno, objCod: item.objCod })}
                                    > 
                                        {item.objNum + ' - ' + shortText}
                                    </option>
                                )
                            })}
                        </select>
                        {errors.objetivo ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.objetivo.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='objetivoEspecifico' className="">
                            Objetivo Específico:
                        </label>
                        <select 
                            id='objetivoEspecifico'
                           
                            disabled={!objetivoEspecificoEnable}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.objetivoEspecifico || isSubmitted ? (errors.objetivoEspecifico ? 'invalid' : 'valid') : ''}`} 
                            {...register('objetivoEspecifico', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Objetivo Específico--</option>
                            {objetivosEspecificos.map((item, index) => {
                                const text = item.objEspNom;
                                const shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;
                                return(
                                    <option 
                                        key={index} 
                                        value={JSON.stringify({ objEspAno: item.objEspAno, objEspCod: item.objEspCod })}
                                    > 
                                        {item.objEspNum + ' - ' + shortText}
                                    </option>
                                )
                            })}
                        </select>
                        {errors.objetivoEspecifico ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.objetivoEspecifico.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label className="block" htmlFor='resNum'>
                            Código del Resultado
                        </label>
                        <input 
                            id="resNum"
                            className={`PowerMas_Modal_Form_${dirtyFields.resNum || isSubmitted ? (errors.resNum ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='R1.1' 
                            maxLength={10} 
                            name="resNum" 
                            autoComplete='off'
                            {...register(
                                'resNum', { 
                                    required: 'El campo es requerido',
                                    maxLength: { value: 10, message: 'El campo no puede tener más de 10 caracteres' },
                                    minLength:  { value: 2, message: 'El campo no puede tener menos de 2 caracteres' },
                                    pattern: {
                                        value: /^[A-Za-z0-9.\s]+$/,
                                        message: 'Por favor, introduce solo letras, numeros y puntos',
                                    },
                                }
                            )}
                        />
                        {errors.resNum ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.resNum.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="resNom" className="">
                            Nombre del Resultado
                        </label>
                        <input type="text"
                            id="resNom"
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.resNom || isSubmitted ? (errors.resNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Acelerados emprendimientos con la población migrante-refugiada."
                            autoComplete='off'
                            maxLength={400}
                            {...register('resNom', { 
                                required: 'El campo es requerido',
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-%_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                maxLength: { value: 400, message: 'El campo no puede tener más de 400 caracteres' },
                            })} 
                        />
                        {errors.resNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.resNom.message}</p>
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