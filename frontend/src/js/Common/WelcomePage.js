import React from "react";
import {useNavigate} from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();
    
    return (
        <div className="WelcomePage">
            <h1>Welcome page</h1>
            <button
                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                onClick={() => navigate('/scenarios/make')}>
                Go to Make Scenarios
            </button>
        </div>
    );
}

export default WelcomePage;
