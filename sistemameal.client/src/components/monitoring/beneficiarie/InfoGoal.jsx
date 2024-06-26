import React from 'react'
import DonutChart from '../../reusable/DonutChart'
import { formatterBudget } from '../goal/helper';

const InfoGoal = ({metaData, openModal, is = true}) => {
    
    const indTipIndMap = {
        'IAC': 'Actividad',
        'IRE': 'Indicador Resultado',
        'IOB': 'Indicador Objetivo',
        'IOE': 'Indicador Objetivo Especifico',
        'IIN': 'Indicador Institucional',
    };

    return (
        <>
        
            <div className="Large_6 overflow-auto flex flex-column"> 
                <div className="PowerMas_Info_Form_Beneficiarie m1 overflow-auto " >
                    <div className="flex p1">
                        <div className="Large_6 flex flex-column ai-center">
                            <h3 className="f1_25 center">Avance Técnico</h3>
                            <DonutChart 
                                percentage={(metaData ? formatterBudget.format(metaData.metPorAvaTec) : 0)} 
                                wh={150}
                                rad={20}
                                newId={'MetaBeneficiario'}
                                colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'}
                            />
                        </div>
                        <div className="Large_6 flex flex-column gap_3">
                            <p className="bold">Nuesta Meta</p>
                            <p className="PowerMas_Info_Card p_5">{metaData ? Number(metaData.metMetTec).toLocaleString(): 0}</p>
                            <p className="bold">Nuestra Ejecución</p>
                            <p 
                                className="PowerMas_Info_Card p_5" 
                            >
                                {metaData ? Number(metaData.metEjeTec).toLocaleString() : 0}
                            </p>
                            <p className="bold">{(metaData && Number(metaData.metMetTec - metaData.metEjeTec)) < 0 ? 'Nos Excedimos en' : 'Nos Falta'  }</p>
                            <p className="PowerMas_Info_Card p_5">{metaData ? Number(metaData.metMetTec - metaData.metEjeTec).toLocaleString() : 0}</p>
                        </div>
                    </div>
                    {
                        metaData &&
                        <div>
                            <article>
                                <h3 className="Large-f1 m_5" style={{textTransform: 'capitalize'}}>
                                    {(indTipIndMap[metaData?.indTipInd] || metaData?.indTipInd)}
                                </h3>
                                <p className="m_5">{metaData?.indNum + ' - ' + metaData?.indNom.charAt(0).toUpperCase() + metaData?.indNom.slice(1).toLowerCase()}</p>
                            </article>
                            {
                                metaData?.resNum !== 'NA' && metaData?.resNom !== 'NA' &&
                                <article>
                                    <h3 className="Large-f1 m_5"> Resultado </h3>
                                    <p className="m_5">{metaData?.resNum + ' - ' + metaData?.resNom.charAt(0).toUpperCase() + metaData?.indNom.slice(1).toLowerCase()}</p>
                                </article>
                            }
                            {
                                metaData?.objEspNum !== 'NA' && metaData?.objEspNom !== 'NA' &&
                                <article>
                                    <h3 className="Large-f1 m_5">Objetivo Específico</h3>
                                    <p className="m_5">{metaData?.objEspNum + ' - ' + metaData?.objEspNom.charAt(0).toUpperCase() + metaData?.objEspNom.slice(1).toLowerCase()}</p>
                                </article>
                            }
                            {
                                metaData?.objNum !== 'NA' && metaData?.objNom !== 'NA' &&
                                <article>
                                    <h3 className="Large-f1 m_5">Objetivo</h3>
                                    <p className="m_5">{metaData?.objNum + ' - ' + metaData?.objNom.charAt(0).toUpperCase() + metaData?.objNom.slice(1).toLowerCase()}</p>
                                </article>
                            }
                            <article>
                                <h3 className="Large-f1 m_5"> Subproyecto </h3>
                                <p className="m_5">{metaData?.subProSap  + ' - ' + metaData?.subProNom.charAt(0) + metaData?.subProNom.slice(1).toLowerCase() }</p>
                            </article>
                            <article>
                                <h3 className="Large-f1 m_5">Proyecto</h3>
                                <p className="m_5">{metaData?.proIde + ' - ' + metaData?.proLinInt  + ' - ' + metaData?.proNom.charAt(0) + metaData?.proNom.slice(1).toLowerCase() }</p>
                            </article>
                        </div>
                    }
                </div>
            </div>
            <div className="PowerMas_Bubble flex flex-column ai-center jc-center" onClick={openModal}>
                <p className="f1_5">{metaData ? Number(metaData.metEjeTec).toLocaleString() : 0}</p>
                <p className="f_75" style={{lineHeight: '1'}}>Ver<br/>{is ? 'Ejecuciones' : 'Beneficiarios'}</p>
            </div>
        </>
    )
}

export default InfoGoal