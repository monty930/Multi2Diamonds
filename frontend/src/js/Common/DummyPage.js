import React from "react";
import {useNavigate} from "react-router-dom";
import "../../css/Common/DummyPage.css";

import dummyImage from "../../assets/dummy.png";

function DummyPage() {
    const navigate = useNavigate();

    return (
        <div className="WelcomePage">
            <div className="CenteredBackgroundContainer">
                <img src={dummyImage} alt="Dummy" className="CenteredBackgroundBridgeImage DummyImage"/>
            </div>
            <div className="WelcomePageInner DummyText">
                To be continued...
            </div>
        </div>
    );
}

export default DummyPage;
