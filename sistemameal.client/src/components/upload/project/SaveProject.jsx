import { useNavigate } from "react-router-dom";
import Bar from "../../user/Bar"
import { StatusContext } from "../../../context/StatusContext";
import { useContext, useEffect, useMemo, useState } from "react";
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import CustomTableUpload from "../../reusable/Table/CustomTableUpload";

const SaveProject = () => {
    // Variables State AuthContext 
    const { statusInfo } = useContext(StatusContext);
    const { tableData, postData, isValid, errorCells } = statusInfo;
    if(tableData.length === 0) return;
    console.log(tableData, postData, isValid, errorCells);
    const [transformedData, setTransformedData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        // Transforma tableData a un arreglo de objetos
        const transformedData = tableData.slice(1).map(row => {
            return row.reduce((obj, cell, index) => {
                const header = tableData[0][index];
                obj[header] = cell;
                return obj;
            }, {});
        });
        setTransformedData(transformedData)
    }, [tableData])
    
    const [sorting, setSorting] = useState([]);

    const columns = useMemo(() => {
        // Usa los encabezados de tableData[0] para generar las columnas
        return tableData[0].map(header => ({
            header,
            accessorKey: header,
        }));
    }, []);

    const table = useReactTable({
        data: transformedData, // Usa los datos transformados
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
    });

    return (
        <>
            <Bar currentStep={3} type='upload' />
            <CustomTableUpload
                table={table}
            />
            {/* <div className='flex flex-column flex-grow-1 Large-p1'>
                <div className="PowerMas_TableContainer flex-grow-1 overflow-auto">
                    <table className="Phone_12 PowerMas_TableStatus ">
                        <thead>
                            <tr>
                                {tableData[0].map((header, index) => (
                                    <th 
                                        key={index}
                                        className='ws-nowrap' 
                                        style={{backgroundColor: '#fff' }}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className=''>
                            {tableData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex} style={{height: '2rem', backgroundColor: row.color}}>
                                    {row.map((cell, columnIndex) => (
                                        <td
                                            key={columnIndex}
                                            style={{
                                                backgroundColor: errorCells.some(errorCell => errorCell.row === rowIndex && errorCell.column === columnIndex) ? 'red' : '#fff',
                                            }}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p>{isValid && postData.length !== 0 ? 'Datos válidos' : 'Datos inválidos o no hay datos'}</p>
                <button className='PowerMas_Buttom_Primary' onClick={processValidData} disabled={!isValid || postData.length === 0}>Procesar datos</button>
            </div> */}
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/subir-proyecto')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button onClick={() => navigate('/upload-project')} className="Large_3 m_75 PowerMas_Buttom_Primary">Guardar</button>
            </footer>
        </>
    )
}

export default SaveProject