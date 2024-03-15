import Notiflix from "notiflix";

export const fetchRegistroAModificar = async (metAno, metCod, metIndAno, metIndCod, reset, fetchSelects, setValue, fetchIndicadorActividad,setIsSecondInputEnabled, setSelectedOption, setJerarquia, setInitialData) => {
    try {
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/meta-indicador/${metAno}/${metCod}/${metIndAno}/${metIndCod}`, {
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
        const {metIndActResAno, metIndActResCod, metIndActResTipInd} = dataInfo;
        Notiflix.Loading.pulse('Cargando...');
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Monitoreo/jerarquia/${metIndActResAno}/${metIndActResCod}/${metIndActResTipInd}`);
        const data = await response.json();

        if (!response.ok) {
            Notiflix.Notify.failure(data.message);
            return;
        }

        setValue('proNom',data.proNom);
        await fetchIndicadorActividad(data.proAno,data.proCod);
        setSelectedOption(data)
        setIsSecondInputEnabled(true);
        setValue('metIndActResAno',metIndActResAno)
        setValue('metIndActResCod',metIndActResCod)
        setValue('metIndActResTipInd',metIndActResTipInd)
        const nombre = data.indActResNum + ' - ' + data.indActResNom;
        setValue('indActResNom', nombre)

        setJerarquia(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        Notiflix.Loading.remove();
    }
};