import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { Export_Excel_Helper, Export_PDF_Helper, fetchDataBlock } from '../../components/reusable/helper'
import { formatter, formatterBudget } from '../../components/monitoring/goal/helper'
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
import Search from '../../icons/Search';
import Expand from '../../icons/Expand';
import IconCalendar from '../../icons/IconCalendar';
import useDateRange from '../../hooks/useDateRange';

const smallPageSizes = [10, 20, 30, 50];
const largePageSizes = [100, 200, 300, 500];

const handleInput = (event) => {
    // Permite solo números y un guion en el formato MM-YYYY
    event.target.value = event.target.value.replace(/[^0-9-]/g, '');

    // Limita la longitud del input para que no exceda el formato MM-YYYY
    if (event.target.value.length > 7) {
        event.target.value = event.target.value.slice(0, 7);
    }
};

const getIndicatorStatus = (metas) => {
    let statusColor = '';
    let statusName = '';
    let statusCode = '';
    if (metas.some(meta => meta.estCod === '04')) {
        statusName = metas.find(meta => meta.estCod === '04').estNom;
        statusColor = metas.find(meta => meta.estCod === '04').estCol;
        statusCode = '04';
    }
    else if (metas.some(meta => meta.estCod === '02')) {
        statusName = metas.find(meta => meta.estCod === '02').estNom;
        statusColor = metas.find(meta => meta.estCod === '02').estCol;
        statusCode = '02';
    }
    else if (metas.some(meta => meta.estCod === '01')) {
        statusName =  metas.find(meta => meta.estCod === '01').estNom;
        statusColor = metas.find(meta => meta.estCod === '01').estCol;
        statusCode = '01';
    }
    else if (metas.every(meta => meta.estCod === '03')) {
        statusName = metas.find(meta => meta.estCod === '03').estNom;
        statusColor = metas.find(meta => meta.estCod === '03').estCol;
        statusCode = '03';
    }
    else {
        statusName = 'ESTADO DESCONOCIDO';
        // Puedes asignar un color por defecto para 'ESTADO DESCONOCIDO'
        statusColor = '#000000'; 
        statusCode = '0';
    }
    return { statusName, statusColor, statusCode };
};



const Table = ({setModalIsOpen, setModalConfirmIsOpen}) => {
    const navigate = useNavigate();

    const [ metas, setMetas ] = useState([])
    const [ expandedRes, setExpandedRes ] = useState([])
    const [ expandedInd, setExpandedInd ] = useState([])
    const  [totals, setTotals ] = useState({
        totalMetTec: 0,
        totalEjeTec: 0,
        totalMetPre: 0,
        totalEjePre: 0,
    });

    const [ dropdownOpen, setDropdownOpen ] = useState(false);
    const [ searchTags, setSearchTags] = useState([]);
    const [ isInputEmpty, setIsInputEmpty] = useState(true);
    const [ inputValue, setInputValue] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [totalPages, setTotalPages] = useState(0);

    const {
        periodoInicio,
        setPeriodoInicio,
        periodoFin,
        setPeriodoFin,
        handlePeriodoChange,
    } = useDateRange();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    };
    
    const goToPreviousPage = () => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    };
    
    const goToFirstPage = () => {
        setCurrentPage(1);
    };
    
    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    useEffect(() => {
        const tagsParam = searchTags.length > 0 ? searchTags.join(',') : null;
        const periodoInicioParam = periodoInicio ? periodoInicio : null;
        const periodoFinParam = periodoFin ? periodoFin : null;
        const url = `Monitoreo/Filter/${tagsParam}/${periodoInicioParam}/${periodoFinParam}`;
        fetchDataBlock(url, (data) => {
            setMetas(data);
            setTotalPages(Math.ceil(data.length / pageSize));
        }, '.table-monitoring');
    }, [searchTags, periodoInicio, periodoFin]);

    useEffect(() => {
        setTotalPages(Math.ceil(metas.length / pageSize));
    }, [metas, pageSize]);
    

    const groupedMetas = useMemo(() => {
        setTotals({
            totalMetTec: 0,
            totalEjeTec: 0,
            totalMetPre: 0,
            totalEjePre: 0,
        });
        const paginatedData = metas.slice(startIndex, endIndex);
    
        const grouped = paginatedData.reduce((grouped, meta) => {
            const key = `res_${meta.resAno}_${meta.resCod}`
            if (!grouped[key]) {
                grouped[key] = { metas: [], resNom: meta.resNom, resNum: meta.resNum, totalMetTec: 0 , totalEjeTec: 0, totalMetPre: 0 , totalEjePre: 0 }
            }
            // Evalúa metMetTec y metEjeTec como operaciones, si es posible
            let metMetTec = Number(meta.metMetTec);
            let metEjeTec = Number(meta.metEjeTec);
            let metMetPre = Number(meta.metMetPre);
            let metEjePre = Number(meta.metEjePre);
            
            if (isNaN(metMetTec)) {
                metMetTec = eval(meta.metMetTec);
            }
            if (isNaN(metEjeTec)) {
                metEjeTec = eval(meta.metEjeTec);
            }
            if (isNaN(metMetPre)) {
                metMetPre = eval(meta.metMetPre);
            }
            if (isNaN(metEjePre)) {
                metEjePre = eval(meta.metEjePre);
            }
            // Agrega la meta al array, pero con metMetTec y metEjeTec evaluados como operaciones
            grouped[key].metas.push({...meta, metMetTec, metEjeTec, metMetPre, metEjePre})
            grouped[key].totalMetTec += metMetTec;
            grouped[key].totalEjeTec += metEjeTec;
            grouped[key].totalMetPre += metMetPre;
            grouped[key].totalEjePre += metEjePre;
        
            // Actualiza los totales
            setTotals(totals => ({
                totalMetTec: totals.totalMetTec + metMetTec,
                totalEjeTec: totals.totalEjeTec + metEjeTec,
                totalMetPre: totals.totalMetPre + metMetPre,
                totalEjePre: totals.totalEjePre + metEjePre,
            }));
        
            return grouped;
        }, {});
    
        // Obtenemos todas las claves de los resultados
        const allKeys = Object.keys(grouped);
    
        // Asignamos todas las claves a expandedRes
        setExpandedRes(allKeys);
    
        return grouped;
    }, [metas, startIndex, endIndex]);
    

    const currentRecords = Object.entries(groupedMetas);

    const Register_Beneficiarie = (meta) => {
        const id = `${meta.metAno}${meta.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        setModalConfirmIsOpen(safeCiphertext)
    }

    const Register_Execution = (meta) => {
        const id = `${meta.metAno}${meta.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-goal-execution/${safeCiphertext}`);
    }


    // Añade una nueva etiqueta al presionar Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue && !searchTags.includes(inputValue)) {
            setSearchTags(prevTags => [...prevTags, inputValue]);
            setInputValue('');  // borra el valor del input
            setIsInputEmpty(true);
        } else if (e.key === 'Backspace' && isInputEmpty && searchTags.length > 0) {
            setSearchTags(prevTags => prevTags.slice(0, -1));
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);  // actualiza el valor del input
        setIsInputEmpty(e.target.value === '');
    }

    // Elimina una etiqueta
    const removeTag = (tag) => {
        setSearchTags(searchTags.filter(t => t !== tag));
    }

    const dataExport = metas;
    const headers = ['ESTADO','TÉCNICO','IMPLEMENTADOR','UBICACIÓN','AÑO','MES','META_PROGRAMATICA', 'EJECUCION_PROGRAMATICA', 'PORCENTAJE_AVANCE_PROGRAMATICO', 'META_PRESUPUESTO', 'EJECUCION_PRESUPUESTO', 'PORCENTAJE_AVANCE_PRESUPUESTO','INDICADOR','TIPO_INDICADOR','RESULTADO','OBJETIVO_ESPECIFICO','OBJETIVO','SUBPROYECTO','PROYECTO','USUARIO_MODIFICADO','FECHA_MODIFICADO'];  // Tus encabezados
    const title = 'METAS';
    const properties = ['estNom','usuNom','impNom','ubiNom','metAnoPlaTec','metMesPlaTec','metMetTec', 'metEjeTec', 'metPorAvaTec', 'metMetPre', 'metEjePre', 'metPorAvaPre', 'indNom', 'tipInd', 'resNom', 'objEspNom', 'objNom', 'subProNom', 'proNom', 'usuMod', 'fecMod'];  // Las propiedades de los objetos de datos que quieres incluir en el Excel
    const format = [1200, 600];

    const Export_Excel = () => {
        // Primero, crea una copia de los datos que quieres exportar
        const dataCopy = JSON.parse(JSON.stringify(dataExport));
    
        // Luego, recorre cada elemento en los datos y evalúa metMetTec y metEjeTec como operaciones
        dataCopy.forEach(item => {
            let metMetTec = Number(item.metMetTec);
            let metEjeTec = Number(item.metEjeTec);
            if (isNaN(metMetTec)) {
                metMetTec = eval(item.metMetTec);
            }
            if (isNaN(metEjeTec)) {
                metEjeTec = eval(item.metEjeTec);
            }
            item.metMetTec = metMetTec;
            item.metEjeTec = metEjeTec;
        });
    
        // Finalmente, pasa los datos modificados a la función Export_Excel_Helper
        Export_Excel_Helper(dataCopy, headers, title, properties);
    };
    
    const Export_PDF = () => {
        // Primero, crea una copia de los datos que quieres exportar
        const dataCopy = JSON.parse(JSON.stringify(dataExport));
    
        // Luego, recorre cada elemento en los datos y evalúa metMetTec y metEjeTec como operaciones
        dataCopy.forEach(item => {
            let metMetTec = Number(item.metMetTec);
            let metEjeTec = Number(item.metEjeTec);
            if (isNaN(metMetTec)) {
                metMetTec = eval(item.metMetTec);
            }
            if (isNaN(metEjeTec)) {
                metEjeTec = eval(item.metEjeTec);
            }
            item.metMetTec = metMetTec;
            item.metEjeTec = metEjeTec;
        });
        // Luego puedes llamar a la función Export_Excel de esta manera:
        Export_PDF_Helper(dataCopy, headers, title, properties, format);
    };


    return (
        <div className='TableMainContainer Large-p1 table-monitoring'>
            <div className='flex gap_25'>
                <div className="PowerMas_Search_Container flex-grow-1">
                    <div className="PowerMas_Input_Filter_Container flex">
                        <div className="flex ai-center">
                            {searchTags && searchTags.map(tag => (
                                <span key={tag} className="PowerMas_InputTag flex ai-center jc-center p_25 gap_5">
                                    <span className="f_75 flex ai-center">{tag}</span>
                                    <button className="f1 bold p0" onClick={() => removeTag(tag)}>x</button>
                                </span>
                            ))}
                        </div>
                        <div className="Phone_12 relative">
                            <Search />
                            <input 
                                className='PowerMas_Input_Filter Large_12 Large-p_5 m0'
                                type="search"
                                placeholder='Buscar'
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                value={inputValue}
                            />
                        </div>
                    </div>
                </div>
                <span className='flex ai-center'>
                    |   
                </span>
                <div style={{border: '1px solid #F7CEAD', borderRadius: '5px'}} className="Phone_2 flex ai-center relative">
                    <span className='flex' style={{position: 'absolute', left: 15}}>
                        <IconCalendar />
                    </span>
                    <input 
                        className='PowerMas_Input_Filter Large_12 Large-p_5 m0'
                        type="text"
                        placeholder='MM-YYYY'
                        onInput={handleInput}
                        onKeyDown={handlePeriodoChange(setPeriodoInicio)}
                        maxLength={7}
                    />
                </div>
                <span className='flex ai-center'>
                    -
                </span>
                <div style={{border: '1px solid #F7CEAD', borderRadius: '5px'}} className="Phone_2 flex ai-center relative">
                    <span className='flex' style={{position: 'absolute', left: 15}}>
                        <IconCalendar />
                    </span>
                    <input 
                        className='PowerMas_Input_Filter Large_12 Large-p_5 m0'
                        type="text"
                        placeholder='MM-YYYY'
                        onInput={handleInput}
                        onKeyDown={handlePeriodoChange(setPeriodoFin)}
                        maxLength={7}
                    />
                </div>
                <div className={`PowerMas_Dropdown_Export Large_2 ${dropdownOpen ? 'open' : ''}`}>
                    <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>
                        Exportar
                        <span className='flex'>
                            <Expand />
                        </span>
                    </button>
                    <div className="PowerMas_Dropdown_Export_Content Phone_12">
                        <a 
                            onClick={() => {
                                Export_PDF();
                                setDropdownOpen(false);
                            }} 
                            className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                        <a 
                            onClick={() => {
                                Export_Excel();
                                setDropdownOpen(false);
                            }} 
                            className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                    </div>
                </div>
            </div>
            <div className='PowerMas_TableContainer'>
                {
                    currentRecords.length > 0 ?
                    <table className='PowerMas_Table_Monitoring Phone_12'>
                        <thead>
                            <tr className='center'>
                                <th></th>
                                <th>Estado</th>
                                <th>FFVV</th>
                                <th>Añadir</th>
                                <th>Técnico</th>
                                <th>Implementador</th>
                                <th>Ubicación</th>
                                <th>Periodo</th>
                                <th style={{color: 'var(--naranja-ayuda)'}}>Meta Programática</th>
                                <th style={{color: 'var(--naranja-ayuda)'}}>Ejecución Programática</th>
                                <th style={{color: 'var(--naranja-ayuda)'}}>% Avance Programático</th>
                                <th style={{color: 'var(--turquesa)'}}>Meta Presupuesto</th>
                                <th style={{color: 'var(--turquesa)'}}>% Avance Presupuesto</th>
                                <th style={{color: 'var(--turquesa)'}}>Ejecución Presupuesto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(([key, { metas, resNom, resNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre }]) => {
                                const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                const text = resNum + ' - ' + resNom;
                                const shortText = text.length > 80 ? text.substring(0, 80) + '...' : text;

                                const {statusName, statusColor} = getIndicatorStatus(metas);
                                return (
                                <Fragment key={key}>
                                    <tr className='' style={{backgroundColor: '#F3F3F3'}}>
                                        <td>
                                            <div 
                                                className={`pointer bold round p_25 PowerMas_MenuIcon ${expandedRes.includes(key) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                                onClick={() => {
                                                    if (expandedRes.includes(key)) {
                                                        setExpandedRes(expandedRes.filter(indicator => indicator !== key));
                                                    } else {
                                                        setExpandedRes([...expandedRes, key]);
                                                    }
                                                }}
                                            > &gt; </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="bold" style={{ color: statusColor, whiteSpace: 'nowrap' }}>
                                                {statusName}
                                            </div>
                                        </td>
                                        <td colSpan={6}>
                                            <span 
                                                data-tooltip-id="info-tooltip" 
                                                data-tooltip-content={text} 
                                            >{shortText}</span>
                                        </td>
                                        <td className='center'>{formatter.format(totalMetTec)}</td>
                                        <td className='center'>{formatter.format(totalEjeTec)}</td>
                                        <td>
                                            <div className="flex flex-column">
                                                <div className="center bold" style={{color: statusColor}}>
                                                    {formatterBudget.format(totalPorAvaTec)}%
                                                </div>
                                                <div 
                                                    className="progress-bar"
                                                    style={{backgroundColor: '#d3d3d3', border: `0px solid ${statusColor}`}}
                                                >
                                                    <div 
                                                        className="progress-bar-fill" 
                                                        style={{width: `${totalPorAvaTec > 100 ? 100 : totalPorAvaTec}%`, backgroundColor: statusColor}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='center'>{formatterBudget.format(totalMetPre)}</td>
                                        <td className='center'>{formatterBudget.format(totalEjePre)}</td>
                                        <td>
                                            <div className="flex flex-column">
                                                <div className="center bold" style={{color: statusColor}}>
                                                    {formatterBudget.format(totalPorAvaPre)}%
                                                </div>
                                                <div 
                                                    className="progress-bar"
                                                    style={{backgroundColor: '#d3d3d3', border: `0px solid ${statusColor}`}}
                                                >
                                                    <div 
                                                        className="progress-bar-fill" 
                                                        style={{width: `${totalPorAvaPre > 100 ? 100 : totalPorAvaPre}%`, backgroundColor: statusColor}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='center' colSpan={2}></td>
                                    </tr>
                                    {expandedRes.includes(key) && Object.entries(metas.reduce((grouped, meta) => {
                                        const key = `ind_${meta.indAno}_${meta.indCod}`
                                        if (!grouped[key]) {
                                            grouped[key] = { metas: [], indNom: meta.indNom, indNum: meta.indNum, totalMetTec: 0 , totalEjeTec: 0, totalMetPre: 0 , totalEjePre: 0 }
                                        }
                                        grouped[key].metas.push(meta)
                                        grouped[key].totalMetTec += Number(meta.metMetTec)
                                        grouped[key].totalEjeTec += Number(meta.metEjeTec)
                                        grouped[key].totalMetPre += Number(meta.metMetPre)
                                        grouped[key].totalEjePre += Number(meta.metEjePre)
                                        return grouped
                                    }, {})).map(([key, { metas: subMetas, indNom, indNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre }]) => {
                                        const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                        const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                        const text = indNum + ' - ' + indNom;
                                        const shortText = text.length > 80 ? text.substring(0, 80) + '...' : text;

                                        const {statusName, statusColor} = getIndicatorStatus(subMetas);
                                        return (
                                        <Fragment key={key}>
                                            <tr className='' style={{color: '#69625F'}}>
                                                <td></td>
                                                <td>
                                                    <div 
                                                        className={`pointer bold round p_25 PowerMas_MenuIcon ${expandedInd.includes(key) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                                        onClick={() => {
                                                            if (expandedInd.includes(key)) {
                                                                setExpandedInd(expandedInd.filter(indicator => indicator !== key));
                                                            } else {
                                                                setExpandedInd([...expandedInd, key]);
                                                            }
                                                        }}
                                                    > &gt; </div>
                                                </td>
                                                <td>
                                                    <div className="bold" style={{ color: statusColor, whiteSpace: 'nowrap' }}>
                                                        {statusName}
                                                    </div>
                                                </td>
                                                <td className='' colSpan={6}>
                                                    <span 
                                                        data-tooltip-id="info-tooltip" 
                                                        data-tooltip-content={text} 
                                                    >{shortText}</span>
                                                </td>
                                                <td className='center'>{formatter.format(totalMetTec)}</td>
                                                <td className='center'>{formatter.format(totalEjeTec)}</td>
                                                <td>
                                                    <div className="flex flex-column">
                                                        <div className="center bold" style={{color: statusColor}}>
                                                            {formatterBudget.format(totalPorAvaTec)}%
                                                        </div>
                                                        <div 
                                                            className="progress-bar"
                                                            style={{backgroundColor: '#d3d3d3', border: `0px solid ${statusColor}`}}
                                                        >
                                                            <div 
                                                                className="progress-bar-fill" 
                                                                style={{width: `${totalPorAvaTec > 100 ? 100 : totalPorAvaTec}%`, backgroundColor: statusColor}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='center'>{formatterBudget.format(totalMetPre)}</td>
                                                <td className='center'>{formatterBudget.format(totalEjePre)}</td>
                                                <td>
                                                    <div className="flex flex-column">
                                                        <div className="center bold" style={{color: statusColor}}>
                                                            {formatterBudget.format(totalPorAvaPre)}%
                                                        </div>
                                                        <div 
                                                            className="progress-bar"
                                                            style={{backgroundColor: '#d3d3d3', border: `0px solid ${statusColor}`}}
                                                        >
                                                            <div 
                                                                className="progress-bar-fill" 
                                                                style={{width: `${totalPorAvaPre > 100 ? 100 : totalPorAvaPre}%`, backgroundColor: statusColor}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='center' colSpan={2}></td>
                                            </tr>
                                            {expandedInd.includes(key) && subMetas.map((meta, index) => {
                                                const mesPeriodo = meta.metMesPlaTec ? (new Date(2024, meta.metMesPlaTec - 1).toLocaleString('es-ES', { month: 'short' })) : '';
                                                
                                                
                                                return (
                                                <tr key={index} style={{color: '#372e2ca6', visibility: expandedInd.includes(key) ? 'visible' : 'collapse'}}>
                                                    <td></td>
                                                    <td></td>
                                                            <td>
                                                                <div className="bold" style={{ color: meta.estCol, whiteSpace: 'nowrap' }}>
                                                                    {meta.estNom}
                                                                </div>
                                                            </td>
                                                    <td>
                                                        <div className="flex jc-center ai-center" >
                                                            <button  
                                                                className="PowerMas_Add_Beneficiarie f_75 flex-grow-1" 
                                                                style={{padding: '0.25rem 0.75rem'}}
                                                                onClick={() => setModalIsOpen(meta)}
                                                            >
                                                                FFVV
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex jc-center ai-center" >
                                                        {
                                                            meta.uniInvPer === 'S' ?
                                                            <button  
                                                                className="PowerMas_Add_Beneficiarie f_75 flex-grow-1" 
                                                                onClick={() => Register_Beneficiarie(meta)}
                                                            >
                                                                Beneficiario
                                                            </button> :
                                                            <button  
                                                                className="PowerMas_Add_Execution f_75 p_25 flex-grow-1" 
                                                                onClick={() => Register_Execution(meta)}
                                                            >
                                                                Ejecución
                                                            </button>
                                                        }
                                                        </div>
                                                    </td>
                                                    <td>{meta.usuNom + ' ' + meta.usuApe}</td>
                                                    <td>{meta.impNom}</td>
                                                    <td>{meta.ubiNom}</td>
                                                    <td>{mesPeriodo.toUpperCase() + ' - ' + meta.metAnoPlaTec}</td>
                                                    <td className='center'>{formatter.format(meta.metMetTec)}</td>
                                                    <td className='center'>{formatter.format(meta.metEjeTec)}</td>
                                                    <td>
                                                        <div className="flex flex-column">
                                                            <div className="center bold" style={{color: meta.estCol}}>
                                                                {formatterBudget.format(meta.metPorAvaTec)}%
                                                            </div>
                                                            <div 
                                                                className="progress-bar"
                                                                style={{backgroundColor: '#d3d3d3', border: `0px solid ${meta.estCol}`}}
                                                            >
                                                                <div 
                                                                    className="progress-bar-fill" 
                                                                    style={{width: `${meta.metPorAvaTec > 100 ? 100 : meta.metPorAvaTec}%`, backgroundColor: meta.estCol}}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='center'>{formatterBudget.format(meta.metMetPre)}</td>
                                                    <td className='center'>{formatterBudget.format(meta.metEjePre)}</td>
                                                    <td>
                                                        <div className="flex flex-column">
                                                            <div className="center bold" style={{color: meta.estCol}}>
                                                                {formatterBudget.format(meta.metPorAvaPre)}%
                                                            </div>
                                                            <div 
                                                                className="progress-bar"
                                                                style={{backgroundColor: '#d3d3d3', border: `0px solid ${meta.estCol}`}}
                                                            >
                                                                <div 
                                                                    className="progress-bar-fill" 
                                                                    style={{width: `${meta.metPorAvaPre > 100 ? 100 : meta.metPorAvaPre}%`, backgroundColor: meta.estCol}}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                </tr>
                                            )})}
                                        </Fragment>
                                    )})}
                                </Fragment>
                            )})}
                                <tr className='PowerMas_Totales_Monitoreo bold'>
                                    <td colSpan={8} ></td>
                                    <td style={{textAlign: 'right'}}>Totales:</td>
                                    <td>{formatter.format(totals.totalMetTec)}</td>
                                    <td>{formatter.format(totals.totalEjeTec)}</td>
                                    <td>{(totals.totalEjeTec !== 0 ? (formatterBudget.format((totals.totalEjeTec/totals.totalMetTec)*100)) : 0)}%</td>
                                    <td>{formatterBudget.format(totals.totalMetPre)} €</td>
                                    <td>{formatterBudget.format(totals.totalEjePre)} €</td>
                                    <td>{(totals.totalMetPre !== 0 ? (formatterBudget.format((totals.totalEjePre/totals.totalMetPre)*100)) : 0)}%</td>
                                    <td colSpan={50}></td>
                                </tr>
                        </tbody>
                    </table>
                    :
                    <div className='Phone_12 flex flex-column ai-center jc-center'>
                        <img src={TableEmpty} alt="TableEmpty" className='Medium_6 Phone_12' />
                        <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                    </div>
                }
            </div>
            <div className="PowerMas_Pagination Large_12 flex column jc-space-between ai-center Large-p_5">
                <div className="todo">
                    <div className="todo">
                        <button onClick={goToFirstPage} disabled={currentPage === 1}>{"<<"}</button>
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>{"<"}</button>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>{">"}</button> 
                        <button onClick={goToLastPage} disabled={currentPage === totalPages}>{">>"}</button>
                    </div>
                </div>
                <div>
                    <select 
                        className="p_5"
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);  // resetea la página actual a 1 cuando se cambia el tamaño de la página
                        }}
                    > 
                        {largePageSizes.map(pageSize => {
                            return  <option key={pageSize} value={pageSize}> 
                                        {pageSize} 
                                    </option>;
                        })}
                    </select>
                </div>
                <div>
                    <p>
                        Mostrando {startIndex + 1} a {Math.min(endIndex, metas.length)} de {metas.length} registros
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Table
