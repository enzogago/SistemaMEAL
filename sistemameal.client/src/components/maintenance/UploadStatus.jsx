import UploadTemplate from "./UploadTemplate"

const UploadStatus = () => {
    const expectedHeaders = [
        { display: 'nombre', dbKey: 'estNom' },
        { display: 'color', dbKey: 'estCol' },
        // Agrega aquí el resto de los mapeos
    ];
    return (
        <>
            <UploadTemplate 
                expectedHeaders={expectedHeaders}
                controller='Estado'
            />
        </>
    )
}

export default UploadStatus