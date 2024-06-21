import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import menuImg from '../../assets/menu.png';

function MakeScenarios({ scenarioContent, setScenarioContent }) {
    const [scenarioName, setScenarioName] = useState('');
    const navigate = useNavigate();
    const [saveLogMessage, setSaveLogMessage] = useState('');
    const [saveLogSuccess, setSaveLogSuccess] = useState(true);
    const [alreadySaved, setAlreadySaved] = useState(false);
    const [alreadySavedScenarioName, setAlreadySavedScenarioName] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const menuButtonRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            } else if (menuButtonRef.current && menuButtonRef.current.contains(event.target)) {
                setMenuOpen(!menuOpen);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

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
            setSaveLogMessage('Error: ' + error.message);
            setSaveLogSuccess(false);
        } finally {
            setTimeout(() => handleLogTimeout(), 4000);
        }
    };

    const handleSaveAsNew = async () => {
        try {
            if (scenarioName.length > 30) {
                throw new Error('Scenario name is too long.');
            }
            else if (!scenarioName.replace(/\s/g, '').length) {
                throw new Error('Enter scenario name!');
            }
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
            setAlreadySaved(true);
            setAlreadySavedScenarioName(data.scenarioName);
            setScenarioName(data.scenarioName);
        } catch (error) {
            setSaveLogMessage('Error: ' + error.message);
            setSaveLogSuccess(false);
        } finally {
            setTimeout(() => handleLogTimeout(), 4000);
        }
    }

    const handleLogTimeout = () => {
        setSaveLogMessage('');
        setSaveLogSuccess(true);
    }

    const saveButtonHandler = async (saveAsNew = false) => {
        console.log('save button handler with:\nalreadySaved: ' + alreadySaved + '\nalreadySavedScenarioName: ' + alreadySavedScenarioName + '\nscenarioName: ' + scenarioName);
        if (alreadySaved && (alreadySavedScenarioName === scenarioName) && !saveAsNew) {
            console.log('handle save');
            await handleSave();
        } else {
            console.log('handle save as new');
            await handleSaveAsNew();
        }
    }

    const handleMenuSelect = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <div className="ScenariosLeftOuterContainer">
            <div className="LeftSideTitleContainer">
                <div className={"LeftSideTitleInnerContainer"}>
                    <img src={menuImg} ref={menuButtonRef} alt="Menu" className={"MenuImage"}/>
                    <span className="LeftSideTitle">Enter constraints:</span>
                    {menuOpen && (
                        <div ref={menuRef} className="MenuOptionsContainer">
                            <ul className={"MenuUl"}>
                                <li className={"MenuLi"}
                                    onClick={() => handleMenuSelect('/scenarios/use')}>Deal Set Creator</li>
                                <li className={"MenuLi"}
                                    onClick={() => handleMenuSelect('/scenarios/savedscenarios')}>Saved Scenarios</li>
                                <li className={"MenuLi"}
                                    onClick={() => handleMenuSelect('/scenarios/saveddealsets')}>Saved Deal Sets</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="ScenarioSavingFieldContainer">
                <button
                    className={"AnyButton SaveConstraintButton"}
                    onClick={() => saveButtonHandler(false)}>
                    Save
                </button>
                {alreadySaved && (alreadySavedScenarioName === scenarioName) &&
                    <button
                        className={"AnyButton SaveAsNewConstraintButton"}
                        onClick={() => saveButtonHandler(true)}>
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
        </div>
    );
}

export default MakeScenarios;
