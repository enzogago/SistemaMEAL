import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchData, handleSubmitMant } from '../reusable/helper';
import Notiflix from 'notiflix';
// import { handleSubmit } from './eventHandlers';

const Modal = ({ estadoEditado, modalVisible, closeModal, setData, title }) => {
    const [ subProyectos, setSubProyectos ] = useState([])
    const [ objetivos, setObjetivos ] = useState([])
    const [ objetivoEnable, setObjetivoEnable ] = useState(false)
    // Configuracion useForm
    const { 
        register, 
        handleSubmit: validateForm, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue,
        watch
    } 
    = useForm({ mode: "onChange"});

    const closeModalAndReset = () => {
        closeModal();
        reset({
            subProyecto: '0',
            objetivo: '0',
            objEspNom: '',
            objEspNum: '',
        });
        setSubProyectosLoaded(false);
        setObjetivosLoaded(false);
    };

    const onSubmit = (data) => {
        const {objAno, objCod} = JSON.parse(data.objetivo);
        data = {
            ...data,
            objAno,
            objCod
        }
        handleSubmitMant('ObjetivoEspecifico',!!estadoEditado,data, setData, closeModalAndReset)
    };
    
    const [objetivosLoaded, setObjetivosLoaded] = useState(false);

    useEffect(() => {
        const subProyecto = watch('subProyecto');
        if (subProyecto != '0' && subProyecto != '') {
            const {subProAno, subProCod} = JSON.parse(subProyecto);
            fetchData(`Objetivo/subproyecto/${subProAno}/${subProCod}`, (data) => {
                const filteredData = data.filter(item => item.objNum !== 'NA' && item.objNom !== 'NA');
                setObjetivos(filteredData);
                setObjetivosLoaded(true); // Establece objetivosLoaded en true una vez que los datos se hayan cargado
            });
            setObjetivoEnable(true);
        } else {
            setValue('objetivo','0');
            setObjetivoEnable(false);
        }
    }, [watch('subProyecto')])

    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado && objetivosLoaded) { // Solo ejecuta este código si objetivosLoaded es true
            const {objAno,objCod} = estadoEditado;
            setValue('objetivo', JSON.stringify({ objAno, objCod }));
        }
    }, [estadoEditado, objetivosLoaded, setValue]);


    const [subProyectosLoaded, setSubProyectosLoaded] = useState(false);

    // Activar focus en input
    useEffect(() => {
        if (modalVisible) {
            fetchData('SubProyecto', (data) => {
                setSubProyectos(data);
                setSubProyectosLoaded(true);
            });
            document.getElementById('objEspNum').focus();
        } else {
            setSubProyectosLoaded(false); // Establece subProyectosLoaded en false cuando el modal se cierra
        }
    }, [modalVisible]);

    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado && subProyectosLoaded) { // Solo ejecuta este código si subProyectosLoaded es true
            const {subProAno,subProCod} = estadoEditado;
            // Establece el valor inicial del select de subproyectos
            setValue('subProyecto', JSON.stringify({ subProAno, subProCod }));
        }
    }, [estadoEditado, subProyectosLoaded, setValue]);


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
                                const shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;
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
                    <div className="">
                        <label className="block" htmlFor='objEspNum'>
                            Código del Objetivo Específico:
                        </label>
                        <input 
                            id="objEspNum"
                            className={`PowerMas_Modal_Form_${dirtyFields.objEspNum || isSubmitted ? (errors.objEspNum ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='OE1' 
                            maxLength={10} 
                            name="objEspNum" 
                            autoComplete='off'
                            {...register(
                                'objEspNum', { 
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
                        {errors.objEspNum ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.objEspNum.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="objEspNom" className="">
                            Nombre del Objetivo Específico:
                        </label>
                        <input type="text"
                            id="objEspNom" 
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.objEspNom || isSubmitted ? (errors.objEspNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Promover la integración económica de la población migrante"
                            autoComplete='off'
                            maxLength={400}
                            {...register('objEspNom', { 
                                required: 'El campo es requerido',
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-%_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                maxLength: { value: 400, message: 'El campo no puede tener más de 400 caracteres' },
                            })} 
                        />
                        {errors.objEspNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.objEspNom.message}</p>
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