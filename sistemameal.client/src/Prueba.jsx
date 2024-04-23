import React, { useEffect, useState, Fragment } from 'react'
import { fetchData } from './components/reusable/helper'
import { formatterBudget } from './components/monitoring/goal/helper'
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const Prueba = () => {
    const navigate = useNavigate();

    const [ metas, setMetas ] = useState([])
    const [ groupedMetas, setGroupedMetas ] = useState({})
    const [ expandedRes, setExpandedRes ] = useState([])
    const [ expandedInd, setExpandedInd ] = useState([])

    useEffect(() => {
        fetchData('Monitoreo/Filter', (data) => {
            const grouped = data.reduce((grouped, meta) => {
                const key = `res_${meta.resAno}_${meta.resCod}`
                if (!grouped[key]) {
                    grouped[key] = { metas: [], resNom: meta.resNom, resNum: meta.resNum, totalMetTec: 0, totalEjeTec: 0, totalMetPre: 0, totalEjePre: 0 }
                }
                grouped[key].metas.push(meta)
                grouped[key].totalMetTec += Number(meta.metMetTec)
                grouped[key].totalEjeTec += Number(meta.metEjeTec)
                grouped[key].totalMetPre += Number(meta.metMetPre)
                grouped[key].totalEjePre += Number(meta.metEjePre)
                return grouped
            }, {})
            console.log(grouped)
            setGroupedMetas(grouped)
        })
    }, [])

    const Register_Beneficiarie = (row) => {
        const id = `${row.original.metAno}${row.original.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');

        Notiflix.Confirm.show(
            'Registrar Beneficiario',
            '¿Como deseas registrar a los benefiriacios?',
            'Masivo',
            'Individual',
            () => {
                navigate(`/upload-beneficiarie/${safeCiphertext}`);
            },
            () => {
                navigate(`/form-goal-beneficiarie/${safeCiphertext}`);
            }
        )
    }

    const Register_Execution = (row) => {
        const id = `${row.original.metAno}${row.original.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-goal-execution/${safeCiphertext}`);
    }

    return (
        <div className=''>
            <table className='PowerMas_Table_Monitoring'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>FFVV</th>
                        <th>Añadir</th>
                        <th>Estado</th>
                        <th>Técnico</th>
                        <th>Implementador</th>
                        <th>Ubicacion</th>
                        <th>Periodo</th>
                        <th>Meta Programatica</th>
                        <th>Ejeucion Programatica</th>
                        <th>% Avance Programatico</th>
                        <th>Meta Presupuesto</th>
                        <th>Ejeucion Presupuesto</th>
                        <th>% Avance Presupuesto</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedMetas).map(([key, { metas, resNom, resNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre }]) => {
                        const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                        const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
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
                                <td colSpan={8}>{resNum + ' - ' + resNom}</td>
                                <td className='center'>{totalMetTec}</td>
                                <td className='center'>{totalEjeTec}</td>
                                <td className='center'>{formatterBudget.format(totalPorAvaTec)}%</td>
                                <td className='center'>{totalMetPre}</td>
                                <td className='center'>{totalEjePre}</td>
                                <td className='center'>{formatterBudget.format(totalPorAvaPre)}%</td>
                                <td className='center' colSpan={2}></td>
                            </tr>
                            {expandedRes.includes(key) && Object.entries(metas.reduce((grouped, meta) => {
                                const key = `ind_${meta.indActResAno}_${meta.indActResCod}`
                                if (!grouped[key]) {
                                    grouped[key] = { metas: [], indActResNom: meta.indActResNom, indActResNum: meta.indActResNum, totalMetTec: 0 , totalEjeTec: 0, totalMetPre: 0 , totalEjePre: 0 }
                                }
                                grouped[key].metas.push(meta)
                                grouped[key].totalMetTec += Number(meta.metMetTec)
                                grouped[key].totalEjeTec += Number(meta.metEjeTec)
                                grouped[key].totalMetPre += Number(meta.metMetPre)
                                grouped[key].totalEjePre += Number(meta.metEjePre)
                                return grouped
                            }, {})).map(([key, { metas: subMetas, indActResNom, indActResNum, totalMetTec, totalEjeTec, totalMetPre, totalEjePre }]) => {
                                const totalPorAvaTec = totalMetTec ? (totalEjeTec / totalMetTec) * 100 : 0
                                const totalPorAvaPre = totalMetPre ? (totalEjePre / totalMetPre) * 100 : 0
                                
                                return (
                                <Fragment key={key}>
                                    <tr className='bold'>
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
                                        <td className='' colSpan={7}>{indActResNum + ' - ' + indActResNom}</td>
                                        <td className='center'>{totalMetTec}</td>
                                        <td className='center'>{totalEjeTec}</td>
                                        <td className='center'>{formatterBudget.format(totalPorAvaTec)}%</td>
                                        <td className='center'>{totalMetPre}</td>
                                        <td className='center'>{totalEjePre}</td>
                                        <td className='center'>{formatterBudget.format(totalPorAvaPre)}%</td>
                                        <td className='center' colSpan={2}></td>
                                    </tr>
                                    {expandedInd.includes(key) && subMetas.map((meta, index) => {
                                        const mesPeriodo = meta.metMesPlaTec ? (new Date(2024, meta.metMesPlaTec - 1).toLocaleString('es-ES', { month: 'short' })) : '';
                                        return (
                                        <tr key={index} style={{visibility: expandedInd.includes(key) ? 'visible' : 'collapse'}}>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <div className="flex jc-center ai-center" >
                                                    <button  
                                                        className="PowerMas_Add_Beneficiarie f_75 flex-grow-1" 
                                                        style={{padding: '0.25rem 0.75rem'}}
                                                        // onClick={() => setModalIsOpen(row.original)}
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
                                                        // onClick={() => Register_Beneficiarie(row)}
                                                    >
                                                        Beneficiario
                                                    </button> :
                                                    <button  
                                                        className="PowerMas_Add_Execution f_75 p_25 flex-grow-1" 
                                                        // onClick={() => Register_Execution(row)}
                                                    >
                                                        Ejecución
                                                    </button>
                                                }
                                                </div>
                                            </td>
                                            <td>
                                                <div className="bold" style={{ color: meta.estCol, whiteSpace: 'nowrap' }}>
                                                    {meta.estNom}
                                                </div>
                                            </td>
                                            <td>{meta.usuNom}</td>
                                            <td>{meta.impNom}</td>
                                            <td>{meta.ubiNom}</td>
                                            <td>{mesPeriodo.toUpperCase() + ' - ' + meta.metAnoPlaTec}</td>
                                            <td className='center'>{meta.metMetTec}</td>
                                            <td className='center'>{meta.metEjeTec}</td>
                                            <td>
                                                <div className="flex flex-column">
                                                    <div className="bold" style={{color: meta.estCol}}>
                                                        {meta.metPorAvaTec}%
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
                                            <td className='center'>{meta.metMetPre}</td>
                                            <td className='center'>{meta.metEjePre}</td>
                                            <td>
                                                <div className="flex flex-column">
                                                    <div className="bold" style={{color: meta.estCol}}>
                                                        {meta.metPorAvaPre}%
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
                </tbody>
            </table>
        </div>
    )
}

export default Prueba
