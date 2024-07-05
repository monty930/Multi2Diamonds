import React from "react";
import "../../css/Common/ErrorPage.css";
import errorImg from "../../assets/2d-cracked.png";

function ErrorPage({ error }) {
    return (
        <div className="ErrorPage">
            <img src={errorImg} alt="Error" className="ErrorImg"/>
            <pre className={"ErrorMessage"}>{ error }</pre>
        </div>
    );
}

export default ErrorPage;
