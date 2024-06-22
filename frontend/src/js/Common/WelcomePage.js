import React from "react";
import {useNavigate} from "react-router-dom";
import bridgeImage from '../../assets/bridge-inverted-transparent.png';
import savedImage from '../../assets/folder4.png';
import makeScenariosImage from "../../assets/icon1.png";
import buildDealSetsImage from "../../assets/icon2.png";
import todoImage from "../../assets/todo-icon.png";

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="WelcomePage">
            <div className="CenteredBackgroundContainer">
                <img src={bridgeImage} alt="Bridge" className="CenteredBackgroundBridgeImage"/>
            </div>
            <div className="WelcomePageInner">
                <div className={"WelcomePageNavigButtonsContainer"}>
                    <div className={"CenteredLayout"}>
                        <div className={"WelcomePageNavigButtons"}>
                            <button
                                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                                onClick={() => navigate('/scenarios/make')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={makeScenariosImage} alt="Saved scenarios" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>Make Scenarios</div>
                                </span>
                            </button>
                            <button
                                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                                onClick={() => navigate('/scenarios/use')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={buildDealSetsImage} alt="Saved scenarios" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>Build Deal&nbsp;Sets</div>
                                </span>
                            </button>
                            <button
                                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                                onClick={() => navigate('/scenarios/savedscenarios')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={savedImage} alt="Saved scenarios" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>Saved items</div>
                                </span>
                            </button>
                            <button
                                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                                onClick={() => navigate('/dummy')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={todoImage} alt="Saved scenarios" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>---</div>
                                </span>
                            </button>
                            <button
                                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                                onClick={() => navigate('/dummy')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={todoImage} alt="Saved scenarios" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>---</div>
                                </span>
                            </button>
                            <button
                                className={"AnyButton ToggleScenariosViewButton GoToMakeButton WelcomePageNavigButton"}
                                onClick={() => navigate('/dummy')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={todoImage} alt="Saved scenarios" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>---</div>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
