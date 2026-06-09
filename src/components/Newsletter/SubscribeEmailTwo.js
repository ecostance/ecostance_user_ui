import MailchimpSubscribe from "react-mailchimp-subscribe";
import { IoIosArrowRoundForward } from "react-icons/io";
import { subscribe } from "src/apiClient/subscribe";
import { useEffect, useState } from "react";
import { MdStayCurrentLandscape } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";

const CustomForm = ({
  isPopup,
  placeHolder,
  subscribeResponse,
  setIsEmailValid,
  seRef,
}) => {
  const [email, setEmail] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (seRef === undefined || seRef === null) return;
    seRef.current = submit;
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const submit = async (tempEmail) => {
    if (!validateEmail(email || tempEmail)) {
      if (isPopup) {
        // return subscribeResponse({ status: 'error', message: 'Please enter a valid email' })
        return setIsEmailValid(false);
      }
      setNewMessage("Please enter a valid email");
      return setStatus("error");
    }

    const res = await subscribe(email || tempEmail);
    if (res.status === 200 || res.status === 201 || res.status === 409) {
      if (isPopup) {
        return subscribeResponse({
          status: res.status,
          message: res.data?.message,
          email,
          existingUser: res.data?.existingUser,
        });
      }
      setStatus("success");
      setNewMessage(res.data?.message);
    } else {
      if (isPopup) {
        return subscribeResponse({
          status: res.status,
          message: res.data?.message,
        });
      }
      setStatus("error");
      setNewMessage(res?.data?.message);
    }

    // setEmailHandler("");

    // setTimeout(() => {
    //   setStatus("");
    // }, 5000);
  };
  const setEmailHandler = (email) => {
    setEmail(email);
    if (isPopup) {
      subscribeResponse({ status: "", message: "" });
      return setIsEmailValid(true);
    }
    setNewMessage("");
    setStatus("");
  };
  return (
    <div className="subscribe-form">
      <div className="mc-form">
        <input
          id="mc-form-email"
          className="email"
          onChange={(e) => setEmailHandler(e.target.value)}
          type="email"
          value={email}
          placeholder={placeHolder || "Your Email Address *"}
        />
        <button className="button" onClick={submit}>
          {isPopup ? (
            <span>SUBSCRIBE</span>
          ) : (
            <BsArrowRight
              className="productNavArrow"
              // onClick={(e) => handleProductNav("next")}
            />
          )}
        </button>
      </div>
      {status === "sending" && (
        <div
          style={{
            color: "#3498db",
            fontSize: "14px",
            fontWeight: 300,
            lineHeight: "1",
          }}
        >
          sending...
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            color: "#e74c3c",
            fontSize: "14px",
            fontWeight: 300,
            lineHeight: "1",
          }}
          dangerouslySetInnerHTML={{ __html: newMessage }}
        />
      )}
      {status === "success" && (
        <div
          style={{
            color: "#20844A",
            fontSize: "14px",
            fontWeight: 300,
            lineHeight: "1.2",
          }}
          dangerouslySetInnerHTML={{ __html: newMessage }}
        />
      )}
    </div>
  );
};

const SubscribeEmailTwo = (props) => {
  return (
    // <div>
    //   <MailchimpSubscribe
    //     url={mailchimpUrl}
    //     render={({ subscribe, status, message }) => (
    //       <CustomForm
    //         status={status}
    //         message={message}
    //         onValidated={(formData) => subscribe(formData)}
    //       />
    //     )}
    //   />
    // </div>
    <div>
      <CustomForm {...props} />
    </div>
  );
};

export default SubscribeEmailTwo;
