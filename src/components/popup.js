const Popup = () => {
  return (
    <div className="main-temp" style={{ backgroundColor: "#999" }}>
      <div
        className="registration--popup-holder"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="registration--popup-image-holder">
          <img
            style={{ maxWidth: "336px" }}
            src="https://ik.imagekit.io/anik/clothes-image_vnLEyOzWA.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662729977742"
          />
        </div>
        <div className="registration--popup-text-holder">
          <h3 className="registration--popup-title">
            Hello <span style={{ fontWeight: "600" }}>Sign up</span> & <br />
            <span style={{ fontWeight: "600" }}>connect </span>
            to Lezada.
          </h3>
          <div className="registration--email-address-holder">
            <input placeholder="Email address" />
            <div>SUBSCRIBE</div>
          </div>
          <div className="registration--exclusive-offer">
            * Be the first to learn about our latest trends and get exclusive
            offers.
          </div>
        </div>

        <div className="registration--popup--cross">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Popup;
