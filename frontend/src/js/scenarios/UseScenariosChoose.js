import React from 'react';
import { useScenario } from './CompilerSettings';
import { useNavigate } from 'react-router-dom';

function UseScenariosChoose() {
    const { setVul, setDealer, setNumberOfDeals } = useScenario();
    const navigate = useNavigate();

    return (
        <div>
            USE SCENARIOS
            <div>
                <div>vul: </div>
                <select onChange={(e) => setVul(e.target.value)} defaultValue="Random">
                    <option value="Random">Random</option>
                    <option value="None">None</option>
                    <option value="All">All</option>
                    <option value="NS">NS</option>
                    <option value="EW">EW</option>
                    <option value="Matching">Matching numbers</option>
                </select>
                <div>dealer: </div>
                <select onChange={(e) => setDealer(e.target.value)} defaultValue="Random">
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
                    <option value="East">East</option>
                    <option value="Random">Random</option>
                    <option value="Matching">Matching numbers</option>
                </select>
                <div>numberOfDeals: </div>
                <input type="number" defaultValue={12} min={1} onChange={(e) => setNumberOfDeals(parseInt(e.target.value, 10) || 1)} />
            </div>
            <div>
                <button onClick={() => navigate('/scenarios/make')}>Go to Make Scenarios</button>
            </div>
        </div>
    );
}

export default UseScenariosChoose;
