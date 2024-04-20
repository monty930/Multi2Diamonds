import React, {useState, useRef, useEffect} from 'react';
import { useScenario } from './CompilerSettings';
import { useNavigate } from 'react-router-dom';
import arrowDown from '../../assets/arrow-down.png';
import arrowUp from '../../assets/arrow-up.png';
import trashImg from '../../assets/trash.png';

function UseScenariosChoose() {
    const { setVul, setDealer, setNumberOfDeals } = useScenario();
    const navigate = useNavigate();
    const [constraints, setConstraints] = useState([{ id: 0, value: "" }]);
    const [constraintOptions, setConstraintOptions] = useState([]);
    const lastId = useRef(0);

    useEffect(() => {
        fetch('http://localhost:5015/ProfileData/GetConstraints')
            .then(response => response.json())
            .then(data => {
                setConstraintOptions(data.constraints);
            })
            .catch(error => {
                console.error('Error fetching constraint options:', error);
            });
    }, []);

    const addConstraintForDealSet = () => {
        console.log("Adding constraint for deal set");
        lastId.current += 1;
        setConstraints(prev => [
            ...prev,
            {
                id: lastId.current,
                value: ""
            }
        ]);
    }

    const handleConstraintChange = (id, value) => {
        setConstraints(prev => prev.map(c => c.id === id ? { ...c, value: value } : c));
    }

    const deleteConstraint = (id) => {
        setConstraints(prevConstraints => prevConstraints.filter(constraint => constraint.id !== id));
    }

    const handleConstraintBlur = (id, value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
            handleConstraintChange(id, "0");
            return;
        }

        const sumOther = constraints.reduce((acc, curr) => {
            if (curr.id !== id) {
                const val = parseFloat(curr.value) || 0;
                return acc + (val > 100 ? 0 : val);
            }
            return acc;
        }, 0);

        if (sumOther + numValue > 100) {
            handleConstraintChange(id, (100 - sumOther).toString());
        }
    }

    const calculateRemainingPercentage = () => {
        const validSum = constraints.slice(0, -1).reduce((acc, curr) => {
            const currentValue = parseFloat(curr.value);
            const valueToReturn = acc + (isNaN(currentValue) || currentValue < 0 || currentValue > 100 ? 0 : currentValue);
            return (valueToReturn < 0 ? 0 : (valueToReturn > 100 ? 100 : valueToReturn))
        }, 0);
        return 100 - validSum;
    };

    return (
        <div className={"ScenariosLeftOuterContainer"}>
            <div className={"SettingsTop"}>
            <div className="LeftSideTitleContainer">
                <div className={"LeftSideTitleInnerContainer"}>
                    <span className="LeftSideTitle">Choose scenarios for a deal set:</span>
                </div>
            </div>
            <div className="SettingsPadding">
                <div className={"SettingsContainerTop"}>
                    <div className={"SettingsBreak"}></div>
                    {constraints.map((constraint, index) => (
                        <React.Fragment key={constraint.id}>
                    <div className={"OneSettingRow"}>
                        <div className={"SettingsChoice ConstraintSelect"}>
                            <div className={"CustomSelectContainer"}>
                                <select
                                    className={"SettingsSelect"}
                                    defaultValue="NoConstraint">
                                    <option value="NoConstraint">No constraint</option>
                                    {constraintOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <div className={"CustomSelectArrow"}>
                                    <img src={arrowDown} alt={"arrow-down"} />
                                </div>
                            </div>
                        </div>
                        <div className={"ConstraintChoiceOptions"}>
                            <div className={"DeleteConstraintFromDealSet"}>
                                {constraints.length > 1 && (
                                <button className={"RedButton DeleteConstraintButton"}
                                        onClick={() => deleteConstraint(constraint.id)}>
                                    <img src={trashImg} alt={"delete"} />
                                </button>
                                )}
                            </div>
                            <div className={"ConstraintPercentage"}>
                                <textarea
                                    className={"ConstraintPercentageInput"}
                                    placeholder={"0"}
                                    spellCheck={"false"}
                                    value={index === constraints.length - 1 ? calculateRemainingPercentage().toString() : constraint.value}
                                    readOnly={index === constraints.length - 1}
                                    onChange={(e) => handleConstraintChange(constraint.id, e.target.value)}
                                    onBlur={(e) => handleConstraintBlur(constraint.id, e.target.value)}
                                />
                                <span className={"PercentageChar"}>%</span>
                            </div>
                        </div>
                    </div>
                            <div className={"SettingsBreak"}></div>
                        </React.Fragment>
                    ))}
                    <div className={"OneSettingRow"}>
                        <div className={"AddConstraintRow"}>
                            <button
                                className={"AnyButton AddConstraintButton"}
                                onClick={addConstraintForDealSet}>
                                Add constraint
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className={"SettingsBottom"}>
            <div className="LeftSideTitleContainer">
                <div className={"LeftSideTitleInnerContainer"}>
                    <span className="LeftSideTitle">Deal set setting:</span>
                </div>
            </div>
            <div className="SettingsPadding">
                <div className={"SettingsContainerBottom"}>
                    <div className={"SettingsBreak"}></div>
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
                        <div className={"NumberSpinner"}>
                            <input
                                className={"InputNumberSetting"}
                                type="number"
                                defaultValue={12}
                                min={1}
                                onChange={(e) => setNumberOfDeals(parseInt(e.target.value, 10) || 1)}
                            />
                            <div className={"InputNumberArrows"}>
                                <button 
                                    type={"button"}
                                    className={"NumberSpinnerButton ButtonIncr"}>
                                    <img src={arrowUp} alt={"increase"} />
                                </button>
                                <button 
                                    type={"button"}
                                    className={"NumberSpinnerButton ButtonDecr"}>
                                    <img src={arrowDown} alt={"decrease"} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"SettingsBreak"}></div>
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
        </div>
        
    );
}

export default UseScenariosChoose;
