import { useEffect, useState } from 'react';
import { FaGlobeAsia, FaPersonBooth, FaRProject, FaReceipt, FaSearch, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';
import Table from './Table';
import DonutChart from '../reusable/DonutChart';
import Paises from '../maps/Paises';
import Ecuador from '../maps/Ecuador';
import Peru from '../maps/Peru';
import Colombia from '../maps/Colombia';
import PieChart from '../reusable/graphics/PieChart';
import DivergingBarChart from '../reusable/graphics/DivergingBarChart';



const Home = () => {
    const navigate = useNavigate();
    const [ monitoringData, setMonitoringData] = useState([])
    const [searchTags, setSearchTags] = useState([]);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [totalBeneficiarios, setTotalBeneficiarios] = useState(0);
    const [totalAtenciones, setTotalAtenciones] = useState(0);
    const [avanceTecnico, setAvanceTecnico] = useState(0);
    const [currentMap, setCurrentMap] = useState('Todos');

    

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

        const fetchBeneficiariosCount = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/BeneficiariosCount/${searchTags.join(',')}`, {
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
                const count = await response.json();
                setTotalBeneficiarios(count);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };
    
        fetchMonitoreo();
        fetchBeneficiariosCount();
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

    const maleColor = '#61A2AA';
    const femaleColor = '#98C0C6';

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

    

    return(
    <>
        <div className="PowerMas_Search_Container_Home" style={{paddingBottom: '1rem'}}>
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
                        className='PowerMas_Input_Filter Large_12 Large-p_5'
                        type="search"
                        placeholder='Buscar'
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                    />
                </div>
            </div>
        </div>

        <div className="PowerMas_ResumeHome m1 flex flex-space-between Small-flex-column Medium-flex-row">
            <div className="PowerMas_LeftSection Large_8 Phone_12 bg-white">
                {monitoringData ? <Table data={monitoringData} /> : <p>Cargando datos...</p>}
            </div>
            <div className="PowerMas_RightSection Large_4 Phone_12 bg-white">
                <h2 className="Large-m_75 Large-f1_5 Powermas_FontTitle">Principales KPI</h2>
                <div className="PowerMas_KPIRow flex-column Large-m_75 Large-f1_25">
                    <span className="bold Powermas_FontTitle">Avance Técnico</span>
                    <DonutChart percentage={avanceTecnico} wh={150} rad={20} />
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Atenciones</span>
                    <span>{totalAtenciones.toLocaleString()}</span>
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Beneficiarios</span>
                    <span>{totalBeneficiarios.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div className='flex flex-column m1 gap-1'>
            <div className="flex gap-1">
                <div className='PowerMas_Home_Card Large-p1 Large_6 Medium_6'>
                    <h4>Beneficiarios por Nacionalidad</h4>
                </div>
                <div className='PowerMas_Home_Card Large-p1 Large_6 Medium_6'>
                    <h4>Beneficiarios por Tipo de documento</h4>
                </div>
                
            </div>
            <div className="flex gap-1">
                <div className='PowerMas_Home_Card p1 Large_6 Medium_6 Phone_12 flex flex-column ai-center'>
                    <h4>Beneficiarios por Edad</h4>
                    <div className='Large_12 Medium_12 Phone_12 Large-p1 Small-p_75 flex-grow-1'>
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
                    <div className='Large_5 Medium_12 Phone_12 Large-p1 Small-p_75 flex-grow-1'>
                        <PieChart data={data} id='MaleFemale' />
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
        
        <div className="PowerMas_RecentsSection flex Medium-flex-row Small-flex-column m1 gap-1">
            <div className="PowerMas_Home_Card PowerMas_ActivitiesSection Large_6 Medium_5 Phone_12 Large-p2">
                <h2 className="Large-f1_5 Powermas_FontTitle">Actividades recientes</h2>
                <div className="PowerMas_Article flex Large-f_75 ai-center left">
                    <div className='PowerMas_Icon Large_2 Large-f1_5'>
                        <div>
                            <FaReceipt className='Large-f1_25' />
                        </div>
                    </div>
                    <div className="PowerMas_Info Large_8 Large-m1">Omar Chuman registró 55
                        beneficiarios al indice...
                    </div>
                    <div className="PowerMas_DateTime Large_2">
                        <span>04/12/2023</span>
                        <span>14:12</span>
                    </div>
                </div>
                <hr className='PowerMas_Hr p0 m0' />
                <div className="PowerMas_Article flex Large-f_75 ai-center left">
                    <div className='PowerMas_Icon Large_2 Large-f1_5'>
                        <div>
                            <FaReceipt className='Large-f1_25' />
                        </div>
                    </div>
                    <div className="PowerMas_Info Large_8 Large-m1">
                        Omar Chuman registró 55
                        beneficiarios al indice...
                    </div>
                    <div className="PowerMas_DateTime Large_2">
                        <span>04/12/2023</span>
                        <span>14:12</span>
                    </div>
                </div>
                <hr className='PowerMas_Hr p0 m0' />
                <div className="PowerMas_Article flex Large-f_75 ai-center left">
                    <div className='PowerMas_Icon Large_2 Large-f1_5'>
                        <div>
                            <FaReceipt className='Large-f1_25' />
                        </div>
                    </div>
                    <div className="PowerMas_Info Large_8 Large-m1">
                        Omar Chuman registró 55 beneficiarios al indice...
                    </div>
                    <div className="PowerMas_DateTime Large_2">
                        <span>04/12/2023</span>
                        <span>14:12</span>
                    </div>
                </div>
            </div>
            <div className="PowerMas_Home_Card PowerMas_BeneficiarySection Large_6 Medium_7 Phone_12 flex">
                <div className='flex flex-grow-1'>
                    <article className='Phone_5 flex-grow-1'>
                        <h2 className="Large-m1 Large-f1_5 Powermas_FontTitle">Beneficiarios por</h2>
                        <div className='flex flex-column p1 gap_5'>
                            <button className='PowerMas_Buttom_Primary' onClick={() => setCurrentMap('Todos')}>Todos</button>
                            <button className='PowerMas_Buttom_Primary' onClick={() => setCurrentMap('Perú')}>Perú</button>
                            <button className='PowerMas_Buttom_Primary' onClick={() => setCurrentMap('Ecuador')}>Ecuador</button>
                            <button className='PowerMas_Buttom_Primary' onClick={() => setCurrentMap('Colombia')}>Colombia</button>
                        </div>
                    </article>
                    <div className='Phone_7 flex-grow-1'>
                        <MapComponent />
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
};

export default Home;
