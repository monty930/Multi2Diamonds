import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import gif1 from "../../assets/scenarios1.gif";
import gif2 from "../../assets/scenarios2.gif";
import gif3 from "../../assets/scenarios3.gif";
import gif4 from "../../assets/scenarios4.gif";

import arrowBack from "../../assets/arrow-back.png";
import arrowForw from "../../assets/arrow.png";

function ScenariosIntroPage() {
    const [gifView, setGifView] = useState(0);

    const gifViewChange = (direction) => {
        setGifView((gifView + direction + 3) % 3);
    }

    return (
        <div className="WelcomeIntroPage">
            <div className={"WelcomeTitle"}>Bridge scenarios</div>
            <div className = {"WelcomeSubtitle"}>
                Create a deal set based on your own scenarios!
            </div>
            <div className={"GifsBackground"}>
                <div className={"ArrowLeft ArrowMain"} onClick={() => gifViewChange(-1)}>
                    <img src={arrowBack} alt="Back arrow" className={"ArrowBackImg ArrowImgScenariosWelcome"}/>
                </div>
                {GifsMain(gifView)}
                <div className={"ArrowRight ArrowMain"} onClick={() => gifViewChange(1)}>
                    <img src={arrowForw} alt="Forward arrow" className={"ArrowForwImg ArrowImgScenariosWelcome"}/>
                </div>
            </div>
        </div>
    );
}

export default ScenariosIntroPage;

function GifsMain(gifView) {
    const navigate = useNavigate();

    return (
        <div className={"GifsMain"}>
            {gifView === 0 && (
                <div className={"ScenarioIntroGifs"}>
                        <img src={gif1} alt="Scenarios gif" className={"ScenariosGif"}/>
                        <img src={gif2} alt="Scenarios gif" className={"ScenariosGif"}/>

                </div>
            )}
            {gifView === 1 && (
                <div className={"ScenarioIntroGifs"}>
                    <img src={gif3} alt="Scenarios gif" className={"ScenariosGif"}/>
                    <img src={gif4} alt="Scenarios gif" className={"ScenariosGif"}/>
                </div>
            )}
            {gifView === 2 && (
                <div className={"ScenarioIntroGifs"}>
                    <img src={gif1} alt="Scenarios gif" className={"ScenariosGif"}/>
                    <img src={gif2} alt="Scenarios gif" className={"ScenariosGif"}/>

                </div>
            )}
            {gifView === 0 && (
                <div className={"ScenarioIntroButtons"}>
                    <button
                        className={"AnyButton ScenarioWelcomePageNavigButton"}
                        onClick={() => navigate('/scenarios/make')}>
                        Make a scenario!
                    </button>
                </div>
            )}
            {gifView === 1 && (
                <div className={"ScenarioIntroButtons"}>
                    <button
                        className={"AnyButton ScenarioWelcomePageNavigButton"}
                        onClick={() => navigate('/scenarios/use')}>
                        Make a deal set!
                    </button>
                </div>
            )}
            {gifView === 2 && (
                <div className={"ScenarioIntroButtons"}>
                    <button
                        className={"AnyButton ScenarioWelcomePageNavigButton"}
                        onClick={() => navigate('/scenarios/savedscenarios')}>
                        Saved scenarios
                    </button>
                    <button
                        className={"AnyButton ScenarioWelcomePageNavigButton"}
                        onClick={() => navigate('/scenarios/saveddealsets')}>
                        Saved deal sets
                    </button>
                </div>
            )}
        </div>
    );
}
