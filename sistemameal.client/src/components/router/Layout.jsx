import { useLocation } from 'react-router-dom';
import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";
import { Tooltip } from 'react-tooltip';

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
            <Tooltip 
                    id="info-tooltip"
                    effect="solid"
                    place='bottom-start'
                    className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="edit-tooltip"
                effect="solid"
                place='top-end'
            />
            <Tooltip 
                id="delete-tooltip" 
                effect="solid"
                place='top-start'
            />
        </div>)
};
export default Layout;
