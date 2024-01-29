import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// helper
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
import Projects from './components/project/Projects';

import Notiflix from "notiflix";
import FormBeneficiarie from './components/goal/beneficiarie/FormBeneficiarie';

Notiflix.Loading.init({
    className: 'notiflix-loading',
    zindex: 4000,
    backgroundColor: 'rgba(0,0,0,0.8)',
    rtl: false,
    fontFamily: 'Quicksand',
    cssAnimation: true,
    cssAnimationDuration: 400,
    clickToClose: false,
    customSvgUrl: null,
    customSvgCode: null,
    svgSize: '80px',
    svgColor: '#20737B',
    messageID: 'NotiflixLoadingMessage',
    messageFontSize: '15px',
    messageMaxLength: 34,
    messageColor: '#dcdcdc',
});

Notiflix.Notify.init({
    width: '280px',
    position: 'right-bottom',
    distance: '10px',
    opacity: 1,
    borderRadius: '5px',
    rtl: false,
    timeout: 3000,
    messageMaxLength: 110,
    backOverlay: false,
    backOverlayColor: 'rgba(0,0,0,0.5)',
    plainText: true,
    showOnlyTheLastOne: false,
    clickToClose: false,
    pauseOnHover: true,
    ID: 'NotiflixNotify',
    className: 'notiflix-notify',
    zindex: 4001,
    fontFamily: 'DMono',
    fontSize: '13px',
    cssAnimation: true,
    cssAnimationDuration: 400,
    cssAnimationStyle: 'from-right',
    closeButton: false,
    useIcon: true,
    useFontAwesome: false,
    fontAwesomeIconStyle: 'basic',
    fontAwesomeIconSize: '34px',
    success: {
    background: '#20737B',
    textColor: '#fff',
    childClassName: 'notiflix-notify-success',
    notiflixIconColor: '#fff',
    fontAwesomeClassName: 'fas fa-check-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(50,198,130,0.2)',
    },
    failure: {
    background: '#FBC355',
    textColor: '#000',
    childClassName: 'notiflix-notify-failure',
    notiflixIconColor: '#000',
    fontAwesomeClassName: 'fas fa-times-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(255,85,73,0.2)',
    },
    warning: {
    background: '#eebf31',
    textColor: '#fff',
    childClassName: 'notiflix-notify-warning',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-exclamation-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(238,191,49,0.2)',
    },
    info: {
    background: '#26c0d3',
    textColor: '#fff',
    childClassName: 'notiflix-notify-info',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-info-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(38,192,211,0.2)',
    },
});


const App = () => {
    // Variables state AuthContext
    const { authInfo, authActions } = useContext(AuthContext);
    const { isLoggedIn, menuData } = authInfo;
    const { setIsLoggedIn } = authActions;


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
                                        return Component ? <Route path={`${menu.menRef}`} element={<Component />} key={index} /> : null;
                                    })}
                                    {menuData.some(menu => menu.menRef === 'projects') && (
                                        <Route path="form-project/:id?" element={<FormProject />} />
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
                                            <Route path="form-beneficiarie/:id?" element={<FormBeneficiarie />} />
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
