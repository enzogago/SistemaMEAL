import { Fragment, Suspense, lazy, useEffect, useState } from 'react';
import Notiflix from 'notiflix';
import Table from './Table';
const DonutChart = lazy(() => import('../reusable/DonutChart'));
const Paises = lazy(() => import('../maps/Paises'));
const Peru = lazy(() => import('../maps/Peru'));
const Ecuador = lazy(() => import('../maps/Ecuador'));
const Colombia = lazy(() => import('../maps/Colombia'));
const PieChart = lazy(() => import('../reusable/graphics/PieChart'));
const DivergingBarChart = lazy(() => import('../reusable/graphics/DivergingBarChart'));
import HorizontalBarChart from '../reusable/graphics/HorizontalBarChart';
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import { formatter } from '../monitoring/goal/helper';

import DivergingEmpty from '../../img/PowerMas_DivergingEmpty.svg';
import PieEmpty from '../../img/PowerMas_PieEmpty.svg';
import BarEmpty from '../../img/PowerMas_BarEmpty.svg';
import Search from '../../icons/Search';

const Home = () => {
    const [ monitoringData, setMonitoringData] = useState(null)
    const [ searchTags, setSearchTags] = useState([]);
    const [ isInputEmpty, setIsInputEmpty] = useState(true);
    const [ inputValue, setInputValue] = useState('');
    const [ totalBeneficiarios, setTotalBeneficiarios] = useState(0);
    const [ totalAtenciones, setTotalAtenciones] = useState(0);
    const [ avanceTecnico, setAvanceTecnico] = useState(0);
    const [ avancePresupuesto, setAvancePresupuesto] = useState(0);
    const [ currentMap, setCurrentMap] = useState('Todos');
    const [ recents, setRecents ] = useState([]);
    const [ dataNac, setDataNac ] = useState([]);
    const [ pieData, setPieData ] = useState([]);

    const [ docData, setDocData ] = useState([]);
    const [ rangeData, setRangeData ] = useState([]);
    const [ mapData, setMapData ] = useState([]);
    const [ beneficiariosData, setBeneficiariosData ] = useState([]);
    const [ disabledFilter, setDisabledFilter ] = useState(false);

    const fetchData = async (controller, setData, clase) => {
        try {
            if (document.querySelector(clase)) {
                Notiflix.Block.pulse(clase, {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
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
            if (document.querySelector(clase)) {
                Notiflix.Block.remove(clase);
            }
        }
    };

    const fetchMonitoreo = async () => {
        try {
            if (document.querySelector('.js-element5')) {
                Notiflix.Block.pulse('.js-element5', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
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
            console.log(data);
            setMonitoringData(data);
            const totalMeta = data.reduce((sum, item) => item.indFor === '' ? sum + Number(item.metMetTec) : sum, 0);
            const totalAtenciones = data.reduce((sum, item) => item.indFor === '' ? sum + Number(item.metEjeTec) : sum, 0);
            const totalMetaPre = data.reduce((sum, item) => item.indFor === '' ? sum + Number(item.metMetPre) : sum, 0);
            const totalAtencionesPre = data.reduce((sum, item) => item.indFor === '' ? sum + Number(item.metEjePre) : sum, 0);

            setTotalAtenciones(totalAtenciones);
            
            const porcentaje = totalMeta !== 0 ? (totalAtenciones / totalMeta) * 100 : 0;
            setAvanceTecnico(porcentaje.toFixed(2));
            const porcentajePre = totalMetaPre !== 0 ? (totalAtencionesPre / totalMetaPre) * 100 : 0;
            setAvancePresupuesto(porcentajePre.toFixed(2));
        } catch (error) {
            console.error('Error:', error);
            setMonitoringData([]); 
        } finally {
            Notiflix.Block.remove('.js-element5');
        }
    };

    const fetchContarBeneficiariosHome = async () => {
        try {
            if (document.querySelector('.js-element6')) {
                Notiflix.Block.pulse('.js-element6', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
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
            Notiflix.Block.remove('.js-element6');
        }
    };
    
    const fetchBeneficiariosHome = async () => {
        try {
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
        }
    };

    const fetchDocumentosHome = async () => {
        try {
            if (document.querySelector('.js-element4')) {
                Notiflix.Block.pulse('.js-element4', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
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
            Notiflix.Block.remove('.js-element4');
        }
    };
    const fetchNacionalidadesHome = async () => {
        try {
            if (document.querySelector('.js-element2')) {
                Notiflix.Block.pulse('.js-element2', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
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
            Notiflix.Block.remove('.js-element2');
        }
    };
    const fetchSexosHome = async () => {
        try {
            if (document.querySelector('.js-element')) {
                Notiflix.Block.pulse('.js-element', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
            
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
            if (document.querySelector('.js-element')) {
                Notiflix.Block.remove('.js-element');
            }
        }
    };
    const fetchRangoHome = async () => {
        try {
            if (document.querySelector('.js-element3')) {
                Notiflix.Block.pulse('.js-element3', {
                    svgSize: '100px',
                    svgColor: '#F87C56',
                });
            }
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
            
            console.log(data)
            setRangeData(data)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Block.remove('.js-element3');
        }
    };
    const fetchUbicacionesHome = async () => {
        try {
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
        }
    };
    
    
    useEffect(() => {
        fetchData('Log', setRecents, '.recents-block');
    }, [])
    
    useEffect(() => {
        const abortController = new AbortController(); 
    
        fetchContarBeneficiariosHome(abortController.signal);
        fetchMonitoreo(abortController.signal);
        fetchSexosHome(abortController.signal);
        fetchRangoHome(abortController.signal);
        fetchNacionalidadesHome(abortController.signal);
        fetchDocumentosHome(abortController.signal);
        fetchBeneficiariosHome(abortController.signal);
        fetchUbicacionesHome(abortController.signal);
    
        setDisabledFilter(false);
    }, [searchTags]);
    

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
                            <button className="f_75" onClick={() => removeTag(tag)} disabled={disabledFilter}>x</button>
                        </span>
                    ))}
                </div>
                <div className="Phone_12 relative">
                    <Search />
                    <input 
                        className='PowerMas_Input_Filter Phone_12 Large-p_5'
                        style={{cursor: `${disabledFilter ? 'progress' : ''}`}}
                        type="search"
                        placeholder='Buscar'
                        disabled={disabledFilter}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                    />
                </div>
            </div>
        </div>
        <div className='PowerMas_Resume_Home overflow-auto'>
            <div className="PowerMas_ResumeHome m1 flex flex-column">
                <div className=" flex Medium-flex-row Small-flex-column bg-white gap_5">
                    <div className="PowerMas_KPIRow Large_2 Medium_4 Small_12 Large-f1_25 Large-p1 Medium-p_5">
                        <p className="f1_25">Atenciones brindadas</p>
                        <span className='Medium_f2 Small-f1_5'>{formatter.format(Number(totalAtenciones))}</span>
                    </div>
                    <div className="PowerMas_KPIRow Large_2 Medium_4 Small_12 js-element6 Large-f1_25 Large-p1 Medium-p_5">
                        <p className="f1_25">Beneficiarios totales</p>
                        <span className='Medium_f2 Small-f1_5'>{formatter.format(Number(totalBeneficiarios))}</span>
                    </div>
                    <div className="PowerMas_KPIRow Large_2 Medium_4 Small_12 js-element6 Large-f1_25 Large-p1 Medium-p_5">
                        <p className="f1_25">Beneficiarios duplicados</p>
                        <span className='Medium_f2 Small-f1_5'>{formatter.format(Number(0))}</span>
                    </div>
                    <div className="PowerMas_KPIRow Large_3 Medium_6 Small_12 gap_3 flex-column Large-f1_25">
                        <p className="f1_25" style={{whiteSpace: 'nowrap'}}>Avance presupuesto</p>
                        <DonutChart percentage={avancePresupuesto} wh={140} rad={20} newId={'Dona_Presupuesto'} colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'} />
                    </div>
                    <div className="PowerMas_KPIRow Large_3 Medium_6 Small_12 gap_3 flex-column Large-f1_25">
                        <p className="f1_25">Avance técnico</p>
                        <DonutChart percentage={avanceTecnico} wh={140} rad={20} newId={'Dona_Tecnico'} colorText={'#000'} colorPc={'#F87C56'} colorSpc={'#F7775A20'} />
                    </div>
                </div>
                <div className="PowerMas_Home_Card PowerMas_LeftSection flex Large_12 Medium_12 Phone_12 flex flex-column bg-white js-element5" style={{minHeight: '26rem'}}>
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
                        <div className='Large_12 Phone_12 flex flex-column flex-grow-1 Medium-p1 Small-p_75'>
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
                            let shortText = text.length > 50? text.substring(0, 50) + '...' : text;

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
                <div className='PowerMas_Home_Card Large-p0 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center gap_3' style={{minHeight: '24rem'}}>
                    <div className='Large_12 p_5 PowerMas_Tittle_Map center'>
                        <h4>Beneficiarios por ubicación</h4>
                    </div>
                    <div className='flex flex-grow-1 Phone_12' style={{position: 'relative'}}>
                        <article className='Medium_3 Phone_3 flex ai-center flex-grow-1' style={{position: 'absolute', bottom: '0', zIndex: '1'}}>
                            <div className='flex flex-column Medium-p_5 Small-p_25 Meidum-gap_5 Small-gap_25  Large_12'>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'Todos' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Todos')}
                                    >
                                        Todos
                                    </button>
                                </div>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'Perú' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Perú')}
                                    >
                                        Perú
                                    </button>
                                </div>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'Ecuador' ? 'Active' : ''}`} 
                                        onClick={() => setCurrentMap('Ecuador')}
                                    >
                                        Ecuador
                                    </button>
                                </div>
                                <div className='bg-white' style={{borderRadius: '6px'}}>
                                    <button 
                                        className={`PowerMas_Buttom_Map Medium-p_5 Small-p_5 Medium-f_75 Small-f_5 PowerMas_Buttom_Map_${currentMap === 'Colombia' ? 'Active' : ''}`} 
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
