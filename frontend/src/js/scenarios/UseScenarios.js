import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function UseScenarios() {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div>
            USE SCENARIOS
            <div>
                {/* Add a button to navigate to MakeScenarios */}
                <button onClick={() => navigate('/scenarios/make')}>Go to Make Scenarios</button>
            </div>
        </div>
    );
}

export default UseScenarios;
