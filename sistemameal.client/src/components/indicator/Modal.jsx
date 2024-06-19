// Importaciones necesarias
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchData, handleSubmitMantEspecial } from '../reusable/helper';

const Modal = ({ estadoEditado, modalVisible, closeModal, setRefresh, title, unidades, tiposDeValor }) => {
    // Variables de estado
    const [involucraSubActividad, setInvolucraSubActividad] = useState(false);
    const [subProyectos, setSubProyectos] = useState([]);
    const [objetivos, setObjetivos] = useState([]);
    const [objetivosEspecificos, setObjetivosEspecificos] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [subProyectoEnable, setSubProyectoEnable] = useState(false);
    const [objetivoEnable, setObjetivoEnable] = useState(false);
    const [objetivoEspecificoEnable, setObjetivoEspecificoEnable] = useState(false);
    const [resultadoEnable, setResultadoEnable] = useState(false);
    const [subProyectosLoaded, setSubProyectosLoaded] = useState(false);
    const [objetivosLoaded, setObjetivosLoaded] = useState(false);
    const [objetivosEspecificosLoaded, setObjetivosEspecificosLoaded] = useState(false);
    const [resultadosLoaded, setResultadosLoaded] = useState(false);

    const [ subProMode, setSubProMode] = useState(true);
    const [ objetivoMode, setObjetivoMode] = useState(true);
    const [ objetivoEspMode, setObjetivoEspMode] = useState(true);

    // Función para extraer todos los indicadores de la fórmula
    const extractIndicators = (formula) => {
        if (formula) {
            const regex = /\[[A-Za-z0-9.]+\]/g;
            const matches = formula.match(regex);
            return matches ? matches.map(indicator => indicator.slice(1, -1)) : [];
        }
    };

    // Función para verificar si un indicador existe en indicadoresSelect
    const indicatorExists = (indicator) => {
        return indicadoresSelect.some(item => item.indNum.toUpperCase() === indicator.toUpperCase());
    };

    const replaceCodesWithIndicators = (formula, data) => {
        let newFormula = formula;
        data.forEach(item => {
            const indAnoCod = item.indAno + item.indCod;
            newFormula = newFormula.replace(new RegExp(indAnoCod, 'g'), item.indNum);
        });
        return newFormula;
    };

    // Configuración useForm
    const { register, handleSubmit: validateForm, formState: { errors, dirtyFields, isSubmitted }, reset, setValue, watch, trigger } = useForm({ mode: "onChange" });

    // Función para cerrar el modal y resetear el formulario
    const closeModalAndReset = () => {
        closeModal();
        setObjetivoEspMode(true);
        setObjetivoMode(true);
        setSubProMode(true);
        reset({
            subProyecto: '0',
            objetivo: '0',
            objetivoEspecifico: '0',
            resultado: '0',
            indNom: '',
            indNum: '',
            indNumPre: '',
            uniCod: '0',
            tipValCod: '0',
            indTipInd: '0',
            indFor: '',
        });
        setObjetivos([])
        setObjetivosEspecificos([])
        setResultados([])
        setActividades([])
        setObjetivosLoaded(false);
        setObjetivosEspecificosLoaded(false);
        setResultadosLoaded(false);
    };


    const replaceIndicatorsWithCodes = (formula) => {
        let newFormula = formula;
        const indicators = extractIndicators(formula);
        indicators.forEach(indicator => {
            const item = indicadoresSelect.find(item => item.indNum.toUpperCase() === indicator.toUpperCase());
            const indAnoCod = item.indAno + item.indCod;
            newFormula = newFormula.replace(indicator, indAnoCod);
        });
        return newFormula;
    };
    

    // Función para manejar el envío del formulario
    const onSubmit = (data) => {
        const formula = data.indFor ? replaceIndicatorsWithCodes(data.indFor) : '';
        const indicadorPre = data.indNumPre ? data.indNumPre  : '';
        let dataSubmit = {
            indFor: formula,
            indNum: data.indNum,
            indNumPre: indicadorPre,
            indNom: data.indNom,
            indTipInd: data.indTipInd,
            tipValCod: data.tipValCod,
            uniCod: data.uniCod,
            indAno: data.indAno,
            indCod: data.indCod,
            indTotPre: data.indTotPre,
            monCod: data.monCod,
            indLinBas: data.indLinBas,
            actAno: data.actAno,
            actCod: data.actCod,
        }

        if (subProMode && !objetivoMode && !objetivoEspMode) {
            const { objAno, objCod } = JSON.parse(data.objetivo);
            dataSubmit = {
                ...dataSubmit,
                objAno,
                objCod
            }
        } else if (objetivoMode && subProMode && !objetivoEspMode) {
            const { objEspAno, objEspCod } = JSON.parse(data.objetivoEspecifico);
            dataSubmit = {
                ...dataSubmit,
                objEspAno,
                objEspCod
            }
        } else {
            if (involucraSubActividad) {
                const { actAno, actCod } = JSON.parse(data.actividad);
                dataSubmit = {
                    ...dataSubmit,
                    actAno,
                    actCod
                }
            } else {
                const { resAno, resCod } = JSON.parse(data.resultado);
                dataSubmit = {
                    ...dataSubmit,
                    resAno,
                    resCod
                }
            }
        }

        const { subProAno, subProCod } = JSON.parse(data.subProyecto);
        dataSubmit = {
            ...dataSubmit,
            subProAno,
            subProCod
        }
        handleSubmitMantEspecial('Indicador', !!estadoEditado, dataSubmit, setRefresh, closeModalAndReset)
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
            const { resAno, resCod } = JSON.parse(resultado);
            fetchData(`Actividad/resultado/${resAno}/${resCod}`, (data) => {
                if (involucraSubActividad) {
                    // Llenamos el select en caso si involucre
                    if(data.length > 0 ) {
                        setActividades(data);
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
        const indicador = watch('indTipInd');
        if (indicador !== '0' && indicador !== '') {

            if (indicador === 'IIN') {
                setSubProMode(false);
                setObjetivoMode(false);
                setObjetivoEspMode(false);
            } else if (indicador === 'IOB') {
                setSubProMode(true);
                setObjetivoMode(false);
                setObjetivoEspMode(false);
            } else if (indicador === 'IOE') {
                setSubProMode(true);
                setObjetivoMode(true);
                setObjetivoEspMode(false);
            } else {
                setSubProMode(true);
                setObjetivoMode(true);
                setObjetivoEspMode(true);
            }
            setSubProyectoEnable(true);
        } else {
            setObjetivoMode(true);
            setObjetivoEspMode(true);
            setSubProMode(true);
            setValue('subProyecto', '0');
            setSubProyectoEnable(false);
        }
    }, [watch('indTipInd')]);
    
    // Efecto para manejar el cambio en el subproyecto seleccionado
    useEffect(() => {
        const subProyecto = watch('subProyecto');
        if (subProyecto !== '0' && subProyecto !== '' && subProyecto) {
            const { subProAno, subProCod, subProInvSubAct } = JSON.parse(subProyecto);
            fetchData(`Objetivo/subproyecto/${subProAno}/${subProCod}`, (data) => {
                setValue('objetivo', '0');
                const filteredData = data.filter(item => item.objNum !== 'NA' && item.objNom !== 'NA');
                if(filteredData.length > 0 ) {
                    setObjetivos(filteredData);
                    setObjetivoEnable(true);
                    setObjetivosLoaded(true);
                }
            });
            if (subProInvSubAct.trim() === 'S') {
                setInvolucraSubActividad(false); //
            } else {
                setInvolucraSubActividad(false);
            }
            fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`, (data) => {
                setIndicadoresSelect(data);
                if (estadoEditado) {
                    const newIndFor = replaceCodesWithIndicators(estadoEditado.indFor, data);
                    setValue('indFor', newIndFor);
                }
            });
        } else {
            setValue('objetivo', '0');
            setObjetivoEnable(false);
            setIndicadoresSelect([])
        }
    }, [watch('subProyecto')]);

    // Efecto para manejar el cambio en el objetivo seleccionado
    useEffect(() => {
        const objetivo = watch('objetivo');
        if (objetivo !== '0' && objetivo !== '') {
            const { objAno, objCod } = JSON.parse(objetivo);
            fetchData(`ObjetivoEspecifico/objetivo/${objAno}/${objCod}`, (data) => {
                setValue('objetivoEspecifico', '0');
                const filteredData = data.filter(item => item.objEspNum !== 'NA' && item.objEspNom !== 'NA');
                if (filteredData.length > 0) {
                    setObjetivosEspecificos(filteredData);
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
                const filteredData = data.filter(item => item.resNum !== 'NA' && item.resNom !== 'NA');
                if (filteredData.length > 0) {
                    setResultadoEnable(true);
                    setResultados(filteredData);
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

    const [indicadoresSelect, setIndicadoresSelect] = useState([])

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
            const { subProAno, subProCod, subProInvSubAct } = estadoEditado;
            setValue('subProyecto', JSON.stringify({ subProAno, subProCod, subProInvSubAct:subProInvSubAct.trim() }));
        }
    }, [estadoEditado, subProyectosLoaded, setValue]);

    // Efecto para manejar la edición del estado
    useEffect(() => {
        if (estadoEditado) {
            reset(estadoEditado);
        }
    }, [estadoEditado, reset, setValue]);


    const handleSelectChange = (event) => {
        const selectedIndNum = event.target.value; // obtén el indNum del indicador seleccionado
        if (selectedIndNum !== '0') {
            const inputElement = document.getElementById('formulaInput');
            const cursorPosition = inputElement.selectionStart;
            const currentFormula = watch('indFor') ? watch('indFor') : '';
            const newFormula = currentFormula.slice(0, cursorPosition) + `[${selectedIndNum}]` + currentFormula.slice(cursorPosition);
            setValue('indFor', newFormula, { shouldDirty: true });
            trigger('indFor');
            event.target.value = '0';
        }
    };
    
    return (
        <div className={`PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent flex flex-column" style={{maxWidth: '80%',width: '60%'}}>
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {title}</h2>
                <form className='Large-f1 PowerMas_FormStatus flex flex-column gap_3 flex-grow-1 overflow-auto' onSubmit={validateForm(onSubmit)}>
                    <div className='flex flex-row gap-1'>
                    <div className='Large_6'>
                            <div>
                                <label htmlFor='indTipInd' className="">
                                    Tipo de Indicador:
                                </label>
                                <select 
                                    id='indTipInd'
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.indTipInd || isSubmitted ? (errors.indTipInd ? 'invalid' : 'valid') : ''}`} 
                                    {...register('indTipInd', { 
                                        validate: {
                                            required: value => value !== '0' || 'El campo es requerido',
                                        }
                                    })}
                                >
                                    <option value="0">--Seleccione Tipo de Indicador--</option>
                                    {/* {
                                        involucraSubActividad ?
                                        <option value="ISA">Indicador de Sub Actividad</option>
                                        :
                                        <option value="IAC">ACTIVIDAD</option>
                                    } */}
                                    <option value="IRE">INDICADOR DE RESULTADO</option>
                                    <option value="IOB">INDICADOR DE OBJETIVO</option>
                                    <option value="IOE">INDICADOR DE OBJETIVO ESPECÍFICO</option>
                                    <option value="IIN">INDICADOR INSTITUCIONAL</option>
                                </select>
                                {errors.indTipInd ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indTipInd.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-column">
                                <label className="" htmlFor='indNum'>
                                    Código de Indicador
                                </label>
                                <input 
                                    id="indNum"
                                    className={`PowerMas_Modal_Form_${dirtyFields.indNum || isSubmitted ? (errors.indNum ? 'invalid' : 'valid') : ''}`}  
                                    type="text" 
                                    disabled={!subProyectoEnable}
                                    placeholder='A1.1.1' 
                                    maxLength={10} 
                                    name="indNum" 
                                    autoComplete='off'
                                    {...register(
                                        'indNum', { 
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
                                {errors.indNum ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indNum.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-column">
                                <label className="" htmlFor='indNumPre'>
                                    Código de Indicador Presupuesto
                                </label>
                                <input 
                                    id="indNumPre"
                                    className={`PowerMas_Modal_Form_${dirtyFields.indNumPre || isSubmitted ? (errors.indNumPre ? 'invalid' : 'valid') : ''}`}  
                                    type="text" 
                                    disabled={!subProyectoEnable}
                                    placeholder='A111' 
                                    maxLength={10} 
                                    name="indNumPre" 
                                    autoComplete='off'
                                    {...register(
                                        'indNumPre', { 
                                            maxLength: { value: 10, message: 'El campo no puede tener más de 10 caracteres' },
                                            minLength:  { value: 2, message: 'El campo no puede tener menos de 2 caracteres' },
                                            pattern: {
                                                value: /^[A-Za-z0-9.\s]+$/,
                                                message: 'Por favor, introduce solo letras, numeros y puntos',
                                            },
                                        }
                                    )}
                                />
                                {errors.indNumPre ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indNumPre.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            <div className="">
                                <label htmlFor="indNom" className="">
                                    Nombre de Indicador
                                </label>
                                <input type="text"
                                    id="indNom"
                                    disabled={!subProyectoEnable}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.indNom || isSubmitted ? (errors.indNom ? 'invalid' : 'valid') : ''}`} 
                                    placeholder="Número de personas que se benefician..."
                                    autoComplete='off'
                                    maxLength={600}
                                    {...register('indNom', { 
                                        required: 'El campo es requerido',
                                        pattern: {
                                            value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9().,;üÜ/\s-:%_]+$/,
                                            message: 'Por favor, introduce caracteres válidos.',
                                        },
                                        minLength: { value: 3, message: 'El campo debe tener minimo 3 caracteres' },
                                        maxLength: { value: 600, message: 'El campo no puede tener más de 600 caracteres' },
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
                                <label htmlFor='uniCod' className="">
                                    Unidad:
                                </label>
                                <select 
                                    id='uniCod'
                                    // disabled={!subProyectoEnable}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.uniCod || isSubmitted ? (errors.uniCod ? 'invalid' : 'valid') : ''}`} 
                                    {...register('uniCod', { 
                                        validate: value => value !== '0' || 'El cargo es requerido' 
                                    })}
                                >
                                    <option value="0">--Seleccione Unidad--</option>
                                    {unidades.map((item, index) => (
                                        <option 
                                            key={index} 
                                            value={item.uniCod}
                                        > 
                                            {item.uniNom}
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
                                    // disabled={!subProyectoEnable}
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
                                            {item.tipValNom}
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
                        </div>
                        <div className='Large_6'>
                            <div>
                                <label htmlFor='subProyecto' className="">
                                    Sub Proyecto:
                                </label>
                                <select 
                                    id='subProyecto'
                                    disabled={!subProyectoEnable}
                                    className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.subProyecto || isSubmitted ? (errors.subProyecto ? 'invalid' : 'valid') : ''}`} 
                                    {...register('subProyecto', { 
                                        validate: {
                                            required: value => value !== '0' || 'El campo es requerido',
                                        }
                                    })}
                                >
                                    <option value="0">--Seleccione Sub Proyecto--</option>
                                    {subProyectos.map((item, index) => {
                                        // Limita la longitud del texto a 50 caracteres
                                        const maxLength = 40;
                                        let displayText = item.subProSap + ' - ' + item.subProNom + ' | ' + item.proNom;
                                        if (displayText.length > maxLength) {
                                            displayText = displayText.substring(0, maxLength) + '...';
                                        }

                                        return (
                                            <option 
                                                key={index} 
                                                value={JSON.stringify({ subProAno: item.subProAno, subProCod: item.subProCod, subProInvSubAct: item.subProInvSubAct.trim() })}
                                                title={item.subProSap + ' - ' + item.subProNom + ' | ' + item.proNom} 
                                            > 
                                                {displayText}
                                            </option>
                                        )
                                    })}
                                </select>
                                {errors.subProyecto ? (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.subProyecto.message}</p>
                                ) : (
                                    <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                        Espacio reservado para el mensaje de error
                                    </p>
                                )}
                            </div>
                            {
                                subProMode &&
                                <>
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
                                                // Limita la longitud del texto a 50 caracteres
                                                const maxLength = 40;
                                                let displayText = item.objNum + ' - ' + item.objNom;
                                                if (displayText.length > maxLength) {
                                                    displayText = displayText.substring(0, maxLength) + '...';
                                                }

                                                return(
                                                    <option 
                                                        key={index} 
                                                        value={JSON.stringify({ objAno: item.objAno, objCod: item.objCod })}
                                                        title={item.objNum + ' - ' + item.objNom} 
                                                    > 
                                                        {displayText}
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
                                    {
                                        objetivoMode &&
                                        <>
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
                                                        const maxLength = 40;
                                                        let displayText = item.objEspNum + ' - ' + item.objEspNom;
                                                        if (displayText.length > maxLength) {
                                                            displayText = displayText.substring(0, maxLength) + '...';
                                                        }

                                                        return(
                                                            <option 
                                                                key={index} 
                                                                value={JSON.stringify({ objEspAno: item.objEspAno, objEspCod: item.objEspCod })}
                                                                title={item.objEspNum + ' - ' + item.objEspNom} 
                                                            > 
                                                                {displayText}
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
                                            {
                                                objetivoEspMode &&
                                                <>
                                                    <div>
                                                        <label htmlFor='resultado' className="">
                                                            Resultado:
                                                        </label>
                                                        <select 
                                                            id='resultado'
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
                                                                const maxLength = 40;
                                                                let displayText = item.resNum + ' - ' + item.resNom;
                                                                if (displayText.length > maxLength) {
                                                                    displayText = displayText.substring(0, maxLength) + '...';
                                                                }

                                                                return(
                                                                    <option 
                                                                        key={index} 
                                                                        value={JSON.stringify({ resAno: item.resAno, resCod: item.resCod })}
                                                                        title={item.resNum + ' - ' + item.resNom} 
                                                                    > 
                                                                        {displayText}
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
                                                                    const text = item.actNom;
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
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </div>
                        
                    </div>
                    
                    <div className='flex flex-column gap_5 p_5' style={{border: '1px solid black'}}>
                        <label htmlFor='formulaInput' className="">
                            Fórmula:
                        </label>
                        <p className="f_75">
                            * Utilizar solamente si va a usar otro indicador u otra actividad asociada 
                        </p>
                        <select 
                            id=''
                            className=''
                            disabled={!objetivoEnable}
                            onChange={(event) => {
                                // Solo agrega el indicador si el valor seleccionado no es 0
                                if (event.target.value !== '0') {
                                    handleSelectChange(event);
                                }
                            }}
                        >
                            <option value="0">--Lista de Indicadores--</option>
                            {indicadoresSelect.map((item, index) => {
                                const maxLength = 80;
                                let displayText = item.indNum + ' - ' + item.indNom;
                                if (displayText.length > maxLength) {
                                    displayText = displayText.substring(0, maxLength) + '...';
                                }

                                return (
                                    <option 
                                        key={index} 
                                        value={item.indNum}
                                        title={item.indNum + ' - ' + item.indNom} 
                                    > 
                                        {displayText}
                                    </option>
                                )
                            })}
                        </select>
                        <textarea
                            rows="4" cols="50"
                            id="formulaInput"
                            autoComplete='off'
                            disabled={!subProyectoEnable}
                            placeholder='Ingresa Formula'
                            className={`block PowerMas_Modal_Form_${dirtyFields.indFor   || isSubmitted ? (errors.indFor   ? 'invalid' : 'valid') : ''}`} 
                            {...register('indFor', { 
                                pattern: {
                                    value: /^=(\[[A-Za-z0-9.]+\]|\d+|\s|\+|-|\*|\/|\(|\))*$/,
                                    message: 'La fórmula contiene caracteres no válidos o no comienza con "=".',
                                },
                                validate: {
                                    balancedBrackets: value => {
                                        if (value) {
                                            const openBrackets = (value.match(/\(/g) || []).length;
                                            const closeBrackets = (value.match(/\)/g) || []).length;
                                            return openBrackets === closeBrackets || 'Los paréntesis no están balanceados.';
                                        }
                                    },
                                    noMultipleOperators: value => {
                                        return !/[\+\-\*\/]{2,}/.test(value) || 'No se pueden ingresar múltiples operadores seguidos.';
                                    },
                                    validIndicators: value => {
                                        if (value) {
                                            const indicators = extractIndicators(value);
                                            return indicators.every(indicatorExists) || 'Uno o más indicadores no existen.';
                                        }
                                    },
                                    noOperatorAtStartOrEnd: value => {
                                        return !/^=[\+\-\*\/]|[\+\-\*\/]$/.test(value) || 'La fórmula no puede comenzar ni terminar con un operador.';
                                    },
                                    noNumberAdjacentToIndicator: value => {
                                        return !/\d\[[A-Za-z0-9.]+\]|\[[A-Za-z0-9.]+\]\d/.test(value) || 'No puede haber un número inmediatamente antes o después de un indicador.';
                                    },
                                    noAdjacentIndicators: value => {
                                        return !/\]\[/g.test(value) || 'No pueden haber dos indicadores adyacentes.';
                                    },
                                },
                            })}
                        >
                        </textarea>

                        {errors.indFor ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.indFor.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                       
                    </div>

                    <br />
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center p1' style={{position: 'sticky', bottom: 0, background: '#FFF'}}>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal