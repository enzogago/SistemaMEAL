import { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Importa el CSS de Cropper.js

function ImageCropper({ imageSrc, onCrop, setSelectedFile }) {
  const cropperRef = useRef(null);

    const cropImage = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            const croppedImageDataURL = cropper.getCroppedCanvas().toDataURL();
            onCrop(croppedImageDataURL);
        }
    };

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src={imageSrc}
        style={{ height: 200, width: '100%' }}
        aspectRatio={1} // Descomenta esta línea para un recorte cuadrado
        guides={false}
      />
      <button onClick={cropImage}>Recortar imagen</button>
      <button onClick={() => setSelectedFile(null)}>Cancelar</button>
    </div>

  );
}

export default ImageCropper;
