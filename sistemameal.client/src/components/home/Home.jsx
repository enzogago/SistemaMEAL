// React y hooks
import { Fragment, Suspense, lazy, useEffect, useState } from 'react';

// Componentes y gráficos reutilizables
import Table from './Table';
import HorizontalBarChart from '../reusable/graphics/HorizontalBarChart';
import DonutChart from '../reusable/DonutChart';
import PieChart from '../reusable/graphics/PieChart';
import DivergingBarChart from '../reusable/graphics/DivergingBarChart';

// Hooks personalizados
import { useSearchTags } from '../../hooks/useSearchTags';

// Helpers y formateadores
import { fetchDataBlock, fetchDataBlockHome } from '../reusable/helper';
import { formatter } from '../monitoring/goal/helper';

// Imágenes y iconos
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import DivergingEmpty from '../../img/PowerMas_DivergingEmpty.svg';
import PieEmpty from '../../img/PowerMas_PieEmpty.svg';
import BarEmpty from '../../img/PowerMas_BarEmpty.svg';
import Search from '../../icons/Search';
import IconCalendar from '../../icons/IconCalendar';
import useDateRange from '../../hooks/useDateRange';


const handleInput = (event) => {
    // Permite solo números y un guion en el formato MM-YYYY
    event.target.value = event.target.value.replace(/[^0-9-]/g, '');

    // Limita la longitud del input para que no exceda el formato MM-YYYY
    if (event.target.value.length > 7) {
        event.target.value = event.target.value.slice(0, 7);
    }
};

// Componentes de mapas (perezosos para optimizar la carga)
const MapComponents = {
    Paises: lazy(() => import('../maps/Paises')),
    Peru: lazy(() => import('../maps/Peru')),
    Ecuador: lazy(() => import('../maps/Ecuador')),
    Colombia: lazy(() => import('../maps/Colombia')),
};


const Home = () => {
   // Custom hooks para manejar la lógica de etiquetas de búsqueda
    const {
        searchTags,
        inputValue,
        handleInputChange,
        handleKeyDown,
        removeTag
    } = useSearchTags();

    const {
        periodoInicio,
        setPeriodoInicio,
        periodoFin,
        setPeriodoFin,
        handlePeriodoChange,
    } = useDateRange();

    // Estados para almacenar datos de la API
    const [monitoringData, setMonitoringData] = useState(null);
    const [totalBeneficiarios, setTotalBeneficiarios] = useState(0);
    const [totalAtenciones, setTotalAtenciones] = useState(0);
    const [avanceTecnico, setAvanceTecnico] = useState(0);
    const [avancePresupuesto, setAvancePresupuesto] = useState(0);

    // Estados para controlar la visualización de mapas y gráficos
    const [currentMap, setCurrentMap] = useState('todos');
    const [recents, setRecents] = useState([]);
    const [dataNac, setDataNac] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [docData, setDocData] = useState([]);
    const [rangeData, setRangeData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [beneficiariosData, setBeneficiariosData] = useState([]);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        fetchDataBlock('Log', setRecents, '.recents-block');
    }, []);

    useEffect(() => {
        const tagsParam = searchTags.length > 0 ? searchTags.join(',') : null;
        const periodoInicioParam = periodoInicio ? periodoInicio : null;
        const periodoFinParam = periodoFin ? periodoFin : null;
        const url = `${tagsParam}/${periodoInicioParam}/${periodoFinParam}`;

        // Inicializa el AbortController para manejar la cancelación de las solicitudes fetch
        const abortController = new AbortController(); 
    
        // Función para calcular y establecer el avance técnico y presupuestario
        const calculateAndSetProgress = (data) => {
            // Definimos los registros de la tabla
            setMonitoringData(data)
            // Suma los valores de metas y ejecuciones técnicas y presupuestarias
            const totalMeta = data.reduce((sum, item) => sum + Number(item.metMetTec), 0);
            const totalAtenciones = data.reduce((sum, item) => sum + Number(item.metEjeTec), 0);
            const totalMetaPre = data.reduce((sum, item) => sum + Number(item.metMetPre), 0);
            const totalAtencionesPre = data.reduce((sum, item) => sum + Number(item.metEjePre), 0);
    
            // Establece el total de atenciones
            setTotalAtenciones(totalAtenciones);
            
            // Calcula y establece el porcentaje de avance técnico
            const porcentaje = totalMeta !== 0 ? (totalAtenciones / totalMeta) * 100 : 0;
            setAvanceTecnico(porcentaje.toFixed(2));
    
            // Calcula y establece el porcentaje de avance presupuestario
            const porcentajePre = totalMetaPre !== 0 ? (totalAtencionesPre / totalMetaPre) * 100 : 0;
            setAvancePresupuesto(porcentajePre.toFixed(2));
        };
    
        // Llamada para obtener y procesar datos de monitoreo
        fetchDataBlockHome(`Monitoreo/Filter/${url}`, calculateAndSetProgress, '.table-home-block', abortController.signal);
    
        // Llamada para obtener el total de beneficiarios
        fetchDataBlockHome(`Beneficiario/contar-home/${url}`, (data) => {
            setTotalBeneficiarios(data.cantidad);
        }, '.js-element6', abortController.signal);
        
        // Llamada para obtener datos de rango de edad
        fetchDataBlockHome(`Beneficiario/rango-home/${url}`, setRangeData, '.js-element3', abortController.signal);
        
        // Llamada para obtener datos de beneficiarios por sexo
        fetchDataBlockHome(`Beneficiario/sexo-home/${url}`, (data) => {
            const dataFormat = data.map(item => ({ name: item.benSex, value: item.cantidad }));
            setPieData(dataFormat);
        }, '.sex-block', abortController.signal);
        
        // Llamada para obtener datos de beneficiarios por nacionalidad
        fetchDataBlockHome(`Nacionalidad/home/${url}`, (data) => {
            const dataFormat = data.map(item => ({ name: item.nacNom, value: item.cantidad }));
            setDataNac(dataFormat);
        }, '.js-element2', abortController.signal);
        
        // Llamada para obtener datos de beneficiarios por tipo de documento
        fetchDataBlockHome(`DocumentoIdentidad/home/${url}`, (data) => {
            const docDataFormat = data.map(item => ({ name: item.docIdeAbr, value: item.cantidad, tip: item.docIdeNom }));
            setDocData(docDataFormat);
        }, '.js-element4', abortController.signal);
        
        // Función de limpieza para cancelar las solicitudes fetch si el componente se desmonta
        return () => abortController.abort();
    }, [searchTags, periodoInicio, periodoFin]);

    useEffect(() => {
        const tagsParam = searchTags.length > 0 ? searchTags.join(',') : null;
        const periodoInicioParam = periodoInicio ? periodoInicio : null;
        const periodoFinParam = periodoFin ? periodoFin : null;
        const url = `${tagsParam}/${periodoInicioParam}/${periodoFinParam}`;
        
        // Cancela cualquier fetch anterior
        const abortController = new AbortController(); 
      
        // Función para obtener datos del mapa y beneficiarios según el país
        const fetchDataForMap = (country) => {
          // Llamada para obtener datos de ubicación para el mapa
          fetchDataBlockHome(`Monitoreo/${country}-home/${url}`, setMapData, '.ubication-block', abortController.signal);
      
          // Llamada para obtener datos de beneficiarios
          fetchDataBlockHome(`Beneficiario/${country}-home/${url}`, setBeneficiariosData, '.ubication-block', abortController.signal);
        };
      
        // Ejecuta la función fetchDataForMap con el país actual
        fetchDataForMap(currentMap);
      
        // Función de limpieza para cancelar las solicitudes fetch si el componente se desmonta
        return () => {
          abortController.abort();
        };
    }, [currentMap, searchTags]);
    
    
    let MapComponent;
    switch (currentMap) {
        case 'todos':
            MapComponent = MapComponents.Paises;
            break;
        case 'peru':
                MapComponent = MapComponents.Peru;
                break;
        case 'ecuador':
            MapComponent = MapComponents.Ecuador;
            break;
        case 'colombia':
            MapComponent = MapComponents.Colombia;
            break;
        default:
            MapComponent = MapComponents.Paises;
    }

    const maleColor = '#FFC65860';
    const femaleColor = '#F87C56';

    const data = [
        { name: 'Masculino', value: 39489, color: maleColor },
        { name: 'Femenino', value: 91949, color: femaleColor },
    ];

    function formatText(text) {
        // Reemplaza el texto entre corchetes con etiquetas span y la clase 'bold'
        return text.replace(/\[(.*?)\]/g, "<span class='PowerMas_Style_Log bold'>$1</span>");
    }
    function formatTextForTooltip(text) {
        // Reemplaza el texto entre corchetes sin las etiquetas span
        return text.replace(/\[(.*?)\]/g, "$1");
    }

    return (
        <>
            <div className="PowerMas_Search_Container_Home flex gap_25 Medium-p_25 Small-p_75" style={{paddingBottom: '1rem'}} >
                <div className="PowerMas_Input_Filter_Container flex flex-grow-1" style={{border: '1px solid #FFC658'}}>
                    <div className="flex ai-center">
                        {searchTags.map(tag => (
                            <span key={tag} className="PowerMas_InputTag flex">
                                <span className="f_75 flex ai-center">{tag}</span>
                                <button className="f_75" onClick={() => removeTag(tag)}>x</button>
                            </span>
                        ))}
                    </div>
                    <div className="Phone_12 flex ai-center relative">
                        <span style={{position: 'absolute', left: 15}}>
                            <Search />
                        </span>
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
                <span className='ai-center Small-none Medium-flex'>
                    |   
                </span>
                <div style={{border: '1px solid var(--naranja-ayuda)', borderRadius: '5px'}} className="Phone_3 Medium_2 flex ai-center relative">
                    <span style={{position: 'absolute', left: 15}}>
                        <IconCalendar />
                    </span>
                    <input 
                        className='PowerMas_Input_Filter Large_12 Large-p_5 m0'
                        type="text"
                        placeholder='MM-YYYY'
                        onInput={handleInput}
                        onKeyDown={handlePeriodoChange(setPeriodoInicio)}
                        maxLength={7}
                    />
                </div>
                <span className='flex ai-center'>
                    -
                </span>
                <div style={{border: '1px solid var(--naranja-ayuda)', borderRadius: '5px'}} className="Phone_3 Medium_2 flex ai-center relative">
                    <span style={{position: 'absolute', left: 15}}>
                        <IconCalendar />
                    </span>
                    <input 
                        className='PowerMas_Input_Filter Large_12 Large-p_5 m0'
                        type="text"
                        placeholder='MM-YYYY'
                        onInput={handleInput}
                        onKeyDown={handlePeriodoChange(setPeriodoFin)}
                        maxLength={7}
                    />
                </div>
            </div>
            <div className='PowerMas_Resume_Home overflow-auto'>
                <div className="PowerMas_ResumeHome m1 flex flex-column">
                    <div className=" flex Medium-flex-row Small-flex-column bg-white gap_5">
                        <div className="PowerMas_KPIRow Large_2 Medium_4 Small_12 Large-f1_25 Large-p1 Medium-p_5 Small-p1 table-home-block">
                            <p className="f1_25">Atenciones brindadas</p>
                            <span className='Medium_f2 Small-f1_5'>{formatter.format(Number(totalAtenciones))}</span>
                        </div>
                        <div className="PowerMas_KPIRow Large_2 Medium_4 Small_12 js-element6 Large-f1_25 Large-p1 Medium-p_5 Small-p1">
                            <p className="f1_25">Beneficiarios totales</p>
                            <span className='Medium_f2 Small-f1_5'>{formatter.format(Number(totalBeneficiarios))}</span>
                        </div>
                        <div className="PowerMas_KPIRow Large_2 Medium_4 Small_12 js-element6 Large-f1_25 Large-p1 Medium-p_5 Small-p1">
                            <p className="f1_25">Beneficiarios duplicados</p>
                            <span className='Medium_f2 Small-f1_5'>{formatter.format(Number(0))}</span>
                        </div>
                        <div className="PowerMas_KPIRow Large_3 Medium_6 Small_12 gap_3 flex-column Large-f1_25 table-home-block">
                            <p className="f1_25">Avance técnico</p>
                            <DonutChart percentage={avanceTecnico} wh={140} rad={20} newId={'Dona_Tecnico'} colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'} />
                        </div>
                        <div className="PowerMas_KPIRow Large_3 Medium_6 Small_12 gap_3 flex-column Large-f1_25 table-home-block">
                            <p className="f1_25" style={{whiteSpace: 'nowrap'}}>Avance presupuesto</p>
                            <DonutChart percentage={avancePresupuesto} wh={140} rad={20} newId={'Dona_Presupuesto'} colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'} />
                        </div>
                    </div>
                    <div 
                        className="PowerMas_Home_Card PowerMas_LeftSection flex Large_12 Medium_12 Phone_12 flex flex-column bg-white table-home-block" 
                        style={{minHeight: '26rem'}}
                    >
                        <div className='Large_12 Phone_12 p_5 PowerMas_Tittle_Map'>
                            <h4>Listado de Metas</h4>
                        </div>
                        {monitoringData && <Table data={monitoringData} />}
                    </div>
                </div>
                <div className='flex flex-column m1 gap-1 center'>
                    <div className="flex Large-flex-row Medium-flex-row Small-flex-column gap-1">
                        <div className='PowerMas_Home_Card Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                            <div className='Large_12 Phone_12 p_5 PowerMas_Tittle_Map'>
                                <h4>Beneficiarios por sexo</h4>
                            </div>
                            <div className='Large_12 Phone_12 flex flex-column flex-grow-1 Medium-p1 Small-p_75 sex-block'>
                                {
                                    pieData.length > 0 ?
                                    <>
                                        <div className='Large_12 Phone_12 flex flex-grow-1 ai-center jc-center'>
                                                <PieChart data={pieData} id='MaleFemale' />
                                        </div>
                                        <div className='flex flex-wrap gap-1 ai-center jc-center'>
                                            {data.map((item, index) => (
                                                <div key={index} className='flex ai-center gap_5'>
                                                    <div className='legend-color' style={{ backgroundColor: item.color, width: '15px', height: '15px' }}></div>
                                                    <span className='legend-label'>{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                    :
                                    <div className='Phone_12 flex flex-column ai-center jc-center Medium-m1 Small-m_75'>
                                        <img src={PieEmpty} alt="PieEmpty" className='Large_7' />
                                        <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='PowerMas_Home_Card Large-p0 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                            <div className='Large_12 Phone_12 p_5 PowerMas_Tittle_Map'>
                                <h4>Beneficiarios por edad</h4>
                            </div>
                            <div className='Large_12 Phone_12 flex flex-column ai-center jc-center js-element3 flex-grow-1 Medium-p1 Small-p_75'>
                                    {
                                        rangeData.length > 0 ?
                                        <>
                                            <div className='Large_12 Medium_12 Phone_12 flex-grow-1 flex ai-center jc-center'>
                                                <DivergingBarChart 
                                                    rangeData={rangeData}
                                                    maleColor={maleColor} 
                                                    femaleColor={femaleColor} 
                                                    id='Diverging' 
                                                />
                                            </div>
                                            <div className='flex flex-wrap gap-1 ai-center jc-center'>
                                                <div className='flex ai-center gap_5'>
                                                    <div className='legend-color' style={{ backgroundColor: maleColor, width: '15px', height: '15px' }}></div>
                                                    <span className='legend-label'>Masculino</span>
                                                </div>
                                                <div className='flex ai-center gap_5'>
                                                    <div className='legend-color' style={{ backgroundColor: femaleColor, width: '15px', height: '15px' }}></div>
                                                    <span className='legend-label'>Femenino</span>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <div className='Phone_12 flex flex-column ai-center jc-center Medium-m1 Small-m_75'>
                                            <img src={DivergingEmpty} alt="DivergingEmpty" className='' />
                                            <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                                        </div>
                                    }
                            </div>
                        </div>
                    </div>
                    <div className="flex Large-flex-row Medium-flex-row Small-flex-column gap-1">
                        <div className='PowerMas_Home_Card Large_6 Medium_6 Phone_12 flex flex-column ai-center' style={{minHeight: '24rem'}}>
                            <div className='Large_12 p_5 PowerMas_Tittle_Map'>
                                <h4>Beneficiarios por nacionalidad</h4>
                            </div>
                            <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex ai-center flex-grow-1 js-element2 Medium-p1 Small-p_75'>
                                {
                                    dataNac.length > 0 ?
                                        <HorizontalBarChart data={dataNac} id='NacionalidadBarChart' barColor='#F7775A' />
                                    :
                                        <div className='Phone_12 flex flex-column ai-center jc-center Medium-m1 Small-m_75'>
                                            <img src={BarEmpty} alt="BarEmpty" className='' />
                                            <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                                        </div>
                                    }
                            </div>
                        </div>
                        <div className='PowerMas_Home_Card Large_6 Medium_6 Phone_12 flex flex-column ai-center' style={{minHeight: '24rem'}}>
                            <div className='Large_12 p_5 PowerMas_Tittle_Map'>
                                <h4>Beneficiarios por tipo de documento</h4>
                            </div>
                            <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex ai-center flex-grow-1 js-element4 Medium-p1 Small-p_75'>
                                {
                                    docData.length > 0 ?
                                    <HorizontalBarChart data={docData} id='TipoDocBarChart' barColor='#F7775A' />
                                    :
                                    <div className='Phone_12 flex flex-column ai-center jc-center Medium-m1 Small-m_75'>
                                        <img src={BarEmpty} alt="BarEmpty" className='' />
                                        <p className='PowerMas_Text_Empty'>No se encontraron datos.</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="PowerMas_RecentsSection flex Large-flex-row Medium-flex-row Small-flex-column m1 gap-1">
                    <div className="PowerMas_Home_Card flex flex-column  Large_6 Medium_6 Phone_12 Large_p0" style={{maxHeight: '24rem'}}>
                        <div className='Large_12 p_5 PowerMas_Tittle_Map center'>
                            <h4>Actividades recientes</h4>
                        </div>
                        <div className='Large-p1 flex flex-column gap_3 overflow-auto recents-block flex-grow-1'>
                            {recents.map((item, index) => {
                                // Crea un objeto Date a partir de la cadena de fecha y horacon
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
                                let tooltipText = formatTextForTooltip(text);  // Formatea el texto para el tooltip
                                let shortText = text.length > 80 ? text.substring(0, 80) + '...' : text;
                                shortText = formatText(shortText);

                                return (
                                    <Fragment key={index}>
                                        <div className="flex ai-center gap-1">
                                            <div>
                                                <div className="PowerMas_ProfilePicture2 m_25" style={{width: '40px', height: '40px', border: '1px solid #000000'}}>
                                                    <img src={item && (item.usuAva ? `data:image/jpeg;base64,${item.usuAva}` : (item.usuSex == 'M' ? masculino : femenino ))} alt="Descripción de la imagen" />
                                                </div>
                                            </div>
                                            <div className="flex flex-column flex-grow-1">
                                                <span className='Large-f1 Small-f_75 bold' style={{textTransform: 'capitalize'}}>{item.usuNom.toLowerCase() + ' ' + item.usuApe.toLowerCase()}</span>
                                                <span 
                                                    data-tooltip-id="info-tooltip" 
                                                    data-tooltip-content={tooltipText}  // Usa el texto formateado para el tooltip
                                                    className='Large-f_75 Small-f_5' 
                                                    style={{textTransform: 'capitalize'}}
                                                    dangerouslySetInnerHTML={{ __html: shortText }}
                                                >
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
                    <div className='PowerMas_Home_Card Large-p0 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center gap_3' style={{minHeight: '24rem'}}>
                        <div className='Large_12 p_5 PowerMas_Tittle_Map center'>
                            <h4>Beneficiarios por ubicación</h4>
                        </div>
                        <div className='flex flex-grow-1 Phone_12 ubication-block' style={{position: 'relative'}}>
                            <article className='Medium_3 Phone_3 flex ai-center flex-grow-1' style={{position: 'absolute', bottom: '0', zIndex: '1'}}>
                                <div className='flex flex-column Medium-p_5 Small-p_25 Meidum-gap_5 Small-gap_25  Large_12'>
                                    <div className='bg-white' style={{borderRadius: '6px'}}>
                                        <button 
                                            className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'todos' ? 'Active' : ''}`} 
                                            onClick={() => setCurrentMap('todos')}
                                        >
                                            Todos
                                        </button>
                                    </div>
                                    <div className='bg-white' style={{borderRadius: '6px'}}>
                                        <button 
                                            className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'peru' ? 'Active' : ''}`} 
                                            onClick={() => setCurrentMap('peru')}
                                        >
                                            Perú
                                        </button>
                                    </div>
                                    <div className='bg-white' style={{borderRadius: '6px'}}>
                                        <button 
                                            className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'ecuador' ? 'Active' : ''}`} 
                                            onClick={() => setCurrentMap('ecuador')}
                                        >
                                            Ecuador
                                        </button>
                                    </div>
                                    <div className='bg-white' style={{borderRadius: '6px'}}>
                                        <button 
                                            className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'colombia' ? 'Active' : ''}`} 
                                            onClick={() => setCurrentMap('colombia')}
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
