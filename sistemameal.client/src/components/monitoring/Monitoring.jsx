import Notiflix from 'notiflix';
import React, { useEffect, useRef, useState } from 'react'
import Table from './Table';
import Modal from 'react-modal';
import { FaRegTrashAlt, FaDownload, FaFile  } from 'react-icons/fa';
import { formatterBudget } from './goal/helper';
import { fetchData } from '../reusable/helper';

const Monitoring = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [modalData, setModalData] = useState(null);

    const [monitoringData, setMonitoringData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const dragCounter = useRef(0);
    const dropRef = useRef(null);
    const fileInputRef = useRef();

    const closeModal = () => {
        setModalIsOpen(false);
        setModalData(null);
        setSelectedFiles([]);
    };
    

    const openModalWithData = (data) => {
        setModalData(data);
        console.log(data);
        setModalIsOpen(true);

        fetchData(`Meta/files/${data.metAno}/${data.metCod}`, (data) => {
            console.log(data)
            setSelectedFiles(data)
        })
    };

    
    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        fetchData('Monitoreo/Filter', setMonitoringData)
    }, []);

    const handleFileUpload = (file) => {
        Notiflix.Loading.pulse();
        const reader = new FileReader();
    
        reader.onloadend = async() => {
            // Aquí tienes los datos del archivo
            const dataUrl = reader.result;
    
            // Extrae los datos de la URL de los datos
            const fileData = dataUrl.split(',')[1];
    
            // Prepara los datos de MetasFuente
            const metasFuente = modalData; // Asegúrate de que modalData tenga los datos correctos
    
            // Construye el objeto MetasFuenteDto
            const metasFuenteDto = {
                MetaFuente: metasFuente,
                FileData: {
                    data: fileData, 
                    fileName: file.name,
                    fileSize: String(file.size)
                }
            };
    
            // Ahora puedes guardar los datos del archivo donde quieras
            // Por ejemplo, podrías hacer una solicitud a tu servidor para guardar el archivo
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/save-file`, {
                    method: 'POST',
                    body: JSON.stringify(metasFuenteDto),
                    headers: { 'Content-Type': 'application/json' },
                });
    
                const data = await response.json();

                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }

                fetchData(`Meta/files/${modalData.metAno}/${modalData.metCod}`, setSelectedFiles);

                Notiflix.Notify.success(data.message);
            } catch (error) {
                Notiflix.Notify.failure(error.message);
            } finally {
                Notiflix.Loading.remove();
            }
        };
    
        reader.readAsDataURL(file);
    };
    

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
            const fileType = file.type;
            if ([
                'application/pdf', 
                'application/vnd.ms-excel', 
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                'application/vnd.ms-excel.sheet.macroEnabled.12', 
                'image/jpeg', 
                'image/png', 
                'image/gif', 
                'video/mp4', 
                'video/quicktime', 
                'video/x-msvideo',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation' // Aquí se agrega el tipo MIME para .pptx
            ].includes(fileType)) {
                fileInputRef.current.files = e.dataTransfer.files;
                handleFileUpload(e.dataTransfer.files[0]); // Aquí se sube el archivo
            } else {
                Notiflix.Notify.failure("Formato no soportado")
            }
            e.dataTransfer.clearData();
            dragCounter.current = 0;
        }
    };
    
    const handleFileChange = (event) => {
        console.log(event.target.files[0])
        if ([
            'application/pdf', 
            'application/vnd.ms-excel', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
            'application/vnd.ms-excel.sheet.macroEnabled.12', 
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'video/mp4', 
            'video/quicktime', 
            'video/x-msvideo',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' // Aquí se agrega el tipo MIME para .pptx
        ].includes(event.target.files[0].type)) {
            handleFileUpload(event.target.files[0]); // Aquí se sube el archivo
        } else {
            Notiflix.Notify.failure("Formato no soportado")
        }
    };
    
    
    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const downloadFile = async (fileName) => {
        const url = `https://meal.ddns.net/uploads/${fileName}`
        try {
            Notiflix.Loading.pulse('Descargando...');
            // Obtenemos los datos
            const response = await fetch(url);
            if (!response.ok) {
                Notiflix.Notify.failure('Error al descargar el archivo');
                return;
            }
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // Divide el nombre del archivo en el primer "_"
                const splitFileName = fileName.split("_");
                // Toma la parte del nombre del archivo después del primer "_"
                const newFileName = splitFileName.length > 1 ? splitFileName.slice(1).join('_') : fileName;
                link.setAttribute('download', newFileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    
    
    
    const eliminarDocumento = async(index) => {
            const file = selectedFiles[index];
    
            // Prepara los datos de MetasFuente
            const metasFuente = modalData; // Asegúrate de que modalData tenga los datos correctos
    
            // Construye el objeto MetasFuenteDto
            const metasFuenteDto = {
                MetaFuente: metasFuente,
                FileData: {
                    fileName: file.metFueVerNom,
                    fileSize: String(file.metFueVerPes)
                }
            };
    
            // Ahora puedes guardar los datos del archivo donde quieras
            try {
                Notiflix.Loading.pulse('Cargando...');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/delete-file`, {
                    method: 'POST',
                    body: JSON.stringify(metasFuenteDto),
                    headers: { 'Content-Type': 'application/json' },
                });
    
                const data = await response.json();

                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }

                // En lugar de actualizar el estado aquí, volvemos a llamar a fetchData
                await fetchData(`Meta/files/${modalData.metAno}/${modalData.metCod}`, setSelectedFiles);

                Notiflix.Notify.success(data.message);
            } catch (error) {
                Notiflix.Notify.failure(error.message);
            } finally {
                Notiflix.Loading.remove();
            }
    };
    

    return (
        <>
            <Table 
                data={monitoringData}
                setMonitoringData={setMonitoringData}
                setModalIsOpen={openModalWithData}
            />
            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                closeTimeoutMS={200}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        width: '50%',
                        height: '90%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            >
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Fuentes de Verificación</h2>
                <div className="flex-grow-1 flex jc-center ai-center">
                    <div className="Large_10">
                        <article className="PowerMas_Article_Upload center">
                            <p style={{color: '#878280'}}>Solo se puede subir documentos en formato PDF,XLS,XLSM,XLSX,PPTX,JPG,PNG,MP4</p>
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
                                accept="*/*"
                            />
                            <FaFile className="Large-f5 w-auto" />
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
                <div className='flex-grow-1 overflow-auto m1'>
                    <table className="PowerMas_Modal_Documentos Large_12">
                        <thead className="">
                            <tr style={{position: 'sticky', top: '0', backgroundColor: '#fff'}}>
                                <th className=''></th>
                                <th className=''>Nombre</th>
                                <th className='center'>Tamaño</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td className="PowerMas_IconsTable">
                                        <div className='flex ai-center jc-center'>
                                            <FaDownload
                                                style={{width: '20px'}}
                                                data-tooltip-id="delete-tooltip" 
                                                data-tooltip-content="Descargar"
                                                onClick={() => downloadFile(`${file.metAno}${file.metCod}_${file.metFueVerNom}`)}
                                            />
                                        </div>
                                    </td>
                                    <td className='f_75' style={{whiteSpace: 'nowrap'}}>{file.metFueVerNom}</td>
                                    <td className='f_75' style={{whiteSpace: 'nowrap'}}>{formatterBudget.format(file.metFueVerPes / 1024)} KB</td>
                                    <td className="PowerMas_IconsTable">
                                        <div className='flex ai-center jc-center'>
                                            <FaRegTrashAlt
                                                style={{width: '20px'}}
                                                data-tooltip-id="delete-tooltip" 
                                                data-tooltip-content="Eliminar"
                                                onClick={() => eliminarDocumento(index)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {
                                selectedFiles.length == 0 &&
                                <tr className="center">
                                    <td colSpan={3} className="p1 f_75"> No se registraron documentos</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div className="center">
                    <button className="PowerMas_Buttom_Primary Large_3 center p_5 m_25" onClick={closeModal}>Cerrar</button>
                </div>
            </Modal>
        </>
    )
}

export default Monitoring