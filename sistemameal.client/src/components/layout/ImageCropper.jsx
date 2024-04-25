import { useEffect, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Importa el CSS de Cropper.js

function ImageCropper({ imageSrc, setCropper }) {
  const cropperRef = useRef(null);

  useEffect(() => {
    if (cropperRef.current) {
      // Proporciona la referencia a Cropper al componente padre
      setCropper(cropperRef.current.cropper);
    }
  }, [setCropper]);

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src={imageSrc}
        style={{ height: 200, width: '100%' }}
        aspectRatio={1} // Descomenta esta línea para un recorte cuadrado
        guides={false}
      />
    </div>

  );
}

export default ImageCropper;
