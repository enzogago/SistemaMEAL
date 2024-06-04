export const formatterBudget = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2
});
export const formatter = new Intl.NumberFormat("en-US");

export const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export const getUbicacionName = (ubiAno, ubiCod, ubicacionesSelect, selects) => {
    for (const options of selects) {
        const option = options.find(o => o.ubiAno === ubiAno && o.ubiCod === ubiCod);
        if (option) {
            return option.ubiNom;
        }
    }
    const ubicacion = ubicacionesSelect.find(u => u.ubiAno === ubiAno && u.ubiCod === ubiCod);
    return ubicacion ? ubicacion.ubiNom.toLowerCase() : '';
};

