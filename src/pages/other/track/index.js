import React, { useState, useEffect } from "react";
import { LayoutTwo } from "../../../components/Layout";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import { Container, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
import { verifyAuthenticity } from "src/apiClient/certificate";
import { useRouter } from "next/router";
function AuthenticateDoc() {
  const Router = useRouter();

  const [documentId, setDocumentId] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    if (!Router.query.documentId) {
      return;
    }
    setDocumentId(Router.query.documentId);
    setResponse("");
    setIsLoading(true);
    await verify(Router?.query?.documentId, "id");
  }, []);

  const handleChange = (e) => {
    setDocumentId(e.target.value);
  };
  const handleVerifyAction = () => {
    Router.push(
      {
        pathname: `/other/track?documentId=${documentId}`,
      },
      undefined,
      { shallow: true }
    );
  };

  function openURLInNewTab(url) {
    const win = window.open(url, "_blank");
    if (win != null) {
      win.focus();
    }
  }
  const verify = async (id, type) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const auth = await verifyAuthenticity(
        type === "id" ? id.replace(/\s/g, "") : documentId.replace(/\s/g, "")
      );
      setResponse(auth?.code || auth?.data?.status || "UnAuthenticatedDocument");
      if (auth?.data?.status === "Authentic") {
        openURLInNewTab(auth?.url);
      }
    } catch (err) {
      setResponse("ServiceError");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      verify(documentId, "id").catch((err) => console.log(err));
    }
  };

  return (
    <div className="verify--track--main-holder">
      <LayoutTwo>
        <BreadcrumbOne
          className="bg--8"
          pageTitle="Verify & Track Certificate"
          // backgroundImage="/assets/images/backgrounds/header-calculator.png"
          // backgroundImage={
          //   "/assets/images/backgrounds/background-bg-8/big-med.png"
          // }
        >
          <ul className="breadcrumb__list">
            <li>
              <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                <a>Home</a>
              </Link>
            </li>

            <li>Verify</li>
          </ul>
        </BreadcrumbOne>
        <div>
          <Container>
            <div className="lezada-form space-mb--30 track--main-holder">
              <div className="track--input-field--main">
                <input
                  className="track--input-field"
                  type="text"
                  value={documentId}
                  placeholder={"Type here..."}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onKeyDown={handleKeyDown}
                />
                <div className="track--button-verify-holder">
                  <button
                    className="d-flex align-items-center  track--verify-button"
                    onClick={() => {
                      verify(documentId, "id");
                    }}
                  >
                    Verify
                    {isLoading && (
                      <Spinner size="sm" className="ml-2" animation="border" />
                    )}
                  </button>
                </div>
              </div>
              <div className="track--button-verify-holder--mobile">
                <button
                  className="d-flex align-items-center  track--verify-button"
                  onClick={() => {
                    verify(documentId, "id");
                  }}
                >
                  Verify
                  {isLoading && (
                    <Spinner size="sm" className="ml-2" animation="border" />
                  )}
                </button>
              </div>

              {response === "Authentic" && (
                <div className="track--authentic-holder-correct">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#7BA986"
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Authentic
                </div>
              )}
              {(response == "DocumentNotFound" ||
                response == "UnAuthenticatedDocument") && (
                <div className="track--authentic-holder-incorrect">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e03131"
                      d="M13 6a1 1 0 10-2 0v3H7a1 1 0 000 2h4v7a1 1 0 102 0v-7h4a1 1 0 100-2h-4V6z"
                    ></path>
                  </svg>
                  Not authentic
                </div>
              )}
              {(response == "BlockchainUnavailable" ||
                response == "CertificateGenerationFailed" ||
                response == "ServiceError") && (
                <div className="track--authentic-holder-incorrect">
                  Verification service is temporarily unavailable. Please try again later.
                </div>
              )}

              <br></br>
              {/* <h5>
              {response === "DocumentNotFound"
                ? `Document linked to this ID couldn't be authenticated`
                : response}
            </h5> */}
            </div>
          </Container>
        </div>
      </LayoutTwo>
    </div>
  );
}

export default AuthenticateDoc;
