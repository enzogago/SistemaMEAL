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
import UploadStatus from './components/maintenance/UploadStatus';
import UploadCharge from './components/maintenance/UploadCharge';
import UploadProject from './components/maintenance/UploadProject';

const App = () => {
    // Variables state AuthContext
    const { authInfo } = useContext(AuthContext);
    const { menuData } = authInfo;

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
        "dashboard": Dashboard,
        "gender": Gender,
        "nationality": Nationality,
        "unit": Unit,
        "beneficiarie": Beneficiarie,
        "upload-status": UploadStatus,
        "upload-charge": UploadCharge,
        "upload-project": UploadProject,
    };

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
                            <Layout>
                                <Routes>
                                    <Route index element={<Home />} />
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
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
    );
};


export default App;
