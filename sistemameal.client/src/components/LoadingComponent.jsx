import { useEffect } from 'react';
import Notiflix from 'notiflix';

const LoadingComponent = () => {
    useEffect(() => {
        // Notiflix.Loading.init({
        //     svgColor: '#ff5549',
        //     messageColor: '#ff5549',
        // });
        Notiflix.Loading.pulse('Cargando...');

        return () => {
            Notiflix.Loading.remove();
        };
    }, []);

    return ;
};

export default LoadingComponent;
