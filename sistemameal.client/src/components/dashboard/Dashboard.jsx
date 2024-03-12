import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
    // Variables state AuthContext
    const { authActions } = useContext(AuthContext);
    const { validarUsuario } = authActions;

    setTimeout(() => {
        validarUsuario();
    }, 15000);


    return (
        <>
            <iframe title="PowerMas_Dashboard_Ayuda_En_Accion" width="100%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiYzQ5MzU3NTgtMGFmOS00NWQzLWI0MTctMWMzYmE0NDdjOTEzIiwidCI6ImNiMmNhMWJhLTk0YjYtNGE0Mi05ZTM3LWViNDM3YWNlZTg1MCJ9" frameborder="0" allowFullScreen="true"></iframe>
        </>
    )
}

export default Dashboard

