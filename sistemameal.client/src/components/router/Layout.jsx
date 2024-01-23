import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";

const Layout = ({ children }) => {
    return(
    <div className="PowerMas_MainHome">
        <Sidebar />
        <div className="PowerMas_MainRender Large_10 Phone_12 Large-p1 Medium-p1">
            <Bar />
            <section className="PowerMas_Content Phone_12">
                {children}
            </section>
        </div>
    </div>)
};
export default Layout;