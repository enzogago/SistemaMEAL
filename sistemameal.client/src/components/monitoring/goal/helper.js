import Notiflix from "notiflix";

export const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2
});


export const fetchRegistroAModificar = async (metAno, metCod, indAno, indCod, reset, fetchSelects, setValue, fetchIndicadorActividad,setIsSecondInputEnabled, setSelectedOption, setJerarquia, setInitialData, setEsActividad) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-indicador/${metAno}/${metCod}/${indAno}/${indCod}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            Notiflix.Notify.failure(data.message);
            return;
        }
        setInitialData(data)
        reset(data);
        console.log(data)
        if (data.indTipInd === 'IAC') {
            setEsActividad(true);
        }
        fetchSelects(data.ubiAno,data.ubiCod);
        obtenerJerarquia(data, setValue, fetchIndicadorActividad,setIsSecondInputEnabled, setSelectedOption, setJerarquia);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};
export const obtenerJerarquia = async (dataInfo, setValue, fetchIndicadorActividad,setIsSecondInputEnabled,setSelectedOption, setJerarquia) => {
    try {
        const {indAno, indCod, indTipInd} = dataInfo;
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/jerarquia/${indAno}/${indCod}`);
        const data = await response.json();

        if (!response.ok) {
            Notiflix.Notify.failure(data.message);
            return;
        }

        setValue('proNom',data.proNom.charAt(0) + data.proNom.slice(1).toLowerCase());
        await fetchIndicadorActividad(data.proAno,data.proCod);
        setSelectedOption(data)
        setIsSecondInputEnabled(true);
        setValue('IndAno',indAno)
        setValue('IndCod',indCod)
        setValue('IndTipInd',indTipInd)
        console.log(data)
        const nombre = data.indNum + ' - ' + data.indNom.charAt(0) + data.indNom.slice(1).toLowerCase();
        setValue('indNom', nombre)

        setJerarquia(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};