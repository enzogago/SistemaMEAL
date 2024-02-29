import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { handleSubmit } from '../helper';
import InputNombre from './Inputs/InputNombre';
import InputInvolucra from './Inputs/InputInvolucra';
import InputAbreviatura from './Inputs/InputAbreviatura';
import InputColor from './Inputs/InputColor';

const Modal = ({ estadoEditado, modalVisible, setModalVisible, closeModal, setData, fieldMapping, controller, codeField }) => {
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

    const onSubmit = (data) => {
        // Elimina los espacios en blanco adicionales
        data.nombre = data.nombre.replace(/\s+/g, ' ').trim();

        handleSubmit(controller, estadoEditado, data, setData, setModalVisible, fieldMapping, codeField, closeModalAndReset);
    };

    // Activar focus en input
    useEffect(() => {
        if (modalVisible && fieldMapping) {
            const firstField = Object.keys(fieldMapping)[0];
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
        }
    }, [estadoEditado, setValue, fieldMapping]);

    
    
    const closeModalAndReset = () => {
        closeModal();
        reset();
    };

    
    return (
        <div className={`PowerMas_Modal ${modalVisible ? 'show' : ''}`}>
            <div className="PowerMas_ModalContent">
                <span className="PowerMas_CloseModal" onClick={closeModalAndReset}>×</span>
                <h2 className="PowerMas_Title_Modal center f1_5">{estadoEditado ? 'Editar' : 'Nuevo'} {controller}</h2>
                <form className='Large-f1 PowerMas_FormStatus' onSubmit={validateForm(onSubmit)}>
                    {Object.keys(fieldMapping).map(field => {
                        switch (field) {
                            case 'nombre':
                                return <InputNombre key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'abreviatura':
                                return <InputAbreviatura key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'involucra':
                                return <InputInvolucra key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} />;
                            case 'color':
                                return <InputColor key={field} register={register} errors={errors} dirtyFields={dirtyFields} isSubmitted={isSubmitted} setValue={setValue} color={color} setColor={setColor} />;
                            default:
                                return null;
                        }
                    })}
                    <div className='PowerMas_StatusSubmit flex jc-center ai-center'>
                        <input className='' type="submit" value="Guardar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal