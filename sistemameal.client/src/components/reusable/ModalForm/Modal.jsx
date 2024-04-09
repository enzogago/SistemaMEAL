import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { handleSubmitMant } from '../helper';
import InputNombre from './Inputs/InputNombre';
import InputInvolucra from './Inputs/InputInvolucra';
import InputAbreviatura from './Inputs/InputAbreviatura';
import InputColor from './Inputs/InputColor';
import InputCodigoSap from './Inputs/InputCodigoSap';
import InputNumero from './Inputs/InputNumero';
import InputIdentificador from './Inputs/InputIdentificador';

const Modal = ({ estadoEditado, modalVisible, setModalVisible, closeModal, setData, fieldMapping, controller, title, controllerSelect, select, selectMapping }) => {
    //
    const [color, setColor] = useState('#000000');

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
        reset();
    };

    const onSubmit = (data) => {
        // Elimina los espacios en blanco adicionales
        for (let key in data) {
            if (typeof data[key] === 'string') {
                data[key] = data[key].replace(/\s+/g, ' ').trim();
            }
        }

        let objeto;

        if (controllerSelect) {
            const select = JSON.parse(data[controllerSelect]);
    
            // Combina el objeto proyecto con el objeto data
            const newData = { ...data, ...select };

            // Crea un nuevo fieldMapping que incluye las claves de select
            const newFieldMapping = { ...fieldMapping, ...Object.keys(select).reduce((obj, key) => ({...obj, [key]: key}), {}) };

            // Crea el objeto final mapeando los campos con newFieldMapping
            objeto = estadoEditado 
                ?   { 
                        ...estadoEditado, 
                        ...Object.keys(newData).reduce((obj, key) => ({...obj, [newFieldMapping[key]]: newData[key]}), {}),
                    } 
                :   { 
                        ...Object.keys(newData).reduce((obj, key) => ({...obj, [newFieldMapping[key]]: newData[key]}), {}),
                    };
        } else {
            objeto = estadoEditado 
                ?   { 
                        ...estadoEditado, 
                        ...Object.keys(data).reduce((obj, key) => ({...obj, [fieldMapping[key]]: data[key]}), {}),
                    } 
                :   { 
                        ...Object.keys(data).reduce((obj, key) => ({...obj, [fieldMapping[key]]: data[key]}), {}),
                    };
        }
        handleSubmitMant(controller, estadoEditado, objeto, setData, closeModalAndReset);
    };

    // Activar focus en input
    useEffect(() => {
        if (modalVisible && fieldMapping) {
            const firstField = Object.keys(fieldMapping)[0];
            console.log(firstField)
            document.getElementById(firstField).focus();
        }
    }, [modalVisible, fieldMapping]);


    // Efecto al editar estado
    useEffect(() => {
        if (estadoEditado && fieldMapping) {
            Object.keys(fieldMapping).forEach(formField => {
                const dbField = fieldMapping[formField];
                let value = estadoEditado[dbField];
                if (value) {
                    if (formField === 'color') {
                        setColor(value);
                    } else {
                        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                    }
                    setValue(formField, value);
                }
            });
            // Lógica adicional para el select
            if (controllerSelect) {
                const selectValue = {};
                selectMapping.properties.forEach(prop => {
                    if (prop in estadoEditado) {
                        selectValue[prop] = estadoEditado[prop];
                    }
                });
                setValue(controllerSelect, JSON.stringify(selectValue));
            }
        }
    }, [estadoEditado, setValue, fieldMapping]);


    
    return (
        <div className={`PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent">
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {title}</h2>
                <form className='Large-f1 PowerMas_FormStatus' onSubmit={validateForm(onSubmit)}>
                    {
                        select &&
                        <>
                            <label htmlFor={controllerSelect} className="">
                                {controllerSelect}:
                            </label>
                            <select 
                                id={controllerSelect}
                                style={{textTransform: 'capitalize'}}
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields[controllerSelect] || isSubmitted ? (errors[controllerSelect] ? 'invalid' : 'valid') : ''}`} 
                                {...register(controllerSelect, { 
                                    validate: {
                                        required: value => value !== '0' || 'El campo es requerido',
                                    }
                                })}
                            >
                                <option value="0">--Seleccione {controllerSelect}--</option>
                                {select.map((item, index) => (
                                    <option 
                                        key={index} 
                                        value={selectMapping.value(item)}
                                    > 
                                        {selectMapping.display(item)}
                                    </option>
                                ))}
                            </select>
                            {errors[controllerSelect] ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors[controllerSelect].message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </>
                    }
                    {Object.keys(fieldMapping).map(field => {
                        switch (field) {
                            case 'codigo':
                                return <InputIdentificador key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'nombre':
                                return <InputNombre key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'abreviatura':
                                return <InputAbreviatura key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'involucra':
                                return <InputInvolucra key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'color':
                                return <InputColor key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} setValue={setValue} color={color} setColor={setColor} />;
                            case 'codigoSAP':
                                return <InputCodigoSap key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            default:
                                return null;
                        }
                    })}
                    <div className='flex jc-center ai-center'>
                        <button className='PowerMas_Buttom_Primary Large_3 p_5' type="submit"> Guardar </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal