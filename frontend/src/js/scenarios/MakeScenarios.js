import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <div>MAKE SCENARIOS</div>
            <div>
                title:<br/>
                <textarea value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} />
            </div>
            <div>
                scenario centent:<br/>
                <textarea value={scenarioContent} onChange={(e) => setScenarioContent(e.target.value)} />
            </div>
            <button onClick={handleSave}>Save</button>
            <div>{/* Reserved for eventual log messages */}</div>
            <button onClick={() => navigate('/scenarios/use')}>Go to Use Scenarios</button>
        </div>
    );
}

export default MakeScenarios;
