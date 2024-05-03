import React, { useState, Fragment, useMemo } from 'react'
import { formatter, formatterBudget } from '../../components/monitoring/goal/helper'
import TableEmpty from '../../img/PowerMas_TableEmpty.svg';

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
            console.log(status)
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
    const [ expandedRes, setExpandedRes ] = useState([])
    const  [totals, setTotals ] = useState({
        totalMetTec: 0,
        totalEjeTec: 0,
        totalMetPre: 0,
        totalEjePre: 0,
    });

    const groupMetasIntoIndicators = (metas) => {
        return metas.reduce((grouped, meta) => {
            const key = `ind_${meta.indActResAno}_${meta.indActResCod}`
            if (!grouped[key]) {
                grouped[key] = { metas: [], indActResNom: meta.indActResNom, indActResNum: meta.indActResNum, totalMetTec: 0 , totalEjeTec: 0, totalMetPre: 0 , totalEjePre: 0, resAno: meta.resAno, resCod: meta.resCod, resNom: meta.resNom, resNum: meta.resNum  }
            }
            grouped[key].metas.push(meta)
            grouped[key].totalMetTec += Number(meta.metMetTec)
            grouped[key].totalEjeTec += Number(meta.metEjeTec)
            grouped[key].totalMetPre += Number(meta.metMetPre)
            grouped[key].totalEjePre += Number(meta.metEjePre)
    
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
    
        return Object.entries(groupedIndicators).reduce((grouped, [key, indicador]) => {
            console.log(indicador)
            const resKey = `res_${indicador.resAno}_${indicador.resCod}`
            if (!grouped[resKey]) {
                grouped[resKey] = { indicadores: [], resNom: indicador.resNom, resNum: indicador.resNum, totalMetTec: 0, totalEjeTec: 0, totalMetPre: 0, totalEjePre: 0 }
            }
    
            grouped[resKey].indicadores.push(indicador);
            grouped[resKey].totalMetTec += Number(indicador.totalMetTec)
            grouped[resKey].totalEjeTec += Number(indicador.totalEjeTec)
            grouped[resKey].totalMetPre += Number(indicador.totalMetPre)
            grouped[resKey].totalEjePre += Number(indicador.totalEjePre)
    
            // Actualiza los totales
            setTotals(totals => ({
                totalMetTec: totals.totalMetTec + Number(indicador.totalMetTec),
                totalEjeTec: totals.totalEjeTec + Number(indicador.totalEjeTec),
                totalMetPre: totals.totalMetPre + Number(indicador.totalMetPre),
                totalEjePre: totals.totalEjePre + Number(indicador.totalEjePre),
            }));
    
            const { statusName, statusColor } = getResultStatus(grouped[resKey].indicadores);
            // Asignamos el estado al resultado
            grouped[resKey].estNom = statusName;
            grouped[resKey].estCol = statusColor;
    
            console.log(grouped)
            return grouped
        }, {})
    }, [data]);
    

    const currentRecords = Object.entries(groupedMetas);

    return (
        <div className='TableMainContainer flex-grow-1'>
            <div className='PowerMas_TableContainer'>
                {
                    currentRecords.length > 0 ?
                    <table className='PowerMas_Table_Monitoring'>
                        <thead>
                            <tr>
                                <th colSpan={8}></th>
                                <th>Meta Programatica</th>
                                <th>Ejeucion Programatica</th>
                                <th>% Avance Programatico</th>
                                <th>Meta Presupuesto</th>
                                <th>Ejeucion Presupuesto</th>
                                <th>% Avance Presupuesto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(([key, { indicadores, resNom, resNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre, estNom, estCol }]) => {
                                const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                const text = resNum + ' - ' + resNom;
                                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                                console.log(indicadores)
                                return (
                                <Fragment key={key}>
                                    <tr className='bold' style={{backgroundColor: '#F3F3F3'}}>
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
                                        <td style={{color: estCol}}>
                                            {estNom}
                                        </td>
                                        <td colSpan={7}>
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
                                        <td className='center'>{formatterBudget.format(totalPorAvaPre)}%</td>
                                    </tr>
                                    {expandedRes.includes(key) && Object.entries(indicadores).map(([key, { metas, indActResNom, indActResNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre, estNom, estCol }]) => {
                                        const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                        const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                        const text = indActResNum + ' - ' + indActResNom;
                                        const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;

                                        return (
                                            <tr className='bold' key={key}>
                                                <td></td>
                                                <td style={{color: estCol}}>{estNom}</td>
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
                                                <td className='center'>{formatterBudget.format(totalPorAvaPre)}%</td>
                                            </tr>
                                    )})}
                                </Fragment>
                            )})}
                                <tr className='PowerMas_Totales_Monitoreo'>
                                    <td colSpan={8} ></td>
                                    <td style={{textAlign: 'right'}}>Totales:</td>
                                    <td>{formatter.format(totals.totalMetTec)}</td>
                                    <td>{formatter.format(totals.totalEjeTec)}</td>
                                    <td>{(totals.totalEjeTec !== 0 ? (formatterBudget.format((totals.totalEjeTec/totals.totalMetTec)*100)) : 0)}%</td>
                                    <td>{formatterBudget.format(totals.totalMetPre)} $</td>
                                    <td>{formatterBudget.format(totals.totalEjePre)} $</td>
                                    <td>{(totals.totalMetPre !== 0 ? (formatterBudget.format((totals.totalEjePre/totals.totalMetPre)*100)) : 0)}%</td>
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
        </div>
    )
}

export default Table
