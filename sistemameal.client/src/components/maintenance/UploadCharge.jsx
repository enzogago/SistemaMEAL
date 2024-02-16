import UploadTemplate from "./UploadTemplate"

const UploadCharge = () => {
    const expectedHeaders = [
        { display: 'CARGO_NOMBRE', dbKey: 'carNom' },
        { display: 'CARGO_EXPLICA', dbKey: 'carExp' },
        // Agrega aquí el resto de los mapeos
    ];
    return (
        <div className="PowerMas_StatusContainer flex-column p1">
            <UploadTemplate 
                expectedHeaders={expectedHeaders}
                controller='Cargo'
            />
        </div>
    )
}

export default UploadCharge