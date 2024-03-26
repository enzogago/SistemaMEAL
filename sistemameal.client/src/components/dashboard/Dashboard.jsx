import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
    // Variables state AuthContext
    const { authInfo } = useContext(AuthContext);
    const { userLogged } = authInfo;

    
    useEffect(() => {
        console.log(userLogged)
    }, [])
    

    return (
        <>
            {
                (userLogged && userLogged.usuAno === '2024' && userLogged.usuCod === '000001') ?
                <iframe title="PowerMas_Dashboard_Ayuda_En_Accion" width="100%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiMWQ5NThkYWQtNjkwYy00ZDAyLWIyYTQtZGZiNmQ0ZjM1YjY2IiwidCI6ImNiMmNhMWJhLTk0YjYtNGE0Mi05ZTM3LWViNDM3YWNlZTg1MCJ9" frameBorder="0" allowFullScreen={true}></iframe>
                :
                <iframe title="PowerMas_Dashboard_Ayuda_En_Accion" width="100%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiYzQ5MzU3NTgtMGFmOS00NWQzLWI0MTctMWMzYmE0NDdjOTEzIiwidCI6ImNiMmNhMWJhLTk0YjYtNGE0Mi05ZTM3LWViNDM3YWNlZTg1MCJ9" frameBorder="0" allowFullScreen={true}></iframe>
            }
        </>
    )
}

export default Dashboard

