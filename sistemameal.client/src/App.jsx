import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Status from './components/goal/Status/Status';
import Monitoring from './components/goal/Monitoring';
import NewProject from './components/Project/NewProject';
import User from './components/user/User';
import FormUser from './components/user/FormUser';
import MenuUser from './components/user/MenuUser';
import PermissionUser from './components/user/PermissionUser';


const App = () => {
    // Variables state AuthContext
    const { authInfo, authActions } = useContext(AuthContext);
    const { isLoggedIn, menuData } = authInfo;
    const { setIsLoggedIn } = authActions;

    // Verificar el token al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (user && token && !isTokenExpired(token)) {
            setIsLoggedIn(true);
        } else{
            setIsLoggedIn(false);
        }
    }, []);

    const componentMap = {
        '/user': User,
        '/estado': Status,
        '/new-project': NewProject,
        '/monitoring' : Monitoring,
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
                                        return Component ? <Route path={menu.menRef} element={<Component />} key={index} /> : null;
                                    })}

                                    {menuData.some(menu => menu.menRef === '/user') && (
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
