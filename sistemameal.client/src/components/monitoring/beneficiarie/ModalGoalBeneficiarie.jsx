import Modal from 'react-modal';
import { useState } from 'react';
import masculino from '../../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../../img/PowerMas_Avatar_Femenino.svg';
import TriangleIcon from '../../../icons/TriangleIcon';
import { getMonthYearText, tipoIndicadorMapping } from '../../reusable/columns';


const ModalGoalBeneficiarie = ({modalGoalBeneficiarie, closeModal, closeModalNames, dataGoalBeneficiarie, dataGoals, setValue}) => {

    const [active, setActive] = useState({});

    const toggleAccordion = (index) => {
        setActive(prevActive => ({
            ...prevActive,
            [index]: !prevActive[index]
          }));
    };

    const handleAssign = () => {
        const {
            benAno,
            benCod,
            benAut,
            benNom,
            benApe,
            benSex,
            genCod,
            benFecNac,
            nacCod,
            benCorEle,
            benTel,
            benTelCon,
            benDir
        } = dataGoalBeneficiarie;

        setValue('benAno',benAno)
        setValue('benCod',benCod)
        setValue('benAut',benAut)
        setValue('benNom',benNom)
        setValue('benApe',benApe)
        setValue('benSex',benSex)
        setValue('genCod',genCod)
        setValue('benFecNac',benFecNac)
        setValue('nacCod',nacCod)
        setValue('benCorEle',benCorEle)
        setValue('benTel',benTel)
        setValue('benTelCon',benTelCon)
        setValue('benDir',benDir)

        closeModal();
        closeModalNames();
    }

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalGoalBeneficiarie}
            onRequestClose={closeModal}
            closeTimeoutMS={200}
            className='PowerMas_React_Modal_Content Large_10 Medium_10 Phone_11'
            overlayClassName='PowerMas_React_Modal_Overlay'
            style={{
                content: {
                    height: '85%',
                },
                overlay: {
                    zIndex: 30
                }
            }}
        >   
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Datos de Intervención del Beneficiario</h2>
            <div className='flex overflow-auto flex-grow-1 Large_12 gap-1'>
                {
                    dataGoalBeneficiarie &&
                    <div className="PowerMas_Info_User PowerMas_Form_Card p1 Large_6 Phone_6 gap_25 overflow-auto" style={{backgroundColor: '#f7f7f7'}}>
                        <div className="flex flex-column jc-center ai-center gap_5">
                            <div className="PowerMas_ProfilePicture2" style={{width: 125, height: 125}}>
                                <img src={dataGoalBeneficiarie.benSex == 'M' ? masculino : femenino } alt="Descripción de la imagen" />
                            </div>
                            <div className="center">
                                <p className="f1_25 bold" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.benNom.toLowerCase() + ' ' + dataGoalBeneficiarie.benApe.toLowerCase() }</p>
                                <p className="color-gray" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.docIdeNom.toLowerCase() }</p>
                                <p className="color-gray" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.benCodUni }</p>
                            </div>
                        </div>
                        <div className='flex'>
                            <article className="Phone_6 flex gap-1">
                                <p className="bold">Nacimiento:</p>
                                <p className="color-gray">{ dataGoalBeneficiarie.benFecNac }</p>
                            </article>
                            <article className="Phone_6 flex gap-1">
                                <p className="bold">Edad Actual:</p>
                                <p className="color-gray">{ dataGoalBeneficiarie.edad }</p>
                            </article>
                        </div>
                        <div className='flex'>
                            <article className="Phone_6 flex gap-1">
                                <p className="bold">Sexo:</p>
                                <p className="color-gray">{ dataGoalBeneficiarie.benSex === 'M' ? 'Masculíno' : 'Femenino' }</p>
                            </article>
                            <article className="Phone_6 flex gap-1">
                                <p className="bold">Género:</p>
                                <p className="color-gray" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.genNom.toLowerCase() }</p>
                            </article>
                        </div>
                        <div className='flex'>
                            <article className="Phone_6 flex gap-1">
                                <p className="bold">Nacionalidad:</p>
                                <p className="color-gray" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.nacNom.toLowerCase() }</p>
                            </article>
                            <article className="Phone_6 flex gap-1">
                                <p className="bold">Teléfono:</p>
                                <p className="color-gray">{ dataGoalBeneficiarie.benTel }</p>
                            </article>
                        </div>
                        <div className="flex gap-1">
                            <p className="bold">Correo:</p>
                            <p className="color-gray">{ dataGoalBeneficiarie.benCorEle.toLowerCase()}</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="bold">Dirección:</p>
                            <p className="color-gray" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.benDir.toLowerCase()}</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="bold">Nombre de Contacto:</p>
                            <p className="color-gray" style={{textTransform: 'capitalize'}}>{ dataGoalBeneficiarie.benNomApo.toLowerCase() + ' ' + dataGoalBeneficiarie.benApeApo.toLowerCase() }</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="bold">Teléfono de Contacto:</p>
                            <p className="color-gray">{ dataGoalBeneficiarie.benTelCon }</p>
                        </div>
                    </div>
                }
                <div className='PowerMas_Form_Card Large_6 gap_5 overflow-auto'>
                    <h4>Listado de Intervenciones</h4>
                    {
                        dataGoals && dataGoals.map((item, index) => {
                            const { ubiNom, indTipInd, indNum, indNom, resNum, resNom, objEspNum, objEspNom, objNom, objNum, subProSap, subProNom, proIde, proLinInt, proNom, metBenMesEjeTec, metBenAnoEjeTec, usuNom, usuApe } = item;
                            return (                                           
                                <div className='PowerMas_Form_Card ' key={index} 
                                    style={{backgroundColor: '#f7f7f7'}}
                                >
                                    <h5>Intervencion {index+1}</h5>
                                    <div className='flex ai-center p_25 gap_5' >
                                        <p className='flex-grow-1'>
                                            En el <span className='bold'>periodo:</span> <span style={{textTransform: 'capitalize'}}> {getMonthYearText(metBenMesEjeTec,metBenAnoEjeTec).toLowerCase()}, </span> {''}
                                            <span className='bold'>ubicación:</span> 
                                            <span style={{textTransform: 'capitalize'}}> {ubiNom.toLowerCase()} </span> 
                                        </p>
                                        <span 
                                            className={`flex ai-center jc-center f1_5 pointer bold PowerMas_MenuIcon ${active[index] ? 'PowerMas_MenuIcon--rotated' : ''}`}
                                            onClick={() => toggleAccordion(index)}
                                        > 
                                            <TriangleIcon />
                                        </span>
                                    </div>
                                    <div className={` ${ active[index] ? 'menu active' : 'menu'}`} >
                                        <article className='PowerMas_Info_Beneficiarie p_25 flex flex-column gap_5'>
                                            <article>
                                                <h3 className="Large-f1 " style={{textTransform: 'capitalize'}}>
                                                    {(tipoIndicadorMapping[indTipInd] || indTipInd)}
                                                </h3>
                                                <p className="">{indNum + ' - ' + indNom.charAt(0).toUpperCase() + indNom.slice(1).toLowerCase()}</p>
                                            </article>
                                            {
                                                resNum !== 'NA' && resNom !== 'NA' &&
                                                <article>
                                                    <h3 className="Large-f1 "> Resultado </h3>
                                                    <p className="">{resNum + ' - ' + resNom.charAt(0).toUpperCase() + indNom.slice(1).toLowerCase()}</p>
                                                </article>
                                            }
                                            {
                                                objEspNum !== 'NA' && objEspNom !== 'NA' &&
                                                <article>
                                                    <h3 className="Large-f1 ">Objetivo Específico</h3>
                                                    <p className="">{objEspNum + ' - ' + objEspNom.charAt(0).toUpperCase() + objEspNom.slice(1).toLowerCase()}</p>
                                                </article>
                                            }
                                            {
                                                objNum !== 'NA' && objNom !== 'NA' &&
                                                <article>
                                                    <h3 className="Large-f1 ">Objetivo</h3>
                                                    <p className="">{objNum + ' - ' + objNom.charAt(0).toUpperCase() + objNom.slice(1).toLowerCase()}</p>
                                                </article>
                                            }
                                            <article>
                                                <h3 className="Large-f1 "> Subproyecto </h3>
                                                <p className="">{subProSap  + ' - ' + subProNom.charAt(0) + subProNom.slice(1).toLowerCase() }</p>
                                            </article>
                                            <article>
                                                <h3 className="Large-f1 ">Proyecto</h3>
                                                <p className="">{proIde + ' - ' + proLinInt  + ' - ' + proNom.charAt(0) + proNom.slice(1).toLowerCase() }</p>
                                            </article>
                                            <div className='flex gap-1'>
                                                <h3 className="Large-f1 ">Responsable</h3>
                                                <p style={{textTransform: 'capitalize'}}>{usuNom.toLowerCase() + ' ' + usuApe.toLowerCase() }</p>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <br />
            <div className='PowerMas_Footer_Box flex jc-center ai-center p_5 gap-1'>    
                <button 
                    className='PowerMas_Buttom_Primary Large_3 p_25'
                    onClick={handleAssign}
                >
                    Asignar
                </button>
                <button 
                    className='PowerMas_Buttom_Secondary Large_3 p_25'
                    onClick={closeModal}
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    )
}

export default ModalGoalBeneficiarie