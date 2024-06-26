import { useNavigate } from "react-router-dom";
import Bar from '../user/Bar'
import CustomTableUpload from "../reusable/Table/CustomTableUpload";
import { StatusContext } from "../../context/StatusContext";
import { useContext, useEffect, useMemo, useState } from "react";
import {
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import { expectedHeaders } from "./handleUpload";
import Notiflix from "notiflix";
import CryptoJS from 'crypto-js';

const UploadValidate = () => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { statusInfo, statusActions } = useContext(StatusContext);
    const { tableData, isValid, errorCells, metaBeneficiario } = statusInfo;
    const { setTableData } = statusActions;
    useEffect(() => {
        if (tableData.length == 0) {
            navigate('/monitoring');
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
        data: tableData, // Usa los datos transformados
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
        if (!isValid) {
            alert('Los datos son inválidos o no hay datos para procesar');
            return;
        }
        
        // Aquí puedes procesar los datos y enviarlos al servidor
        const MetaBeneficiarioDto = {
            Beneficiarios: tableData,
            MetaBeneficiario: metaBeneficiario
        }

        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Beneficiario/masivo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(MetaBeneficiarioDto),
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message)
                return;
            }
            Notiflix.Notify.success(data.message)
            setTableData([]);
            navigate('/monitoring')
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }
    }

    const  returnUpload = () => {
        const id = `${metaBeneficiario.metAno}${metaBeneficiario.metCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/upload-beneficiarie/${safeCiphertext}`);
    }

    return (
        <>
            <Bar currentStep={2} type='uploadBeneficiarie' />
            <CustomTableUpload
                table={table}
                errorCells={errorCells}
                isLargePagination={true}
            />
            <footer className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button onClick={returnUpload} className="Large_3 m_75 PowerMas_Buttom_Secondary">Atras</button>
                <button 
                    className="Large_3 m_75 PowerMas_Buttom_Primary"
                    onClick={processValidData} 
                    // disabled={!selectedFile}
                >
                    Siguiente
                </button>
            </footer>
        </>
    )
}

export default UploadValidate