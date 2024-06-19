import { useEffect, useMemo, useState } from "react";
import useModal from "../../hooks/useModal";
import Modal from "../layout/Modal";
import ExportMenu from "../reusable/Tables/ExportMenu";
import Plus from "../../icons/Plus";
import CommonTable from "../reusable/Tables/CommonTable";
import useEntityActions from "../../hooks/useEntityActions";
import { getColumns } from "./columns";
import { fetchDataBlock } from "../reusable/fetchs";
import { useSearchTags } from "../../hooks/useSearchTags";
import SearchTagsInput from "../reusable/Tables/SearchTagsInput";
import CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";

const User = () => {
    const navigate = useNavigate();
    // States locales
    const [ data, setData ] = useState([])
    const [ refresh, setRefresh ] = useState([]);

    const { modalVisible, estadoEditado, openModal, closeModal } = useModal();

    const handleEditNavigate = (item) => {
        const id = `${item.usuAno}${item.usuCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const safeCiphertext = btoa(ciphertext).replace('+', '-').replace('/', '_').replace(/=+$/, '');
        navigate(`/form-user/${safeCiphertext}`);
    }

    const actions = useEntityActions('USUARIO');
    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions, 'Usuario', openModal, setRefresh, handleEditNavigate), [actions, 'Usuario', openModal, setRefresh, handleEditNavigate]);
  
    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('Usuario', setData, '.user-block');
    }, [refresh]);

     // Hook personalizado para manejar las etiquetas de búsqueda
     const {
        searchTags,
        inputValue,
        handleInputChange,
        handleKeyDown,
        removeTag
    } = useSearchTags();

    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag =>
                item.usuNom.includes(tag.toUpperCase()) ||
                item.usuApe.includes(tag.toUpperCase()) ||
                item.usuCorEle.includes(tag.toUpperCase()) ||
                item.usuFecNac.includes(tag.toUpperCase()) ||
                item.usuTel.includes(tag.toUpperCase()) ||
                item.usuNumDoc.includes(tag.toUpperCase()) ||
                item.docIdeAbr.includes(tag.toUpperCase()) ||
                item.carNom.includes(tag.toUpperCase()) ||
                item.rolNom.includes(tag.toUpperCase()) ||
                item.usuEst.includes(tag.toUpperCase()) ||
                (item.usuEst === 'A' && 'ACTIVO'.includes(tag.toUpperCase())) ||
                (item.usuEst === 'I' && 'INACTIVO'.includes(tag.toUpperCase()))
            )
        ), [data, searchTags]
    );

    let dataExport = filteredData;
    dataExport = dataExport.map(item => {
        return {
            ...item,
            usuEst: item.usuEst === 'A' ? 'ACTIVO' : 'INACTIVO'
        };
    });
    const headers = ['ESTADO','DOCUMENTO','NUMERO_DOCUMENTO','NOMBRE', 'APELLIDO', 'NACIMIENTO', 'CORREO', 'PAÍS', 'TELEFONO', 'CARGO', 'ROL']; 
    const properties = ['usuEst','docIdeNom','usuNumDoc','usuNom', 'usuApe', 'usuFecNac', 'usuCorEle', 'ubiNom', 'usuTel', 'carNom', 'rolNom'];
    
    return (
        <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto user-block">
                <h3>Listado de Usuarios</h3>
                <div className="flex gap_5 p_25">
                    {/* Componente para la entrada de búsqueda con etiquetas */}
                    <SearchTagsInput 
                        searchTags={searchTags}
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        removeTag={removeTag}
                    />
                    <button 
                        className='flex jc-space-between ai-center Large_3 Large-p_5 PowerMas_Buttom_Primary'
                        onClick={() => navigate('/form-user')} 
                        disabled={!actions.add}
                    >
                        Nuevo 
                        <span className='flex f1_25'>
                            <Plus />
                        </span>
                    </button>
                    {/* Menú de exportación con opciones condicionales basadas en los permisos */}
                    <ExportMenu
                        filteredData={dataExport}
                        headers={headers}
                        title={'USUARIOS'}
                        properties={properties}
                        format={[600,300]}
                        actions={actions}
                    />
                </div>
                {/* Tabla común para mostrar los datos filtrados */}
                <CommonTable 
                    data={filteredData} 
                    columns={columns}
                    isLargePagination={true}
                />
            </div>
            <Modal 
                isOpen={modalVisible}
                closeModal={closeModal}
                user={estadoEditado}
            />
        </>
    )
}

export default User