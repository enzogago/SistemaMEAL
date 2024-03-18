import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Notiflix Configuracion estilos
import './js/notiflixConfig';
// Context
import { AuthContext } from './context/AuthContext';
// Componentes
import Home from './components/home/Home';
import Login from './components/auth/Login';
import PrivateRoute from './components/router/PrivateRoute';
import PublicRoute from './components/router/PublicRoute';
import Layout from './components/router/Layout';
import Monitoring from './components/monitoring/Monitoring';
import User from './components/user/User';
import FormUser from './components/user/FormUser';
import MenuUser from './components/user/MenuUser';
import PermissionUser from './components/user/PermissionUser';
import Status from './components/status/Status';
import IdentityDocumento from './components/document/IdentityDocumento';
import Charge from './components/charge/Charge';
import Role from './components/role/Role';
import Financer from './components/financer/Financer';
import Implementer from './components/implementer/Implementer';
import Permission from './components/permission/Permission';
import TypeValue from './components/type-value/TypeValue';
import FormProject from './components/project/FormProject';
import Projects from './components/project/Projects';
import Dashboard from './components/dashboard/Dashboard';
import FormGoal from './components/monitoring/goal/FormGoal';
import Gender from './components/gender/Gender';
import Nationality from './components/Nationality.jsx/Nationality';
import Unit from './components/Unit/Unit';
import NotFound from './components/NotFound';
import Beneficiarie from './components/beneficiarie/Beneficiarie';
import FormGoalBeneficiarie from './components/monitoring/beneficiarie/FormGoalBeneficiarie';
import FormBeneficiarie from './components/beneficiarie/FormBeneficiarie';
import FormProfile from './components/profile/FormProfile';
import FormatProject from './components/upload/project/FormatProject';
import Notiflix from 'notiflix';
import SaveProject from './components/upload/project/SaveProject';
import UploadProject from './components/upload/project/UploadProject';
import Subproject from './components/subproject/Subproject';
import Objective from './components/objective/Objective';
import ObjectiveSpecific from './components/objective-specific/ObjectiveSpecific';
import Result from './components/result/Result';
import Indicator from './components/indicator/Indicator';
import Activity from './components/activity/Activity';

const App = () => {
    // Variables state AuthContext
    const { authActions, authInfo } = useContext(AuthContext);
    const { setIsLoggedIn, setMenuData } = authActions;
    const { userLogged, menuData  } = authInfo;

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const fetchMenuData = async () => {

            if (Object.keys(userLogged).length > 0) {
                // Storage
                const token = localStorage.getItem('token');
                const usuAno = userLogged.usuAno;
                const usuCod = userLogged.usuCod;
    
                try {
                    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Menu/${usuAno}/${usuCod}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        const data = await response.json();
                        if (data.result) {
                            setIsLoggedIn(false);
                        }
            
                        // Notiflix.Notify.failure(data.message);
                        Notiflix.Loading.remove();
                        return;
                    }
        
                    const data = await response.json();
                    setMenuData(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsDataLoaded(true);
                }
            }
        };
    
        fetchMenuData();
    }, [userLogged]);

    const componentMap = {
        'user': User,
        'estado': Status,
        'monitoring' : Monitoring,
        'identity-document': IdentityDocumento,
        'role': Role,
        'charge': Charge,
        'financer': Financer,
        'implementer': Implementer,
        'permission': Permission,
        'type-value': TypeValue,
        "projects": Projects,
        "subproject": Subproject,
        "objective": Objective,
        "objective-specific": ObjectiveSpecific,
        "result": Result,
        "activity": Activity,
        "indicator": Indicator,
        "dashboard": Dashboard,
        "gender": Gender,
        "nationality": Nationality,
        "unit": Unit,
        "beneficiarie": Beneficiarie,
        "upload-project": FormatProject,
    };

    let defaultRoute;

    if (menuData.length === 1 && menuData[0].menRef === 'dashboard') {
        defaultRoute = <Navigate to='/dashboard' />;
    } else {
        defaultRoute = <Home />;
    }


    return (
            <Router>
                <Routes>
                    <Route path='/login' element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path='*' element={
                        <PrivateRoute>
                            {
                                isDataLoaded && (Object.keys(userLogged).length > 0) &&
                                <Layout>
                                    <Routes>
                                        <Route index element={defaultRoute} />
                                        {menuData.map((menu, index) => {
                                            const Component = componentMap[menu.menRef];
                                            return Component ? <Route path={`${menu.menRef}`} element={<Component />} key={index} /> : null;
                                        })}
                                        {menuData.some(menu => menu.menRef === 'projects') && (
                                            <Route path="form-project/:id?" element={<FormProject />} />
                                        )}
                                        {menuData.some(menu => menu.menRef === 'beneficiarie') && (
                                            <Route path="form-beneficiarie/:id?" element={<FormBeneficiarie />} />
                                            )}
                                        {menuData.some(menu => menu.menRef === 'user') && (
                                            <>
                                                <Route path="form-user/:id?" element={<FormUser />} />
                                                <Route path="menu-user/:id" element={<MenuUser />} />
                                                <Route path="permiso-user/:id" element={<PermissionUser />} />
                                            </>
                                        )}
                                        {menuData.some(menu => menu.menRef === 'upload-project') && (
                                            <>
                                                <Route path="subir-proyecto" element={<UploadProject />} />
                                                <Route path="guardar-proyecto" element={<SaveProject />} />
                                            </>
                                        )}
                                        {menuData.some(menu => menu.menRef === 'monitoring') && (
                                            <>
                                                <Route path="form-goal-beneficiarie/:id" element={<FormGoalBeneficiarie />} />
                                                <Route path="form-goal/:id?" element={<FormGoal />} />
                                            </>
                                        )}
                                        <Route path="form-profile/:id" element={<FormProfile />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Layout>
                            }
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
    );
};


export default App;
