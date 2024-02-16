import UploadTemplate from "./UploadTemplate"

const UploadStatus = () => {
    const expectedHeaders = [
        { display: 'ESTADO_NOMBRE', dbKey: 'estNom' },
        { display: 'ESTADO_COLOR', dbKey: 'estCol' },
        // Agrega aquí el resto de los mapeos
    ];
    return (
        <div className="PowerMas_StatusContainer flex-column p1">
            <UploadTemplate 
                expectedHeaders={expectedHeaders}
                controller='Estado'
            />
        </div>
    )
}

export default UploadStatus