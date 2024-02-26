import { useLocation } from 'react-router-dom';
import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";

const Layout = ({ children }) => {
    const location = useLocation();
    const showSidebarAndBar = location.pathname !== '/dashboard';

    return(
        <div className="PowerMas_MainHome flex Large-flex-row Medium-flex-row Small-flex-column flex-column" >
            {
                showSidebarAndBar ? 
                <>
                    <Sidebar />
                    <div className="PowerMas_MainRender Large_10 Medium_9 Small_12">
                        <Bar />
                        <section className="PowerMas_Content Large-m1">
                            {children}
                        </section>
                    </div>
                </>
                :
                <>{children}</>
            }
        </div>)
};
export default Layout;
