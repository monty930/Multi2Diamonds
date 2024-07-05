import React from "react";
import {useNavigate} from "react-router-dom";
import bridgeImage from '../../assets/bridge-inverted-transparent.png';
import savedImage from '../../assets/folder4.png';
import makeScenariosImage from "../../assets/icon1.png";
import buildDealSetsImage from "../../assets/icon2.png";
import todoImage from "../../assets/todo-icon.png";
import pollsImage from "../../assets/polls-icon.png";
import debugIcon from "../../assets/debug.png";

function WelcomePage() {
    const [adminTools, setAdminTools] = React.useState(false);
    const navigate = useNavigate();

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://localhost:5015/ProfileData/CheckAdmin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setAdminTools(true);
            } else {
                setAdminTools(false);
            }
        } catch (error) {
            console.error('Error fetching admin permission.', error);
            setAdminTools(false);
        }
    };

    React.useEffect(() => {
        fetchProfileData().then(r => {});
    }, []);

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
                                onClick={() => navigate('/scenarios/polls')}>
                                <span className={"WelcomeNavigButtonLayout"}>
                                    <img src={pollsImage} alt="Polls Button" className={"WelcomeNavigButtonImage"}/>
                                    <div className={"WelcomeNavigButtonText"}>Polls</div>
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
            {adminTools && (
                <button
                    className={"WelcomePageNavigButton WelcomePageNavigButtonDebug"}
                    onClick={() => navigate('/debug')}>
                                    <span className={"WelcomeNavigButtonLayout"}>
                                        <img src={debugIcon} alt="Debug Icon" className={"WelcomeNavigButtonImage"}/>
                                        <div className={"WelcomeNavigButtonText"}>Debug tools</div>
                                    </span>
                </button>
            )}
        </div>
    );
}

export default WelcomePage;
