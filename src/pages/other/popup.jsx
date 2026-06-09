import React from "react";
import LezadaBackdrop from "src/components/lezadaBackdrop";

const sustainabilityPopup = ({
  showStartAgainModal,
  setShowStartAgainModal,

  saveSustainabilityPageToAPI,
  resetSustainabilityPageToDefaults,
  resetSustainabilityPageToPreviousVersion,
  handleSustainabilityCancel,
}) => {
  const handleClearSustainabilityClear = (type) => {
    // switch (showStartAgainModal?.type) {
    //   case "START_AGAIN":
    //     resetSustainabilityPageToPreviousVersion();
    //     return setShowStartAgainModal({ val: false, type: "" });
    //   case "SYSTEM_DEFAULTS":
    //     resetSustainabilityPageToDefaults();
    //     return setShowStartAgainModal({ val: false, type: "" });
    //   case "ENABLE_EDIT":
    //     handleSustainabilityCancel();
    //     return setShowStartAgainModal({ val: false, type: "" });
    //   case "SAVE_PUBLISH_PUBLISH":
    //     saveSustainabilityPageToAPI({ slug: true });
    //     return setShowStartAgainModal({ val: false, type: "" });
    //   case "SAVE_PUBLISH_UNPUBLISH":
    //     saveSustainabilityPageToAPI({ slug: false });
    //     return setShowStartAgainModal({ val: false, type: "" });
    //   default:
    //     console.log("No case provided");
    // }
    if (showStartAgainModal?.type === "START_AGAIN") {
      resetSustainabilityPageToPreviousVersion();

      setShowStartAgainModal({ val: false, type: "" });
    } else if (showStartAgainModal?.type === "SYSTEM_DEFAULTS") {
      resetSustainabilityPageToDefaults();
      setShowStartAgainModal({ val: false, type: "" });
    } else if (showStartAgainModal?.type === "ENABLE_EDIT") {
      handleSustainabilityCancel();
      setShowStartAgainModal({ val: false, type: "" });
    } else if (type === "SAVE_PUBLISH_PUBLISH") {
      saveSustainabilityPageToAPI({ slug: true });
      setShowStartAgainModal({ val: false, type: "" });
    } else if (type === "SAVE_PUBLISH_UNPUBLISH") {
      saveSustainabilityPageToAPI({ slug: false });
      setShowStartAgainModal({ val: false, type: "" });
    }
  };

  const extraClass =
    showStartAgainModal?.type === "SAVE_PUBLISH" ? "changeSlug" : "";

  return (
    <LezadaBackdrop>
      <div className="sustainability--confirm-popup-holder">
        <div
          className={`sustainability-cross-icon ${extraClass}`}
          onClick={() => [
            setShowStartAgainModal({ val: false, type: "" }),
            extraClass ? saveSustainabilityPageToAPI({ exit: true }) : "",
          ]}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>
        <div>
          <img src="/assets/images/sustainability-popup.png" />
        </div>
        <div>
          <h3 className={`sustainability--popup-sure-text ${extraClass}`}>
            {showStartAgainModal?.type === "SAVE_PUBLISH"
              ? "Should the data being saved get applied to your published sustainability page?"
              : "Are you Sure?"}
          </h3>
          {showStartAgainModal?.type !== "SAVE_PUBLISH" ? (
            <p style={{ textAlign: "center", fontSize: "20px" }}>
              {showStartAgainModal?.type === "ENABLE_EDIT"
                ? "All your unsaved edits will be lost"
                : "All your edits will be lost"}
            </p>
          ) : (
            ""
          )}
        </div>
        {showStartAgainModal?.type !== "SAVE_PUBLISH" ? (
          <div className="sustainability--popup-button-holder">
            <button
              className="sustainability--popup-button-white button--white"
              onClick={handleClearSustainabilityClear}
            >
              YES
            </button>
            <button
              className="sustainability--popup-button-black button--black button--cursor"
              onClick={() => setShowStartAgainModal({ val: false, type: "" })}
            >
              NO
            </button>
          </div>
        ) : (
          <div className="sustainability--popup-button-holder changeSlug">
            <button
              className="sustainability--popup-button-black button--white button--cursor"
              onClick={() => [
                setShowStartAgainModal({ val: false, type: "" }),
                saveSustainabilityPageToAPI({ exit: true }),
              ]}
            >
              NO, JUST CANCEL
            </button>
            <button
              className="sustainability--popup-button-black button--white button--cursor"
              onClick={() =>
                handleClearSustainabilityClear("SAVE_PUBLISH_UNPUBLISH")
              }
            >
              YES SAVE, BUT UNPUBLISH MY PAGE
            </button>
            <button
              className="sustainability--popup-button-white button--black"
              onClick={() =>
                handleClearSustainabilityClear("SAVE_PUBLISH_PUBLISH")
              }
            >
              YES, SAVE AND APPLY
            </button>
          </div>
        )}
      </div>
    </LezadaBackdrop>
  );
};

export default sustainabilityPopup;
