const SectionTitleFive = ({ title, subtitle, userData, lessSpace }) => {
  return (
    <div
      className={
        lessSpace
          ? `section-title-container text-center`
          : `section-title-container text-center space-mb--r80`
      }
      // style={{ paddingBottom: lessSpace ? "10px !important" : "" }}
    >
      <h2
        className={`section-title ${
          subtitle ? "space-mb--35 space-mt--25" : ""
        }`}
      >
        {title}
      </h2>

      {!subtitle ? (
        !userData?.isLoggedIn ? (
          <h4
            className="section-title--secondary"
            style={{ color: "red", opacity: "0.5" }}
          >
            Please login to generate support tickets
          </h4>
        ) : (
          ""
        )
      ) : (
        <div>{subtitle}</div>
      )}
    </div>
  );
};

export default SectionTitleFive;
