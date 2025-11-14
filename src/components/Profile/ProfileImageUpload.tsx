import React, { useState, useRef, useEffect } from "react";
import Icon from "../Icon/Icon";
import 'react-image-crop/dist/ReactCrop.css';
import ImageCrop from "../ImageCrop/ImageCrop";

interface ProfileImageUploadProps {
  profilePicture?: string,
  setImg: React.Dispatch<React.SetStateAction<File | null>>,
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ setImg, profilePicture }) => {
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
        setCroppedPreview={setCroppedPreview} />
      <button className="upload-image" onClick={handleInputClick} title="Choose image">
        <Icon name="addImage" />
      </button>
      {(croppedPreview && <img src={croppedPreview} alt="preview" className="profile-preview" />) ||
        (profilePicture && <img src={profilePicture} alt="preview" className="profile-preview" />) ||
        (<Icon name="profileDefault" />)
      }
    </>
  );
};

export default ProfileImageUpload;
