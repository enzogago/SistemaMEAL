import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';
import Table from './Table';
import DonutChart from '../reusable/DonutChart';
import Paises from '../maps/Paises';
import Ecuador from '../maps/Ecuador';
import Peru from '../maps/Peru';
import Colombia from '../maps/Colombia';
import PieChart from '../reusable/graphics/PieChart';
import DivergingBarChart from '../reusable/graphics/DivergingBarChart';
import HorizontalBarChart from '../reusable/graphics/HorizontalBarChart';
import masculino from '../../img/PowerMas_Avatar_Masculino.svg';
import femenino from '../../img/PowerMas_Avatar_Femenino.svg';
import { fetchData } from '../reusable/helper';


const Home = () => {
    const [ monitoringData, setMonitoringData] = useState([])
    const [searchTags, setSearchTags] = useState([]);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [totalBeneficiarios, setTotalBeneficiarios] = useState(0);
    const [totalAtenciones, setTotalAtenciones] = useState(0);
    const [avanceTecnico, setAvanceTecnico] = useState(0);
    const [currentMap, setCurrentMap] = useState('Todos');
    const [ recents, setRecents ] = useState([]);
    const [ nacionalidades, setNacionalidades ] = useState([]);
    const [ dataNac, setDataNac ] = useState([]);
    const [ nacionalidadesLoaded, setNacionalidadesLoaded ] = useState(false);
    const [ pieData, setPieData ] = useState([]);
    

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
                console.log(response)
                if (!response.ok) {
                    if(response.status == 401 || response.status == 403){
                        const data = await response.json();
                        Notiflix.Notify.failure(data.message);
                    }
                    return;
                }
                const data = await response.json();
                console.log(data)
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
        const fetchDataHome = async () => {
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
                // Conteo de beneficiarios
                setTotalBeneficiarios(data.length);

                // Contar beneficiarios por sexo
                let maleCount = 0;
                let femaleCount = 0;
                data.forEach(beneficiario => {
                    if (beneficiario.benSex === 'M') {
                        maleCount++;
                    } else if (beneficiario.benSex === 'F') {
                        femaleCount++;
                    }
                });

                // Actualizar la data del gráfico de pastel
                setPieData([
                    { name: 'Masculino', value: maleCount, color: maleColor },
                    { name: 'Femenino', value: femaleCount, color: femaleColor },
                ]);
    
                // Crear un objeto para contar las nacionalidades
                const nacionalidadesCount = {};
                data.forEach(beneficiario => {
                    if (!nacionalidadesCount[beneficiario.nacCod]) {
                        nacionalidadesCount[beneficiario.nacCod] = 1;
                    } else {
                        nacionalidadesCount[beneficiario.nacCod]++;
                    }
                });

                // Convertir el objeto a un array para usarlo en el gráfico
                const dataNac = Object.keys(nacionalidadesCount).map(nacCod => {
                    const nacNom = nacionalidades.find(n => n.nacCod === nacCod).nacNom;
                    return { name: nacNom, value: nacionalidadesCount[nacCod] };
                });
                setDataNac(dataNac);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        if (nacionalidadesLoaded) {
            fetchDataHome();
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

    const maleColor = '#1d6776';
    const femaleColor = '#61A2AA';

    const data = [
        { name: 'Masculino', value: 39489, color: maleColor },
        { name: 'Femenino', value: 91949, color: femaleColor },
    ];

    const maleData = [
        { age: 10, count: 20 },
        { age: 15, count: 30 },
        { age: 50, count: 80 },
        { age: 8, count: 80 },
        { age: 58, count: 10 },
        { age: 90, count: 8 },
        // ...
    ];
    
    const femaleData = [
        { age: 8, count: 70 },
        { age: 10, count: 25 },
        { age: 15, count: 35 },
        { age: 30, count: 50 },
        { age: 40, count: 60 },
        { age: 58, count: 30 },
        { age: 68, count: 50 },
        { age: 69, count: 80 },
        // ...
    ];

    const ageRanges = [
        { min: 0, max: 9 },
        { min: 10, max: 29 },
        { min: 30, max: 54 },
        { min: 55, max: 64 },
        { min: 65, max: 150 }
    ];
    
    const groupDataByAgeRange = (data) => {
        return ageRanges.map(range => {
            const count = data.reduce((total, d) => {
                if (d.age >= range.min && d.age <= range.max) {
                    total += d.count;
                }
                return total;
            }, 0);
            return { age: `${range.min}-${range.max}`, count };
        });
    };
    
    const groupedMaleData = groupDataByAgeRange(maleData);
    const groupedFemaleData = groupDataByAgeRange(femaleData);

    // const dataNac = [
    //     { name: 'Peruana', value: 100 },
    //     { name: 'Colombiana', value: 200 },
    //     { name: 'Ecuatoriana', value: 80 },
    //     { name: 'Argentina', value: 310 },
    //     { name: 'Chilena', value: 20 },
    // ];
    const dataTipDoc = [
        { name: 'DNI', value: 100 },
        { name: 'CE', value: 200 },
        { name: 'CC', value: 80 },
        { name: 'PDN', value: 310 },
        { name: 'PAS', value: 20 },
    ];


    return(
    <>
        <div className="PowerMas_Search_Container_Home " style={{paddingBottom: '1rem'}}>
            <div className="PowerMas_Input_Filter_Container flex">
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

        <div className="PowerMas_ResumeHome m1 flex Small-flex-column Medium-flex-column Large-flex-row">
            <div className="PowerMas_LeftSection flex Large_8 Medium_12 Phone_12 bg-white">
                {monitoringData ? <Table data={monitoringData} /> : <p>Cargando datos...</p>}
            </div>
            <div className="PowerMas_RightSection flex flex-column Large_4 Medium_12 Phone_12 bg-white p1 gap_5">
                <h2 className="Large-m_75 Large-f1_5 Powermas_FontTitle">Principales KPI</h2>
                <div className="PowerMas_KPIRow flex-column Large-f1_25">
                    <span className="bold Powermas_FontTitle">Avance Técnico</span>
                    <DonutChart percentage={avanceTecnico} wh={150} rad={20} />
                </div>
                <div className="PowerMas_KPIRow Large-f1_25 Large-p1 Medium-p_5">
                    <span className="bold Powermas_FontTitle">Atenciones</span>
                    <span>{totalAtenciones.toLocaleString()}</span>
                </div>
                <div className="PowerMas_KPIRow Large-f1_25 Large-p1 Medium-p_5">
                    <span className="bold Powermas_FontTitle">Beneficiarios</span>
                    <span>{totalBeneficiarios.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div className='flex flex-column m1 gap-1 center'>
            <div className="flex Large-flex-row Medium-flex-row Small-flex-column gap-1">
                <div className='PowerMas_Home_Card p1 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                    <h4>Beneficiarios por Nacionalidad</h4>
                    <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex-grow-1'>
                        <HorizontalBarChart data={dataNac} id='NacionalidadBarChart' barColor='#1d6776' />
                    </div>
                </div>
                <div className='PowerMas_Home_Card p1 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                    <h4>Beneficiarios por Tipo de documento</h4>
                    <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex-grow-1'>
                        <HorizontalBarChart data={dataTipDoc} id='TipoDocBarChart' barColor='#1d6776' />
                    </div>
                </div>
                
            </div>
            <div className="flex Large-flex-row Medium-flex-row Small-flex-column gap-1">
                <div className='PowerMas_Home_Card Large-p1 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                    <h4>Beneficiarios por Edad</h4>
                    <div className='Large_12 Medium_12 Phone_12 Large-p1 Medium-p_75 flex-grow-1'>
                        <DivergingBarChart maleData={groupedMaleData} femaleData={groupedFemaleData} maleColor={maleColor} femaleColor={femaleColor} ageRanges={ageRanges} id='Diverging' />
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
                <div className='PowerMas_Home_Card p1 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                    <h4>Beneficiarios por Sexo</h4>
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
            </div>
        </div>
        
        <div className="PowerMas_RecentsSection flex Large-flex-row Medium-flex-row Small-flex-column m1 gap-1">
            <div className="PowerMas_Home_Card flex flex-column Large_6 Medium_6 Phone_12 p1 gap-1">
                <h4 className="Large-f1_25 Small-f1 center p_25">Actividades recientes</h4>
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

                    let text = item.logDes;
                    let shortText = text.length > 60 ? text.substring(0, 60) + '...' : text;

                    return (
                        <div className="flex ai-center gap-1" key={index}>
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
                    );
                })}
            </div>
            <div className='PowerMas_Home_Card Large-p1 Medium-p_75 Large_6 Medium_6 Phone_12 flex flex-column ai-center gap-1'>
                <h4>Beneficiarios por Ubicación</h4>
                <div className='flex flex-grow-1 Phone_12' style={{position: 'relative'}}>
                    <article className='flex ai-center flex-grow-1' style={{position: 'absolute', bottom: '0'}}>
                        <div className='flex flex-column p_5 gap_5 Large_12'>
                            <button 
                                className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Todos' ? 'Active' : ''}`} 
                                onClick={() => setCurrentMap('Todos')}
                            >
                                Todos
                            </button>
                            <button 
                                className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Perú' ? 'Active' : ''}`} 
                                onClick={() => setCurrentMap('Perú')}
                            >
                                Perú
                            </button>
                            <button 
                                className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Ecuador' ? 'Active' : ''}`} 
                                onClick={() => setCurrentMap('Ecuador')}
                            >
                                Ecuador
                            </button>
                            <button 
                                className={`PowerMas_Buttom_Map PowerMas_Buttom_Map_${currentMap === 'Colombia' ? 'Active' : ''}`} 
                                onClick={() => setCurrentMap('Colombia')}
                            >
                                Colombia
                            </button>
                        </div>
                    </article>
                    <div className='Large_6 Medium_12 Phone_12 flex-grow-1'>
                        <MapComponent />
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
};

export default Home;
