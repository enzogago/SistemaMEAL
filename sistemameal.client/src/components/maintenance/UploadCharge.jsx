import UploadTemplate from "./UploadTemplate"

const UploadCharge = () => {
    const expectedHeaders = [
        { display: 'nombre', dbKey: 'carNom' },
        // Agrega aquí el resto de los mapeos
    ];
    return (
        <>
            <UploadTemplate 
                expectedHeaders={expectedHeaders}
                controller='Cargo'
            />
        </>
    )
}

export default UploadCharge