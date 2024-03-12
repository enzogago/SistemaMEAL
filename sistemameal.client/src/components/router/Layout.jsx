import { useLocation } from 'react-router-dom';
import Bar from "../layout/Bar";
import Sidebar from "../layout/Sidebar";
import { Tooltip } from 'react-tooltip';
import Notiflix from 'notiflix';

const Layout = ({ children }) => {
    const location = useLocation();
    
    const showSidebarAndBar = location.pathname !== '/dashboard';

    const handleMouseMove = (e) => {
        // Obtener la hora y minutos guardados en el localStorage
        let [horaGuardada, minutoGuardado] = localStorage.getItem('timeInit').split(':').map(Number);
    
        // Crear una fecha con la hora y minutos guardados
        let fechaGuardada = new Date();
        fechaGuardada.setHours(horaGuardada, minutoGuardado);
    
        // Agregar 2 horas a la fecha guardada
        fechaGuardada.setHours(fechaGuardada.getHours() + 2);
    
        // Obtener la fecha y hora actuales
        let fechaActual = new Date();
        // console.log(fechaGuardada)
        // console.log(fechaActual)
        // Comparar si la fecha guardada más 2 horas es menor que la fecha actual
        if (fechaGuardada < fechaActual) {
            // Aquí va tu código si la condición es verdadera
            // console.log("Han pasado más de 2 horas desde la última actividad.");


        } else {
            // Aquí va tu código si la condición es falsa
            // console.log("No han pasado más de 2 horas desde la última actividad.");
            // Notiflix.Confirm.show(
            //     'Notiflix Confirm',
            //     'Do you agree with me?',
            //     'Yes',
            //     'No',
            //     () => {
            //         // Seteamos la hora con la nueva
            //         alert('Thank you.');
            //     },
            //     () => {
            //         // Validar usuario
            //         alert('If you say so...');
            //     },
            //     {
            //     },
            //     );
        }
    };
    

    return(
        <div className="PowerMas_MainHome flex Large-flex-row Medium-flex-row Small-flex-column flex-column" onMouseMove={handleMouseMove} >
            {
                showSidebarAndBar ? 
                <>
                    <Sidebar />
                    <div className="PowerMas_MainRender Large_10 Medium_9 Small_12">
                        <Bar showSidebarAndBar={true} />
                        <section className="PowerMas_Content Large-m1">
                            {children}
                        </section>
                    </div>
                </>
                :
                <div className='flex flex-column Large_12'>
                    {/* <Bar showSidebarAndBar={showSidebarAndBar} />
                    <br /> */}
                    {children}
                </div>
            }
            <Tooltip 
                    id="error-tooltip"
                    effect="solid"
                    place='bottom-start'
                    className="PowerMas_Tooltip_Info"
            />
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
                className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="delete-tooltip" 
                effect="solid"
                place='top-start'
                className="PowerMas_Tooltip_Info"
            />
            <Tooltip 
                id="select-tooltip" 
                effect="solid"
                place='top-start'
                className="PowerMas_Tooltip_Info"
            />
        </div>)
};
export default Layout;
