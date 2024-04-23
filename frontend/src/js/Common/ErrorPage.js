import React from "react";
import "../../css/Common/ErrorPage.css";
import errorImg from "../../assets/2d-cracked.png";

function ErrorPage({ error }) {
    return (
        <div className="ErrorPage">
            <pre className={"ErrorMessage"}>{ error }</pre>
            <img src={errorImg} alt="Error" className="ErrorImg"/>
        </div>
    );
}

export default ErrorPage;
