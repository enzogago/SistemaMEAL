import { useEffect, useState } from "react"
import { fetchData } from "../reusable/helper"

const Monitoring = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData('Monitoreo/pruebametas', (fetchedData) => {
            const processedData = [];
            const uniqueMetMesPlaTec = {};
            fetchedData.forEach(row => {
                // Si la fila tiene una fórmula
                if (row.indFor) {
                    // Extraemos los indicadores de la fórmula
                    const indicadores = row.indFor.match(/\[\d+\]/g);
                    // Para cada indicador en la fórmula
                    indicadores.forEach(indicador => {
                        // Buscamos las metas correspondientes en los datos
                        const metas = fetchedData.filter(r => `[${r.indAno}${r.indCod}]` === indicador);
                        // Duplicamos las metas y cambiamos IndAno e IndCod al del indicador principal
                        const duplicatedMetas = metas.map(meta => ({ ...meta, indAno: row.indAno, indCod: row.indCod, metMetTec: row.indFor }));
                        // Agregamos las metas duplicadas a los datos procesados
                        duplicatedMetas.forEach(meta => {
                            const key = `${meta.indAno}${meta.indCod}${meta.metMesPlaTec}`;
                            if (!uniqueMetMesPlaTec[key]) {
                                processedData.push(meta);
                                uniqueMetMesPlaTec[key] = true;
                            }
                        });
                    });
                } else {
                    // Si la fila no tiene una fórmula, la agregamos tal cual a los datos procesados
                    processedData.push(row);
                }
            });
            setData(processedData);
        });
    }, []);
    
    return (
        <div className="todos center">
            <table>
                <thead>
                    <tr>
                        <th>METANO</th>
                        <th>METCOD</th>
                        <th>METMETTEC</th>
                        <th>METMESPLATEC</th>
                        <th>INDANO</th>
                        <th>INDCOD</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.metAno}</td>
                            <td>{row.metCod}</td>
                            <td>{row.metMetTec}</td>
                            <td>{row.metMesPlaTec}</td>
                            <td>{row.indAno}</td>
                            <td>{row.indCod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Monitoring;
