import { useRouter } from "next/router";
import React from "react";
import LezadaBackdrop from "./lezadaBackdrop";
import { cartTransfer } from "src/apiClient/orders";
import { useToasts } from "react-toast-notifications";

const BusinessPopup = ({
    businessPopupShown,
    setBusinessPopShown,
    isBusinessOrder,
    setIsBusinessOrder,
    handleRedirect
}) => {
    const router = useRouter();
    const { addToast } = useToasts();

    const businessData = async () => {
        setBusinessPopShown(false)
        handleRedirect()
        localStorage.setItem("BusinessOrderSelection", "yes")
        // let cartTransferData = await cartTransfer()
        // if (!cartTransferData.success) return addToast("Please Try again by placing order", {
        //     appearance: "error",
        //     autoDismiss: true,
        // });
    }
    return (
        <LezadaBackdrop>
            <div className="standard-popup-holder carbon--offset-popup--main">
                <div
                    className="standard-popup-cross-icon"
                    onClick={() => { setBusinessPopShown(false), setIsBusinessOrder(false) }}
                >
                    <img src="/assets/images/cross-sustainability.png" />
                </div>
                <div className="carbon--svg">
                    <img src="/assets/images/flamingo--carbon-calculator.png" />
                </div>

                <p>
                    Do you want to place this order as a Personal Account or Business account ({JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name})
                </p>
                <div className="carbon--button-holder">
                    <button className="button--white" onClick={() => {
                        setBusinessPopShown(false), localStorage.setItem("BusinessOrderSelection", "no"), handleRedirect()
                    }}>
                        Personal account
                    </button>
                    <button
                        className="button--black"
                        onClick={() => businessData()}
                    >
                        Business account
                    </button>
                </div>
                <div></div>
            </div>
        </LezadaBackdrop>
    );
};

export default BusinessPopup;
