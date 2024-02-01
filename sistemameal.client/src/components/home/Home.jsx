import { useEffect, useState } from 'react';
import { FaGlobeAsia, FaPersonBooth, FaRProject, FaReceipt, FaSearch, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';
import Table from './Table';


const Home = () => {
    const navigate = useNavigate();
    const [ monitoringData, setMonitoringData] = useState([])
    // EFECTO AL CARGAR COMPONENTE GET - LISTAR ESTADOS
    useEffect(() => {
        const fetchMonitoreo = async () => {
            try {
                Notiflix.Loading.pulse('Cargando...');
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo`, {
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
            } catch (error) {
                console.error('Error:', error);
            } finally {
                Notiflix.Loading.remove();
            }
        };

        fetchMonitoreo();
    }, []);

    return(
    <>
        <div className="PowerMas_SearchContainer flex ai-center">
            <FaSearch className='PowerMas_InputIcon'/>
            <input className="PowerMas_Input Phone_12 p_75" type="search" placeholder="" />
        </div>

        <div className="PowerMas_ResumeHome m1">
            <div className="PowerMas_LeftSection Large_8 bg-white">
                {monitoringData.length > 0 ? <Table data={monitoringData} /> : <p>Cargando datos...</p>}
            </div>
            <div className="PowerMas_RightSection Large_4 bg-white">
                <h2 className="Large-m_75 Large-f1_5 Powermas_FontTitle">Principales KPI</h2>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Atenciones</span>
                    <span>8,617</span>
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Beneficiarios</span>
                    <span>4,814</span>
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25 Large-p1">
                    <span className="bold Powermas_FontTitle">Avance Técnico</span>

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
        <div className="PowerMas_RecentsSection flex m1">
            <div className="PowerMas_ActivitiesSection Large_5 Large-p2">
                <h2 className=" Large-f1_5 Powermas_FontTitle">Actividades recientes</h2>
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
            <div className="PowerMas_BeneficiarySection Large_7 Large-p1">
                <h2 className="Large-m1 Large-f1_5 Powermas_FontTitle">Beneficiarios por ciudad</h2>
                <div id="map"></div>
                <div id="legend"></div>
            </div>
        </div>
    </>)
};

export default Home;
