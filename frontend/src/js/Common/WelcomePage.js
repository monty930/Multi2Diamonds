import React from "react";
import {useNavigate} from "react-router-dom";

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
