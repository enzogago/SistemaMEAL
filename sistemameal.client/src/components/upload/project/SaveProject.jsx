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
import { expectedHeaders } from "./handleUpload";
import Notiflix from "notiflix";

const SaveProject = () => {
    // Variables State AuthContext 
    const { statusInfo } = useContext(StatusContext);
    const { tableData, postData, isValid, errorCells } = statusInfo;
    if(tableData.length === 0) return;
    const [transformedData, setTransformedData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        // Transforma tableData a un arreglo de objetos
        const transformedData = tableData.map((row, rowIndex) => {
            return expectedHeaders.reduce((obj, headerInfo, index) => {
                const dbKey = headerInfo.dbKey;
                const cell = row[index];
                obj[dbKey] = cell;
                return obj;
            }, {});
        });
        setTransformedData(transformedData)
    }, [tableData]);
    
    
    const [sorting, setSorting] = useState([]);

    const columns = useMemo(() => {
        // Usa los encabezados de tableData[0] para generar las columnas
        return expectedHeaders.map((headerInfo, index) => ({
            header: headerInfo.display,
            accessorKey: headerInfo.dbKey,
            index: index,
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

    const processValidData = async() => {
        // Verifica que los datos sean válidos y que no estén vacíos
        if (!isValid || postData.length === 0) {
            alert('Los datos son inválidos o no hay datos para procesar');
            return;
        }
    
        // Aquí puedes procesar los datos y enviarlos al servidor
        console.log('Procesando datos...');
        console.log(postData);
        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Proyecto/Masivo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData),
            });
            console.log("desde response: ",response)
            const data = await response.json();
            if (!response.ok) {
                console.log(data)
                Notiflix.Notify.failure(data.message)
                return;
            }
            console.log(data)
            Notiflix.Notify.success(data.message)
            navigate('/upload-project');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    return (
        <>
            <Bar currentStep={3} type='upload' />
            <CustomTableUpload
                table={table}
                errorCells={errorCells}
            />
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/subir-proyecto')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button disabled={!isValid} onClick={processValidData} className="Large_3 m_75 PowerMas_Buttom_Primary">Guardar</button>
            </footer>
        </>
    )
}

export default SaveProject