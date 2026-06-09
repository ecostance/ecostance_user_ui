import React, { useState } from "react";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { uploadImage } from "src/apiClient/business"

const NewMultipleFileUpload = ({ previews, setPreviews,fileInputRef }) => {
    const { addToast } = useToasts();
    const [currentImage, setCurrentImage] = useState("");
    const [images, setImages] = useState([]);

    let imagesarray = []


    useEffect(() => {
        console.log("selected-preview", previews)
    }, [previews, setPreviews]);

    //   const handleImageChange = (e) => {
    //     if (!e?.target?.files) {
    //       return;
    //     }

    //     const uploadedImg = e?.target?.files[0];
    //     if (!uploadedImg) return;

    //     var _URL = window.URL || window.webkitURL;
    //     const img = new Image();
    //     const uploadedImgURL = _URL.createObjectURL(uploadedImg);
    //     img.onload = function () {
    //       if (Number(this.width) < 180 || Number(this.height) < 180) {
    //         setImage(null);
    //         setCurrentImage(null);
    //         return addToast(
    //           "Image must have a minimum resolution of 180px * 180px",
    //           {
    //             appearance: "error",
    //             autoDismiss: true,
    //           }
    //         );
    //       }
    //     };
    //     img.src = uploadedImgURL;

    //     if (
    //       e?.target?.files[0]?.type?.includes("jpeg") ||
    //       e?.target?.files[0]?.type?.includes("png") ||
    //       e?.target?.files[0]?.type?.includes("jpg")
    //     ) {
    //     } else {
    //       setImage(null);
    //       setCurrentImage(null);
    //       return addToast("Image must be of type of PNG | JPG | JPEG", {
    //         appearance: "error",
    //         autoDismiss: true,
    //       });
    //     }
    //     if (e?.target?.files[0]?.size > 10000000) {
    //       setImage(null);
    //       setCurrentImage(null);
    //       return addToast("Image size cannot be greater than 10MB", {
    //         appearance: "error",
    //         autoDismiss: true,
    //       });
    //     }

    //     if (e?.target?.files[0] && typeof e.target.files[0] !== "string") {
    //       setImage(e.target.files[0]);
    //       setCurrentImage(URL.createObjectURL(e.target.files[0]));
    //     }
    //   };

    const handleImage = (selectedImage) => {
        const updatedPreview = previews.filter(item => item !== selectedImage);
        setPreviews(updatedPreview)
    }


    const handleFileChange = async (event) => {
        // console.log("item" , item)
        if (previews.length === 5) {
            return addToast("Cannot upload more than 5 images!", {
                appearance: "error",
                autoDismiss: true,
            })
        }
        if (!event?.target?.files) {
            console.log("Aaaabbb")
            return;
        }
        console.log("imghghg", event?.target?.files[0])
        const uploadedImg = event?.target?.files[0];
        let dataImgs = new FormData()
        dataImgs.append(`galleryFile`, uploadedImg);
        let imageURL = await uploadImage(dataImgs)
        console.log(imageURL)
        if (imageURL?.data?.success) {
            imagesarray.push(imageURL?.data?.data?.urlLink)
        }
        console.log("arr-img", imagesarray)
        setPreviews(prevArray => [...prevArray, imageURL?.data?.data?.urlLink]);
        // if (selectedFiles.length > 3) {
        //     return addToast("Cannot upload more than 3 images", {
        //         appearance: "error",
        //         autoDismiss: true,
        //     });
        // }
        // setFiles(selectedFiles);

        // const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
        // setPreviews(filePreviews);
    };

    return (
        <>
            <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    opacity: "0%",
                    cursor: "pointer",
                }}
                className="sustainability--file--upload"
            // accept="image/x-png,image/jpeg, image/gif"
            />
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
                    <p>PNG, JPG, JPEG up to 10MB</p>
                </div>
            </div>
        </>
    );
};

export default NewMultipleFileUpload;
