import UploadTemplate from "./UploadTemplate"

const UploadStatus = () => {
    const expectedHeaders = [
        { display: 'nombre', dbKey: 'estNom' },
        { display: 'color', dbKey: 'estCol' },
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