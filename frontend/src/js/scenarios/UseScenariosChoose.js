import React from 'react';
import { useScenario } from './CompilerSettings';
import { useNavigate } from 'react-router-dom';
import '../../css/Scenarios/UseScenariosChoose.css';
import arrowDown from '../../assets/arrow-down.png';

function UseScenariosChoose() {
    const { setVul, setDealer, setNumberOfDeals } = useScenario();
    const navigate = useNavigate();

    return (
        <div className={"ScenariosLeftOuterContainer"}>
            <div className="LeftSideTitleContainer">
                <span className="LeftSideTitle">Choose scenarios for a deal set:</span>
            </div>
            <div className="SettingsPadding">
                <div className={"SettingsContainer"}>
                    <div className={"OneSettingRow"}>
                        <div className="SettingsTitle">
                            Vulnerability:
                        </div>
                        <div className={"SettingsChoice"}>
                            <div className={"CustomSelectContainer"}>
                                <select
                                    className={"SettingsSelect"}
                                    onChange={(e) => setVul(e.target.value)} 
                                    defaultValue="Random"
                                    id="VulSelect">
                                    <option value="Random">Random</option>
                                    <option value="None">None</option>
                                    <option value="All">All</option>
                                    <option value="NS">NS</option>
                                    <option value="EW">EW</option>
                                    <option value="Matching">Matching numbers</option>
                                </select>
                                <div className={"CustomSelectArrow"}>
                                    <img src={arrowDown} alt={"arrow-down"} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"SettingsBreak"}></div>
                    <div className={"OneSettingRow"}>
                        <div className="SettingsTitle">
                            Dealer:
                        </div>
                        <div className={"SettingsChoice"}>
                            <div className={"CustomSelectContainer"}>
                                <select
                                    className={"SettingsSelect"}
                                    onChange={(e) => setDealer(e.target.value)}
                                    defaultValue="Random"
                                    id="DealerSelect">
                                    <option value="North">North</option>
                                    <option value="South">South</option>
                                    <option value="West">West</option>
                                    <option value="East">East</option>
                                    <option value="Random">Random</option>
                                    <option value="Matching">Matching numbers</option>
                                </select>
                                <div className={"CustomSelectArrow"}>
                                    <img src={arrowDown} alt={"arrow-down"} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"SettingsBreak"}></div>
                    <div className={"OneSettingRow"}>
                        <div className="SettingsTitle">
                            Number of deals:
                        </div>
                        <div className={"InputNumberSetting"}>
                            <input
                                type="number"
                                defaultValue={12}
                                min={1}
                                onChange={(e) => setNumberOfDeals(parseInt(e.target.value, 10) || 1)}
                                className={"SettingsNumberInput"}
                            />
                        </div>
                    </div>
                    
                    
                    {/*<div>dealer: </div>*/}
                    {/*<select onChange={(e) => setDealer(e.target.value)} defaultValue="Random">*/}
                    {/*    <option value="North">North</option>*/}
                    {/*    <option value="South">South</option>*/}
                    {/*    <option value="West">West</option>*/}
                    {/*    <option value="East">East</option>*/}
                    {/*    <option value="Random">Random</option>*/}
                    {/*    <option value="Matching">Matching numbers</option>*/}
                    {/*</select>*/}
                    {/*<div>numberOfDeals: </div>*/}
                    {/*<input type="number" defaultValue={12} min={1} onChange={(e) => setNumberOfDeals(parseInt(e.target.value, 10) || 1)} />*/}
                </div>
                <div className="ToggleScenariosViewButtonContainer">
                    <button
                        className={"AnyButton ToggleScenariosViewButton GoToMakeButton"}
                        onClick={() => navigate('/scenarios/make')}>
                        Go to Make Scenarios
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default UseScenariosChoose;
