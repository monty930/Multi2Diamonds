import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Scenarios.css';
import '../../css/Scenarios/MakeScenarios.css';

function MakeScenarios() {
    const [scenarioContent, setScenarioContent] = useState('');
    const [scenarioName, setScenarioName] = useState('');
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5015/Scenarios/AddItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: scenarioName, scenarioContent }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Save successful', data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <div className="ScenariosLeftOuterContainer">
            <div className="LeftSideTitleContainer">
                <span className="LeftSideTitle">Enter constraints:</span>
            </div>
            <div className="ScenarioSavingFieldContainer">
                <button 
                    className={"AnyButton SaveConstraintButton"}
                    onClick={handleSave}>
                    Save
                </button>
                <div className="ScenarioNameLabelContainer">
                <textarea value={scenarioName} 
                          spellCheck={false}
                          wrap={"off"}
                          placeholder={"Scenario Name"}
                          className="ScenarioNameTextArea"
                          onChange={(e) => setScenarioName(e.target.value)} />
                </div>
            </div>
            <div className="ScenarioContentTextAreaContainer">
                <div className="ScenarioContentTextAreaPadding">
                <textarea value={scenarioContent}
                          spellCheck={false}
                          wrap={"off"}
                          placeholder={"Enter your constraints!"}
                          className="ScenarioContentTextArea"
                          onChange={(e) => setScenarioContent(e.target.value)} />
                </div>
            </div>
            <div className="LogContainer">
                <span id="ConstrainrSavingLogMessage">
                    {/* Reserved for log messages */}
                </span>
            </div>
            <div className="ToggleScenariosViewButtonContainer">
                <button 
                    className={"AnyButton ToggleScenariosViewButton GoToUseButton"}
                    onClick={() => navigate('/scenarios/use')}>
                    Go to Use Scenarios
                </button>
            </div>
        </div>
    );
}

export default MakeScenarios;
