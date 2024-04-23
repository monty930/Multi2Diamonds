import React from "react";
import {BrowserRouter as Router, Link, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Scenarios from "./scenarios/Scenarios";

function WelcomePage() {
    const navigate = useNavigate();
    
    return (
        <div className="WelcomePage">
            Welcome page
            <button
                className={"AnyButton ToggleScenariosViewButton GoToMakeButton"}
                onClick={() => navigate('/scenarios/make')}>
                Go to Make Scenarios
            </button>
        </div>
    );
}

export default WelcomePage;
