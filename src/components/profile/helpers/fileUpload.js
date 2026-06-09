import React, { useState } from "react";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const App = ({ image, setImage }) => {
  const { addToast } = useToasts();
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (image && typeof image === "string") {
      setCurrentImage(image);
    } else if (image) {
      setCurrentImage(URL.createObjectURL(image));
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
      if (Number(this.width) < 180 || Number(this.height) < 180) {
        setImage(null);
        setCurrentImage(null);
        return addToast(
          "Image must have a minimum resolution of 180px * 180px",
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
      }
    };
    img.src = uploadedImgURL;

    if (
      e?.target?.files[0]?.type?.includes("jpeg") ||
      e?.target?.files[0]?.type?.includes("png")
    ) {
    } else {
      setImage(null);
      setCurrentImage(null);
      return addToast("Image must be of type of", {
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
    <div className="main--image--holder" style={{ cursor: "pointer" }}>
      <input
        type="file"
        onChange={handleImageChange}
        style={{
          position: "absolute",
          opacity: "0%",
          cursor: "pointer",
        }}
        className="sustainability--file--upload profile-section--file-upload"
        accept="image/x-png,image/jpeg"
      />
      {!image && (
        <div className="profilePicture--holder--profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="195"
            height="195"
            fill="none"
            viewBox="0 0 195 195"
          >
            <circle
              cx="97.5"
              cy="97.5"
              r="97"
              stroke="#DDDCE1"
              strokeDasharray="7 7"
            ></circle>
            <path
              stroke="#7E7E7E"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M57.578 85.313a9.246 9.246 0 019.246-9.245h4.297a9.245 9.245 0 007.693-4.117l3.757-5.635a9.246 9.246 0 017.692-4.117h17.841a9.247 9.247 0 017.693 4.117l3.756 5.635a9.247 9.247 0 007.693 4.117h4.298a9.245 9.245 0 019.245 9.245v41.606a9.246 9.246 0 01-9.245 9.246h-64.72a9.246 9.246 0 01-9.246-9.246V85.313z"
            ></path>
            <path
              stroke="#7E7E7E"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M113.052 103.805c0 7.659-6.209 13.868-13.868 13.868-7.66 0-13.869-6.209-13.869-13.868 0-7.66 6.21-13.869 13.869-13.869s13.868 6.21 13.868 13.869z"
            ></path>
          </svg>
        </div>
      )}
      {image && (
        <div className="d-flex" style={{ justifyContent: "center" }}>
          <img
            src={currentImage || image}
            style={{ maxHeight: "150px", maxWidth: "870px" }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
