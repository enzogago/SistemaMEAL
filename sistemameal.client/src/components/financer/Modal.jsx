import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchData, handleSubmitMant } from '../reusable/helper';
// import { handleSubmit } from './eventHandlers';

const Modal = ({ estadoEditado, modalVisible, closeModal, setData, title }) => {
    const [ monedas, setMonedas ] = useState([])
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
            monCod: '0',
            finNom: '',
            finIde: '',
            finSap: '',
        });
    };

    const onSubmit = (data) => {
        console.log(data)
        handleSubmitMant('Financiador',!!estadoEditado,data, setData, closeModalAndReset)
    };

    const [monedasLoaded, setMonedasLoaded] = useState(false);

    // Activar focus en input
    useEffect(() => {
        if (modalVisible) {
            fetchData('Moneda', (data) => {
                setMonedas(data);
                setMonedasLoaded(true); // Mueve esta línea aquí
            });
            document.getElementById('finSap').focus();
        }
    }, [modalVisible]);
    


    useEffect(() => {
        if (estadoEditado && monedasLoaded) {
            setValue('monCod', estadoEditado.monCod);
        }
    }, [estadoEditado, monedasLoaded, setValue])


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
            reset(newData);
        }
    }, [estadoEditado, reset, setValue]);



    return (
        <div className={` PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent" style={{width: '40%'}}>
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {title}</h2>
                <form className='Large-f1 PowerMas_FormStatus flex flex-column gap_3' onSubmit={validateForm(onSubmit)}>
                    <div>
                        <label htmlFor='finIde' className="block">
                            Código de Financiación:
                        </label>
                        <input 
                            id="finIde"
                            className={`p_5 PowerMas_Modal_Form_${dirtyFields.finIde || isSubmitted ? (errors.finIde ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='022001' 
                            maxLength={7} 
                            name="finIde" 
                            autoComplete='off'
                            {...register(
                                'finIde', { 
                                    required: 'el campo es requerido',
                                    maxLength: { value: 7, message: 'El campo no puede tener más de 7 caracteres' },
                                    minLength:  { value: 6, message: 'El campo no puede tener menos de 6 caracteres' },
                                    pattern: {
                                        value: /^[A-Za-z0-9/\s-_]+$/,
                                        message: 'Por favor, introduce solo letras y espacios',
                                    },
                                }
                            )}
                        />
                        {errors.finIde ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.finIde.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div className="">
                        <label htmlFor="finNom" className="">
                            Nombre
                        </label>
                        <input type="text"
                            id="finNom"
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.finNom || isSubmitted ? (errors.finNom ? 'invalid' : 'valid') : ''}`} 
                            placeholder="Ayuda En Acción"
                            autoComplete='off'
                            maxLength={100}
                            {...register('finNom', { 
                                required: 'El campo es requerido',
                                pattern: {
                                    value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ.,;üÜ/\s-_]+$/,
                                    message: 'Por favor, introduce caracteres válidos.',
                                },
                                minLength: { value: 3, message: 'El campo debe tener minimo 3 digitos' },
                                maxLength: { value: 100, message: 'El campo no puede tener más de 100 caracteres' },
                            })} 
                        />
                        {errors.finNom ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.finNom.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='finSap' className="block">
                            Código SAP:
                        </label>
                        <input 
                            id="finSap"
                            className={`p_5 PowerMas_Modal_Form_${dirtyFields.finSap || isSubmitted ? (errors.finSap ? 'invalid' : 'valid') : ''}`}  
                            type="text" 
                            placeholder='AEAE' 
                            maxLength={10}
                            name="finSap" 
                            autoComplete='off'
                            {...register(
                                'finSap', { 
                                    required: 'el campo es requerido',
                                    maxLength: { value: 10, message: 'El campo no puede tener más de 10 caracteres' },
                                    minLength:  { value: 3, message: 'El campo no puede tener menos de 3 caracteres' },
                                    pattern: {
                                        value: /^[A-Za-z/\s-_]+$/,
                                        message: 'Por favor, introduce solo letras y espacios',
                                    },
                                }
                            )}
                        />
                        {errors.finSap ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.finSap.message}</p>
                        ) : (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                Espacio reservado para el mensaje de error
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='monCod' className="">
                            Moneda:
                        </label>
                        <select 
                            id='monCod'
                            style={{textTransform: 'capitalize'}}
                            className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.monCod || isSubmitted ? (errors.monCod ? 'invalid' : 'valid') : ''}`} 
                            {...register('monCod', { 
                                validate: {
                                    required: value => value !== '0' || 'El campo es requerido',
                                }
                            })}
                        >
                            <option value="0">--Seleccione Moneda--</option>
                            {monedas.map((item, index) => (
                                <option 
                                    key={index} 
                                    value={item.monCod}
                                > 
                                    { item.monCod == '00' 
                                        ? 'Sin Moneda'
                                        : `${item.monAbr} (${item.monSim})`
                                    }
                                </option>
                            ))}
                        </select>
                        {errors.monCod ? (
                            <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.monCod.message}</p>
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