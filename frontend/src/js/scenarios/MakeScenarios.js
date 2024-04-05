import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MakeScenarios() {
    const [activeTab, setActiveTab] = useState('textarea');
    const [textareaContent, setTextareaContent] = useState('');
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5015/Scenarios/AddItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: textareaContent }),
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
                {/* Conditional rendering based on activeTab */}
                {activeTab === 'textarea' && (
                    <textarea value={textareaContent} onChange={(e) => setTextareaContent(e.target.value)} />
                )}
                {activeTab === 'settings' && <div>Settings view (to be implemented)</div>}
                {activeTab === 'readme' && <div>Readme or helpful information here</div>}
            </div>
            <div>
                <button onClick={() => handleTabChange('textarea')}>Input</button>
                <button onClick={() => handleTabChange('settings')}>Settings</button>
                <button onClick={() => handleTabChange('readme')}>Readme</button>
                <button onClick={handleSave}>Save</button>
            </div>
            <div>{/* Reserved for eventual log messages */}</div>
            <button onClick={() => navigate('/scenarios/use')}>Go to Use Scenarios</button>
        </div>
    );
}

export default MakeScenarios;
