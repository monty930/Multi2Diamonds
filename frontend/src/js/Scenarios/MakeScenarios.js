import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function MakeScenarios() {
    const [scenarioContent, setScenarioContent] = useState('');
    const [scenarioName, setScenarioName] = useState('');
    const navigate = useNavigate();
    const [saveLogMessage, setSaveLogMessage] = useState('');
    const [saveLogSuccess, setSaveLogSuccess] = useState(true);
    const [alreadySaved, setAlreadySaved] = useState(false);
    const [alreadySavedScenarioName, setAlreadySavedScenarioName] = useState('');
    
    useEffect(() => {
        const savedConstraintId = sessionStorage.getItem('savedConstraintId');
        if (savedConstraintId) {
            sessionStorage.removeItem('savedConstraintId');
            fetch('http://localhost:5015/Scenarios/GetSavedScenario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ SavedContentId: savedConstraintId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                scenarioNameChanged(data.scenarioName);
                scenarioContentChanged(data.scenarioContent);
                setAlreadySaved(true);
                setAlreadySavedScenarioName(data.scenarioName);
            })
            .catch(error => {
                console.error('Failed to fetch saved constraint:', error);
            });
        } else {
            const savedConstraintName = sessionStorage.getItem('savedConstraintName');
            const savedConstraintContent = sessionStorage.getItem('savedConstraintContent');
            setScenarioName(savedConstraintName);
            setScenarioContent(savedConstraintContent);
        }
    }, []);
    
    const scenarioNameChanged = (name) => {
        setScenarioName(name);
        sessionStorage.setItem('savedConstraintName', name);
    };
    
    const scenarioContentChanged = (content) => {
        setScenarioContent(content);
        sessionStorage.setItem('savedConstraintContent', content);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5015/Scenarios/OverwriteScenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenarioName, scenarioContent }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            setSaveLogMessage('Scenario ' + scenarioName + ' saved successfully!');
            setSaveLogSuccess(true);
        } catch (error) {
            console.error('Error saving data:', error);
            setSaveLogMessage('Error: ' + error.message);
            setSaveLogSuccess(false);
        } finally {
            setTimeout(() => setSaveLogMessage(''), 10000);
        }
    };
    
    const handleSaveAsNew = async () => {
        try {
            const response = await fetch('http://localhost:5015/Scenarios/SaveScenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenarioName, scenarioContent }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setSaveLogMessage('Scenario ' + data.scenarioName + ' saved successfully!');
            setSaveLogSuccess(true);
        } catch (error) {
            console.error('Error saving data:', error);
            setSaveLogMessage('Error: ' + error.message);
            setSaveLogSuccess(false);
        } finally {
            setTimeout(() => setSaveLogMessage(''), 10000);
        }
    }
    
    const saveButtonHandler = async () => {
        if (alreadySaved && (alreadySavedScenarioName === scenarioName)) {
            await handleSave();
        } else {
            await handleSaveAsNew();
        }
    }

    return (
        <div className="ScenariosLeftOuterContainer">
            <div className="LeftSideTitleContainer">
                <div className={"LeftSideTitleInnerContainer"}>
                    <span className="LeftSideTitle">Enter constraints:</span>
                </div>
            </div>
            <div className="ScenarioSavingFieldContainer">
                <button 
                    className={"AnyButton SaveConstraintButton"}
                    onClick={handleSave}>
                    Save
                </button>
                {alreadySaved && (alreadySavedScenarioName === scenarioName) &&
                    <button
                        className={"AnyButton SaveAsNewConstraintButton"}
                        onClick={handleSaveAsNew}>
                        Save as new
                    </button>
                }
                <div className="ScenarioNameLabelContainer">
                <textarea value={scenarioName} 
                          spellCheck={false}
                          wrap={"off"}
                          placeholder={"Scenario Name"}
                          className="ScenarioNameTextArea"
                          onChange={(e) => scenarioNameChanged(e.target.value)} />
                </div>
            </div>
            <div className="ScenarioContentTextAreaContainer">
                <div className="ScenarioContentTextAreaPadding">
                <textarea value={scenarioContent}
                          spellCheck={false}
                          wrap={"off"}
                          placeholder={"Enter your constraints!"}
                          className="ScenarioContentTextArea"
                          onChange={(e) => scenarioContentChanged(e.target.value)} />
                </div>
            </div>
            <div className="LogContainer">
                <span id="ConstrainrSavingLogMessage" className={saveLogSuccess ? 'LogSuccess' : 'LogFailure'}>
                    {saveLogMessage}
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
