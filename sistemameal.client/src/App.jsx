import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// helper
import { isTokenExpired } from './components/auth/auth';
// Context
import { AuthContext } from './context/AuthContext';
// Componentes
import Home from './components/home/Home';
import Login from './components/auth/Login';
import PrivateRoute from './components/router/PrivateRoute';
import PublicRoute from './components/router/PublicRoute';
import Layout from './components/router/Layout';
import Monitoring from './components/goal/Monitoring';
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
import ProjectList from './components/project/ProjectList';


const App = () => {
    // Variables state AuthContext
    const { authInfo, authActions } = useContext(AuthContext);
    const { isLoggedIn, menuData } = authInfo;
    const { setIsLoggedIn } = authActions;


    const componentMap = {
        'user': User,
        'estado': Status,
        'new-project': FormProject,
        'monitoring' : Monitoring,
        'identity-document': IdentityDocumento,
        'role': Role,
        'charge': Charge,
        'financer': Financer,
        'implementer': Implementer,
        'permission': Permission,
        'type-value': TypeValue,
        "all-projects": ProjectList,
    };

    return (
            <Router>
                <Routes>
                    <Route path='/login' element={
                        <PublicRoute isLogggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path='/*' element={
                        <PrivateRoute> 
                            <Layout>
                                <Routes>
                                    {menuData.map((menu, index) => {
                                        const Component = componentMap[menu.menRef];
                                        if (menu.menRef === 'new-project') {
                                            return Component ? <Route path={`${menu.menRef}/:id?`} element={<Component />} key={index} /> : null;
                                        } else {
                                            return Component ? <Route path={menu.menRef} element={<Component />} key={index} /> : null;
                                        }
                                    })}

                                    {menuData.some(menu => menu.menRef === 'user') && (
                                        <>
                                            <Route path="form-user" element={<FormUser />} />
                                            <Route path="menu-user" element={<MenuUser />} />
                                            <Route path="permiso-user" element={<PermissionUser />} />
                                        </>
                                    )}

                                    <Route path="*" element={<Home />} />
                                </Routes>
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
    );
};


export default App;
