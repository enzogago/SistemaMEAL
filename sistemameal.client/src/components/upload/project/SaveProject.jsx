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
import CryptoJS from 'crypto-js';

const SaveProject = () => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { statusInfo } = useContext(StatusContext);
    const { tableData, postData, isValid, errorCells } = statusInfo;
    const [transformedData, setTransformedData] = useState([])

    useEffect(() => {
        if (tableData.length > 0) {
            // Transforma tableData a un arreglo de objetos
            const transformedData = tableData.map((row, rowIndex) => {
                return expectedHeaders.reduce((obj, headerInfo, index) => {
                    const dbKey = headerInfo.dbKey;
                    let cell = row[index];
                    // Si la key no contiene 'Num', convierte el valor a minúsculas
                    console.log(dbKey)
                    if (!dbKey.includes('Num') && !dbKey.includes('Ide')) {
                        cell = cell.toLowerCase();
                    }
                    obj[dbKey] = cell;
                    return obj;
                }, {});
            });
            console.log(transformedData)
            setTransformedData(transformedData)
        } else {
            navigate('/upload-project');
        }
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

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 100, //default page size
      });

    const table = useReactTable({
        data: transformedData, // Usa los datos transformados
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
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
            const {subProAnoOut, subProCodOut} = data;

            const id = `${subProAnoOut}${subProCodOut}`;
            // Encripta el ID
            const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
            // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
            const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
            navigate(`/registrar-proyecto/${safeCiphertext}`);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    return (
        <>
            <Bar currentStep={2} type='upload' />
            <CustomTableUpload
                table={table}
                errorCells={errorCells}
                isLargePagination={true}
            />
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={() => navigate('/upload-project')} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button disabled={!isValid} onClick={processValidData} className="Large_3 m_75 PowerMas_Buttom_Primary">Siguiente</button>
            </footer>
        </>
    )
}

export default SaveProject