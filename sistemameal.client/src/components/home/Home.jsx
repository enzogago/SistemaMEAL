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


const Home = () => {
    const navigate = useNavigate();
    const [ monitoringData, setMonitoringData] = useState([])
    const [searchTags, setSearchTags] = useState([]);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [totalBeneficiarios, setTotalBeneficiarios] = useState(0);
    const [totalAtenciones, setTotalAtenciones] = useState(0);
    const [avanceTecnico, setAvanceTecnico] = useState(0);

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

    return(
    <>
        <div className="PowerMas_Search_Container_Home">
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
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Atenciones</span>
                    <span>{totalAtenciones.toLocaleString()}</span>
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Beneficiarios</span>
                    <span>{totalBeneficiarios.toLocaleString()}</span>
                </div>
                <div className="PowerMas_KPIRow flex-column Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Avance Técnico</span>
                    <DonutChart percentage={avanceTecnico} />
                </div>
            </div>
        </div>
        <div className='PowerMas_Direct_Access bg-white Large-p1 m1'>
            <h2 className="block center Large-p_5 Powermas_FontTitle">Accesos directos</h2>
            <div className="PowerMas_AccessCards">
                <div className="PowerMas_AccessCard Large_3">
                    <p className="block center bold Large-f1_25">Usuarios</p>
                    <Link className="PowerMas_AccessCardHeader flex Large-flex-row Medium-flex-column" to='/form-user'>
                        <FaUser className='Phone_1' />
                        <div className="PowerMas_AccessTitle Large_11 Large-f_75 center" >Crear usuario</div>
                    </Link>
                    <div className="PowerMas_AccessIndicator">
                        <span className="Large_6 Large-f_75">Total de usuarios</span>
                        <span className="Large_6 Large-f2">35</span>
                    </div>
                </div>
                <div className="PowerMas_AccessCard Large_3">
                    <p className="block center bold Large-f1_25">Proyectos</p>
                    <Link className="PowerMas_AccessCardHeader flex Large-flex-row Medium-flex-column" to='/form-project'>
                        <FaRProject className='Phone_1' />
                        <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear proyecto</div>
                    </Link>
                    <div className="PowerMas_AccessIndicator">
                        <span className="Large_6 Large-f_75">Total de proyectos</span>
                        <span className="Large_6 Large-f2">50</span>
                    </div>
                </div>
                <div className="PowerMas_AccessCard Large_3">
                    <p className="block center bold Large-f1_25">Metas</p>
                    <Link className="PowerMas_AccessCardHeader flex Large-flex-row Medium-flex-column" to='form-goal'>
                        <FaGlobeAsia className='Phone_1' />
                        <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear meta</div>
                    </Link>
                    <div className="PowerMas_AccessIndicator">
                        <span className="Large_6 Large-f_75">Total de metas</span>
                        <span className="Large_6 Large-f2">20</span>
                    </div>
                </div>
                <div className="PowerMas_AccessCard Large_3">
                    <p className="block center bold Large-f1_25">Beneficiarios</p>
                    <Link className="PowerMas_AccessCardHeader flex Large-flex-row Medium-flex-column">
                        <FaPersonBooth className='Phone_1'/>
                        <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear beneficiario</div>
                    </Link>
                    <div className="PowerMas_AccessIndicator">
                        <span className="Large_6 Large-f_75">Total de beneficiarios</span>
                        <span className="Large_6 Large-f2">90</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="PowerMas_RecentsSection flex Medium-flex-row Small-flex-column m1">
            <div className="PowerMas_ActivitiesSection Large_5 Medium_5 Phone_12 Large-p2">
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
            <div className="PowerMas_BeneficiarySection Large_7 Medium_7 Phone_12 Large-p1">
                <div className='flex'>
                    <article className='Phone_4'>
                        <h2 className="Large-m1 Large-f1_5 Powermas_FontTitle">Beneficiarios por</h2>
                        asda
                    </article>
                    <div className='Phone_8'>
                        <Paises />
                    </div>
                </div>
            </div>
        </div>
    </>)
};

export default Home;
