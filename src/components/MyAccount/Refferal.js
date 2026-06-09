import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?refId=Ram123"
const Refferal = () => {
    return (
        <div className="change--email--wrapper">
            <h3 className="common--heading">Refferal</h3>
            <div className="change--email--main">
                <h5>Share your refferal link and earn</h5>
            </div>
            <div className="change--email--main" style={{marginTop:"10px"}}>
            <p>Your Refferal Link : <a href = {link} style={{textDecoration:"underline"}} target="_blank">https://www.ecostance.com?refId=ram123</a></p>
            </div>
        </div>
    );
};

export default Refferal;
