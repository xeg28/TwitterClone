import React, { useState, useRef, useEffect } from "react";
import 'react-image-crop/dist/ReactCrop.css';
import ImageCrop from "../../FeatureModules/ImageCrop/ImageCrop";
import Icon from "../../UIElements/Icon/Icon";

interface ProfileImageUploadProps {
  imgType: "banner" | "profile",
  currentImg?: string,
  setImg: React.Dispatch<React.SetStateAction<File | null>>,
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ setImg, currentImg, imgType}) => {
  const [preview, setPreview] = useState<string | undefined>();
  const [croppedPreview, setCroppedPreview] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      if (croppedPreview) URL.revokeObjectURL(croppedPreview);
    };
  }, [croppedPreview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.[0];
    if (selectedFile) {
      // revoke previous preview
      if (preview) URL.revokeObjectURL(preview);
      const obj = URL.createObjectURL(selectedFile);
      setPreview(obj); // show preview
    }
  };

  const handleInputClick = () => {
    const input = inputRef.current;

    if (!input) return;

    input.click();
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }} ref={inputRef} />
      <ImageCrop
        preview={preview}
        setPreview={setPreview}
        inputRef={inputRef}
        setImg={setImg}
        setCroppedPreview={setCroppedPreview} 
        imgType={imgType}
        />
      <button className="upload-image" onClick={handleInputClick} title="Choose image">
        <Icon name="addImage" />
      </button>
      {(croppedPreview && <img src={croppedPreview} alt="preview" className={`${imgType}-preview`} />) ||
        (currentImg && <img src={currentImg} alt="preview" className={`${imgType}-preview`} />) ||
        (imgType==="profile" && (<Icon name="profileDefault" />))
      }
    </>
  );
};

export default ProfileImageUpload;
