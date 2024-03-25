import React, { useEffect, useState } from 'react'
import { FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
import { fetchData } from '../reusable/helper';
import { useForm } from 'react-hook-form';

const ResultChain = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [subproyectos, setSubProyectos] = useState([]);
    const [indicadores, setIndicadores] = useState([]);
    const [transformedData, setTransformedData] = useState({});
    const [activeButton, setActiveButton] = useState('Por Año');
    const [initialValues, setInitialValues] = useState({});
    const [headersNew, setHeaders] = useState([]);

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

    useEffect(() => {
        fetchData('SubProyecto',setSubProyectos)
    }, []);
    
    useEffect(() => {
        const subproyecto = watch('subproyecto');
        if (subproyecto && subproyecto !== '0') {
            const { subProAno, subProCod } = JSON.parse(subproyecto);
            fetchData(`Indicador/subproyecto/${subProAno}/${subProCod}`,setIndicadores)
            
            let endpoint;
            switch (activeButton) {
                case 'Por Año':
                    endpoint = `Indicador/cadena/${subProAno}/${subProCod}`;
                    break;
                case 'Por Implementador':
                    endpoint = `Indicador/implementador/${subProAno}/${subProCod}`;
                    break;
                case 'Por Ubicación':
                    endpoint = `Indicador/ubicacion/${subProAno}/${subProCod}`;
                    break;
                default:
                    return;
            }
    
            fetchData(endpoint, (data) => {
                const transformedData = transformData(data, activeButton);
                setTransformedData(transformedData);
            
                // Guardar los valores iniciales
                let newInitialValues = { ...initialValues };  // Copia los valores iniciales existentes
                for (let key in transformedData) {
                    for (let subKey in transformedData[key]) {
                        newInitialValues[`${key}_${subKey}`] = {
                            metTec: transformedData[key][subKey].metTec,
                            metPre: transformedData[key][subKey].metPre
                        };
                    }
                }
                setInitialValues(newInitialValues);  // Guarda los nuevos valores iniciales
            });
        }
    }, [watch('subproyecto'), activeButton]);

    function transformData(data, activeButton) {
        const transformedData = {};
        const newHeaders = [];
    
        data.forEach(item => {
            // Crear la clave única para cada indicador
            const key = `${item.indAno}_${item.indCod}`;
    
            // Si la clave no existe en el objeto transformado, la inicializamos
            if (!transformedData[key]) {
                transformedData[key] = {};
            }
    
            // Determinar la clave y las propiedades en función del botón activo
            let groupKey, metTecProp, metPreProp, registerKey;
            switch (activeButton) {
                case 'Por Año':
                    groupKey = item.cadResPerAno;
                    metTecProp = 'cadResPerMetTec';
                    metPreProp = 'cadResPerMetPre';
                    registerKey = item.cadResPerAno;  // Usar el año para registrar la entrada
                    break;
                case 'Por Implementador':
                    groupKey = item.impNom;
                    metTecProp = 'cadResImpMetTec';
                    metPreProp = 'cadResImpMetPre';
                    registerKey = item.impCod;  // Usar el código del implementador para registrar la entrada
                    break;
                case 'Por Ubicación':
                    groupKey = item.ubiNom;
                    metTecProp = 'cadResUbiMetTec';
                    metPreProp = 'cadResUbiMetPre';
                    registerKey = item.ubiAno + item.ubiCod;  // Usar el año y el código de la ubicación para registrar la entrada
                    break;
                default:
                    return;
            }
    
            // Agregar los datos del grupo al objeto del indicador
            transformedData[key][registerKey] = {
                metTec: item[metTecProp],
                metPre: item[metPreProp]
            };
    
            // Agregar el nombre del grupo a los encabezados si aún no está presente
            if (!newHeaders.includes(groupKey)) {
                newHeaders.push(groupKey);
            }
        });
    
        setHeaders(newHeaders);
        return transformedData;
    }
    
    

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    // Obtén todos los años únicos de los datos
    const headers = [...new Set(Object.values(transformedData).flatMap(obj => Object.keys(obj)))];


    switch (activeButton) {
        case 'Por Año':
            break;
        case 'Por Implementador':
            break;
        case 'Por Ubicación':
            break;
        default:
            return;
    }

    const onSubmit = (data) => {
        delete data.subproyecto;
        console.log(data)
        // Crear los arreglos para almacenar los cambios
        let cambiosPorAno = [];
        let cambiosPorImplementador = [];
        let cambiosPorUbicacion = [];
        
        // Iterar sobre los datos del formulario
        for (let key in data) {
            // Obtener el valor inicial y el valor actual de la celda
            let valorInicial = initialValues[key].metTec;
            let valorActual = data[key];
    
            // Si el valor ha cambiado, agregar el cambio al arreglo correspondiente
            if (valorInicial !== valorActual) {
                // Obtener la parte de la clave que corresponde al 'ano', 'implementador' o 'ubicacion'
                let keyParts = key.split('_');
                let indAno = keyParts[0];
                let indCod = keyParts[1];
                let keyType = keyParts[2];
    
                let cambio = {
                    indAno: indAno,
                    indCod: indCod,
                };
    
                if (keyType.length === 4) {  // Si la longitud es 4, entonces es un 'ano'
                    cambio.cadResPerAno = keyType;
                    cambio.cadResPerMetTec = valorActual;
                    cambio.cadResPerMetPre = initialValues[key].metPre;
                    cambiosPorAno.push(cambio);
                } else if (keyType.length === 2) {  // Si la longitud es 2, entonces es un 'implementador'
                    cambio.impCod = keyType;
                    cambio.cadResImpMetTec = valorActual;
                    cambio.cadResImpMetPre = initialValues[key].metPre;
                    cambiosPorImplementador.push(cambio);
                } else if (keyType.length === 10) {  // Si la longitud es 10, entonces es una 'ubicacion'
                    cambio.ubiAno = keyType.substring(0, 4);
                    cambio.ubiCod = keyType.substring(4);
                    cambio.cadResUbiMetTec = valorActual;
                    cambio.cadResUbiMetPre = initialValues[key].metPre;
                    cambiosPorUbicacion.push(cambio);
                }
            }
        }
    
        const CadenaIndicadorDto = {
            CadenaPeriodos: cambiosPorAno,
            CadenaImplementadores: cambiosPorImplementador,
            CadenaUbicaciones: cambiosPorUbicacion
        }
    
        console.log(CadenaIndicadorDto);
    };
    
    
    

    return (
        <div className='p1 flex flex-column flex-grow-1 overflow-auto'>
            <h1 className="Large-f1_5"> Cadena de resultado </h1>
            <div className='flex jc-space-between'>
                <div className="m_25 flex-grow-1">
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
                <div className={`PowerMas_Dropdown_Export Large_3 Large-m_25 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        {true &&
                            <a onClick={() => {
                                Export_PDF();
                                setDropdownOpen(false);
                            }} className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                        }
                        {true &&
                            <a onClick={() => {
                                Export_Excel();
                                setDropdownOpen(false);
                            }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                        }
                    </div>
                </div>
            </div>
            <div>
                <button 
                    className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'Por Año' ? 'Active' : ''}`} 
                    onClick={() => setActiveButton('Por Año')}
                >Por Año</button>
                <button 
                    className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'Por Implementador' ? 'Active' : ''}`} 
                    onClick={() => setActiveButton('Por Implementador')}
                >Por Implementador</button>
                <button 
                    className={`PowerMas_Buttom_Tab PowerMas_Buttom_Tab_${activeButton === 'Por Ubicación' ? 'Active' : ''}`} 
                    onClick={() => setActiveButton('Por Ubicación')}
                >Por Ubicación</button>
            </div>
            <div className="PowerMas_TableContainer flex-column overflow-auto">
                <table className="PowerMas_TableStatus">
                <thead>
    <tr>
        <th>#</th>
        <th>Proyecto</th>
        <th>Código</th>
        <th>Nombre</th>
        {headersNew.map(header => <th key={header}>{header}</th>)}
    </tr>
</thead>

                    <tbody>
                        {
                        indicadores.map((item, index) => {
                            const indicatorData = transformedData[`${item.indAno}_${item.indCod}`] || {};
                            const text = item.indNom.charAt(0).toUpperCase() + item.indNom.slice(1).toLowerCase();
                            const shortText = text.length > 100 ? text.substring(0, 100) + '...' : text;

                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td style={{textTransform: 'capitalize'}}>{item.proNom.toLowerCase()}</td>
                                    <td>{item.indNum}</td>
                                    {
                                        text.length > 100 ?
                                        <td 
                                            data-tooltip-id="info-tooltip" 
                                            data-tooltip-content={text} 
                                        >{shortText}</td>
                                        :
                                        <td>{text}</td>
                                    }
                                    {headers.map(key => {
                                        return(
                                        <td key={key}>
                                            <input
                                                className={`Large_12 f_75 PowerMas_Cadena_Form_${dirtyFields[`${item.indAno}_${item.indCod}_${key}`] || isSubmitted ? (errors[`${item.indAno}_${item.indCod}_${key}`] ? 'invalid' : 'valid') : ''}`} 
                                                {...register(`${item.indAno}_${item.indCod}_${key}`, {
                                                    pattern: {
                                                        value: /^(?:[1-9]\d*|)$/,
                                                        message: 'Valor no válido'
                                                    }
                                                })}
                                                defaultValue={indicatorData[key]?.metTec || ''}
                                            />
                                        </td>
                                    )})}
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='flex jc-center'>
                <button 
                    className='PowerMas_Buttom_Primary Large_3'
                    onClick={handleSubmit(onSubmit)}
                >
                    Grabar
                </button>
            </div>
        </div>
    )
}

export default ResultChain