import React, { Fragment, useEffect, useState } from 'react'
import { FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import { Export_Excel_Basic, fetchData } from '../../reusable/helper';
import { useForm } from 'react-hook-form';
import Notiflix, { Notify } from 'notiflix';
import Modal from 'react-modal';
import { formatter } from './helper';

const ResultGoal = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [subproyectos, setSubProyectos] = useState([]);
    const [selectedSubProyecto, setSelectedSubProyecto] = useState(null);
    const [indicadores, setIndicadores] = useState([]);
    
    const [implementadoresSelect, setImplementadoresSelect] = useState([]);
    const [ubicacionesSelect, setUbicacionesSelect] = useState([]);
    const [additionalRows, setAdditionalRows] = useState([]);
    const [expandedIndicators, setExpandedIndicators] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    const [totals, setTotals] = useState({});
    const [prevValues, setPrevValues] = useState({});

    const [ selects, setSelects ] = useState([]);

    const { 
        register, 
        watch, 
        handleSubmit, 
        formState: { errors, dirtyFields, isSubmitted }, 
        reset, 
        setValue, 
        trigger 
    } = 
    useForm({ mode: "onChange"});

    // Configuracion del formulario 2
    const { 
        register: register2, 
        watch: watch2, 
        handleSubmit: handleSubmit2, 
        formState: { errors: errors2, dirtyFields:dirtyFields2, isSubmitted:isSubmitted2 }, 
    } = 
    useForm({ mode: "onChange"});

    useEffect(() => {
        const pais = watch2('pais');

        if (pais) {
            if (pais === '0') {
                setSelects([]);
                return;
            }

            handleCountryChange(pais);
        }
    }, [watch2('pais')]);

    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos)
    }, []);
    
    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`,setIndicadores)
            fetchData(`Implementador/subproyecto/${subProAno}/${subProCod}`,setImplementadoresSelect)
            fetchData(`Ubicacion/subproyecto/${subProAno}/${subProCod}`, (data) => {
                setUbicacionesSelect([]);
                data.map(ubi => {
                    fetchSelect(ubi.ubiAno, ubi.ubiCod);
                })
            })
            
            const selected = subproyectos.find(item => item.subProAno === subProAno && item.subProCod === subProCod);
            setSelectedSubProyecto(selected);
        } else {
            setSelectedSubProyecto(null)
            setIndicadores([]);
        }
    }, [watch('subproyecto')]);
    
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const onSubmit = (data) => {
        console.log(data)
    };
    const onSubmit2 = (data) => {
        let ubiAno, ubiCod;
        // Si los selects dinamicos son mayor a 1
        if (selects.length > 1) {
            // Obtiene el ubiAno y ubiCod del último select
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;
            if (lastSelect === '0') {
                // Si el último select tiene un valor de '0', obtén el ubiAno y ubiCod del penúltimo select
                const penultimateSelectElement = document.querySelector(`select[name=select${selects.length - 2}]`);
                const penultimateSelect = JSON.parse(penultimateSelectElement.value);
                ubiAno = penultimateSelect.ubiAno;
                ubiCod = penultimateSelect.ubiCod;
            } else {
                // Si el último select tiene un valor distinto de '0', usa ese
                const ultimo = JSON.parse(lastSelect);
                ubiAno = ultimo.ubiAno;
                ubiCod = ultimo.ubiCod;
            }
        } else {
            const lastSelectElement = document.querySelector(`select[name=select${selects.length - 1}]`);
            const lastSelect = lastSelectElement.value;

            // Si luego del siguiente nivel de Pais no se selecciona nada
            if(lastSelect === '0'){
                // Se toman los valores pasados del select pais
                const { ubiAno: paisUbiAno, ubiCod: paisUbiCod } = JSON.parse(data.pais);
                ubiAno = paisUbiAno;
                ubiCod = paisUbiCod;
            } else{
                // Caso contrario se toma el unico valor que tiene ese select ya que no tiene más niveles por debajo
                const ultimo = JSON.parse(lastSelect);
                ubiAno = ultimo.ubiAno;
                ubiCod = ultimo.ubiCod;
            }
        }
        console.log(selects)
        setValue(`ubicacion_${editingRow}`,'Ubicacion')
    };

    const fetchSelect = async (ubiAno,ubiCod) => {
        try {
            const token = localStorage.getItem('token');
            Notiflix.Loading.pulse('Cargando...');
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/select/${ubiAno}/${ubiCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            console.log(data)
            setUbicacionesSelect(prevUbicaciones => [...prevUbicaciones, data[0]]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleCountryChange = async (ubicacion, index) => {
        const selectedCountry = JSON.parse(ubicacion);
        if (ubicacion === '0') {
            setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual

            // Aquí actualizamos selectedValues para los selectores de nivel inferior
            // setSelectedValues(prevSelectedValues => {
            //     const newSelectedValues = [...prevSelectedValues];
            //     for (let i = index; i < newSelectedValues.length; i++) {
            //         newSelectedValues[i] = '0';
            //     }
            //     return newSelectedValues;
            // });

            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Ubicacion/${selectedCountry.ubiAno}/${selectedCountry.ubiCod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if(response.status == 401 || response.status == 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                }
                return;
            }
            const data = await response.json();
            if (data.success == false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            if (data.length > 0) {
                setSelects(prevSelects => prevSelects.slice(0, index + 1).concat([data]));  // Reinicia los selects por debajo del nivel actual
            } else {
                setSelects(prevSelects => prevSelects.slice(0, index + 1));  // Reinicia los selects por debajo del nivel actual
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
            <h1 className="Large-f1_5"> Cadena de resultado | Metas técnicas programáticas </h1>
            <div className='flex jc-space-between gap-1'>
                <div className="flex-grow-1">
                    <select 
                        id='subproyecto'
                        style={{textTransform: 'capitalize'}}
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.subproyecto || isSubmitted ? (errors.subproyecto ? 'invalid' : 'valid') : ''}`} 
                        {...register('subproyecto', { 
                            validate: {
                                required: value => value !== '0' || 'El campo es requerido',
                            }
                        })}
                    >
                        <option value="0">--Seleccione Sub Proyecto--</option>
                        {subproyectos.map((item, index) => (
                            <option 
                                key={index} 
                                value={JSON.stringify({ subProAno: item.subProAno, subProCod: item.subProCod })}
                            > 
                                {item.subProSap + ' - ' + item.subProNom.toLowerCase() + ' | ' + item.proNom.toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.subproyecto ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.subproyecto.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                </div>
                <div>
                    <select 
                        id='metAnoPlaTec'
                        className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields.metAnoPlaTec || isSubmitted ? (errors.metAnoPlaTec ? 'invalid' : 'valid') : ''}`} 
                        {...register('metAnoPlaTec', { 
                            validate: {
                                required: value => value !== '0' || 'El campo es requerido',
                            }
                        })}
                    >
                        <option value="0">--Seleccione un Año--</option>
                        {selectedSubProyecto && Array.from({length: selectedSubProyecto.proPerAnoFin - selectedSubProyecto.proPerAnoIni + 1}, (_, i) => i + Number(selectedSubProyecto.proPerAnoIni)).map(metAnoPlaTec => (
                            <option key={metAnoPlaTec} value={metAnoPlaTec}>{metAnoPlaTec}</option>
                        ))}
                    </select>
                    {errors.metAnoPlaTec ? (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors.metAnoPlaTec.message}</p>
                    ) : (
                        <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                            Espacio reservado para el mensaje de error
                        </p>
                    )}
                </div>
                <div className={`PowerMas_Dropdown_Export Large_3 Large-m_25 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        <a onClick={() => {
                            Export_Excel();
                            setDropdownOpen(false);
                        }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto borde-ayuda">
                <table className="PowerMas_TableStatus ">
                    <thead>
                        <tr style={{zIndex: '1'}}>
                            <th className='center' colSpan={2}></th>
                            <th style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>Código</th>
                            <th colSpan={2}>Nombre</th>
                            {meses.map((mes, i) => (
                                <th className='center' key={i+1}>{mes}</th>
                            ))}
                            <th style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        indicadores.map((item, index) => {
                            const text = item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase();
                            const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;
                            
                            return (
                                <Fragment  key={index}>
                                <tr>
                                    <td>
                                        <div 
                                            className={`pointer bold round p_25 PowerMas_MenuIcon ${expandedIndicators.includes(`${item.indAno}_${item.indCod}`) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                            onClick={() => {
                                                if (expandedIndicators.includes(`${item.indAno}_${item.indCod}`)) {
                                                    setExpandedIndicators(expandedIndicators.filter(indicator => indicator !== `${item.indAno}_${item.indCod}`));
                                                } else {
                                                    setExpandedIndicators([...expandedIndicators, `${item.indAno}_${item.indCod}`]);
                                                }
                                            }}
                                        >
                                            &gt;
                                        </div>
                                    </td>
                                    <td>
                                        <button className='p_25' style={{backgroundColor: 'transparent', border: 'none'}} onClick={() => setAdditionalRows([...additionalRows, { indAno: item.indAno, indCod: item.indCod }])}>+</button>
                                    </td>
                                    <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}>{item.indNum}</td>
                                    {
                                        text.length > 60 ?
                                        <td
                                        colSpan={2}
                                            data-tooltip-id="info-tooltip" 
                                            data-tooltip-content={text} 
                                        >{shortText}</td>
                                        :
                                        <td colSpan={2}>{text}</td>
                                    }
                                    {meses.map((mes, i) => (
                                        <td key={i+1} className='center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                            {formatter.format(Object.entries(totals)
                                                .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}_${String(i+1).padStart(2, '0')}`))
                                                .reduce((sum, [, value]) => sum + value, 0))}
                                        </td>
                                    ))}
                                    <td  className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                        {formatter.format(Object.entries(totals)
                                            .filter(([key]) => key.startsWith(`${item.indAno}_${item.indCod}`) && key.endsWith('_total'))
                                            .reduce((sum, [, value]) => sum + value, 0))}
                                    </td>
                                </tr>
                                {expandedIndicators.includes(`${item.indAno}_${item.indCod}`) && additionalRows.filter(row => row.indAno === item.indAno && row.indCod === item.indCod).map((row, rowIndex) => (
                                    <tr key={`${row.indAno}_${row.indCod}_${rowIndex}`} >
                                        <td ></td>
                                        <td>
                                            <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={() => setAdditionalRows(additionalRows.filter((_, i) => i !== rowIndex))}>-</button>
                                        </td>
                                        <td style={{position: 'sticky', left: '0', backgroundColor: '#fff'}}></td>
                                        <td>
                                            <select 
                                                id={`implementador_${item.indAno}_${item.indCod}_${rowIndex}`}
                                                className={`PowerMas_Input_Cadena f_75 PowerMas_Modal_Form_${dirtyFields[`implementador_${item.indAno}_${item.indCod}_${rowIndex}`] || isSubmitted ? (errors[`implementador_${item.indAno}_${item.indCod}_${rowIndex}`] ? 'invalid' : 'valid') : ''}`} 
                                                {...register(`implementador_${item.indAno}_${item.indCod}_${rowIndex}`, { 
                                                    
                                                })}
                                            >
                                                <option value="0">--Seleccione Implementador--</option>
                                                {implementadoresSelect.map((imp, index) => (
                                                    <option
                                                        className='f_75'
                                                        key={index} 
                                                        value={imp.impCod}
                                                    > 
                                                        {imp.impNom}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                placeholder='Sin ubicación'
                                                className='f_75'
                                                disabled
                                                {...register(`ubicacion_${item.indAno}_${item.indCod}${rowIndex !== undefined ? `_${rowIndex}` : ''}`)}
                                            />
                                            <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={() => {
                                                setIsModalOpen(true);
                                                setEditingRow(`${item.indAno}_${item.indCod}${rowIndex !== undefined ? `_${rowIndex}` : ''}`);
                                            }}>+</button>
                                        </td>
                                        {meses.map((mes, i) => (
                                            <td key={i+1}>
                                                <input
                                                    className={`PowerMas_Input_Cadena Large_12 f_75 PowerMas_Cadena_Form_${dirtyFields[`${item.indAno}_${item.indCod}_${String(i+1).padStart(2, '0')}_${rowIndex}`] || isSubmitted ? (errors[`${item.indAno}_${item.indCod}_${String(i+1).padStart(2, '0')}_${rowIndex}`] ? 'invalid' : 'valid') : ''}`} 
                                                    style={{margin: '0'}}
                                                    onInput={(e) => {
                                                        if (rowIndex !== undefined) {
                                                            const key = `${item.indAno}_${item.indCod}_${String(i+1).padStart(2, '0')}_${rowIndex}`;
                                                            const totalKey = `${item.indAno}_${item.indCod}_${rowIndex}_total`;
                                                            const prevValue = prevValues[key] || 0;
                                                            const newValue = Number(e.target.value);
                                                            setTotals(prevTotals => ({
                                                                ...prevTotals,
                                                                [key]: (prevTotals[key] || 0) - prevValue + newValue,
                                                                [totalKey]: (prevTotals[totalKey] || 0) - prevValue + newValue
                                                            }));
                                                            setPrevValues(prevValues => ({
                                                                ...prevValues,
                                                                [key]: newValue
                                                            }));
                                                        }
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== 'Enter') {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    maxLength={10}
                                                    {...register(`${item.indAno}_${item.indCod}_${String(i+1).padStart(2, '0')}_${rowIndex}`, { 
                                                        pattern: {
                                                            value: /^(?:[1-9]\d*|)$/,
                                                            message: 'Valor no válido',
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: ''
                                                        }
                                                    })}
                                                />
                                            </td>
                                        ))}
                                        <td className='bold center' style={{position: 'sticky', right: '0', backgroundColor: '#fff'}}>
                                            {formatter.format(totals[`${item.indAno}_${item.indCod}_${rowIndex}_total`] || 0) }
                                        </td>
                                    </tr>
                                ))}
                            </Fragment>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='PowerMas_Footer_Box flex flex-column jc-center ai-center p_5 gap_5'>    
                <button 
                    className='PowerMas_Buttom_Primary Large_3 p_5'
                    onClick={handleSubmit(onSubmit)}
                >
                    Grabar
                </button>
            </div>
            <Modal
                ariaHideApp={false}
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                closeTimeoutMS={200}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        width: '80%',
                        height: '50%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            > 
            {isModalOpen && 
                <div className='Large_6 flex flex-column ai-center jc-center flex-grow-1'>
                    <div className='Phone_12 flex-grow-1'>
                        <div className="m_75">
                            <label htmlFor="pais" className="">
                                Pais:
                            </label>
                            <select 
                                id="pais"
                                style={{textTransform: 'capitalize'}}
                                className={`block Phone_12 PowerMas_Modal_Form_${dirtyFields2.pais || isSubmitted2 ? (errors2.pais ? 'invalid' : 'valid') : ''}`} 
                                {...register2('pais', { 
                                    validate: {
                                        required: value => value !== '0' || 'El campo es requerido',
                                    }
                                })}
                            >
                                <option value="0">--Seleccione País--</option>
                                {ubicacionesSelect.map(pais => (
                                    <option 
                                        key={pais.ubiCod} 
                                        value={JSON.stringify({ ubiCod: pais.ubiCod, ubiAno: pais.ubiAno })}
                                    > 
                                        {pais.ubiNom.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors2.pais ? (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid">{errors2.pais.message}</p>
                            ) : (
                                <p className="Large-f_75 Medium-f1 f_75 PowerMas_Message_Invalid" style={{ visibility: "hidden" }}>
                                    Espacio reservado para el mensaje de error
                                </p>
                            )}
                        </div>
                        {selects.map((options, index) => (
                            <div className="m_75" key={index}>
                                <label style={{textTransform: 'capitalize'}} htmlFor={index} className="">
                                    {options[0].ubiTip.toLowerCase()}
                                </label>
                                <select
                                    id={index}
                                    key={index} 
                                    name={`select${index}`} 
                                    onChange={(event) => {
                                        handleCountryChange(event.target.value, index);
                                    }} 
                                    style={{textTransform: 'capitalize'}}
                                    className="block Phone_12"
                                >
                                    <option style={{textTransform: 'capitalize'}} value="0">--Seleccione {options[0].ubiTip.toLowerCase()}--</option>
                                    {options.map(option => (
                                        <option key={option.ubiCod} value={JSON.stringify({ ubiCod: option.ubiCod, ubiAno: option.ubiAno })}>
                                            {option.ubiNom.toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    <button 
                        className='PowerMas_Buttom_Primary Large_6'
                        onClick={handleSubmit2(onSubmit2)}
                    >
                        Guardar
                    </button>
                </div>
            }
            </Modal>
        </div>
    )
}

export default ResultGoal