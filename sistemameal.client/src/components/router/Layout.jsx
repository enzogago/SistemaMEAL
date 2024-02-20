import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";

const Layout = ({ children }) => {
    return(
    <div className="PowerMas_MainHome flex Large-flex-row Medium-flex-row Small-flex-column flex-column" >
        <Sidebar />
        <div className="PowerMas_MainRender Large_10 Medium_9 Small_12">
            <Bar />
            <section className="PowerMas_Content Large-m1">
                {children}
            </section>
        </div>
    </div>)
};
export default Layout;