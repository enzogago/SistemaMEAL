import React, { useState, Fragment, useMemo } from 'react'
import { formatter, formatterBudget } from '../../components/monitoring/goal/helper'
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';
import TriangleIcon from '../../icons/TriangleIcon';

// Esta función recibe un array de metas y devuelve el estado del indicador
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


const getResultStatus = (indicadores) => {
    let statusName = '';
    let statusColor = '';
    if (indicadores.some(indicador => {
        const status = getIndicatorStatus(indicador.metas);
        
        if (status.statusCode === '04') {
            statusName = status.statusName;
            statusColor = status.statusColor;
            return true;
        }
        return false;
    })) {
        // No necesitamos hacer nada aquí porque ya hemos asignado statusName y statusColor
    } else if (indicadores.some(indicador => {
        const status = getIndicatorStatus(indicador.metas);
        if (status.statusCode === '02') {
            statusName = status.statusName;
            statusColor = status.statusColor;
            return true;
        }
        return false;
    })) {
        // No necesitamos hacer nada aquí porque ya hemos asignado statusName y statusColor
    } else if (indicadores.some(indicador => {
        const status = getIndicatorStatus(indicador.metas);
        if (status.statusCode === '01') {
            statusName = status.statusName;
            statusColor = status.statusColor;
            return true;
        }
        return false;
    })) {
        // No necesitamos hacer nada aquí porque ya hemos asignado statusName y statusColor
    } else if (indicadores.every(indicador => {
        const status = getIndicatorStatus(indicador.metas);
        if (status.statusCode === '03') {
            statusName = status.statusName;
            statusColor = status.statusColor;
            return true;
        }
        return false;
    })) {
        // No necesitamos hacer nada aquí porque ya hemos asignado statusName y statusColor
    } else {
        statusName = 'ESTADO DESCONOCIDO';
        // Puedes asignar un color por defecto para 'ESTADO DESCONOCIDO'
        statusColor = '#000000'; 
    }
    return { statusName, statusColor };
};


const Table = ({data}) => {
    const [ expandedRes, setExpandedRes ] = useState([]);
    const [ expandedSubPro, setExpandedSubPro ] = useState([]);

    const  [totals, setTotals ] = useState({
        totalMetTec: 0,
        totalEjeTec: 0,
        totalMetPre: 0,
        totalEjePre: 0,
    });

    const groupMetasIntoIndicators = (metas) => {
        return metas.reduce((grouped, meta) => {
            const key = `ind_${meta.indAno}_${meta.indCod}`
            if (!grouped[key]) {
                grouped[key] = { metas: [], ...meta, totalMetTec: 0 , totalEjeTec: 0, totalMetPre: 0 , totalEjePre: 0 }
            }

            let metMetTec = Number(meta.metMetTec);
            let metEjeTec = Number(meta.metEjeTec);
            let metMetPre = Number(meta.metMetPre);
            let metEjePre = Number(meta.metEjePre);

            grouped[key].metas.push({...meta, metMetTec, metEjeTec, metMetPre, metEjePre})
            grouped[key].totalMetTec += metMetTec;
            grouped[key].totalEjeTec += metEjeTec;
            grouped[key].totalMetPre += metMetPre;
            grouped[key].totalEjePre += metEjePre;
    
            const { statusName, statusColor } = getIndicatorStatus(grouped[key].metas);
            // Asignamos el estado al indicador
            grouped[key].estNom = statusName;
            grouped[key].estCol = statusColor;
    
            return grouped
        }, {});
    };
    

    const groupedMetas = useMemo(() => {
        setTotals({
            totalMetTec: 0,
            totalEjeTec: 0,
            totalMetPre: 0,
            totalEjePre: 0,
        });
    
        // Primero, agrupamos las metas en indicadores
        const groupedIndicators = groupMetasIntoIndicators(data);
    
        const groupedResults =  Object.entries(groupedIndicators).reduce((grouped, [key, indicador]) => {
            const resKey = `res_${indicador.resAno}_${indicador.resCod}`
            let name, number;

            switch(indicador.indTipInd) {
                case 'IIN':
                    name = indicador.subProNom;
                    number = indicador.subProSap;
                    break;
                case 'IOB':
                    name = indicador.objNom;
                    number = indicador.objNum;
                    break;
                case 'IOE':
                    name = indicador.objEspNom;
                    number = indicador.objEspNum;
                    break;
                default:
                    name = indicador.resNom;
                    number = indicador.resNum;
            }

            if (!grouped[resKey]) {
                grouped[resKey] = { resKey, indicadores: [], ...indicador, name, number, totalMetTec: 0, totalEjeTec: 0, totalMetPre: 0, totalEjePre: 0 }
            }
    
            grouped[resKey].indicadores.push(indicador);
            grouped[resKey].totalMetTec += Number(indicador.totalMetTec)
            grouped[resKey].totalEjeTec += Number(indicador.totalEjeTec)
            grouped[resKey].totalMetPre += Number(indicador.totalMetPre)
            grouped[resKey].totalEjePre += Number(indicador.totalEjePre)
    
            const { statusName, statusColor } = getResultStatus(grouped[resKey].indicadores);
            // Asignamos el estado al resultado
            grouped[resKey].estNom = statusName;
            grouped[resKey].estCol = statusColor;
    
            return grouped
        }, {});

        const allResultKeys = Object.values(groupedResults).flatMap(result => result.resKey);
        setExpandedRes(allResultKeys);

        // Finalmente, agrupamos los resultados en subproyectos
        const groupedSubProjects = Object.entries(groupedResults).reduce((grouped, [key, resultado]) => {
            const subProKey = `subPro_${resultado.subProAno}_${resultado.subProCod}`
            if (!grouped[subProKey]) {
                grouped[subProKey] = { subProKey, resultados: [], subProNom: resultado.subProNom, subProSap: resultado.subProSap, totalMetTec: 0, totalEjeTec: 0, totalMetPre: 0, totalEjePre: 0 }
            }

            grouped[subProKey].resultados.push(resultado);
            grouped[subProKey].totalMetTec += Number(resultado.totalMetTec)
            grouped[subProKey].totalEjeTec += Number(resultado.totalEjeTec)
            grouped[subProKey].totalMetPre += Number(resultado.totalMetPre)
            grouped[subProKey].totalEjePre += Number(resultado.totalEjePre)

            // Actualiza los totales
            setTotals(totals => ({
                totalMetTec: totals.totalMetTec + Number(resultado.totalMetTec),
                totalEjeTec: totals.totalEjeTec + Number(resultado.totalEjeTec),
                totalMetPre: totals.totalMetPre + Number(resultado.totalMetPre),
                totalEjePre: totals.totalEjePre + Number(resultado.totalEjePre),
            }));

            const { statusName, statusColor } = getResultStatus(grouped[subProKey].resultados);
            // Asignamos el estado al subproyecto
            grouped[subProKey].estNom = statusName;
            grouped[subProKey].estCol = statusColor;

            return grouped
        }, {})

        const allSubproKeys = Object.values(groupedSubProjects).flatMap(subpro => subpro.subProKey);
        setExpandedSubPro(allSubproKeys);

        return groupedSubProjects;
    }, [data]);

    const currentRecords = Object.entries(groupedMetas);

    return (
        <div className='TableMainContainer flex-grow-1'>
            <div className='PowerMas_TableContainer'>
                {
                    currentRecords.length > 0 ?
                    <table className='PowerMas_Table_Monitoring Phone_12'>
                        <thead>
                            <tr>
                                <th></th>
                                <th> Estado </th>
                                <th colSpan={7}> Actividades e Indicadores </th>
                                <th className='center' style={{color: 'var(--naranja-ayuda)'}}>Meta Programática</th>
                                <th className='center' style={{color: 'var(--naranja-ayuda)'}}>Ejecución Programática</th>
                                <th className='center' style={{color: 'var(--naranja-ayuda)'}}>% Avance Programático</th>
                                <th className='center' style={{color: 'var(--turquesa)'}}>Meta Presupuesto</th>
                                <th className='center' style={{color: 'var(--turquesa)'}}>Ejecución Presupuesto</th>
                                <th className='center' style={{color: 'var(--turquesa)'}}>% Avance Presupuesto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(([key, { subProKey, resultados, subProNom, subProSap, totalMetTec, totalEjeTec, totalMetPre, totalEjePre, estNom, estCol }]) => {
                                const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                const text = subProSap + ' - ' + subProNom;
                                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                                return (
                                <Fragment key={subProKey}>
                                    <tr className='' style={{backgroundColor: '#FFC65860'}}>
                                        <td className='p0'>
                                            <span
                                                style={{minWidth: '1rem'}}
                                                className={`pointer bold flex ai-center f1_25 PowerMas_MenuIcon ${expandedSubPro.includes(subProKey) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                                onClick={() => {
                                                    if (expandedSubPro.includes(subProKey)) {
                                                        console.log(subProKey)
                                                        setExpandedSubPro(expandedSubPro.filter(subpro => subpro !== subProKey));
                                                    } else {
                                                        setExpandedSubPro([...expandedSubPro, subProKey]);
                                                    }
                                                }}
                                            > 
                                                <TriangleIcon />
                                            </span>
                                        </td>
                                        <td></td>
                                        <td className='bold' style={{color: estCol}}>
                                            {estNom}
                                        </td>
                                        <td colSpan={7}>
                                            <span
                                                className='bold'
                                                data-tooltip-id="info-tooltip" 
                                                data-tooltip-content={text} 
                                            >{shortText}</span>
                                        </td>
                                        <td className='center'>{formatter.format(totalMetTec)}</td>
                                        <td className='center'>{formatter.format(totalEjeTec)}</td>
                                        <td>
                                            <div className="flex flex-column">
                                                <div className="bold center" style={{color: estCol}}>
                                                    {formatterBudget.format(totalPorAvaTec)}%
                                                </div>
                                                <div 
                                                    className="progress-bar"
                                                    style={{backgroundColor: '#d3d3d3', border: `0px solid ${estCol}`}}
                                                >
                                                    <div 
                                                        className="progress-bar-fill" 
                                                        style={{width: `${totalPorAvaTec > 100 ? 100 : totalPorAvaTec}%`, backgroundColor: estCol}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='center'>{formatterBudget.format(totalMetPre)}</td>
                                        <td className='center'>{formatterBudget.format(totalEjePre)}</td>
                                        <td>
                                            <div className="flex flex-column">
                                                <div className="bold center" style={{color: estCol}}>
                                                    {formatterBudget.format(totalPorAvaPre)}%
                                                </div>
                                                <div 
                                                    className="progress-bar"
                                                    style={{backgroundColor: '#d3d3d3', border: `0px solid ${estCol}`}}
                                                >
                                                    <div 
                                                        className="progress-bar-fill" 
                                                        style={{width: `${totalPorAvaPre > 100 ? 100 : totalPorAvaPre}%`, backgroundColor: estCol}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedSubPro.includes(subProKey) && Object.entries(resultados).map(([key, { resKey, indicadores, name, number, totalMetTec, totalEjeTec, totalMetPre, totalEjePre, estNom, estCol }]) => {
                                        const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                        const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                        const text = number + ' - ' + name;
                                        const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                                        return (
                                        <Fragment key={resKey}>
                                            <tr className='' style={{backgroundColor: '#F3F3F3'}}>
                                                <td></td>
                                                <td className='p0'>
                                                    <div
                                                        style={{minWidth: '1rem'}}
                                                        className={`pointer bold flex ai-center f1_25 PowerMas_MenuIcon ${expandedRes.includes(resKey) ? 'PowerMas_MenuIcon--rotated' : ''}`} 
                                                        onClick={() => {
                                                            if (expandedRes.includes(resKey)) {
                                                                console.log(expandedRes)
                                                                setExpandedRes(expandedRes.filter(indicator => indicator !== resKey));
                                                            } else {
                                                                setExpandedRes([...expandedRes, resKey]);
                                                            }
                                                        }}
                                                    > 
                                                        <TriangleIcon />
                                                    </div>
                                                </td>
                                                <td className='bold' style={{color: estCol}}>
                                                    {estNom}
                                                </td>
                                                <td colSpan={7}>
                                                    <span
                                                        className=''
                                                        data-tooltip-id="info-tooltip" 
                                                        data-tooltip-content={text} 
                                                    >{shortText}</span>
                                                </td>
                                                <td className='center'>{formatter.format(totalMetTec)}</td>
                                                <td className='center'>{formatter.format(totalEjeTec)}</td>
                                                <td>
                                                    <div className="flex flex-column">
                                                        <div className="bold center" style={{color: estCol}}>
                                                            {formatterBudget.format(totalPorAvaTec)}%
                                                        </div>
                                                        <div 
                                                            className="progress-bar"
                                                            style={{backgroundColor: '#d3d3d3', border: `0px solid ${estCol}`}}
                                                        >
                                                            <div 
                                                                className="progress-bar-fill" 
                                                                style={{width: `${totalPorAvaTec > 100 ? 100 : totalPorAvaTec}%`, backgroundColor: estCol}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='center'>{formatterBudget.format(totalMetPre)}</td>
                                                <td className='center'>{formatterBudget.format(totalEjePre)}</td>
                                                <td>
                                                    <div className="flex flex-column">
                                                        <div className="bold center" style={{color: estCol}}>
                                                            {formatterBudget.format(totalPorAvaPre)}%
                                                        </div>
                                                        <div 
                                                            className="progress-bar"
                                                            style={{backgroundColor: '#d3d3d3', border: `0px solid ${estCol}`}}
                                                        >
                                                            <div 
                                                                className="progress-bar-fill" 
                                                                style={{width: `${totalPorAvaPre > 100 ? 100 : totalPorAvaPre}%`, backgroundColor: estCol}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRes.includes(resKey) && Object.entries(indicadores).map(([indKey, { metas, indNom, indNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre, estNom, estCol }]) => {
                                                const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                                const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                                const text = indNum + ' - ' + indNom.charAt(0) + indNom.slice(1).toLowerCase();
                                                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;

                                                return (
                                                    <tr className='' key={indKey} style={{color: '#69625F'}}>
                                                        <td></td>
                                                        <td></td>
                                                        <td style={{color: estCol}}>{estNom.charAt(0) + estNom.slice(1).toLowerCase()}</td>
                                                        <td className='' colSpan={7}>
                                                            <span 
                                                                data-tooltip-id="info-tooltip" 
                                                                data-tooltip-content={text} 
                                                            >{shortText}</span>
                                                        </td>
                                                        <td className='center'>{formatter.format(totalMetTec)}</td>
                                                        <td className='center'>{formatter.format(totalEjeTec)}</td>
                                                        <td>
                                                            <div className="flex flex-column">
                                                                <div className="bold center" style={{color: estCol}}>
                                                                    {formatterBudget.format(totalPorAvaTec)}%
                                                                </div>
                                                                <div 
                                                                    className="progress-bar"
                                                                    style={{backgroundColor: '#d3d3d3', border: `0px solid ${estCol}`}}
                                                                >
                                                                    <div 
                                                                        className="progress-bar-fill" 
                                                                        style={{width: `${totalPorAvaTec > 100 ? 100 : totalPorAvaTec}%`, backgroundColor: estCol}}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='center'>{formatterBudget.format(totalMetPre)}</td>
                                                        <td className='center'>{formatterBudget.format(totalEjePre)}</td>
                                                        <td>
                                                            <div className="flex flex-column">
                                                                <div className="bold center" style={{color: estCol}}>
                                                                    {formatterBudget.format(totalPorAvaPre)}%
                                                                </div>
                                                                <div 
                                                                    className="progress-bar"
                                                                    style={{backgroundColor: '#d3d3d3', border: `0px solid ${estCol}`}}
                                                                >
                                                                    <div 
                                                                        className="progress-bar-fill" 
                                                                        style={{width: `${totalPorAvaPre > 100 ? 100 : totalPorAvaPre}%`, backgroundColor: estCol}}
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
                                <td colSpan={9} ></td>
                                <td style={{textAlign: 'right'}}>Totales:</td>
                                <td>{formatter.format(totals.totalMetTec)}</td>
                                <td>{formatter.format(totals.totalEjeTec)}</td>
                                <td>{(totals.totalEjeTec !== 0 ? (formatterBudget.format((totals.totalEjeTec/totals.totalMetTec)*100)) : 0)}%</td>
                                <td>{formatterBudget.format(totals.totalMetPre)} </td>
                                <td>{formatterBudget.format(totals.totalEjePre)} </td>
                                <td>{(totals.totalMetPre !== 0 ? (formatterBudget.format((totals.totalEjePre/totals.totalMetPre)*100)) : 0)}%</td>
                            </tr>
                        </tbody>
                    </table>
                    :
                    <div className='Phone_12 flex flex-column ai-center jc-center'>
                        <img src={TableEmpty} alt="TableEmpty" className='Medium_4 Phone_12' />
                        <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Table
