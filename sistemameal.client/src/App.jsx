import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Notiflix Configuracion estilos
import './js/notiflixConfig';
import 'react-tippy/dist/tippy.css';
// Context
import { AuthContext } from './context/AuthContext';

// Componentes
import LoadingComponent from './components/LoadingComponent';
const ResultChain = lazy(() => import('./components/result-chain/ResultChain'));
const Tutorial = lazy(() => import('./components/tutorial/Tutorial'));
const ResultBudget = lazy(() => import('./components/result-budget/ResultBudget'));
const RegisterProject = lazy(() => import('./components/upload/project/RegisterProject'));
const ResultGoal = lazy(() => import('./components/monitoring/goal/ResultGoal'));
const UploadBeneficiarie = lazy(() => import('./components/beneficiarie/UploadBeneficiarie'));
const UploadValidate = lazy(() => import('./components/beneficiarie/UploadValidate'));
const ExecutionBugdet = lazy(() => import('./components/result-budget/ExecutionBugdet'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const UploadGoalBudget = lazy(() => import('./components/result-budget/UploadGoalBudget'));
const SaveGoalBudget = lazy(() => import('./components/result-budget/SaveGoalBudget'));
const ViewExecution = lazy(() => import('./components/result-budget/ViewExecution'));
const FormGoalExecution = lazy(() => import('./components/monitoring/beneficiarie/FormGoalExecution'));
const Prueba = lazy(() => import('./Prueba'));
const Login = lazy(() => import('./components/auth/Login'));
const Home = lazy(() => import('./components/home/Home'));
const PrivateRoute = lazy(() => import('./components/router/PrivateRoute'));
const PublicRoute = lazy(() => import('./components/router/PublicRoute'));
const Layout = lazy(() => import('./components/router/Layout'));
const Monitoring = lazy(() => import('./components/monitoring/Monitoring'));
const User = lazy(() => import('./components/user/User'));
const FormUser = lazy(() => import('./components/user/FormUser'));
const MenuUser = lazy(() => import('./components/user/MenuUser'));
const PermissionUser = lazy(() => import('./components/user/PermissionUser'));
const Status = lazy(() => import('./components/status/Status'));
const IdentityDocumento = lazy(() => import('./components/document/IdentityDocumento'));
const Charge = lazy(() => import('./components/charge/Charge'));
const Role = lazy(() => import('./components/role/Role'));
const Financer = lazy(() => import('./components/financer/Financer'));
const Currency = lazy(() => import('./components/currency/Currency'));
const Implementer = lazy(() => import('./components/implementer/Implementer'));
const Permission = lazy(() => import('./components/permission/Permission'));
const TypeValue = lazy(() => import('./components/type-value/TypeValue'));
const Projects = lazy(() => import('./components/project/Projects'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Gender = lazy(() => import('./components/gender/Gender'));
const Nationality = lazy(() => import('./components/Nationality.jsx/Nationality'));
const Unit = lazy(() => import('./components/Unit/Unit'));
const NotFound = lazy(() => import('./components/NotFound'));
const Beneficiarie = lazy(() => import('./components/beneficiarie/Beneficiarie'));
const FormGoalBeneficiarie = lazy(() => import('./components/monitoring/beneficiarie/FormGoalBeneficiarie'));
const FormBeneficiarie = lazy(() => import('./components/beneficiarie/FormBeneficiarie'));
const FormatProject = lazy(() => import('./components/upload/project/FormatProject'));
const Notiflix = lazy(() => import('notiflix'));
const SaveProject = lazy(() => import('./components/upload/project/SaveProject'));
const UploadProject = lazy(() => import('./components/upload/project/UploadProject'));
const Subproject = lazy(() => import('./components/subproject/Subproject'));
const Objective = lazy(() => import('./components/objective/Objective'));
const ObjectiveSpecific = lazy(() => import('./components/objective-specific/ObjectiveSpecific'));
const Result = lazy(() => import('./components/result/Result'));
const Indicator = lazy(() => import('./components/indicator/Indicator'));
const Activity = lazy(() => import('./components/activity/Activity'));
const FormSubProject = lazy(() => import('./components/subproject/FormSubProject'));

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
        'currency': Currency,
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
        "upload-project": UploadProject,
        "result-chain": ResultChain,
        "result-budget": ResultBudget,
        "result-goal": ResultGoal,
        "goal-budget": ExecutionBugdet,
        "upload-goal-budget": UploadGoalBudget,
        "execution-budget": ViewExecution,
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
                                <Suspense fallback={<LoadingComponent />}>
                                    <Login />
                                </Suspense>
                            </PublicRoute>
                        } />
                        <Route path='/forgot-password' element={
                            <PublicRoute>
                                <Suspense fallback={<LoadingComponent />}>
                                    <ForgotPassword />
                                </Suspense>
                            </PublicRoute>
                        } />
                        <Route path='*' element={
                            <PrivateRoute>
                                {
                                    isDataLoaded && (Object.keys(userLogged).length > 0) &&
                                    <Suspense fallback={<LoadingComponent />}>
                                    <Layout>
                                            <Routes>
                                                <Route index element={defaultRoute} />
                                                {menuData.map((menu, index) => {
                                                    const Component = componentMap[menu.menRef];
                                                    return Component ? <Route path={`${menu.menRef}`} element={<Component />} key={index} /> : null;
                                                })}
                                                {menuData.some(menu => menu.menRef === 'subproject') && (
                                                    <Route path="form-subproject/:id?" element={<FormSubProject />} />
                                                )}
                                                {menuData.some(menu => menu.menRef === 'beneficiarie') && (
                                                    <>
                                                        <Route path="form-beneficiarie/:id?" element={<FormBeneficiarie />} />
                                                        
                                                    </>
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
                                                        <Route path="guardar-proyecto" element={<SaveProject />} />
                                                        <Route path="registrar-proyecto/:id" element={<RegisterProject />} />
                                                    </>
                                                )}
                                                {menuData.some(menu => menu.menRef === 'upload-goal-budget') && (
                                                    <>
                                                        <Route path="save-goal-budget" element={<SaveGoalBudget />} />
                                                    </>
                                                )}
                                                {menuData.some(menu => menu.menRef === 'monitoring') && (
                                                    <>
                                                        <Route path="form-goal-execution/:id" element={<FormGoalExecution />} />
                                                        <Route path="form-goal-beneficiarie/:id" element={<FormGoalBeneficiarie />} />
                                                        <Route path="upload-beneficiarie/:id" element={<UploadBeneficiarie />} />
                                                        <Route path="validate-beneficiarie" element={<UploadValidate />} />
                                                    </>
                                                )}
                                                <Route path="tutorial" element={<Tutorial />} />
                                                <Route path="prueba" element={<Prueba />} />
                                                <Route path="*" element={<NotFound />} />
                                            </Routes>
                                    </Layout>
                                    </Suspense>
                                }
                            </PrivateRoute>
                        } />
                    </Routes>
            </Router>
    );
};


export default App;
