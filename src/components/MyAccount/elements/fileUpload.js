import React, { useState } from "react";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const LOGO_SPECS = {
  uniqhor: {
    minWidth: 131,
    minHeight: 31,
    minRatio: 3,
    maxRatio: 6,
    previewMaxWidth: 230,
    previewMaxHeight: 31,
    hint: "PNG, JPG, JPEG up to 10MB. Recommended: 131×31px wide logo (or proportional, e.g. 262×62px).",
    errorMin: "Logo must be at least 131×31px for the Uniqohr template.",
    errorRatio: "Logo should be a wide horizontal image (roughly 4:1 aspect ratio).",
  },
  default: {
    minWidth: 180,
    minHeight: 180,
    previewMaxWidth: 870,
    previewMaxHeight: 150,
    hint: "PNG, JPG, JPEG up to 10MB",
    errorMin: "Image must have a minimum resolution of 180px × 180px",
  },
};

const App = ({ image, setImage, themeSelected = "blue" }) => {
  const { addToast } = useToasts();
  const [currentImage, setCurrentImage] = useState("");
  const logoSpec = themeSelected === "uniqhor" ? LOGO_SPECS.uniqhor : LOGO_SPECS.default;

  useEffect(() => {
    if (image && typeof image === "string") {
      setCurrentImage(image);
    }
  }, [image]);

  const handleImageChange = (e) => {
    if (!e?.target?.files) {
      return;
    }

    const uploadedImg = e?.target?.files[0];
    if (!uploadedImg) return;

    var _URL = window.URL || window.webkitURL;
    const img = new Image();
    const uploadedImgURL = _URL.createObjectURL(uploadedImg);
    img.onload = function () {
      const width = Number(this.width);
      const height = Number(this.height);

      if (width < logoSpec.minWidth || height < logoSpec.minHeight) {
        setImage(null);
        setCurrentImage(null);
        return addToast(logoSpec.errorMin, {
          appearance: "error",
          autoDismiss: true,
        });
      }

      if (logoSpec.minRatio && logoSpec.maxRatio) {
        const ratio = width / height;
        if (ratio < logoSpec.minRatio || ratio > logoSpec.maxRatio) {
          setImage(null);
          setCurrentImage(null);
          return addToast(logoSpec.errorRatio, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
    };
    img.src = uploadedImgURL;

    if (
      e?.target?.files[0]?.type?.includes("jpeg") ||
      e?.target?.files[0]?.type?.includes("png") ||
      e?.target?.files[0]?.type?.includes("jpg")
    ) {
    } else {
      setImage(null);
      setCurrentImage(null);
      return addToast("Image must be of type of PNG | JPG | JPEG", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (e?.target?.files[0]?.size > 10000000) {
      setImage(null);
      setCurrentImage(null);
      return addToast("Image size cannot be greater than 10MB", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    if (e?.target?.files[0] && typeof e.target.files[0] !== "string") {
      setImage(e.target.files[0]);
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleImageChange}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: "0%",
          cursor: "pointer",
        }}
        className="sustainability--file--upload"
        accept="image/x-png,image/jpeg, image/gif"
      />
      {!image && (
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
            ></path>
          </svg>
          <div className="sustainability--edit-photo-text-holder">
            <div className="sustainability--edit-text-holder">
              <span>Upload a file</span>
              <p>or drag and drop</p>
            </div>
            <p>{logoSpec.hint}</p>
          </div>
        </div>
      )}
      {image && (
        <div className="d-flex" style={{ justifyContent: "center" }}>
          <img
            src={currentImage || image}
            alt="Uploaded logo preview"
            style={{
              maxHeight: `${logoSpec.previewMaxHeight}px`,
              maxWidth: `${logoSpec.previewMaxWidth}px`,
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </>
  );
};

export default App;
