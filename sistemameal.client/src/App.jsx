import { useState } from 'react';
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

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

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
