import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Home from './components/home/Home';
import NewProject from './components/Project/NewProject';
import Login from './components/auth/Login';
import PrivateRoute from './components/router/PrivateRoute';
import PublicRoute from './components/router/PublicRoute';
import Layout from './components/router/Layout';
import StatusState from './context/StatusState';
import Monitoring from './components/goal/Monitoring';
import Status from './components/goal/Status/Status';
//
import { isTokenExpired } from './components/auth/auth';
import { AuthContext } from './context/AuthContext';
import User from './components/user/User';

const App = () => {
    const { authInfo, authActions } = useContext(AuthContext);
    const { isLoggedIn } = authInfo;
    const { setIsLoggedIn, setUser } = authActions;

    // Verificar el token al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (user && token && !isTokenExpired(token)) {
            setIsLoggedIn(true);
            setUser(JSON.parse(user));
        }
    }, []);

    return (
            <Router>
                <Routes>
                    <Route path='/login' element={
                        <PublicRoute isLogggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path='/*' element={
                        <PrivateRoute isLogggedIn={isLoggedIn}> 
                            <Layout setIsLoggedIn={setIsLoggedIn}>
                                <Routes>
                                    <Route index element={<Home />} />
                                    <Route path="/new-project" element={<NewProject />} />
                                    <Route path="/estado" element={
                                        <StatusState>
                                            <Status />
                                        </StatusState>
                                    } />
                                    <Route path="/user" element={<User />} />
                                    <Route path="/monitoreo" element={
                                        <StatusState>
                                            <Monitoring />
                                        </StatusState>
                                    } />

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
