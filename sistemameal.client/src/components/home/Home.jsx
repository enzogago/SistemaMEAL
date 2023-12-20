import { useEffect } from 'react';
import drawDonut from '../../js/drawDonut';
import { FaSearch } from 'react-icons/fa';


const Home = () => {

    useEffect(() => {
        drawDonut(60);
    }, []);

    return(
    <div>
        <div className="PowerMas_SearchContainer">
            <FaSearch className='PowerMas_InputIcon'/>
            <input className="PowerMas_Input" type="search" placeholder="" />
        </div>

        <div className="PowerMas_ResumeHome">
            <div className="PowerMas_LeftSection Large_8 Large-p1">
                <h2 className="Large-m1 Large-f1_5 Powermas_FontTitle">Listado de Metas</h2>
                <div className="PowerMas_CheckboxContainer Large-f_75 Large-m1">
                    <input type="checkbox" id="filtro1" name="filtro1" />
                    <label htmlFor="filtro1">Terminado</label>
                    <input type="checkbox" id="filtro2" name="filtro2" />
                    <label htmlFor="filtro2">En proceso</label>
                    <input type="checkbox" id="filtro3" name="filtro3" />
                    <label htmlFor="filtro3">Pendiente</label>
                    <input type="checkbox" id="filtro4" name="filtro4" />
                    <label htmlFor="filtro4">Retrasado</label>
                    <input type="checkbox" id="filtro5" name="filtro5" />
                    <label htmlFor="filtro5">Todos</label>
                </div>
                    <table className="PowerMas_TableHome Large-f_75">
                        <thead>
                            <tr>
                                <th>Subactividad</th>
                                <th>Estado</th>
                                <th>Meta</th>
                                <th>Ejecución</th>
                                <th>Avance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>asdsadasdasd</td>
                                <td>Dato 2</td>
                                <td>Dato 3</td>
                                <td>Dato 4</td>
                                <td>Dato 5</td>
                            </tr>
                            <tr>
                                <td>Dato 1</td>
                                <td>Dato 2</td>
                                <td>Dato 3</td>
                                <td>Dato 4</td>
                                <td>Dato 5</td>
                            </tr>
                            <tr>
                                <td>Dato 1</td>
                                <td>Dato 2</td>
                                <td>Dato 3</td>
                                <td>Dato 4</td>
                                <td>Dato 5</td>
                            </tr>
                            <tr>
                                <td>Dato 1</td>
                                <td>Dato 2</td>
                                <td>Dato 3</td>
                                <td>Dato 4</td>
                                <td>Dato 5</td>
                            </tr>
                            <tr>
                                <td>Dato 1</td>
                                <td>Dato 2</td>
                                <td>Dato 3</td>
                                <td>Dato 4</td>
                                <td>Dato 5</td>
                            </tr>
                        </tbody>
                    </table>

            </div>
            <div className="PowerMas_RightSection Large_4">
                <h2 className="Large-m_75 Large-f1_5 Powermas_FontTitle">Principales kpi</h2>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25">
                    <span className="bold Powermas_FontTitle">Atenciones</span>
                    <span>8,617</span>
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25">
                    <span className="bold Powermas_FontTitle">Beneficiarios</span>
                    <span>4,814</span>
                </div>
                <div className="PowerMas_KPIRow Large-m_75 Large-f1_25">
                    <span className="bold Powermas_FontTitle">Avance Técnico</span>
                    <div id="donutContainer">
                        <svg id="donut" width="80" height="80">
                                <circle r="35" cx="40" cy="40" fill="transparent" stroke="#ddd" strokeWidth="10"></circle>
                                <circle id="progress" r="35" cx="40" cy="40" fill="transparent" stroke="#4caf50" strokeWidth="10" strokeDasharray="219.911" strokeDashoffset="219.911"></circle>
                        </svg>
                        <div id="counter">60%</div>
                    </div>

                </div>
            </div>
        </div>

        <h2 className="block center Large-p1 Powermas_FontTitle">Accesos directos</h2>
        <div className="PowerMas_AccessCards">
            <div className="PowerMas_AccessCard Large_3">
                <p className="block center bold Large-f1_25">Usuarios</p>
                <div className="PowerMas_AccessCardHeader">
                    <i className="fas fa-user Large_1"></i>
                    <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear usuario</div>
                </div>
                <div className="PowerMas_AccessIndicator">
                    <span className="Large_6 Large-f_75">Total de usuarios</span>
                    <span className="Large_6 Large-f2">35</span>
                </div>
            </div>
            <div className="PowerMas_AccessCard Large_3">
                <p className="block center bold Large-f1_25">Proyectos</p>
                <div className="PowerMas_AccessCardHeader">
                    <i className="fas fa-user Large_1"></i>
                    <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear proyecto</div>
                </div>
                <div className="PowerMas_AccessIndicator">
                    <span className="Large_6 Large-f_75">Total de proyectos</span>
                    <span className="Large_6 Large-f2">50</span>
                </div>
            </div>
            <div className="PowerMas_AccessCard Large_3">
                <p className="block center bold Large-f1_25">Metas</p>
                <div className="PowerMas_AccessCardHeader">
                    <i className="fas fa-user Large_1"></i>
                    <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear meta</div>
                </div>
                <div className="PowerMas_AccessIndicator">
                    <span className="Large_6 Large-f_75">Total de metas</span>
                    <span className="Large_6 Large-f2">20</span>
                </div>
            </div>
            <div className="PowerMas_AccessCard Large_3">
                <p className="block center bold Large-f1_25">Beneficiarios</p>
                <div className="PowerMas_AccessCardHeader">
                    <i className="fas fa-user Large_1"></i>
                    <div className="PowerMas_AccessTitle Large_11 Large-f_75 center">Crear beneficiario</div>
                </div>
                <div className="PowerMas_AccessIndicator">
                    <span className="Large_6 Large-f_75">Total de beneficiarios</span>
                    <span className="Large_6 Large-f2">90</span>
                </div>
            </div>
        </div>
        <div className="PowerMas_RecentsSection Large_12 flex">
            <div className="PowerMas_ActivitiesSection Large_5 Large-p2">
                <h2 className=" Large-f1_5 Powermas_FontTitle">Actividades recientes</h2>
                <div className="PowerMas_Article flex Large-f_75 ai-center left">
                    <div className="PowerMas_Icon Large_2 Large-f1_5">
                        <i className="fas fa-receipt Large-m_75"></i>
                    </div>
                    <div className="PowerMas_Info Large_8 Large-m1">Omar Chuman registró 55
                        beneficiarios al indice...
                    </div>
                    <div className="PowerMas_DateTime Large_2">
                        <span>04/12/2023</span>
                        <span>14:12</span>
                    </div>
                </div>
                <div className="PowerMas_Article flex Large-f_75 ai-center left">
                    <div className="PowerMas_Icon Large_2 Large-f1_5">
                        <i className="fas fa-receipt Large-m_75"></i>
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
                <div className="PowerMas_Article flex Large-f_75 ai-center left">
                    <div className="PowerMas_Icon Large_2 Large-f1_5">
                        <i className="fas fa-receipt Large-m_75"></i>
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
            </div>
            <div className="PowerMas_BeneficiarySection Large_7 Large-p1">
                <h2 className="Large-m1 Large-f1_5 Powermas_FontTitle">Beneficiarios por ciudad</h2>
                <div id="map"></div>
                <div id="legend"></div>
            </div>

        </div>
    </div>)
};

export default Home;
