import Modal from 'react-modal';
import TableGoalBeneficiarie from './TableGoalBeneficiarie';
import { useEffect, useState } from 'react';
import Notiflix from 'notiflix';

const ModalGoalBeneficiarie = ({modalGoalBeneficiarie, closeModal, dataGoalBeneficiarie, dataGoals}) => {
    if (!modalGoalBeneficiarie) return;

    const { benAno, benCod, benNom, benApe, benCorEle, benTel, benTelCon, benCodUni, benSex, benFecNac, genNom, nacNom, docIdeBenNum, docIdeAbr, docIdeNom, benNomApo, benApeApo } = dataGoalBeneficiarie;

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalGoalBeneficiarie}
            onRequestClose={closeModal}
            closeTimeoutMS={200}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    width: '90%',
                    height: '90%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column'
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
        >   
            <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
            <h2 className='PowerMas_Title_Modal f1_5 center'>Datos de Intervención del Beneficiario</h2>
            <div className='flex overflow-auto flex-grow-1'>
                <div className="PowerMas_Info_User PowerMas_Form_Card p1" style={{backgroundColor: '#f7f7f7'}}>
                <h2 className="f1_25">Datos del Beneficiario </h2>
                <br />
                    <article className="p_25 flex flex-column" style={{gap: 0}}>
                    <p className="bold">Documento:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize', textWrap: 'nowrap'}}>{ docIdeAbr + ' - ' + docIdeNom.toLowerCase() }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Número:</p>
                        <p className="color-gray">{ docIdeBenNum }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">CUB:</p>
                        <p className="color-gray">{ benCodUni }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Nombre:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize'}}>{benNom.toLowerCase() }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Apellido:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize'}}>{ benApe.toLowerCase()}</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Sexo:</p>
                        <p className="color-gray">{ benSex === 'M' ? 'Masculíno' : 'Femenino' }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Nacimiento:</p>
                        <p className="color-gray">{ benFecNac }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Genero:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize'}}>{ genNom.toLowerCase() }</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Correo:</p>
                        <p className="color-gray">{ benCorEle.toLowerCase()}</p>
                    </article>
                    <article className="p_25">
                        <p className="bold">Teléfono:</p>
                        <p className="color-gray">{ benTel }</p>
                    </article>
                    
                    <article className="p_25">
                        <p className="bold">Nacionalidad:</p>
                        <p className="color-gray" style={{textTransform: 'capitalize'}}>{ nacNom.toLowerCase() }</p>
                    </article>
                    {
                        benNomApo &&
                        <article className="p_25">
                            <p className="bold">Nombre de Contacto:</p>
                            <p className="color-gray" style={{textTransform: 'capitalize'}}>{ benNomApo.toLowerCase() + ' ' + benApeApo.toLowerCase() }</p>
                        </article>
                    }
                    <article className="p_25">
                        <p className="bold">Teléfono de Contacto:</p>
                        <p className="color-gray">{ benTelCon }</p>
                    </article>
                </div>
                <TableGoalBeneficiarie data={dataGoals} />
            </div>
        </Modal>
    )
}

export default ModalGoalBeneficiarie