import UploadTemplateTransaction from "./UploadTemplateTransaction";

const UploadProject = () => {
    const expectedHeaders = [
        { display: 'NOMBRE_INDICADOR_ACTIVIDAD', dbKey: 'indActResNom', entity: 'IndicadorActividad', validation: 'nombre' },
        { display: 'NUMERO_INDICADOR_ACTIVIDAD', dbKey: 'indActResNum', entity: 'IndicadorActividad', validation: 'numero' },
        { display: 'TIPO_INDICADOR_ACTIVIDAD', dbKey: 'indActResTip', entity: 'IndicadorActividad', validation: 'indicador' },
        { display: 'NOMBRE_RESULTADO', dbKey: 'resNom', entity: 'Resultado', validation: 'nombre' },
        { display: 'NUMERO_RESULTADO', dbKey: 'resNum', entity: 'Resultado', validation: 'numero' },
        { display: 'NOMBRE_OBJETIVO_ESPECIFICO', dbKey: 'objEspNom', entity: 'ObjetivoEspecifico', validation: 'nombre' },
        { display: 'NUMERO_OBJETIVO_ESPECIFICO', dbKey: 'objEspNum', entity: 'ObjetivoEspecifico', validation: 'numero' },
        { display: 'NOMBRE_OBJETIVO', dbKey: 'objNom', entity: 'Objetivo', validation: 'nombre' },
        { display: 'NUMERO_OBJETIVO', dbKey: 'objNum', entity: 'Objetivo', validation: 'numero' },
        { display: 'NOMBRE_SUB_PROYECTO', dbKey: 'subProNom', entity: 'Subproyecto', validation: 'nombre' },
        { display: 'SAP_SUB_PROYECTO', dbKey: 'subProSap', entity: 'Subproyecto', validation: 'numero' },
        { display: 'NOMBRE_PROYECTO', dbKey: 'proNom', entity: 'Proyecto', validation: 'nombre' },
        { display: 'DESCRIPCION_PROYECTO', dbKey: 'proDes', entity: 'Proyecto', validation: 'nombre' },
        { display: 'RESPONSABLE_PROYECTO', dbKey: 'proRes', entity: 'Proyecto', validation: 'nombre' },
        { display: 'AÑO_PERIODO_INICIO_PROYECTO', dbKey: 'proPerAnoIni', entity: 'Proyecto', validation: 'año' },
        { display: 'MES_PERIODO_INICIO_PROYECTO', dbKey: 'proPerMesIni', entity: 'Proyecto', validation: 'mes' },
        { display: 'AÑO_PERIODO_FIN_PROYECTO', dbKey: 'proPerAnoFin', entity: 'Proyecto', validation: 'año' },
        { display: 'MES_PERIODO_FIN_PROYECTO', dbKey: 'proPerMesFin', entity: 'Proyecto', validation: 'mes' },
    ];
    
    return (
        <>
            <UploadTemplateTransaction
                expectedHeaders={expectedHeaders}
                controller='Proyecto'
            />
        </>
    )
}

export default UploadProject