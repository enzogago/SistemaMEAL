import { useEffect, useMemo, useState } from 'react';
// Componentes reutilizables y hooks
import CommonTable from '../reusable/Tables/CommonTable';
import { fetchDataBlock } from '../reusable/fetchs';
import { getColumns } from './columns';
import { useSearchTags } from '../../hooks/useSearchTags';
import SearchTagsInput from '../reusable/Tables/SearchTagsInput';
import ExportMenu from '../reusable/Tables/ExportMenu';
import useEntityActions from '../../hooks/useEntityActions';

/**
 * Componente Beneficiarie que muestra un listado de beneficiarios.
 * Permite la búsqueda por diferentes campos y la exportación de los datos filtrados.
 */
const Beneficiarie = () => {
   // Estados locales para manejar los datos y el refresco de la tabla
   const [ data, setData ] = useState([]);
   const [ refresh, setRefresh ] = useState([]);

   // Obtener las acciones permitidas para la entidad 'BENEFICIARIO'
   const actions = useEntityActions('BENEFICIARIO');

    // Efecto para cargar los datos de los beneficiarios al montar el componente
    useEffect(() => {
        fetchDataBlock('Beneficiario', setData, '.beneficiarie-block');
    }, [refresh]);

    // Columnas de la tabla definidas en un hook personalizado
    const columns = useMemo(() => getColumns(actions), [actions]);

    // Hook personalizado para manejar las etiquetas de búsqueda
    const {
        searchTags,
        inputValue,
        handleInputChange,
        handleKeyDown,
        removeTag
    } = useSearchTags();

    // Datos filtrados basados en las etiquetas de búsqueda
    const filteredData = useMemo(() => 
        data.filter(item => 
            searchTags.every(tag => 
                item.benAno.includes(tag.toUpperCase()) ||
                item.benCod.includes(tag.toUpperCase()) ||
                item.benNom.includes(tag.toUpperCase()) ||
                item.benApe.includes(tag.toUpperCase()) ||
                item.benCorEle.includes(tag.toUpperCase()) ||
                item.benTel.includes(tag.toUpperCase()) ||
                item.benTelCon.includes(tag.toUpperCase()) ||
                item.benCodUni.includes(tag.toUpperCase()) ||
                item.benDir.includes(tag.toUpperCase()) ||
                item.benNomApo.includes(tag.toUpperCase()) ||
                item.benApeApo.includes(tag.toUpperCase()) ||
                item.genNom.includes(tag.toUpperCase()) ||
                item.nacNom.includes(tag.toUpperCase()) ||
                (item.benSex === 'M' && 'MASCULINO'.includes(tag.toUpperCase())) ||
                (item.benSex === 'F' && 'FEMENINO'.includes(tag.toUpperCase()))
            )
        ), [data, searchTags]
    );

    // Encabezados y propiedades para la exportación de datos
    const headers = ['CUB','NOMBRE','APELLIDO','EMAIL','TELÉFONO','TELÉFONO CONTACTO','DIRECCIÓN','NOMBRE APODERADO','APELLIDO APODERADO','GÉNERO','NACIONALIDAD'];
    const properties = ['benCodUni','benNom','benApe','benCorEle','benTel','benTelCon','benDir','benNomApo','benApeApo','genNom','nacNom'];

    return (
        <>
            <div className="flex flex-column p1 gap_25 flex-grow-1 overflow-auto beneficiarie-block">
                <h3>Listado de Beneficiarios</h3>
                <div className="flex gap_5 p_25">
                    {/* Componente para la entrada de búsqueda con etiquetas */}
                    <SearchTagsInput 
                        searchTags={searchTags}
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        removeTag={removeTag}
                    />
                    {/* Menú de exportación con opciones condicionales basadas en los permisos */}
                    <ExportMenu
                        filteredData={filteredData}
                        headers={headers}
                        title={'BENEFICIARIOS'}
                        properties={properties}
                        format={[500,250]}
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
        </>
    )
}

export default Beneficiarie