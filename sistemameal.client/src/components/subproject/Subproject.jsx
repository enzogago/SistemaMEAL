import { useEffect, useMemo, useRef, useState } from 'react';
// Fetch Get
import { fetchData } from '../reusable/helper';
import Modal from 'react-modal';
import Download from '../../icons/Download';
import FileExcel from '../../icons/FileExcel';
import Delete from '../../icons/Delete';
import { formatterBudget } from '../monitoring/goal/helper';
import Notiflix from 'notiflix';
import { getColumns } from './columns';
import SearchInput from '../reusable/Tables/SearchInput';
import ExportMenu from '../reusable/Tables/ExportMenu';
import CommonTable from '../reusable/Tables/CommonTable';
import useEntityActions from '../../hooks/useEntityActions';
import Plus from '../../icons/Plus';
import { fetchDataBlock } from '../reusable/fetchs';
import { getMonthYearText } from '../reusable/columns';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Subproject = () => {
    const navigate = useNavigate();
    // States locales
    const [ data, setData ] = useState([])
    const [ refresh, setRefresh ] = useState([]);

    const [ modalIsOpen, setModalIsOpen ] = useState(false)
    const closeModal = () => {
        setModalIsOpen(false);
        setModalData(null);
        setSelectedFiles([]);
    };
    const openModalWithData = (data) => {
        setModalData(data);
        console.log(data);
        setModalIsOpen(true);

        fetchData(`SubProyecto/files/${data.subProAno}/${data.subProCod}`, (data) => {
            console.log(data)
            setSelectedFiles(data)
        })
    };

    const handleEditNavigate = (item) => {
        const id = `${item.subProAno}${item.subProCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-subproject/${safeCiphertext}`);
    }

    const actions = useEntityActions('SUBPROYECTO');
    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions, 'SubProyecto', openModalWithData, setRefresh, handleEditNavigate), [actions, 'Indicador', openModalWithData, setRefresh, handleEditNavigate]);
  
    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('SubProyecto', setData, '.subproject-block');
    }, [refresh]);

    const [searchFilter, setSearchFilter] = useState('');
    const filteredData = useMemo(() => 
        data.filter(item => {
            // Genera el texto del mes y año de inicio y fin
            const periodoInicio = getMonthYearText(item.subProPerMesIni, item.subProPerAnoIni);
            const periodoFin = getMonthYearText(item.subProPerMesFin, item.subProPerAnoFin);

            return (
                (item.subProNom ? item.subProNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.subProSap ? item.subProSap.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.proIde ? item.proIde.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.proNom ? item.proNom.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (item.subProInvSubAct === 'S' && 'PROYECTO CON SUB ACTIVIDADES'.includes(searchFilter.toUpperCase())) ||
                (item.subProInvSubAct === 'N' && 'PROYECTO SIN SUB ACTIVIDADES'.includes(searchFilter.toUpperCase())) ||
                (periodoInicio ? periodoInicio.toUpperCase().includes(searchFilter.toUpperCase()) : false) ||
                (periodoFin ? periodoFin.toUpperCase().includes(searchFilter.toUpperCase()) : false)
            );
        }), [data, searchFilter]
    );

    const headers = ['CODIGO_FINANCIACION', 'NOMBRE', 'RESPONSABLE','AÑO_INICIO','MES_INICIO','AÑO_FIN','MES_FIN','INVOLUCRA_SUB_ACTIVIDAD', 'PROYECTO'];  // Tus encabezados
    const properties = ['subProSap', 'subProNom', 'subProRes', 'subProPerAnoIni', 'subProPerMesIni', 'subProPerAnoFin', 'subProPerMesFin', 'subProInvSubAct', 'proNom'];  // Las propiedades de los objetos de datos que quieres incluir
    // Preparar los datos
    let dataExport = [...filteredData]; 
    // Modificar el campo 'uniInvPer' en los datos
    dataExport = dataExport.map(item => ({
        ...item,
        subProInvSubAct: item.subProInvSubAct === 'S' ? 'PROYECTO CON SUB ACTIVIDADES' : 'PROYECTO SIN SUB ACTIVIDADES',

    }));

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [dragging, setDragging] = useState(false);
    const dragCounter = useRef(0);
    const dropRef = useRef(null);
    const fileInputRef = useRef();

    const handleFileUpload = (file) => {
        Notiflix.Loading.pulse();
        const reader = new FileReader();
    
        reader.onloadend = async() => {
            // Aquí tienes los datos del archivo
            const dataUrl = reader.result;
    
            // Extrae los datos de la URL de los datos
            const fileData = dataUrl.split(',')[1];
    
            // Prepara los datos de MetasFuente
            const fuente = modalData; // Asegúrate de que modalData tenga los datos correctos
            // Construye el objeto MetasFuenteDto
            const SubProyectoFuenteDto = {
                SubProyectoFuente: fuente,
                FileData: {
                    data: fileData, 
                    fileName: file.name,
                    fileSize: String(file.size)
                }
            };
    
            // Ahora puedes guardar los datos del archivo donde quieras
            // Por ejemplo, podrías hacer una solicitud a tu servidor para guardar el archivo
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/SubProyecto/save-file`, {
                    method: 'POST',
                    body: JSON.stringify(SubProyectoFuenteDto),
                    headers: { 'Content-Type': 'application/json' },
                });
    
                const data = await response.json();

                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }

                fetchData(`SubProyecto/files/${modalData.subProAno}/${modalData.subProCod}`, setSelectedFiles);

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
                link.setAttribute('download', fileName);
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
            const fuentes = modalData; // Asegúrate de que modalData tenga los datos correctos
            console.log(file)
            // Construye el objeto MetasFuenteDto
            const SubProyectoFuenteDto = {
                SubProyectoFuente: fuentes,
                FileData: {
                    fileName: file.subProFueVerNom,
                    fileSize: String(file.subProFueVerPes)
                }
            };
    
            // Ahora puedes guardar los datos del archivo donde quieras
            try {
                Notiflix.Loading.pulse('Cargando...');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/SubProyecto/delete-file`, {
                    method: 'POST',
                    body: JSON.stringify(SubProyectoFuenteDto),
                    headers: { 'Content-Type': 'application/json' },
                });
    
                const data = await response.json();

                if (!response.ok) {
                    Notiflix.Notify.failure(data.message);
                    return;
                }

                // En lugar de actualizar el estado aquí, volvemos a llamar a fetchData
                await fetchData(`SubProyecto/files/${modalData.subProAno}/${modalData.subProCod}`, setSelectedFiles);

                Notiflix.Notify.success(data.message);
            } catch (error) {
                Notiflix.Notify.failure(error.message);
            } finally {
                Notiflix.Loading.remove();
            }
    };

    return (
        <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto subproject-block">
                <h3>Listado de Indicadores</h3>
                <div className="flex gap_5 p_25">
                    {/* Componente para la entrada de búsqueda con etiquetas */}
                    <SearchInput
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    <button 
                        className='flex jc-space-between ai-center Large_3 Large-p_5 PowerMas_Buttom_Primary'
                        onClick={() => navigate('/form-subproject')} 
                        disabled={!actions.add}
                    >
                        Nuevo 
                        <span className='flex f1_25'>
                            <Plus />
                        </span>
                    </button>
                    {/* Menú de exportación con opciones condicionales basadas en los permisos */}
                    <ExportMenu
                        filteredData={dataExport}
                        headers={headers}
                        title={'SUB PROYECTOS'}
                        properties={properties}
                        format={[500,250]}
                        actions={actions}
                    />
                </div>
                {/* Tabla común para mostrar los datos filtrados */}
                <CommonTable 
                    data={filteredData} 
                    columns={columns}
                    isLargePagination={true}
                />
            </div>
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
                        flexDirection: 'column',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30
                    }
                }}
            >
                <span className="PowerMas_CloseModal" style={{position: 'absolute',right: 20, top: 10}} onClick={closeModal}>×</span>
                <h2 className='PowerMas_Title_Modal f1_5 center'>Documentación de Formulación</h2>
                <div className="flex-grow-1 flex jc-center ai-center overflow-auto">
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
                            <span className="Large-f4 flex ai-center jc-center" >
                                <FileExcel />
                            </span>
                            {
                                dragging ?
                                <p>Suelta el archivo aquí</p>
                                :
                                <>
                                <p>Arrastra el documento o solo da click para abrir tu escritorio y escoger el documento.</p>
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
                                            <span 
                                                className="flex Large-f1_25"
                                                data-tooltip-id="delete-tooltip" 
                                                data-tooltip-content="Descargar"
                                                onClick={() => downloadFile(`${file.subProFueVerNom}`)}
                                            >
                                                <Download /> 
                                            </span>
                                        </div>
                                    </td>
                                    <td className='f_75 p_25' style={{whiteSpace: 'nowrap'}}>{file.subProFueVerNom}</td>
                                    <td className='f_75' style={{whiteSpace: 'nowrap'}}>{formatterBudget.format(file.subProFueVerPes / 1024)} KB</td>
                                    <td className="PowerMas_IconsTable">
                                        <span 
                                            className='flex ai-center jc-center f1_25'
                                            data-tooltip-id="delete-tooltip" 
                                            data-tooltip-content="Eliminar"
                                            onClick={() => eliminarDocumento(index)}
                                        >
                                            <Delete />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {
                                selectedFiles.length == 0 &&
                                <tr className="center">
                                    <td colSpan={4} className="p1 f_75"> No se registraron documentos</td>
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
    );
};

export default Subproject;
