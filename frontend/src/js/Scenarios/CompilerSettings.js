import React, { createContext, useContext, useState } from 'react';

const CompilerSettings = createContext();

export function useScenario() {
    return useContext(CompilerSettings);
}

export const ScenarioProvider = ({ children }) => {
    const [vul, setVul] = useState('Random');
    const [dealer, setDealer] = useState('Random');
    const [numberOfDeals, setNumberOfDeals] = useState(12);

    const value = {
        vul,
        setVul,
        dealer,
        setDealer,
        numberOfDeals,
        setNumberOfDeals,
    };

    return <CompilerSettings.Provider value={value}>{children}</CompilerSettings.Provider>;
};