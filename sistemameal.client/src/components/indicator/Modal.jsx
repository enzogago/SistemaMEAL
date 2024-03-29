// Importaciones necesarias
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchData, handleSubmitMant } from '../reusable/helper';

const Modal = ({ estadoEditado, modalVisible, closeModal, setData, title, unidades, tiposDeValor }) => {
    // Variables de estado
    const [involucraSubActividad, setInvolucraSubActividad] = useState(false);
    const [subProyectos, setSubProyectos] = useState([]);
    const [objetivos, setObjetivos] = useState([]);
    const [objetivosEspecificos, setObjetivosEspecificos] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [objetivoEnable, setObjetivoEnable] = useState(false);
    const [objetivoEspecificoEnable, setObjetivoEspecificoEnable] = useState(false);
    const [resultadoEnable, setResultadoEnable] = useState(false);
    const [actividadesEnable, setActividadesEnable] = useState(false);
    const [subProyectosLoaded, setSubProyectosLoaded] = useState(false);
    const [objetivosLoaded, setObjetivosLoaded] = useState(false);
    const [objetivosEspecificosLoaded, setObjetivosEspecificosLoaded] = useState(false);
    const [resultadosLoaded, setResultadosLoaded] = useState(false);

    // Configuración useForm
    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue, watch } = useForm({ mode: "onChange" });

    // Función para cerrar el modal y resetear el formulario
    const closeModalAndReset = () => {
        closeModal();
        reset({
            subProyecto: '0',
            objetivo: '0',
            objetivoEspecifico: '0',
            resultado: '0',
            indNom: '',
            indNum: '',
            uniCod: '0',
            tipValCod: '0',
            indTipInd: '0',
        });
        setObjetivosLoaded(false);
        setObjetivosEspecificosLoaded(false);
        setResultadosLoaded(false);
    };

    // Función para manejar el envío del formulario
    const onSubmit = (data) => {
        if (involucraSubActividad) {
            const { actAno, actCod } = JSON.parse(data.actividad);
            data = {
                ...data,
                actAno,
                actCod
            }
        } else {
            const { resAno, resCod } = JSON.parse(data.resultado);
            data = {
                ...data,
                resAno,
                resCod
            }
        }
        const { subProAno, subProCod } = JSON.parse(data.subProyecto);
        console.log(subProAno)
        console.log(subProCod)
        data = {
            ...data,
            subProAno,
            subProCod
        }
        console.log(data)
        handleSubmitMant('Indicador', !!estadoEditado, data, setData, closeModalAndReset)
    };


    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado && resultadosLoaded) {
            const { resAno, resCod } = estadoEditado;
            setValue('resultado', JSON.stringify({ resAno, resCod }));
        }
    }, [estadoEditado, resultadosLoaded, setValue]);
    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado && objetivosEspecificosLoaded) {
            const { objEspAno, objEspCod } = estadoEditado;
            setValue('objetivoEspecifico', JSON.stringify({ objEspAno, objEspCod }));
        }
    }, [estadoEditado, objetivosEspecificosLoaded, setValue]);

    // Efecto para manejar el cambio en el subproyecto seleccionado
    useEffect(() => {
        const resultado = watch('resultado');
        if (resultado && resultado !== '0' && resultado !== '') {
            console.log(resultado)
            const { resAno, resCod } = JSON.parse(resultado);
            fetchData(`Actividad/resultado/${resAno}/${resCod}`, (data) => {
                if (involucraSubActividad) {
                    // Llenamos el select en caso si involucre
                    if(data.length > 0 ) {
                        setActividades(data);
                        setActividadesEnable(true);
                    }
                } else {
                    if (data.length > 0) {
                        const {actAno, actCod} = data[0]; 
                        setValue('actAno',actAno);
                        setValue('actCod',actCod);
                    } 
                }
            });
        }
    }, [watch('resultado')]);

    // Efecto para manejar el cambio en el subproyecto seleccionado
    useEffect(() => {
        const subProyecto = watch('subProyecto');
        if (subProyecto !== '0' && subProyecto !== '') {
            const { subProAno, subProCod, proInvSubAct } = JSON.parse(subProyecto);
            fetchData(`Objetivo/subproyecto/${subProAno}/${subProCod}`, (data) => {
                setValue('objetivo', '0');
                if(data.length > 0 ) {
                    setObjetivos(data);
                    setObjetivoEnable(true);
                    setObjetivosLoaded(true);
                }
            });
            if (proInvSubAct.trim() === 'S') {
                setInvolucraSubActividad(true);
            }
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
                setValue('objetivoEspecifico', '0');
                if (data.length > 0) {
                    setObjetivosEspecificos(data);
                    setObjetivoEspecificoEnable(true);
                    setObjetivosEspecificosLoaded(true);
                }
            });
        } else {
            setValue('objetivoEspecifico', '0');
            setObjetivoEspecificoEnable(false);
        }
    }, [watch('objetivo')]);

    // Efecto para manejar el cambio en el objetivo seleccionado
    useEffect(() => {
        const objetivoEspecifico = watch('objetivoEspecifico');
        if (objetivoEspecifico !== '0' && objetivoEspecifico !== '') {
            const { objEspAno, objEspCod } = JSON.parse(objetivoEspecifico);
            fetchData(`Resultado/objetivo-especifico/${objEspAno}/${objEspCod}`, (data) => {
                setValue('resultado', '0');
                if (data.length > 0) {
                    setResultadoEnable(true);
                    setResultados(data);
                    setResultadosLoaded(true);
                }
            });
        } else {
            setValue('resultado', '0');
            setResultadoEnable(false);
        }
    }, [watch('objetivoEspecifico')]);

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
            
            document.getElementById('indNum').focus();
        } else {
            setSubProyectosLoaded(false);
        }
    }, [modalVisible]);

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado && subProyectosLoaded) {
            const { subProAno, subProCod, proInvSubAct } = estadoEditado;
            setValue('subProyecto', JSON.stringify({ subProAno, subProCod, proInvSubAct:proInvSubAct.trim() }));
        }
    }, [estadoEditado, subProyectosLoaded, setValue]);

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado) {
            let newData = {};
            for (let key in estadoEditado) {
                if (typeof estadoEditado[key] === 'string') {
                    newData[key] = estadoEditado[key].trim().toLowerCase();
                } else {
                    newData[key] = estadoEditado[key];
                }
            }
            reset(newData);
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
                            style={{textTransform: 'capitalize'}}
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
                                    value={JSON.stringify({ subProAno: item.subProAno, subProCod: item.subProCod, proInvSubAct: item.proInvSubAct.trim() })}
                                > 
                                    {item.subProSap + ' - ' + item.subProNom.toLowerCase() + ' | ' + item.proNom.toLowerCase()}
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
                            style={{textTransform: 'capitalize'}}
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
                                const text = item.objNom.toLowerCase();
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
                            style={{textTransform: 'capitalize'}}
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
                                const text = item.objEspNom.toLowerCase();
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
                    <div>
                        <label htmlFor='resultado' className="">
                            Resultado:
                        </label>
                        <select 
                            id='resultado'
                            style={{textTransform: 'capitalize'}}
                            disabled={!resultadoEnable}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.resultado || isSubmitted ? (errors.resultado ? 'invalid' : 'valid') : ''}`} 
                            {...register('resultado', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Resultado--</option>
                            {resultados.map((item, index) => {
                                const text = item.resNom.toLowerCase();
                                const shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;
                                return(
                                    <option 
                                        key={index} 
                                        value={JSON.stringify({ resAno: item.resAno, resCod: item.resCod })}
                                    > 
                                        {item.resNum + ' - ' + shortText}
                                    </option>
                                )
                            })}
                        </select>
                        {errors.resultado ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.resultado.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    {
                        involucraSubActividad &&
                        <div>
                            <label htmlFor='actividad' className="">
                                Actividad:
                            </label>
                            <select 
                                id='actividad'
                                style={{textTransform: 'capitalize'}}
                                disabled={!resultadoEnable}
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.actividad || isSubmitted ? (errors.actividad ? 'invalid' : 'valid') : ''}`} 
                                {...register('actividad', { 
                                    validate: {
                                        required: value => value !== '0' || 'El campo es requerido',
                                    }
                                })}
                            >
                                <option value="0">--Seleccione Actividad--</option>
                                {actividades.map((item, index) => {
                                    const text = item.actNom.toLowerCase();
                                    const shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;
                                    return(
                                        <option 
                                            key={index} 
                                            value={JSON.stringify({ actAno: item.actAno, actCod: item.actCod })}
                                        > 
                                            {item.actNum + ' - ' + shortText}
                                        </option>
                                    )
                                })}
                            </select>
                            {errors.actividad ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.actividad.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                    }
                    <div className="">
                        <label className="block" htmlFor='indNum'>
                            Código del Indicador
                        </label>
                        <input 
                            id="indNum"
                            className={`PowerMas_Modal_Form_${dirtyFields.indNum || isSubmitted ? (errors.indNum ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            style={{textTransform: 'capitalize'}}
                            placeholder='123456' 
                            maxLength={100} 
                            name="indNum" 
                            autoComplete='disabled'
                            {...register(
                                'indNum', { 
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
                        {errors.indNum ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indNum.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="indNom" className="">
                            Nombre del Indicador
                        </label>
                        <input type="text"
                            id="indNom"
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.indNom || isSubmitted ? (errors.indNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Movilidad Humana"
                            autoComplete="disabled"
                            maxLength={300}
                            {...register('indNom', { 
                                required: 'El campo es requerido',
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                maxLength: { value: 300, message: 'El campo no puede tener más de 300 caracteres' },
                            })} 
                        />
                        {errors.indNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indNom.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='indTipInd' className="">
                            Tipo de Indicador:
                        </label>
                        <select 
                            id='indTipInd'
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.indTipInd || isSubmitted ? (errors.indTipInd ? 'invalid' : 'valid') : ''}`} 
                            {...register('indTipInd', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Unidad--</option>
                            {
                                involucraSubActividad ?
                                <option value="isa">Indicador de Sub Actividad</option>
                                :
                                <option value="iac">Indicador de Actividad</option>
                            }
                            <option value="ire">Indicador de Resultado</option>
                            <option value="iob">Indicador de Objetivo</option>
                            <option value="ioe">Indicador de Objetivo Específico</option>
                        </select>
                        {errors.indTipInd ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indTipInd.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='uniCod' className="">
                            Unidad:
                        </label>
                        <select 
                            id='uniCod'
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.uniCod || isSubmitted ? (errors.uniCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('uniCod', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Unidad--</option>
                            {unidades.map((item, index) => (
                                <option 
                                    key={index} 
                                    value={item.uniCod}
                                > 
                                    {item.uniNom.toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {errors.uniCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.uniCod.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='tipValCod' className="">
                            Tipo de Valor:
                        </label>
                        <select 
                            id='tipValCod'
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.tipValCod || isSubmitted ? (errors.tipValCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('tipValCod', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Tipo de Valor--</option>
                            {tiposDeValor.map((item, index) => (
                                <option 
                                    key={index} 
                                    value={item.tipValCod}
                                > 
                                    {item.tipValNom.toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {errors.tipValCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.tipValCod.message}</p>
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