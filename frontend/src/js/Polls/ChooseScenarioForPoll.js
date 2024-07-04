import React, { useEffect, useState } from 'react';
import {navigate, useNavigate} from 'react-router-dom';
import '../../css/Polls/ChooseScenarioForPoll.css';
import arrowDown from "../../assets/arrow-down.png";
import arrowUp from "../../assets/arrow-up.png";
import { usePollsSettingsProvider } from "./PollsSettingsProvider";

function ChooseScenarioForPoll() {
    const navigate = useNavigate();

    const { setNumberOfDeals, setConstraint } = usePollsSettingsProvider();
    const [constraintOptions, setConstraintOptions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5015/Scenarios/GetConstraints')
            .then(response => response.json())
            .then(data => {
                setConstraintOptions(data.constraints);
            })
            .catch(error => {
                console.error('Error fetching constraint options:', error);
            });
    }, []);

    const handleSelectChange = (e) => {
        setConstraint(e.target.value);
        console.log('Selected constraint:', e.target.value);
    };

    const handleNumberChange = (e) => {
        setNumberOfDeals(parseInt(e.target.value, 10) || 1);
    };

    return (
        <div className={"PollsGrid PollsGrid1 ChooseScenarioForPoll"}>
            <div className={"PollsGridSettings"}>
                Choose constraints

                <div className={"ConstraintChoiceForPoll"}>
                    <div className={"CustomSelectContainer"}>
                        <select
                            className={"SettingsSelect"}
                            defaultValue="NoConstraint"
                            onChange={handleSelectChange}>
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

                <div className={"OneSettingRow"}>
                    <div className="SettingsTitle">
                        Number of deals:
                    </div>
                    <div className={"NumberSpinner"}>
                        <input
                            className={"InputNumberSetting"}
                            type="number"
                            defaultValue={30}
                            min={1}
                            onChange={handleNumberChange}
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
            </div>
            <div className={"NewConstraintsButton"}>
                Need different constraints?
                <button
                    onClick={() => navigate('/scenarios/make')}
                    className={"AnyButton PollsButton"}>
                    Create new...
                </button>
            </div>
        </div>
    );
}

export default ChooseScenarioForPoll;
