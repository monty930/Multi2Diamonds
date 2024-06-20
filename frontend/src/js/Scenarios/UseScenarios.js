import React from 'react';
import UseScenariosChoose from './UseScenariosChoose';
import GenerateDealSet from './GenerateDealSet';
import { ScenarioProvider } from './CompilerSettings';

function UseScenarios({ setIsDragging, getLongestWestSuitLength }) {
    return (
        <ScenarioProvider>
            <div className="ScenariosPage">
                <div className="UseScenariosOuter"><UseScenariosChoose /></div>
                <div
                    className="Divider"
                    onMouseDown={() => setIsDragging(true)}
                ></div>
                <div className="GenerateDealSetOuter"><GenerateDealSet getLongestWestSuitLength={getLongestWestSuitLength} /></div>
            </div>
        </ScenarioProvider>
    );
}

export default UseScenarios;
