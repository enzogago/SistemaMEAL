import { useNavigate, useParams } from "react-router-dom";
import Bar from "../user/Bar";
import { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaRegFileExcel } from "react-icons/fa";
import Notiflix from "notiflix";
import CryptoJS from 'crypto-js';
import template from '../../templates/MARCO_LOGICO.xlsm';
import { handleUpload } from "./handleUpload";
import { StatusContext } from "../../context/StatusContext";

const UploadBeneficiarie = () => {
    const { id: safeCiphertext } = useParams();
    // Reemplaza los caracteres a su representación original en base64 y decodifica la cadena
    const ciphertext = atob(safeCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const metAno = id.slice(0, 4);
    const metCod = id.slice(4);

    //
    const navigate = useNavigate();

     // Variables State AuthContext 
     const { statusActions } = useContext(StatusContext);
     const { setTableData, setIsValid, setErrorCells, setMetaBeneficiario } = statusActions;

    useEffect(() => {
        if (id.length !== 10) {
            navigate('/monitoring');
        }
    }, [id]);
    

    const handleFileUpload = () => {
        setMetaBeneficiario({
            metAno,
            metCod,
            ubiAno: '2024',
            ubiCod: '000001',
            metBenMesEjeTec: '01',
            metBenAnoEjeTec: '2025',
        })
        handleUpload(selectedFile, setTableData, setIsValid, setErrorCells, navigate);
    };

    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const dragCounter = useRef(0);
    const dropRef = useRef(null);
    const fileInputRef = useRef();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(dragCounter)
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Verificar si el archivo es un Excel
            const file = e.dataTransfer.files[0];
            const fileType = file.name.split('.').pop();
            if (fileType === 'xlsm') {
                fileInputRef.current.files = e.dataTransfer.files;
                setSelectedFile(e.dataTransfer.files[0]); // Aquí se actualiza el estado selectedFile
            } else {
                Notiflix.Notify.failure("Formato no soportado")
            }
            e.dataTransfer.clearData();
            dragCounter.current = 0;
        }
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        console.log(event.target.files[0])
        if (event.target.files[0].type === 'application/vnd.ms-excel.sheet.macroEnabled.12') {
            setSelectedFile(event.target.files[0]);
        } else {
            Notiflix.Notify.failure("Formato no soportado")
        }
    };

    const handleDownload = () => {
        fetch(template)
            .then(response => response.blob())
            .then(blob => {
                saveAs(blob, 'MARCO_LOGICO.xlsm');
            });
    }

    
    return (
        <>
            <Bar currentStep={1} type='uploadBeneficiarie' />
            <div className="flex-grow-1 flex jc-center ai-center overflow-auto">
                
                <div className="Large_8">
                <div className="flex jc-center p_5">
                <button className="PowerMas_Buttom_Secondary flex ai-center jc-space-between p_5 Phone_3" onClick={handleDownload}> 
                    Descargar formato 
                    <FaDownload className="w-auto" /> 
                </button>
                </div>
                    <article className="PowerMas_Article_Upload center">
                        <p style={{color: '#878280'}}>Solo se puede subir documentos en formato Excel</p>
                        <h3>Subir Archivo</h3>
                    </article>
                    <br />
                    <div
                        className="PowerMas_Input_Upload center p2 pointer"
                        ref={dropRef}
                        onClick={handleDivClick}
                        onDragEnter={handleDragIn}
                        onDragLeave={handleDragOut}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{display: 'none'}} 
                            onChange={handleFileChange} 
                            accept=".xlsm,application/vnd.ms-excel.sheet.macroEnabled.12"
                        />
                        <FaRegFileExcel className="Large-f5 w-auto" />
                        {
                            dragging ?
                            <p>Suelta el archivo aquí</p>
                            :
                            <>
                                {
                                    !selectedFile ?
                                    <p>Arrastra el documento o solo da click para abrir tu escritorio y escoger el documento.</p>
                                    :
                                    <p>Archivo seleccionado: {selectedFile.name}</p>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/monitoring')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button 
                onClick={handleFileUpload} 
                className="Large_3 m_75 PowerMas_Buttom_Primary"
                disabled={!selectedFile}
                >
                    Siguiente
                </button>
            </footer>
        </>
    )
}

export default UploadBeneficiarie