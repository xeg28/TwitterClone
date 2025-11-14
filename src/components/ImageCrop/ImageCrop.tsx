import './ImageCrop.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import ReactCrop, { Crop } from 'react-image-crop';
import PopupCard from '../PopupCard/PopupCard';
import CropSlider from './CropSlider';

interface ImageCropProps {
  preview: string | undefined;
  setPreview: React.Dispatch<React.SetStateAction<string | undefined>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setImg: React.Dispatch<React.SetStateAction<File | null>>;
  setCroppedPreview: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function getSquareDimensionsPercentage(
  originalWidth: number,
  originalHeight: number
): { widthPercent: number; heightPercent: number } {

  const maxDimension = Math.max(originalWidth, originalHeight);
  const squareDimension = Math.min(originalWidth, originalHeight);
  const percentage = (squareDimension / maxDimension) * 100;

  let widthPercent: number;
  let heightPercent: number;

  if (originalWidth > originalHeight) {
    widthPercent = percentage;
    heightPercent = 100;
  } else if (originalHeight > originalWidth) {
    widthPercent = 100;
    heightPercent = percentage;
  } else {
    widthPercent = 100;
    heightPercent = 100;
  }
  return {
    widthPercent: widthPercent,
    heightPercent: heightPercent
  };
}

const ImageCrop: React.FC<ImageCropProps> = ({ preview, setPreview, inputRef, setImg, setCroppedPreview }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 0,
    y: 0,
  });
  const originalCrop = useRef<{ height: number, width: number }>({
    height: 0,
    width: 0
  });
  const [cropSizeVal, setCropSizeVal] = useState<number>(1);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!preview) return;
    const image = new Image();
    image.src = preview;
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      const dimensions = getSquareDimensionsPercentage(width, height);
      setCrop({
        x: 0,
        y: 0,
        unit: "%",
        width: dimensions.widthPercent,
        height: dimensions.heightPercent
      });
      originalCrop.current = {
        width: dimensions.widthPercent,
        height: dimensions.heightPercent
      }
    }
  }, [preview]);

  useEffect(() => {
    if (!originalCrop.current) return;

    setCrop((prev) => {
      const newWidth = originalCrop.current.width * cropSizeVal;
      const newHeight = originalCrop.current.height * cropSizeVal;

      const maxX = 100 - newWidth;
      const maxY = 100 - newHeight;

      return {
        ...prev,
        width: newWidth,
        height: newHeight,
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY),
      };
    });
  }, [cropSizeVal]);


  const setShowPopup = (show: boolean) => {
    if (show || inputRef.current == null) return;
    inputRef.current.value = "";
    setPreview(undefined);

  }

  const createCroppedFile = useCallback(
    async (image: HTMLImageElement, crop: Crop): Promise<File> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      const imgWidth = image.naturalWidth;
      const imgHeight = image.naturalHeight;

      // Convert crop from % or px to actual pixels on the *displayed* image
      const cropX = (crop.x / 100) * imgWidth;
      const cropY = (crop.y / 100) * imgHeight;
      const cropWidth = (crop.width / 100) * imgWidth;
      const cropHeight = (crop.height / 100) * imgHeight;

      const outputSize = 400; // will be change when doing banner
      canvas.width = outputSize;
      canvas.height = outputSize;
      // Draw the cropped region, scaled to output size
      ctx.drawImage(
        image,
        cropX,           // source X
        cropY,           // source Y
        cropWidth,       // source width
        cropHeight,      // source height
        0,               // dest X
        0,               // dest Y
        outputSize,     // dest width
        outputSize     // dest height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
            resolve(file);
          } else {
            reject(new Error("Failed to create blob"));
          }
        }, "image/jpeg");
      });
    },
    []
  );

  const handleDone = async () => {
    if (imgRef.current && crop.width && crop.height) {
      const file = await createCroppedFile(imgRef.current, crop);

      const obj = URL.createObjectURL(file);
      setCroppedPreview(obj); // show preview
      setImg(file);
    }
    if (inputRef.current != null)
      inputRef.current.value = "";
    if (preview) URL.revokeObjectURL(preview);
    setPreview(undefined); // close cropper
  };


  if (typeof document == "undefined") return null;
  return preview ? ReactDOM.createPortal(
    <PopupCard
      setShowPopup={setShowPopup}
      popupTitle="Crop Image"
      submitText="Done"
      onSubmit={handleDone}
    >
      <div className="image-crop">
        <ReactCrop
          crop={crop}
          onChange={(_, pCrop) => setCrop(pCrop)}
          locked={true}
          aspect={1}
          keepSelection={true}
          ruleOfThirds={false}
          style={{ maxWidth: '100%', width: 'fit-content' }}
        >
          <img
            className="crop-preview-image"
            src={preview}
            alt="crop"
            ref={imgRef}
          />
        </ReactCrop>
        <CropSlider setPercentage={setCropSizeVal} />
      </div>
    </PopupCard>,
    document.body
  ) : null
}

export default ImageCrop;