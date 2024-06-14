import React from "react";
import {useNavigate} from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();
    
    return (
        <div className="WelcomePage">
            <div className={"WelcomeTitle"}>Welcome page</div>
            <button
                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                onClick={() => navigate('/scenarios')}>
                Bridge Scenarios
            </button>
        </div>
    );
}

export default WelcomePage;
