import { Fragment, Suspense, lazy, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Notiflix from 'notiflix';
import Table from './Table';
const DonutChart = lazy(() => import('../reusable/DonutChart'));
const Paises = lazy(() => import('../maps/Paises'));
const Peru = lazy(() => import('../maps/Peru'));
const Ecuador = lazy(() => import('../maps/Ecuador'));
const Colombia = lazy(() => import('../maps/Colombia'));
const PieChart = lazy(() => import('../reusable/graphics/PieChart'));
const DivergingBarChart = lazy(() => import('../reusable/graphics/DivergingBarChart'));
const HorizontalBarChart = lazy(() => import('../reusable/graphics/HorizontalBarChart'));
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import { formatter } from '../monitoring/goal/helper';


const Home = () => {
    const [ monitoringData, setMonitoringData] = useState([])
    const [ searchTags, setSearchTags] = useState([]);
    const [ isInputEmpty, setIsInputEmpty] = useState(true);
    const [ inputValue, setInputValue] = useState('');
    const [ totalBeneficiarios, setTotalBeneficiarios] = useState(0);
    const [ totalAtenciones, setTotalAtenciones] = useState(0);
    const [ avanceTecnico, setAvanceTecnico] = useState(0);
    const [ currentMap, setCurrentMap] = useState('Todos');
    const [ recents, setRecents ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ dataNac, setDataNac ] = useState([]);
    const [ nacionalidadesLoaded, setNacionalidadesLoaded ] = useState(false);
    const [ pieData, setPieData ] = useState([]);

    const [docData, setDocData] = useState([]);
    const [rangeData, setRangeData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [beneficiariosData, setBeneficiariosData] = useState([]);

    const fetchData = async (controller, setData) => {
        try {
            Notiflix.Loading.pulse('Cargando...');
            // Valores del storage
            const token = localStorage.getItem('token');
            
            // Obtenemos los datos
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/${controller}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if(response.status === 401 || response.status === 403){
                    const data = await response.json();
                    Notiflix.Notify.failure(data.message);
                }
                return;
            }
            const data = await response.json();
            if (data.success === false) {
                Notiflix.Notify.failure(data.message);
                return;
            }
            setData(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchMonitoreo = async () => {
            setMonitoringData(null); 
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/Filter/${searchTags.join(',')}`, {
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
                const totalMeta = data.reduce((sum, item) => sum + Number(item.metMetTec), 0);
                const totalAtenciones = data.reduce((sum, item) => sum + Number(item.metEjeTec), 0);
                const porcentaje = totalMeta !== 0 ? (totalAtenciones / totalMeta) * 100 : 0;
                setTotalAtenciones(totalAtenciones);
                setAvanceTecnico(porcentaje.toFixed(2));
            } catch (error) {
                console.error('Error:', error);
                setMonitoringData([]); 
            } finally {
                Notiflix.Loading.remove();
            }
        };

        fetchData('Nacionalidad', data => {
            setNacionalidades(data);
            setNacionalidadesLoaded(true);
        });

        fetchData('Log',setRecents);
        fetchMonitoreo();
    }, [searchTags]);


    useEffect(() => {
        const fetchContarBeneficiariosHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/contar-home/${searchTags.join(',')}`, {
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
                // Suma de la propiedad 'cantidad' en todos los objetos
                setTotalBeneficiarios(data.cantidad);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        
        const fetchBeneficiariosHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/home/${searchTags.join(',')}`, {
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
                // Suma de la propiedad 'cantidad' en todos los objetos
                setBeneficiariosData(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        const fetchDocumentosHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/DocumentoIdentidad/home/${searchTags.join(',')}`, {
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
                
                // Convierte el objeto a un array para usarlo en el gráfico
                const docData = data.map(item => ({ name: item.docIdeAbr, value: item.cantidad, tip: item.docIdeNom }));

                setDocData(docData);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchNacionalidadesHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Nacionalidad/home/${searchTags.join(',')}`, {
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
                // Convierte el objeto a un array para usarlo en el gráfico
                const dataFormat = data.map(item => ({ name: item.nacNom, value: item.cantidad }));

                setDataNac(dataFormat);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchSexosHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/sexo-home/${searchTags.join(',')}`, {
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
                // Convierte el objeto a un array para usarlo en el gráfico
                const dataFormat = data.map(item => ({ name: item.benSex, value: item.cantidad }));

                setPieData(dataFormat);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchRangoHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/rango-home/${searchTags.join(',')}`, {
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
                setRangeData(data)
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
        const fetchUbicacionesHome = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/paises-home/${searchTags.join(',')}`, {
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
                setMapData(data)
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        if (nacionalidadesLoaded) {
            fetchContarBeneficiariosHome();
            fetchBeneficiariosHome();
            fetchDocumentosHome();
            fetchNacionalidadesHome();
            fetchSexosHome();
            fetchRangoHome();
            fetchUbicacionesHome();
        }
    }, [nacionalidadesLoaded, searchTags]);

    // Añade una nueva etiqueta al presionar Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue && !searchTags.includes(inputValue)) {
            setSearchTags(prevTags => [...prevTags, inputValue]);
            setInputValue('');  // borra el valor del input
            setIsInputEmpty(true);
        } else if (e.key === 'Backspace' && isInputEmpty && searchTags.length > 0) {
            setSearchTags(prevTags => prevTags.slice(0, -1));
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);  // actualiza el valor del input
        setIsInputEmpty(e.target.value === '');
    }

    // Elimina una etiqueta
    const removeTag = (tag) => {
        setSearchTags(searchTags.filter(t => t !== tag));
    }

    let MapComponent;
    switch (currentMap) {
        case 'Todos':
            MapComponent = Paises;
            break;
        case 'Perú':
            MapComponent = Peru;
            break;
        case 'Ecuador':
            MapComponent = Ecuador;
            break;
        case 'Colombia':
            MapComponent = Colombia;
            break;
        default:
            MapComponent = Paises;
    }

    const maleColor = '#FFC65860';
    const femaleColor = '#F87C56';

    const data = [
        { name: 'Masculino', value: 39489, color: maleColor },
        { name: 'Femenino', value: 91949, color: femaleColor },
    ];

    return(
    <>
        <div className="PowerMas_Search_Container_Home " style={{paddingBottom: '1rem'}} >
            <div className="PowerMas_Input_Filter_Container flex" style={{border: '1px solid #FFC658'}}>
                <div className="flex ai-center">
                    {searchTags.map(tag => (
                        <span key={tag} className="PowerMas_InputTag flex">
                            <span className="f_75 flex ai-center">{tag}</span>
                            <button className="f_75" onClick={() => removeTag(tag)}>x</button>
                        </span>
                    ))}
                </div>
                <div className="Phone_12 relative">
                    <FaSearch className="search-icon" />
                    <input 
                        className='PowerMas_Input_Filter Phone_12 Large-p_5'
                        type="search"
                        placeholder='Buscar'
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                    />
                </div>
            </div>
        </div>

        <div className='PowerMas_Resume_Home overflow-auto'>
            <div className="PowerMas_ResumeHome m1 flex flex-column">
                <div className="PowerMas_RightSection flex Large_12 Medium_12 Phone_12 bg-white gap_5">
                    {/* <h2 className="Large-m_75 Large-f1_5 Powermas_FontTitle">Principales KPI</h2> */}
                    <div className="PowerMas_KPIRow Large-f1_25 Large-p1 Medium-p_5">
                        <p className="f1_25">Atenciones brindadas</p>
                        <span className='f2'>{formatter.format(totalAtenciones)}</span>
                    </div>
                    <div className="PowerMas_KPIRow Large-f1_25 Large-p1 Medium-p_5">
                        <p className="f1_25">Beneficiarios totales</p>
                        <span className='f2'>{formatter.format(Number(totalBeneficiarios))}</span>
                    </div>
                    <div className="PowerMas_KPIRow Large-f1_25 Large-p1 Medium-p_5">
                        <p className="f1_25">Beneficiarios recurrentes</p>
                        <span className='f2'>{formatter.format(0)}</span>
                    </div>
                    <div className="PowerMas_KPIRow gap_3 flex-column Large-f1_25">
                        <p className="f1_25" style={{whiteSpace: 'nowrap'}}>Avance presupuesto</p>
                        <Suspense fallback={<div>Cargando...</div>}>
                            <DonutChart percentage={avanceTecnico} wh={140} rad={20} newId={'Dona_Presupuesto'} colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'} />
                        </Suspense>
                    </div>
                    <div className="PowerMas_KPIRow gap_3 flex-column Large-f1_25">
                        <p className="f1_25">Avance técnico</p>
                        <Suspense fallback={<div>Cargando...</div>}>
                            <DonutChart percentage={avanceTecnico} wh={140} rad={20} newId={'Dona_Tecnico'} colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'} />
                        </Suspense>
                    </div>
                </div>
                <div className=" PowerMas_Home_Card PowerMas_LeftSection flex Large_12 Medium_12 Phone_12 bg-white">
                    {monitoringData ? <Table data={monitoringData} /> : <p>Cargando datos...</p>}
                </div>
            </div>
            <div className='flex flex-column m1 gap-1 center'>
                <div className="flex Large-flex-row Medium-flex-row Small-flex-column gap-1">
                    <div className='PowerMas_Home_Card Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                        <div className='Large_12 p_5 PowerMas_Tittle_Map'>
                            <h4>Beneficiarios por sexo</h4>
                        </div>
                        <div className='Large_6 Medium_12 Phone_12 Large-p1 Small-p_75 flex-grow-1'>
                            <PieChart data={pieData} id='MaleFemale' />
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            {data.map((item, index) => (
                                <div key={index} className='flex ai-center gap_5'>
                                    <div className='legend-color' style={{ backgroundColor: item.color, width: '15px', height: '15px' }}></div>
                                    <span className='legend-label'>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='PowerMas_Home_Card Large-p0 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                        <div className='Large_12 p_5 PowerMas_Tittle_Map'>
                            <h4>Beneficiarios por edad</h4>
                        </div>
                        <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex-grow-1'>
                            <Suspense fallback={<div>Cargando...</div>}>
                                <DivergingBarChart 
                                    rangeData={rangeData}
                                    maleColor={maleColor} 
                                    femaleColor={femaleColor} 
                                    id='Diverging' 
                                />
                            </Suspense>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            <div className='flex ai-center gap_5'>
                                <div className='legend-color' style={{ backgroundColor: maleColor, width: '15px', height: '15px' }}></div>
                                <span className='legend-label'>Masculino</span>
                            </div>
                            <div className='flex ai-center gap_5'>
                                <div className='legend-color' style={{ backgroundColor: femaleColor, width: '15px', height: '15px' }}></div>
                                <span className='legend-label'>Femenino</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex Large-flex-row Medium-flex-row Small-flex-column gap-1">
                    <div className='PowerMas_Home_Card Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                        <div className='Large_12 p_5 PowerMas_Tittle_Map'>
                            <h4>Beneficiarios por nacionalidad</h4>
                        </div>
                        <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex-grow-1'>
                            <Suspense fallback={<div>Cargando...</div>}>
                                <HorizontalBarChart data={dataNac} id='NacionalidadBarChart' barColor='#F7775A' />
                            </Suspense>
                        </div>
                    </div>
                    <div className='PowerMas_Home_Card Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                        <div className='Large_12 p_5 PowerMas_Tittle_Map'>
                            <h4>Beneficiarios por tipo de documento</h4>
                        </div>
                        <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex-grow-1'>
                            <Suspense fallback={<div>Cargando...</div>}>
                                <HorizontalBarChart data={docData} id='TipoDocBarChart' barColor='#F7775A' />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="PowerMas_RecentsSection flex Large-flex-row Medium-flex-row Small-flex-column m1 gap-1">
                <div className="PowerMas_Home_Card flex flex-column  Large_6 Medium_6 Phone_12 Large_p0">
                    <div className='Large_12 p_5 PowerMas_Tittle_Map center'>
                        <h4>Actividades recientes</h4>
                    </div>
                    <div className='Large-p1 flex flex-column gap_3 overflow-auto'>
                        {recents.map((item, index) => {
                            // Crea un objeto Date a partir de la cadena de fecha y hora
                            const date = new Date(item.logFecIng);
                            // Formatea la fecha y la hora
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, así que añadimos 1
                            const year = date.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;

                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            const formattedTime = `${hours}:${minutes}`;

                            let text = item.logDes ? item.logDes : '';
                            let shortText = text.length > 50? text.substring(0, 50) + '...' : text;

                            return (
                                <Fragment  key={index}>
                                    <div className="flex ai-center gap-1">
                                        <div>
                                            <div className="PowerMas_ProfilePicture2 m_25" style={{width: '40px', height: '40px', border: '1px solid #000000'}}>
                                                <img src={masculino} alt="Descripción de la imagen" />
                                            </div>
                                        </div>
                                        <div className="flex flex-column flex-grow-1">
                                            <span className='Large-f1 Small-f_75 bold' style={{textTransform: 'capitalize'}}>{item.usuNom.toLowerCase() + ' ' + item.usuApePat.toLowerCase() + ' ' + item.usuApeMat.toLowerCase()}</span>
                                            <span 
                                                data-tooltip-id="info-tooltip" 
                                                data-tooltip-content={text} 
                                                className='Large-f_75 Small-f_5' 
                                                style={{textTransform: 'capitalize'}}
                                            >
                                                {shortText.toLowerCase()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-column center Large-f_75 Small-f_5">
                                            <span>{formattedDate}</span>
                                            <span>{formattedTime}</span>
                                        </div>
                                    </div>
                                    {
                                        (recents.length != (index+1)) &&
                                        <hr className='PowerMas_Hr m0' />
                                    }
                                </Fragment>
                            );
                        })}
                    </div>
                </div>
                <div className='PowerMas_Home_Card Large-p0 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center gap_3'>
                    <div className='Large_12 p_5 PowerMas_Tittle_Map center'>
                        <h4>Beneficiarios por ubicación</h4>
                    </div>
                    <div className='flex flex-grow-1 Phone_12' style={{position: 'relative'}}>
                        <article className='flex ai-center flex-grow-1' style={{position: 'absolute', bottom: '0', zIndex: '1'}}>
                            <div className='flex flex-column p_5 gap_5 Large_12'>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Todos' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Todos')}
                                    >
                                        Todos
                                    </button>
                                </div>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Perú' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Perú')}
                                    >
                                        Perú
                                    </button>
                                </div>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Ecuador' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Ecuador')}
                                    >
                                        Ecuador
                                    </button>
                                </div>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Colombia' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Colombia')}
                                    >
                                        Colombia
                                    </button>
                                </div>
                            </div>
                        </article>
                        <Suspense fallback={<div>Cargando...</div>}>
                            <MapComponent mapData={mapData} beneficiariosData={beneficiariosData} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
};

export default Home;
