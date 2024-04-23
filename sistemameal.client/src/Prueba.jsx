import React, { useEffect, useState, Fragment } from 'react'
import { fetchData } from './components/reusable/helper'

const Prueba = () => {
    const [ metas, setMetas ] = useState([])
    const [ groupedMetas, setGroupedMetas ] = useState({})
    const [ expandedRes, setExpandedRes ] = useState([])
    const [ expandedInd, setExpandedInd ] = useState([])

    useEffect(() => {
        fetchData('Monitoreo/Filter', (data) => {
            setMetas(data)
            const grouped = data.reduce((grouped, meta) => {
                const key = `res_${meta.resAno}_${meta.resCod}`
                if (!grouped[key]) {
                    grouped[key] = { metas: [], resNom: meta.resNom, resNum: meta.resNum, totalMetTec: 0, totalEjeTec: 0 }
                }
                grouped[key].metas.push(meta)
                grouped[key].totalMetTec += Number(meta.metMetTec)
                grouped[key].totalEjeTec += Number(meta.metEjeTec)
                return grouped
            }, {})
            console.log(grouped)
            setGroupedMetas(grouped)
        })
    }, [])

    return (
        <div className=''>
            <table className='PowerMas_TableStatus'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Estado</th>
                        <th>Periodo</th>
                        <th>Ubicacion</th>
                        <th>Implementador</th>
                        <th>Meta Programatica</th>
                        <th>Ejeucion Programatica</th>
                        <th>% Avance Tecnico</th>
                        <th>Meta Presupuesto</th>
                        <th>Ejeucion Presupuesto</th>
                        <th>% Avance Presupuesto</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedMetas).map(([key, { metas, resNom, resNum, totalMetTec, totalEjeTec }]) => (
                        <Fragment key={key}>
                            <tr>
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
                                <td colSpan={5}>{resNum + ' - ' + resNom}</td>
                                <td>{totalMetTec}</td>
                                <td>{totalEjeTec}</td>
                            </tr>
                            {expandedRes.includes(key) && Object.entries(metas.reduce((grouped, meta) => {
                                const key = `ind_${meta.indActResAno}_${meta.indActResCod}`
                                if (!grouped[key]) {
                                    grouped[key] = { metas: [], indActResNom: meta.indActResNom, indActResNum: meta.indActResNum, totalMetTec: 0 , totalEjeTec: 0 }
                                }
                                grouped[key].metas.push(meta)
                                grouped[key].totalMetTec += Number(meta.metMetTec)
                                grouped[key].totalEjeTec += Number(meta.metEjeTec)
                                return grouped
                            }, {})).map(([key, { metas: subMetas, indActResNom, indActResNum, totalMetTec, totalEjeTec }]) => (
                                <Fragment key={key}>
                                    <tr>
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
                                        <td colSpan={4}>{indActResNum + ' - ' + indActResNom}</td>
                                        <td>{totalMetTec}</td>
                                        <td>{totalEjeTec}</td>
                                    </tr>
                                    {expandedInd.includes(key) && subMetas.map((meta, index) => (
                                        <tr key={index} style={{visibility: expandedInd.includes(key) ? 'visible' : 'collapse'}}>
                                            <td></td>
                                            <td></td>
                                            <td>{meta.estNom}</td>
                                            <td>{meta.metMesPlaTec + ' - ' + meta.metAnoPlaTec}</td>
                                            <td>{meta.ubiNom}</td>
                                            <td>{meta.impNom}</td>
                                            <td>{meta.metMetTec}</td>
                                            <td>{meta.metEjeTec}</td>
                                            <td>{meta.metPorAvaTec}</td>
                                            <td>{meta.metMetPre}</td>
                                            <td>{meta.metEjePre}</td>
                                            <td>{meta.metPorAvaPre}</td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Prueba
