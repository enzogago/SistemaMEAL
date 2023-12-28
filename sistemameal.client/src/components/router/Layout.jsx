import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";

const Layout = ({ children }) => {
    return(
    <div className="PowerMas_MainHome">
        <Sidebar />
        <div className="PowerMas_MainRender">
            <Bar />
            <section className="PowerMas_Content">
                {children}
            </section>
        </div>
    </div>)
};
export default Layout;