import Notiflix from 'notiflix';
import React, { useEffect, useRef, useState } from 'react'
import Table from './Table';
import Modal from 'react-modal';
import { FaRegFileExcel } from 'react-icons/fa';

const Monitoring = () => {
    const [ monitoringData, setMonitoringData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)

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
            if (fileType === 'pdf') {
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
        if (event.target.files[0].type === 'application/pdf') {
            setSelectedFile(event.target.files[0]);
        } else {
            Notiflix.Notify.failure("Formato no soportado")
        }
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
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        padding: '20px'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            >
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Fuentes de Verificación</h2>
                <div className="flex-grow-1 flex jc-center ai-center overflow-auto">
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
                                accept=".pdf"
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
                <br />
                <div className="center">
                    <button className="PowerMas_Buttom_Primary Large_3 center p_5 m_25" onClick={closeModal}>Guardar</button>
                </div>
            </Modal>
        </>
    )
}

export default Monitoring