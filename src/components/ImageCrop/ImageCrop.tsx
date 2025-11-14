import './ImageCrop.css';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import ReactCrop, { Crop } from 'react-image-crop';
import PopupCard from '../PopupCard/PopupCard';
import CropSlider from './CropSlider';
interface ImageCropProps {
  preview: string | undefined;
  setPreview: React.Dispatch<React.SetStateAction<string | undefined>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
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

const ImageCrop: React.FC<ImageCropProps> = ({ preview, setPreview, inputRef }) => {
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
  const portalCropRef = useRef<HTMLElement | null>(null);
  const [cropSizeVal, setCropSizeVal] = useState<number>(1);
  const [originalImage, setOriginalImage] = useState<EventTarget | undefined>();

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

  useEffect(() => {
    if (typeof document === 'undefined') return;
    let root = document.getElementById('crop-root') as HTMLElement | null;
    if (!root) {
      root = document.createElement('div');
      root.id = 'crop-root';
      document.body.appendChild(root);
    }
    portalCropRef.current = root;
    return () => {
      // keep the root if other code might use it; if you want, remove when empty:
      // if (root && root.childElementCount === 0) document.body.removeChild(root);
    };
  }, []);

  const onImageLoad = (img: EventTarget) => {
    setOriginalImage(img);
  };
  const setShowPopup = (show: boolean) => {
    if (show || inputRef.current == null) return;
    inputRef.current.value = "";
    setPreview(undefined);

  }


  if (typeof document == "undefined") return null;
  return preview && portalCropRef.current ? ReactDOM.createPortal(
    <PopupCard
      setShowPopup={setShowPopup}
      popupTitle="Crop Image"
      submitText="Confirm"
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
          <img className="crop-preview-image" src={preview} onLoad={(e) => onImageLoad(e.target)} alt="crop" />
        </ReactCrop>
        <CropSlider setPercentage={setCropSizeVal} />
      </div>
    </PopupCard>,
    portalCropRef.current
  ) : null
}

export default ImageCrop;