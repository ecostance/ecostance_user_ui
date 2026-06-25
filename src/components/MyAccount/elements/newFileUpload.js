import React, { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { uploadImage } from "src/apiClient/business";

const NewFileUpload = ({ previews, setPreviews, fileInputRef }) => {
  const { addToast } = useToasts();

  useEffect(() => {
    console.log("selected-preview", previews);
  }, [previews]);

  const handleRemoveImage = () => {
    setPreviews("");

    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (event) => {
    if (!event?.target?.files?.length) return;

    const uploadedImg = event.target.files[0];

    // Validate type
    if (
      !(
        uploadedImg.type.includes("jpeg") ||
        uploadedImg.type.includes("jpg") ||
        uploadedImg.type.includes("png")
      )
    ) {
      if (fileInputRef?.current) fileInputRef.current.value = "";

      return addToast("Image must be PNG | JPG | JPEG", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    // Validate size (10MB)
    if (uploadedImg.size > 10 * 1024 * 1024) {
      if (fileInputRef?.current) fileInputRef.current.value = "";

      return addToast("Image size cannot be greater than 10MB", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    try {
      const formData = new FormData();
      formData.append("galleryFile", uploadedImg);

      const response = await uploadImage(formData);

      if (response?.data?.success) {
        setPreviews(response.data.data.urlLink);
      } else {
        addToast("Upload failed", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.error(err);

      addToast("Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg"
        className="sustainability--file--upload"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: 0,
          cursor: "pointer",
        }}
      />

      {!previews ? (
        <div className="sustainability--file-upload-info-holder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="58"
            height="58"
            fill="none"
            viewBox="0 0 58 58"
          >
            <path
              stroke="#DDDCE1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.372"
              d="M33.525 10.37H14.549a4.744 4.744 0 00-4.744 4.744v23.72m0 0v4.744a4.744 4.744 0 004.744 4.744h28.463a4.744 4.744 0 004.744-4.744V34.09M9.805 38.834l10.878-10.878a4.744 4.744 0 016.708 0l6.134 6.134m14.231-9.488v9.488m0 0l-3.762-3.762a4.744 4.744 0 00-6.708 0l-3.761 3.762m0 0l4.744 4.744m4.743-28.464H52.5m-4.744-4.744v9.488m-14.231 4.744h.023"
            />
          </svg>

          <div className="sustainability--edit-photo-text-holder">
            <div className="sustainability--edit-text-holder">
              <span>Upload a file</span>
              <p>or drag and drop</p>
            </div>
            <p>PNG, JPG, JPEG up to 10MB</p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "150px",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={previews}
              alt="Preview"
              style={{
                height: "140px",
                width: "140px",
                border: "1px solid lightgray",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />

            <div className="delete-img" onClick={handleRemoveImage}>
              &#x2715;
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewFileUpload;