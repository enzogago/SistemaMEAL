import Notiflix from 'notiflix';
import React, { useEffect, useRef, useState } from 'react'
import Table from './Table';
import Modal from 'react-modal';
import { FaRegFileExcel, FaRegTrashAlt } from 'react-icons/fa';
import { formatterBudget } from './goal/helper';

const Monitoring = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);


    const [ monitoringData, setMonitoringData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const dragCounter = useRef(0);
    const dropRef = useRef(null);
    const fileInputRef = useRef();

    const closeModal = () => {
        setModalIsOpen(false)
    }
    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchMonitoreo = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/Filter`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if(response.status == 401 || response.status == 403){
                        const data = await response.json();
                        Notiflix.Notify.failure(data.message);
                    }
                    return;
                }
                const data = await response.json();
                if (data.success == false) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }
                setMonitoringData(data);
                console.log(data)
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        fetchMonitoreo();
    }, []);


    const handleFileUpload = (file) => {
        const reader = new FileReader();
    
        reader.onloadend = async() => {
            // Aquí tienes los datos del archivo
            const dataUrl = reader.result;
    
            // Extrae los datos de la URL de los datos
            const fileData = dataUrl.split(',')[1];
            console.log(fileData)
    
            // Ahora puedes guardar los datos del archivo donde quieras
            // Por ejemplo, podrías hacer una solicitud a tu servidor para guardar el archivo
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/save-file`, {
                method: 'POST',
                body: JSON.stringify({ 
                    data: fileData, 
                    fileName: file.name // Aquí incluyes el nombre del archivo
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                Notiflix.Notify.failure("Error al subir el archivo.");
                return;
            }
            const data = await response.json();
    
            Notiflix.Notify.success(data.message);
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
            if (['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel.sheet.macroEnabled.12', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(fileType)) {
                fileInputRef.current.files = e.dataTransfer.files;
                setSelectedFile(e.dataTransfer.files[0]); // Aquí se actualiza el estado selectedFile
                setSelectedFiles(prevFiles => [...prevFiles, e.dataTransfer.files[0]]); // Aquí se agrega el archivo a la lista de selectedFiles
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
        if (['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel.sheet.macroEnabled.12', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(event.target.files[0].type)) {
            setSelectedFiles(prevFiles => [...prevFiles, event.target.files[0]]);
            handleFileUpload(event.target.files[0]); // Aquí se sube el archivo
        } else {
            Notiflix.Notify.failure("Formato no soportado")
        }
    };
    
    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const eliminarDocumento = async (index) => {
        const file = selectedFiles[index];
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Meta/delete-file`, {
            method: 'DELETE',
            body: JSON.stringify({ 
                fileName: file.name // Aquí incluyes el nombre del archivo
            }),
            headers: { 'Content-Type': 'application/json' },
        });
    
        if (!response.ok) {
            Notiflix.Notify.failure("Error al eliminar el archivo.");
            return;
        }
        const data = await response.json();
    
        Notiflix.Notify.success(data.message);
    
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    

    return (
        <>
            <Table 
                data={monitoringData}
                setMonitoringData={setMonitoringData}
                setModalIsOpen={setModalIsOpen}
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
                            <p style={{color: '#878280'}}>Solo se puede subir documentos en formato PDF</p>
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
                <div className='flex-grow-1 overflow-auto m1'>
                    <table className="PowerMas_Modal_Documentos Large_12">
                        <thead className="">
                            <tr style={{position: 'sticky', top: '0', backgroundColor: '#fff'}}>
                                <th className=''>Nombre</th>
                                <th className='center'>Tamaño</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td className='f_75' style={{whiteSpace: 'nowrap'}}>{file.name}</td>
                                    <td className='f_75' style={{whiteSpace: 'nowrap'}}>{formatterBudget.format(file.size / 1024)} KB</td>
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
                    <button className="PowerMas_Buttom_Primary Large_3 center p_5 m_25"  onClick={handleFileUpload}>Guardar</button>
                </div>
            </Modal>
        </>
    )
}

export default Monitoring